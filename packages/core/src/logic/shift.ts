import { roundAmount } from "./money";

/** فاتورة مبسّطة لحساب إجماليات الوردية (القيم بالأرقام، لا Decimal). */
export interface ShiftSaleLike {
  total: number;
  paid: number;
  remaining: number;
  discount?: number;
  /** طريقة الدفع في نقطة البيع: "CASH" | "CARD" | "CREDIT" (قد تكون null للبيانات القديمة/الويب). */
  paymentMethod?: string | null;
}

/** إجماليات وردية محسوبة بشكل موحَّد عبر التطبيقات وصفحة التقارير. */
export interface ShiftTotals {
  /** عدد الفواتير في الوردية. */
  salesCount: number;
  /** إجمالي قيمة المبيعات (Σ total). */
  totalSales: number;
  /** إجمالي المحصّل (نقد + بطاقة) = Σ paid. */
  collectedCash: number;
  /** المحصّل نقدًا فقط (يدخل الصندوق). */
  cashCollected: number;
  /** المحصّل عبر البطاقة (لا يدخل الصندوق). */
  cardCollected: number;
  /** المبالغ الآجلة غير المسدَّدة (Σ remaining). */
  creditTotal: number;
  /** إجمالي الخصومات (Σ discount). */
  totalDiscount: number;
  /** النقد المتوقَّع في الصندوق = الرصيد الافتتاحي + النقد المحصّل (بدون البطاقة). */
  expectedCash: number;
  /** النقد المعدود فعليًّا عند الإغلاق (null ما دامت الوردية مفتوحة). */
  countedCash: number | null;
  /** فرق العدّ = المعدود − المتوقَّع (null قبل الإغلاق). موجب = زيادة، سالب = عجز. */
  discrepancy: number | null;
}

/**
 * يحسب إجماليات الوردية من فواتيرها ورصيدها الافتتاحي (ومعدود الإغلاق إن وُجد).
 * دالة نقية تُستخدم في الخادم (التقارير) والديسكتوب والهاتف لضمان تطابق الأرقام.
 * تفصيل الدفع: البطاقة = Σ paid لفواتير CARD، والنقد = باقي المحصّل (نقدي + مقدّمات الآجل).
 * النقد المتوقَّع في الصندوق يحتسب النقد فقط دون البطاقة.
 */
export function computeShiftTotals(
  sales: ShiftSaleLike[],
  openingFloat: number,
  closingCountedCash?: number | null,
): ShiftTotals {
  let totalSales = 0;
  let collectedCash = 0;
  let cardCollected = 0;
  let creditTotal = 0;
  let totalDiscount = 0;
  for (const s of sales) {
    totalSales += s.total;
    collectedCash += s.paid;
    creditTotal += s.remaining;
    totalDiscount += s.discount ?? 0;
    if (s.paymentMethod === "CARD") cardCollected += s.paid;
  }
  const cashCollected = collectedCash - cardCollected;
  const expectedCash = openingFloat + cashCollected;
  const counted = closingCountedCash ?? null;
  return {
    salesCount: sales.length,
    totalSales: roundAmount(totalSales),
    collectedCash: roundAmount(collectedCash),
    cashCollected: roundAmount(cashCollected),
    cardCollected: roundAmount(cardCollected),
    creditTotal: roundAmount(creditTotal),
    totalDiscount: roundAmount(totalDiscount),
    expectedCash: roundAmount(expectedCash),
    countedCash: counted,
    discrepancy: counted != null ? roundAmount(counted - expectedCash) : null,
  };
}
