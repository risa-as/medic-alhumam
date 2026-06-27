import { roundAmount } from "./money";

/** دفعة مخزون كما تدخل خوارزمية FEFO. */
export interface FefoBatch {
  id: string;
  remaining: number;
  costPrice: number;
  /** تاريخ الصلاحية (اختياري). الدفعات بلا صلاحية تُستهلك أخيرًا. */
  expiryDate?: Date | string | null;
  /** تاريخ الاستلام — يُستخدم لكسر التعادل (FIFO عند غياب الصلاحية). */
  receivedAt: Date | string;
}

/** تخصيص كمية من دفعة واحدة. */
export interface FefoAllocation {
  batchId: string;
  quantity: number;
  costPrice: number;
}

export interface FefoResult {
  allocations: FefoAllocation[];
  /** مجموع تكلفة البضاعة المخصّصة = Σ(quantity × costPrice). */
  costTotal: number;
  /** الكمية المخصّصة فعليًا (= المطلوب − shortfall). */
  allocated: number;
  /** الكمية غير المغطّاة عند عدم كفاية الدفعات. */
  shortfall: number;
}

function toTime(d: Date | string | null | undefined): number {
  if (d == null) return Number.POSITIVE_INFINITY; // بلا صلاحية → الأخير
  const t = d instanceof Date ? d.getTime() : new Date(d).getTime();
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
}

/**
 * ترتيب FEFO: الأقرب انتهاءً أولًا (expiryDate تصاعديًا، وبلا صلاحية أخيرًا)،
 * ثم الأقدم استلامًا (receivedAt تصاعديًا) لكسر التعادل.
 */
export function sortBatchesFefo<T extends FefoBatch>(batches: T[]): T[] {
  return [...batches].sort((a, b) => {
    const ea = toTime(a.expiryDate);
    const eb = toTime(b.expiryDate);
    if (ea !== eb) return ea - eb;
    return toTime(a.receivedAt) - toTime(b.receivedAt);
  });
}

/**
 * يخصّص كمية مطلوبة من الدفعات بترتيب FEFO ويحسب تكلفة البضاعة المباعة.
 * لا يطرح من الدفعات (نقي/خالٍ من الأثر الجانبي) — المُستدعي يطبّق النقص.
 * عند عدم كفاية المخزون يخصّص المتاح ويُرجع `shortfall` بالباقي (FR-049: تُقبل البيعة دائمًا).
 */
export function allocateFefo(batches: FefoBatch[], quantity: number): FefoResult {
  const allocations: FefoAllocation[] = [];
  let remaining = Math.max(0, Math.trunc(quantity));
  let costTotal = 0;

  for (const b of sortBatchesFefo(batches)) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, Math.max(0, b.remaining));
    if (take <= 0) continue;
    allocations.push({ batchId: b.id, quantity: take, costPrice: b.costPrice });
    costTotal += take * b.costPrice;
    remaining -= take;
  }

  const requested = Math.max(0, Math.trunc(quantity));
  return {
    allocations,
    costTotal: roundAmount(costTotal),
    allocated: requested - remaining,
    shortfall: remaining,
  };
}
