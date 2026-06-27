import { prisma, Prisma } from "@medic/database";
import {
  calculateSaleTotals,
  deriveDebtStatus,
  allocateFefo,
  type SaleCreateInput,
  type SaleSyncEvent,
} from "@medic/core";
import { ApiError } from "../api";

type Tx = Prisma.TransactionClient;

/**
 * يخصّص كمية مبيعة من دفعات المنتج بترتيب FEFO، ينقص المتبقّي من الدفعات،
 * ويعيد تكلفة البضاعة المباعة (costTotal) للسطر — أو null إن لم توجد دفعات
 * مُسعّرة (فواتير ما قبل تتبّع التكلفة) حتى لا يُحتسب ربح وهمي.
 */
async function consumeBatchesFefo(tx: Tx, productId: string, quantity: number): Promise<number | null> {
  const batches = await tx.productBatch.findMany({
    where: { productId, remaining: { gt: 0 } },
    select: { id: true, remaining: true, costPrice: true, expiryDate: true, receivedAt: true },
  });

  const result = allocateFefo(
    batches.map((b) => ({
      id: b.id,
      remaining: b.remaining,
      costPrice: Number(b.costPrice),
      expiryDate: b.expiryDate,
      receivedAt: b.receivedAt,
    })),
    quantity,
  );

  for (const a of result.allocations) {
    await tx.productBatch.update({
      where: { id: a.batchId },
      data: { remaining: { decrement: a.quantity } },
    });
  }

  return result.allocations.length > 0 ? result.costTotal : null;
}

const saleInclude = {
  items: { include: { product: { select: { nameAr: true, sku: true } } } },
  customer: true,
  debt: true,
} satisfies Prisma.SaleInclude;

/** يولّد رقم فاتورة تسلسلي فريدًا داخل المعاملة. */
async function nextInvoiceNo(tx: Tx): Promise<string> {
  const count = await tx.sale.count();
  return `INV-${String(count + 1).padStart(6, "0")}`;
}

/** يجد أو ينشئ زبونًا (للبيع الآجل offline أو عند تمرير اسم/هاتف). */
async function resolveCustomerId(
  tx: Tx,
  opts: { customerId?: string | null; name?: string | null; phone?: string | null },
): Promise<string> {
  if (opts.customerId) return opts.customerId;
  if (opts.phone) {
    const existing = await tx.customer.findFirst({ where: { phone: opts.phone } });
    if (existing) return existing.id;
  }
  const created = await tx.customer.create({
    data: { name: opts.name?.trim() || "زبون", phone: opts.phone ?? null },
  });
  return created.id;
}

/**
 * إنشاء فاتورة بشكل رسمي على الخادم (المصدر الموثوق):
 * يقرأ أسعار المنتجات من القاعدة، يتحقق من التوفر، يحسب الإجماليات،
 * يخصم المخزون، يسجّل حركات البيع، وينشئ دينًا عند وجود متبقٍّ.
 */
export async function createSaleAuthoritative(
  input: SaleCreateInput & { customerName?: string; customerPhone?: string },
  userId: string,
  platform: "POS_MOBILE" | "WEB" = "WEB",
) {
  return prisma.$transaction(async (tx) => {
    const ids = input.items.map((i) => i.productId);
    const products = await tx.product.findMany({ where: { id: { in: ids } } });
    const byId = new Map(products.map((p) => [p.id, p]));

    const lineInputs = input.items.map((it) => {
      const p = byId.get(it.productId);
      if (!p) throw new ApiError(404, "PRODUCT_NOT_FOUND", `منتج غير موجود: ${it.productId}`);
      if (p.quantity < it.quantity) {
        throw new ApiError(409, "INSUFFICIENT_STOCK", `الكمية غير متوفرة للمنتج "${p.nameAr}"`);
      }
      return {
        productId: p.id,
        quantity: it.quantity,
        unitPrice: Number(p.salePrice),
        lineDiscount: it.lineDiscount ?? 0,
      };
    });

    const totals = calculateSaleTotals(
      lineInputs.map((l) => ({ quantity: l.quantity, unitPrice: l.unitPrice, lineDiscount: l.lineDiscount })),
      input.discount ?? 0,
      input.paid ?? 0,
    );

    let customerId: string | null = input.customerId ?? null;
    if (totals.remaining > 0) {
      customerId = await resolveCustomerId(tx, {
        customerId,
        name: input.customerName,
        phone: input.customerPhone,
      });
    }

    const invoiceNo = await nextInvoiceNo(tx);

    // تخصيص FEFO + حساب تكلفة البضاعة المباعة لكل سطر (ينقص متبقّي الدفعات)
    // تسلسليًا لتفادي ازدواج تخصيص نفس الدفعة عند تكرار المنتج بين السطور.
    const costTotals: (number | null)[] = [];
    for (const l of lineInputs) {
      costTotals.push(await consumeBatchesFefo(tx, l.productId, l.quantity));
    }

    const sale = await tx.sale.create({
      data: {
        invoiceNo,
        customerId,
        customerName: input.customerName ?? null,
        customerPhone: input.customerPhone ?? null,
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        paid: totals.paid,
        remaining: totals.remaining,
        paymentType: totals.paymentType,
        platform,
        userId,
        items: {
          create: lineInputs.map((l, idx) => ({
            productId: l.productId,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            lineDiscount: l.lineDiscount,
            lineTotal: totals.lines[idx]!.lineTotal,
            costTotal: costTotals[idx],
          })),
        },
      },
      include: saleInclude,
    });

    // خصم المخزون + تسجيل حركات البيع
    for (const l of lineInputs) {
      await tx.product.update({
        where: { id: l.productId },
        data: { quantity: { decrement: l.quantity } },
      });
      await tx.stockMovement.create({
        data: { productId: l.productId, type: "SALE", quantity: l.quantity, reason: `بيع ${invoiceNo}` },
      });
    }

    // إنشاء دين عند وجود متبقٍّ
    if (totals.remaining > 0 && customerId) {
      await tx.debt.create({
        data: {
          customerId,
          saleId: sale.id,
          amount: totals.remaining,
          paid: 0,
          status: deriveDebtStatus(totals.remaining, 0),
        },
      });
    }

    return tx.sale.findUniqueOrThrow({ where: { id: sale.id }, include: saleInclude });
  }, { maxWait: 15000, timeout: 30000 });
}

