/** تقريب المبالغ إلى 3 منازل (يطابق Decimal(14,3) في قاعدة البيانات). */
export function roundAmount(n: number): number {
  return Math.round((n + Number.EPSILON) * 1000) / 1000;
}
