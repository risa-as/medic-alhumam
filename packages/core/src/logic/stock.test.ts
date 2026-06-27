import { describe, it, expect } from "vitest";
import { applyStockMovement, canSell } from "./stock";

describe("applyStockMovement", () => {
  it("البيع ينقص الكمية (10 − 2 = 8)", () => {
    expect(applyStockMovement(10, "SALE", 2)).toBe(8);
  });

  it("الشراء يزيد الكمية", () => {
    expect(applyStockMovement(5, "PURCHASE", 20)).toBe(25);
  });

  it("الإرجاع يعيد الكمية للمخزون", () => {
    expect(applyStockMovement(8, "RETURN", 2)).toBe(10);
  });

  it("التسوية تقبل دلتا موقّعة", () => {
    expect(applyStockMovement(10, "ADJUSTMENT", -3)).toBe(7);
  });

  it("يرفض الكمية الناتجة السالبة", () => {
    expect(() => applyStockMovement(1, "SALE", 5)).toThrow();
  });
});

describe("canSell", () => {
  it("يسمح بالبيع عند توفّر الكمية", () => expect(canSell(10, 2)).toBe(true));
  it("يمنع البيع عند نقص الكمية", () => expect(canSell(1, 5)).toBe(false));
});