export interface SyncResult {
  clientEventId: string;
  status: "ok" | "duplicate" | "error";
  saleId?: string;
  message?: string;
}

/**
 * يسجّل فاتورة مكتملة محليًا (offline) كما هي (المصدر = الجهاز)، بشكل idempotent.
 * يخصم المخزون (مع عدم السماح بالسالب)، ويسجّل الحركات، وينشئ دينًا عند الحاجة.
 */
export async function recordSyncedSale(event: SaleSyncEvent, fallbackUserId: string): Promise<SyncResult> {
  try {
    const existing = await prisma.sale.findUnique({ where: { clientEventId: event.clientEventId } });
    if (existing) {
      return { clientEventId: event.clientEventId, status: "duplicate", saleId: existing.id };
    }

    // نسبة الفاتورة للمستخدم الفعّال لحظة إنشائها على الجهاز؛ نتأكّد أنه موجود وإلا نرجع للمستخدم الافتراضي (FR-047)
    let userId = fallbackUserId;
    if (event.userId) {
      const u = await prisma.user.findUnique({ where: { id: event.userId }, select: { id: true } });
      if (u) userId = u.id;
    }

    const sale = await prisma.$transaction(async (tx) => {
      let customerId: string | null = null;
      if (event.remaining > 0) {
        customerId = await resolveCustomerId(tx, {
          name: event.customerName,
          phone: event.customerPhone,
        });
      }

      // تخصيص FEFO + تكلفة البضاعة المباعة لكل سطر (تسلسليًا) قبل إنشاء الفاتورة
      const costTotals: (number | null)[] = [];
      for (const l of event.items) {
        costTotals.push(await consumeBatchesFefo(tx, l.productId, l.quantity));
      }

      const created = await tx.sale.create({
        data: {
          invoiceNo: event.invoiceNo,
          clientEventId: event.clientEventId,
          customerId,
          customerName: event.customerName ?? null,
          customerPhone: event.customerPhone ?? null,
          subtotal: event.subtotal,
          discount: event.discount,
          total: event.total,
          paid: event.paid,
          remaining: event.remaining,
          paymentType: event.paymentType,
          platform: "POS_DESKTOP",
          userId,
          createdAt: new Date(event.createdAt),
          items: {
            create: event.items.map((l, idx) => ({
              productId: l.productId,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
              lineDiscount: l.lineDiscount,
              lineTotal: l.lineTotal,
              costTotal: costTotals[idx],
            })),
          },
        },
      });

      for (const l of event.items) {
        const p = await tx.product.findUnique({ where: { id: l.productId } });
        if (p) {
          // قاعدة التسوية (FR-049): بيعة الأوفلاين تُقبل دائمًا؛ عند نقص الكمية تُثبَّت عند 0
          // وتُسجَّل حركة تسوية بالفرق معلّمة needsReview بدل رفض الفاتورة وفقدان السجل.
          const shortfall = Math.max(0, l.quantity - p.quantity);
          const nextQty = Math.max(0, p.quantity - l.quantity);
          await tx.product.update({ where: { id: l.productId }, data: { quantity: nextQty } });
          await tx.stockMovement.create({
            data: { productId: l.productId, type: "SALE", quantity: l.quantity, reason: `مزامنة ${event.invoiceNo}` },
          });
          if (shortfall > 0) {
            await tx.stockMovement.create({
              data: {
                productId: l.productId,
                type: "ADJUSTMENT",
                quantity: shortfall,
                reason: `تعارض مزامنة: بيع أوفلاين تجاوز المتوفر (${event.invoiceNo})`,
                needsReview: true,
              },
            });
          }
        }
      }

      if (event.remaining > 0 && customerId) {
        await tx.debt.create({
          data: {
            customerId,
            saleId: created.id,
            amount: event.remaining,
            paid: 0,
            status: deriveDebtStatus(event.remaining, 0),
          },
        });
      }

      return created;
    }, { maxWait: 15000, timeout: 30000 });

    return { clientEventId: event.clientEventId, status: "ok", saleId: sale.id };
  } catch (e) {
    return {
      clientEventId: event.clientEventId,
      status: "error",
      message: e instanceof Error ? e.message : "خطأ غير معروف",
    };
  }
}

export { saleInclude };
