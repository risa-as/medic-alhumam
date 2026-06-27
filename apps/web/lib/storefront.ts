import type { Product } from "@medic/database";

type ProductWithCategory = Product & { category?: { nameAr: string } | null };

/** الشكل العام الآمن للمنتج في المتجر — لا يحوي أبدًا `costPrice` أو أي حقول حسّاسة. */
export interface StorefrontProduct {
  id: string;
  nameAr: string;
  salePrice: number;
  /** السعر قبل الخصم (إن وُجد وكان أكبر من salePrice) — يُعرض مشطوبًا مع شارة نسبة الخصم. */
  compareAtPrice: number | null;
  /** سعر التوصيل المعروض للزبون بجانب سعر المنتج. 0 = توصيل مجاني/غير محدّد. */
  deliveryPrice: number;
  images: string[];
  videoUrl: string | null;
  description: string | null;
  /** الكمية المتوفّرة — لعرض حالة التوفّر (متوفر/كمية محدودة/نفد). */
  quantity: number;
  minQuantity: number;
  /** مُحتسب على الخادم: أُضيف خلال آخر ١٤ يومًا. */
  isNew: boolean;
  customFields: Array<{ id: string; name: string; type: string; options?: string[]; required: boolean }>;
  category?: { nameAr: string };
}

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * يحوّل منتج Prisma إلى الشكل العام الآمن للمتجر (FR-013).
 * يُسقط `costPrice` (سعر الشراء الحسّاس) وأي حقول داخلية،
 * ويحوّل قيم Decimal إلى Number — فلا تُمرَّر كائنات Decimal لمكوّنات العميل.
 */
export function toStorefrontProduct(p: ProductWithCategory): StorefrontProduct {
  return {
    id: p.id,
    nameAr: p.nameAr,
    salePrice: Number(p.salePrice),
    compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
    deliveryPrice: Number(p.deliveryPrice),
    images: p.images,
    videoUrl: p.videoUrl,
    description: p.description,
    quantity: p.quantity,
    minQuantity: p.minQuantity,
    isNew: Date.now() - new Date(p.createdAt).getTime() < NEW_WINDOW_MS,
    customFields: (p.customFields as StorefrontProduct["customFields"]) ?? [],
    category: p.category ? { nameAr: p.category.nameAr } : undefined,
  };
}

/** حالة توفّر المنتج للعرض في الواجهة. */
export type Availability = "in_stock" | "low_stock" | "out_of_stock";

export function availabilityOf(p: { quantity: number; minQuantity: number }): Availability {
  if (p.quantity <= 0) return "out_of_stock";
  if (p.quantity <= p.minQuantity) return "low_stock";
  return "in_stock";
}

/** نسبة الخصم المئوية (مقرّبة) إن وُجد سعر مقارنة صالح، وإلا null. */
export function discountPercent(p: { salePrice: number; compareAtPrice: number | null }): number | null {
  if (p.compareAtPrice && p.compareAtPrice > p.salePrice) {
    return Math.round(((p.compareAtPrice - p.salePrice) / p.compareAtPrice) * 100);
  }
  return null;
}
