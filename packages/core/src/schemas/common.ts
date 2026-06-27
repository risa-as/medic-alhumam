import { z } from "zod";

export const idSchema = z.string().min(1, "معرّف مطلوب");
export const amountSchema = z.number().nonnegative("القيمة يجب ألا تكون سالبة");
export const positiveIntSchema = z.number().int().positive("يجب أن يكون عددًا صحيحًا موجبًا");
export const nonNegativeIntSchema = z.number().int().min(0);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;
