import { z } from "zod";
import { idSchema, amountSchema, nonNegativeIntSchema } from "./common";

/** تعريف حقل مخصّص للمنتج (لون/قياس/...). */
export const customFieldSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1, "اسم الحقل مطلوب"),
    type: z.enum(["select", "text"]),
    options: z.array(z.string().min(1)).optional(),
    required: z.boolean().default(false),
  })
  .refine((f) => f.type !== "select" || (f.options?.length ?? 0) > 0, {
    message: "حقل القائمة يتطلب قيمة واحدة على الأقل",
    path: ["options"],
  });

export type CustomField = z.infer<typeof customFieldSchema>;

export const productCreateSchema = z.object({
  nameAr: z.string().min(1, "اسم المنتج مطلوب"),
  sku: z.string().min(1, "الرمز/الباركود مطلوب"),
  categoryId: idSchema,
  costPrice: amountSchema,
  salePrice: amountSchema,
  // السعر قبل الخصم (اختياري). null/غياب = لا خصم. يُعرض مشطوبًا في المتجر عندما يفوق salePrice.
  compareAtPrice: amountSchema.nullable().optional(),
  // سعر التوصيل المعروض للزبون بجانب سعر المنتج. 0 = توصيل مجاني/غير محدّد.
  deliveryPrice: amountSchema.default(0),
  quantity: nonNegativeIntSchema.default(0),
  minQuantity: nonNegativeIntSchema.default(0),
  images: z.array(z.string().url()).default([]),
  videoUrl: z.string().url().optional(),
  description: z.string().optional(),
  isOnline: z.boolean().default(false),
  customFields: z.array(customFieldSchema).default([]),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
