import { z } from "zod";
import { idSchema, amountSchema, positiveIntSchema } from "./common";
import { paymentTypeEnum } from "../enums";

export const saleItemInputSchema = z.object({
  productId: idSchema,
  quantity: positiveIntSchema,
  unitPrice: amountSchema,
  lineDiscount: amountSchema.default(0),
});
export type SaleItemInput = z.infer<typeof saleItemInputSchema>;

export const saleCreateSchema = z.object({
  customerId: idSchema.optional(),
  items: z.array(saleItemInputSchema).min(1, "الفاتورة تتطلب صنفًا واحدًا على الأقل"),
  discount: amountSchema.default(0),
  paid: amountSchema.default(0),
});
export type SaleCreateInput = z.infer<typeof saleCreateSchema>;

export const debtPaymentCreateSchema = z.object({
  amount: amountSchema.refine((n) => n > 0, "مبلغ الدفعة يجب أن يكون أكبر من صفر"),
});
export type DebtPaymentCreateInput = z.infer<typeof debtPaymentCreateSchema>;

// ---- مزامنة الفواتير من الديسكتوب (Offline-first) ----
export const saleSyncItemSchema = z.object({
  productId: idSchema,
  quantity: positiveIntSchema,
  unitPrice: amountSchema,
  lineDiscount: amountSchema.default(0),
  lineTotal: amountSchema,
});

/** حدث فاتورة مكتملة محليًا يُدفع إلى الخادم (بأمواله المحسوبة مسبقًا). */
export const saleSyncEventSchema = z.object({
  clientEventId: z.string().min(1),
  invoiceNo: z.string().min(1),
  // معرّف المستخدم الفعّال لحظة إنشاء الفاتورة على الجهاز (FR-047) — اختياري للتوافق الخلفي
  userId: idSchema.optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  items: z.array(saleSyncItemSchema).min(1),
  subtotal: amountSchema,
  discount: amountSchema,
  total: amountSchema,
  paid: amountSchema,
  remaining: amountSchema,
  paymentType: paymentTypeEnum,
  createdAt: z.string(),
});
export type SaleSyncEvent = z.infer<typeof saleSyncEventSchema>;

export const syncPushSchema = z.object({
  events: z.array(saleSyncEventSchema).min(1),
});
export type SyncPushInput = z.infer<typeof syncPushSchema>;
