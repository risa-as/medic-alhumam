import { z } from "zod";

// تطابق enums في مخطط Prisma (packages/database).
export const roleEnum = z.enum(["ADMIN", "CASHIER"]);
export const paymentTypeEnum = z.enum(["CASH", "CREDIT", "PARTIAL"]);
export const movementTypeEnum = z.enum(["PURCHASE", "SALE", "ADJUSTMENT", "RETURN"]);
export const debtStatusEnum = z.enum(["OPEN", "PARTIAL", "PAID"]);
export const orderSourceEnum = z.enum([
  "WEBSITE",
  "LANDING_PAGE",
  "FACEBOOK",
  "INSTAGRAM",
  "OTHER",
]);
export const orderStatusEnum = z.enum([
  "HOME",
  "PENDING",
  "COMPLETED",
  "RETURNED",
  "CANCELLED",
  "DELETED",
]);
export const expenseCategoryEnum = z.enum([
  "RENT",
  "SALARIES",
  "UTILITIES",
  "PURCHASES",
  "MAINTENANCE",
  "MARKETING",
  "TRANSPORT",
  "OTHER",
]);

export type Role = z.infer<typeof roleEnum>;
export type PaymentType = z.infer<typeof paymentTypeEnum>;
export type MovementType = z.infer<typeof movementTypeEnum>;
export type DebtStatus = z.infer<typeof debtStatusEnum>;
export type OrderSource = z.infer<typeof orderSourceEnum>;
export type OrderStatus = z.infer<typeof orderStatusEnum>;
export type ExpenseCategory = z.infer<typeof expenseCategoryEnum>;
