import { z } from "zod";
import { idSchema, amountSchema } from "./common";
import { shiftStatusEnum, salePlatformEnum } from "../enums";

/** فتح وردية (من الهاتف/الويب مباشرةً عبر الـ API). */
export const shiftOpenSchema = z.object({
  // النقد الموجود في الصندوق عند الفتح
  openingFloat: amountSchema.default(0),
  note: z.string().max(500).optional(),
  // المنصّة التي فُتحت منها (يُحدَّد عادةً على الخادم حسب نوع الطلب).
  platform: salePlatformEnum.optional(),
});
export type ShiftOpenInput = z.infer<typeof shiftOpenSchema>;

/** إغلاق وردية بعدّ النقد الفعلي. */
export const shiftCloseSchema = z.object({
  closingCountedCash: amountSchema,
  note: z.string().max(500).optional(),
});
export type ShiftCloseInput = z.infer<typeof shiftCloseSchema>;

/**
 * حدث وردية يُدفع من الديسكتوب الأوفلاين (idempotent عبر clientEventId).
 * status = OPEN عند الفتح، و CLOSED عند الإغلاق (يحمل عندها closingCountedCash و closedAt).
 */
export const shiftSyncEventSchema = z.object({
  // معرّف الوردية الثابت (مفتاح الـ upsert على الخادم؛ يتشارك بين حدثَي الفتح والإغلاق).
  clientEventId: z.string().min(1),
  // مفتاح فريد لهذا الحدث تحديدًا (فتح/إغلاق) يُعاد كما هو ليطابق العميل عنصر الطابور.
  // عند غيابه يُستخدم clientEventId.
  eventKey: z.string().optional(),
  userId: idSchema.optional(),
  openingFloat: amountSchema.default(0),
  openedAt: z.string(),
  status: shiftStatusEnum,
  closingCountedCash: amountSchema.nullable().optional(),
  closedAt: z.string().nullable().optional(),
  note: z.string().max(500).nullable().optional(),
});
export type ShiftSyncEvent = z.infer<typeof shiftSyncEventSchema>;
