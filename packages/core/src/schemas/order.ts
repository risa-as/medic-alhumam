import { z } from "zod";
import { idSchema, amountSchema, positiveIntSchema } from "./common";
import { orderSourceEnum, orderStatusEnum } from "../enums";

export const orderItemInputSchema = z.object({
  productId: idSchema,
  quantity: positiveIntSchema,
  unitPrice: amountSchema,
  // القيم المختارة للحقول المخصّصة: { "اللون": "أحمر" }
  selectedAttributes: z.record(z.string(), z.string()).default({}),
});
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;

export const orderCreateSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, "الطلب يتطلب صنفًا واحدًا على الأقل"),
  customerName: z.string().min(1, "الاسم مطلوب"),
  customerPhone: z.string().min(1, "رقم الهاتف مطلوب"),
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  customerAddress: z.string().optional(),
  source: orderSourceEnum.optional(),
  clientEventId: z.string().optional(),
  notes: z.string().max(500).optional(),
});
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

export const orderStatusUpdateSchema = z.object({
  status: orderStatusEnum,
});
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

/** تعديل بيانات الطلب من لوحة الإدارة: تفاصيل الزبون + تكلفة التوصيل الفعلية + الملاحظات. */
export const orderUpdateSchema = z.object({
  customerName: z.string().min(1, "الاسم مطلوب").optional(),
  customerPhone: z.string().min(1, "رقم الهاتف مطلوب").optional(),
  governorate: z.string().min(1, "المحافظة مطلوبة").optional(),
  customerAddress: z.string().nullable().optional(),
  // null = إزالة القيمة المخزّنة (الرجوع للحساب التلقائي من الإعدادات).
  actualDeliveryCost: amountSchema.nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;

/** بيانات الزبون المحفوظة في كوكي الجلسة (بعد الـ landing). */
export const customerSessionSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  governorate: z.string().min(1),
  address: z.string().optional(),
});
export type CustomerSession = z.infer<typeof customerSessionSchema>;
