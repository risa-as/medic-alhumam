import { prisma, type Product } from "@medic/database";

/**
 * يحوّل حقول Decimal إلى أرقام لتسهيل استهلاكها على طرف العميل.
 * عند `hideCostPrice` يُحذف حقل `costPrice` نهائيًا من الاستجابة (FR-041) — للمستخدم CASHIER.
 */
export function serializeProduct(p: Product, hideCostPrice = false) {
  const { costPrice, ...rest } = p;
  const base = {
    ...rest,
    salePrice: Number(p.salePrice),
    compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
    deliveryPrice: Number(p.deliveryPrice),
  };
  if (hideCostPrice) return base;
  return { ...base, costPrice: Number(costPrice) };
}

export interface ProductFilter {
  categoryId?: string;
  q?: string;
  online?: boolean;
  lowStock?: boolean;
  hideCostPrice?: boolean;
}

export async function listProducts(filter: ProductFilter) {
  const where: Record<string, unknown> = {};
  if (filter.categoryId) where.categoryId = filter.categoryId;
  if (filter.online !== undefined) where.isOnline = filter.online;
  if (filter.q) {
    where.OR = [
      { nameAr: { contains: filter.q, mode: "insensitive" } },
      { sku: { contains: filter.q, mode: "insensitive" } },
    ];
  }
  if (filter.lowStock) {
    where.quantity = { lte: prisma.product.fields.minQuantity };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 200,
  });
  return products.map((p) => ({
    ...serializeProduct(p, filter.hideCostPrice),
    category: p.category,
  }));
}
