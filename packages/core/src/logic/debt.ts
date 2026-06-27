import type { DebtStatus } from "../enums";
import { roundAmount } from "./money";

/** يشتق حالة الدين من المبلغ والمسدّد. */
export function deriveDebtStatus(amount: number, paid: number): DebtStatus {
  if (paid <= 0) return "OPEN";
  if (paid >= amount) return "PAID";
  return "PARTIAL";
}

/** الصيغة الموحّدة للرصيد المتبقّي على دين (لا يقلّ عن صفر). */
export function debtRemaining(amount: number, paid: number): number {
  return Math.max(0, roundAmount(amount - paid));
}

export interface ApplyPaymentResult {
  paid: number;
  remaining: number;
  status: DebtStatus;
}

/** يطبّق دفعة سداد على دين ويعيد المسدّد الجديد والحالة. يرفض المبالغ غير الصالحة أو التي تتجاوز الرصيد. */
export function applyDebtPayment(
  amount: number,
  currentPaid: number,
  payment: number,
): ApplyPaymentResult {
  if (payment <= 0) {
    throw new Error("مبلغ الدفعة يجب أن يكون أكبر من صفر");
  }
  const newPaid = roundAmount(currentPaid + payment);
  if (newPaid > amount) {
    throw new Error("الدفعة تتجاوز الرصيد المتبقّي");
  }
  return {
    paid: newPaid,
    remaining: roundAmount(amount - newPaid),
    status: deriveDebtStatus(amount, newPaid),
  };
}
