import { z } from "zod";
import { idSchema, positiveIntSchema, nonNegativeIntSchema, amountSchema } from "./common";
import { movementTypeEnum, expenseCategoryEnum } from "../enums";

export const categoryCreateSchema = z.object({
  nameAr: z.string().min(1, "اسم الفئة مطلوب"),
});
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;

export const categoryUpdateSchema = categoryCreateSchema.partial();
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

export const customerCreateSchema = z.object({
  name:    z.string().min(1, "اسم الزبون مطلوب"),
  phone:   z.string().optional(),
  address: z.string().optional(),
});
export type CustomerCreateInput = z.infer<typeof customerCreateSchema>;

export const stockMovementCreateSchema = z.object({
  productId: idSchema,
  type: movementTypeEnum,
  // موجب لـ PURCHASE/SALE/RETURN؛ موقّع لـ ADJUSTMENT
  quantity: z.number().int().refine((n) => n !== 0, "الكمية يجب ألا تكون صفرًا"),
  reason: z.string().optional(),
  // سعر شراء الشحنة (مطلوب لـ PURCHASE) — أساس تكلفة دفعة FEFO
  costPrice: amountSchema.optional(),
  // تاريخ الصلاحية (اختياري) — يُفعّل ترتيب FEFO الكامل
  expiryDate: z.string().datetime().optional(),
});
export type StockMovementCreateInput = z.infer<typeof stockMovementCreateSchema>;

// تأكيد أن PURCHASE/SALE/RETURN كميتها موجبة (التسوية فقط تقبل الإشارة السالبة)
// + أن PURCHASE يحمل سعر شراء (لإنشاء دفعة التكلفة)
export const restrictedStockMovementSchema = stockMovementCreateSchema
  .refine(
    (m) => m.type === "ADJUSTMENT" || m.quantity > 0,
    { message: "الكمية يجب أن تكون موجبة لهذا النوع", path: ["quantity"] },
  )
  .refine(
    (m) => m.type !== "PURCHASE" || (m.costPrice != null && m.costPrice >= 0),
    { message: "سعر الشراء مطلوب لإدخال شحنة", path: ["costPrice"] },
  );

// تعديل دفعة مخزون (تصحيح): سعر الشراء/الصلاحية/السبب فقط — لا تُعدَّل الكمية/المتبقّي محاسبيًا.
export const productBatchUpdateSchema = z.object({
  costPrice: amountSchema.optional(),
  expiryDate: z.string().datetime().nullable().optional(),
  reason: z.string().max(200).nullable().optional(),
});
export type ProductBatchUpdateInput = z.infer<typeof productBatchUpdateSchema>;

// مصروف تشغيلي (إيجار/رواتب/فواتير...)
export const expenseCreateSchema = z.object({
  amount: z.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
  category: expenseCategoryEnum.default("OTHER"),
  note: z.string().max(300).optional(),
  // تاريخ الصرف (ISO)؛ يُفترض الآن إن لم يُرسَل
  spentAt: z.string().datetime().optional(),
});
export type ExpenseCreateInput = z.infer<typeof expenseCreateSchema>;

export const expenseUpdateSchema = expenseCreateSchema.partial();
export type ExpenseUpdateInput = z.infer<typeof expenseUpdateSchema>;

export { positiveIntSchema, nonNegativeIntSchema };
