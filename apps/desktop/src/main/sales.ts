import { randomUUID } from "crypto";
import { Prisma } from "../../generated/prisma";
import { calculateSaleTotals, canSell } from "@medic/core";
import { db } from "./db";

export interface PosSaleItemInput {
  productId: string;
  quantity: number;
  /** سعر الوحدة المعدَّل يدويًا في نقطة البيع؛ إن غاب يُستخدم سعر البيع المعرَّف للمنتج. */
  unitPrice?: number;
  lineDiscount?: number;
}

export interface PosSaleInput {
  items: PosSaleItemInput[];
  discount?: number;
  paid?: number;
  customerName?: string;
  customerPhone?: string;
}

/** فلاتر سجل الفواتير (بحث برقم الفاتورة + نطاق زمني). */
export interface SalesFilter {
  /** بحث جزئي في رقم الفاتورة. */
  invoiceNo?: string;
  /** بداية النطاق (ISO، شامل). */
  from?: string;
  /** نهاية النطاق (ISO، غير شامل). */
  to?: string;
}

/** يولّد رقم فاتورة تسلسليًا محليًا بصيغة 8 خانات يبدأ من «00000001» (طلب العميل).
 *  يعتمد عدّادًا ثابتًا في جدول Meta ويزيده ذرّيًا داخل المعاملة لتفادي التكرار. */
async function nextLocalInvoiceNo(tx: Prisma.TransactionClient): Promise<string> {
  const row = await tx.meta.findUnique({ where: { key: "invoiceSeq" } });
  const next = (row ? parseInt(row.value, 10) || 0 : 0) + 1;
  await tx.meta.upsert({
    where: { key: "invoiceSeq" },
    update: { value: String(next) },
    create: { key: "invoiceSeq", value: String(next) },
  });
  return String(next).padStart(8, "0");
}

export async function listLocalProducts(query?: string) {
  const q = query?.trim();
  return db.localProduct.findMany({
    where: q
      ? { OR: [{ nameAr: { contains: q } }, { sku: { contains: q } }] }
      : undefined,
    orderBy: { nameAr: "asc" },
    take: 100,
  });
}

/** بحث دقيق عن منتج بالباركود (sku) لقارئ الباركود في المخزون.
 * يُرجع المنتج إن وُجد أو null إن كان باركودًا جديدًا. */
export async function findLocalProductByBarcode(barcode: string) {
  const code = barcode.trim();
  if (!code) return null;
  return db.localProduct.findUnique({ where: { sku: code } });
}

/** ينشئ فاتورة محلية: يتحقق من التوفر، يحسب الإجماليات، يخصم المخزون المحلي، ويُدرج حدثًا للمزامنة.
 * تُنسب الفاتورة لـ `userId` المستخدم الفعّال لحظة الإنشاء (FR-047). */
export async function createLocalSale(input: PosSaleInput, userId?: string) {
  const products = await db.localProduct.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  // عُلِّمت صحيحًا إذا اختلف السعر المباع لأيّ صنف عن سعر البيع المعرَّف (تعديل سعر يدوي)
  let priceEdited = false;
  const lines = input.items.map((it) => {
    const p = byId.get(it.productId);
    if (!p) throw new Error(`منتج غير موجود محليًا: ${it.productId}`);
    if (!canSell(p.quantity, it.quantity)) {
      throw new Error(`الكمية غير متوفرة للمنتج "${p.nameAr}" (المتوفر: ${p.quantity})`);
    }
    // السعر الفعّال: المعدَّل يدويًا في نقطة البيع إن وُجد وكان صالحًا، وإلا سعر البيع المعرَّف
    const unitPrice =
      it.unitPrice != null && Number.isFinite(it.unitPrice) && it.unitPrice >= 0
        ? it.unitPrice
        : p.salePrice;
    if (unitPrice !== p.salePrice) priceEdited = true;
    return {
      productId: p.id,
      nameAr: p.nameAr,
      quantity: it.quantity,
      unitPrice,
      lineDiscount: it.lineDiscount ?? 0,
    };
  });

  const totals = calculateSaleTotals(
    lines.map((l) => ({ quantity: l.quantity, unitPrice: l.unitPrice, lineDiscount: l.lineDiscount })),
    input.discount ?? 0,
    input.paid ?? 0,
  );

  const clientEventId = randomUUID();
  const createdAt = new Date().toISOString();

  const sale = await db.$transaction(async (tx) => {
    const invoiceNo = await nextLocalInvoiceNo(tx);
    const created = await tx.localSale.create({
      data: {
        clientEventId,
        invoiceNo,
        userId: userId ?? null,
        customerName: input.customerName ?? null,
        customerPhone: input.customerPhone ?? null,
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        paid: totals.paid,
        remaining: totals.remaining,
        paymentType: totals.paymentType,
        priceEdited,
        createdAt,
        items: {
          create: lines.map((l, idx) => ({
            productId: l.productId,
            nameAr: l.nameAr,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            lineDiscount: l.lineDiscount,
            lineTotal: totals.lines[idx]!.lineTotal,
          })),
        },
      },
      include: { items: true },
    });

    for (const l of lines) {
      await tx.localProduct.update({
        where: { id: l.productId },
        data: { quantity: { decrement: l.quantity } },
      });
    }

    // حدث المزامنة (outbox)
    await tx.syncQueueItem.create({
      data: {
        clientEventId,
        createdAt,
        payload: JSON.stringify({
          clientEventId,
          invoiceNo,
          userId,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          items: lines.map((l, idx) => ({
            productId: l.productId,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            lineDiscount: l.lineDiscount,
            lineTotal: totals.lines[idx]!.lineTotal,
          })),
          subtotal: totals.subtotal,
          discount: totals.discount,
          total: totals.total,
          paid: totals.paid,
          remaining: totals.remaining,
          paymentType: totals.paymentType,
          createdAt,
        }),
      },
    });

    return created;
  });

  return sale;
}

export async function listLocalSales(filter?: SalesFilter) {
  const where: Prisma.LocalSaleWhereInput = {};

  const q = filter?.invoiceNo?.trim();
  if (q) where.invoiceNo = { contains: q };

  if (filter?.from || filter?.to) {
    // createdAt مخزَّن كنص ISO (UTC) → المقارنة المعجمية سليمة لأن الصيغة موحّدة
    where.createdAt = {
      ...(filter.from ? { gte: filter.from } : {}),
      ...(filter.to ? { lt: filter.to } : {}),
    };
  }

  return db.localSale.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { items: true },
  });
}

export async function getLocalSale(id: string) {
  return db.localSale.findUnique({ where: { id }, include: { items: true } });
}
