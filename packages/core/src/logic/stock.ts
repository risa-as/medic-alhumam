import type { MovementType } from "../enums";

/**
 * يطبّق حركة مخزون على الكمية الحالية ويعيد الكمية الجديدة.
 * - PURCHASE / RETURN: تزيد الكمية
 * - SALE: تنقص الكمية
 * - ADJUSTMENT: دلتا موقّعة (+/-)
 * يرفض النتيجة السالبة (FR-006).
 */
export function applyStockMovement(
  currentQty: number,
  type: MovementType,
  quantity: number,
): number {
  let delta: number;
  switch (type) {
    case "PURCHASE":
    case "RETURN":
      delta = Math.abs(quantity);
      break;
    case "SALE":
      delta = -Math.abs(quantity);
      break;
    case "ADJUSTMENT":
      delta = quantity;
      break;
  }

  const next = currentQty + delta;
  if (next < 0) {
    throw new Error("الكمية الناتجة لا يمكن أن تكون سالبة");
  }
  return next;
}

/** يتحقق من إمكانية بيع كمية من المتوفر دون أن يصبح المخزون سالبًا. */
export function canSell(currentQty: number, quantity: number): boolean {
  return quantity > 0 && currentQty >= quantity;
}
