import type { PaymentType } from "../enums";
import { roundAmount } from "./money";

export interface SaleLineInput {
  quantity: number;
  unitPrice: number;
  lineDiscount?: number;
}

export interface SaleLineResult {
  quantity: number;
  unitPrice: number;
  lineDiscount: number;
  lineTotal: number;
}

export interface SaleTotals {
  lines: SaleLineResult[];
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  remaining: number;
  paymentType: PaymentType;
}

/**
 * يحسب إجماليات الفاتورة ويشتق المتبقي ونوع الدفع.
 * - lineTotal = quantity × unitPrice − lineDiscount (لا يقل عن صفر)
 * - total = subtotal − discount (لا يقل عن صفر)
 * - remaining = total − paid (لا يقل عن صفر)
 * - paymentType: CASH عند السداد الكامل، CREDIT عند عدم الدفع، PARTIAL فيما بينهما.
 */
export function calculateSaleTotals(
  items: SaleLineInput[],
  discount = 0,
  paid = 0,
): SaleTotals {
  const lines: SaleLineResult[] = items.map((it) => {
    const lineDiscount = it.lineDiscount ?? 0;
    const gross = it.quantity * it.unitPrice;
    const lineTotal = roundAmount(Math.max(0, gross - lineDiscount));
    return { quantity: it.quantity, unitPrice: it.unitPrice, lineDiscount, lineTotal };
  });

  const subtotal = roundAmount(lines.reduce((acc, l) => acc + l.lineTotal, 0));
  const total = roundAmount(Math.max(0, subtotal - discount));
  const remaining = roundAmount(Math.max(0, total - paid));

  let paymentType: PaymentType;
  if (paid >= total) paymentType = "CASH";
  else if (paid <= 0) paymentType = "CREDIT";
  else paymentType = "PARTIAL";

  return { lines, subtotal, discount: roundAmount(discount), total, paid: roundAmount(paid), remaining, paymentType };
}
