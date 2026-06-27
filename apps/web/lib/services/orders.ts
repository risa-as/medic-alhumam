import { prisma } from "@medic/database";
import type { OrderCreateInput } from "@medic/core";
import { ApiError } from "../api";

export async function createOrder(input: OrderCreateInput) {
  // idempotency: إن وُجد clientEventId مُكرَّر نُعيد الطلب نفسه
  const orderInclude = {
    items: { include: { product: { select: { nameAr: true, sku: true } } } },
  } as const;

  if (input.clientEventId) {
    const existing = await prisma.order.findUnique({
      where: { clientEventId: input.clientEventId },
      include: orderInclude,
    });
    if (existing) return existing;
  }

  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isOnline: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const itemsData = input.items.map((it) => {
    const p = byId.get(it.productId);
    if (!p) throw new ApiError(404, "PRODUCT_NOT_FOUND", `منتج غير موجود: ${it.productId}`);

    // التحقق من الحقول الإلزامية
    const customFields = Array.isArray(p.customFields)
      ? (p.customFields as Array<{ id: string; name: string; required: boolean }>)
      : [];
    for (const f of customFields) {
      if (f.required && !it.selectedAttributes?.[f.name]) {
        throw new ApiError(422, "MISSING_REQUIRED_FIELD", `الحقل "${f.name}" إلزامي`);
      }
    }

    const lineTotal = it.unitPrice * it.quantity;
    total += lineTotal;
    return {
      productId: it.productId,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      selectedAttributes: (it.selectedAttributes ?? {}) as Record<string, string>,
    };
  });

  const count = await prisma.order.count();
  const orderNo = `ORD-${String(count + 1).padStart(6, "0")}`;

  // تكلفة التوصيل الفعلية: لقطة لحظية من الإعدادات حسب المحافظة (بغداد مقابل بقيتها).
  const actualDeliveryCost = await resolveActualDeliveryCost(input.governorate);

  return prisma.order.create({
    data: {
      orderNo,
      clientEventId: input.clientEventId ?? null,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      governorate: input.governorate,
      customerAddress: input.customerAddress ?? null,
      source: input.source ?? "WEBSITE",
      total,
      actualDeliveryCost,
      notes: input.notes ?? null,
      items: { create: itemsData },
    },
    include: orderInclude,
  });
}

/**
 * يحسب تكلفة التوصيل الفعلية لمحافظة ما من إعدادات المتجر القابلة للتغيير:
 * بغداد → deliveryCostBaghdad، وبقية المحافظات → deliveryCostOther.
 * يُعيد null إن لم تكن هناك إعدادات (لا نفرض قيمة افتراضية صلبة).
 */
export async function resolveActualDeliveryCost(governorate: string): Promise<number | null> {
  const setting = await prisma.setting.findFirst();
  if (!setting) return null;
  const isBaghdad = governorate.trim() === "بغداد";
  return Number(isBaghdad ? setting.deliveryCostBaghdad : setting.deliveryCostOther);
}
