import { describe, it, expect } from "vitest";
import { allocateFefo, sortBatchesFefo } from "./fefo";

describe("sortBatchesFefo", () => {
  it("يرتّب حسب الصلاحية تصاعديًا (الأقرب انتهاءً أولًا)", () => {
    const order = sortBatchesFefo([
      { id: "b", remaining: 5, costPrice: 1, expiryDate: "2026-12-01", receivedAt: "2026-01-01" },
      { id: "a", remaining: 5, costPrice: 1, expiryDate: "2026-06-01", receivedAt: "2026-01-01" },
    ]).map((x) => x.id);
    expect(order).toEqual(["a", "b"]);
  });

  it("الدفعات بلا صلاحية تأتي أخيرًا", () => {
    const order = sortBatchesFefo([
      { id: "noexp", remaining: 5, costPrice: 1, expiryDate: null, receivedAt: "2026-01-01" },
      { id: "exp", remaining: 5, costPrice: 1, expiryDate: "2026-06-01", receivedAt: "2026-05-01" },
    ]).map((x) => x.id);
    expect(order).toEqual(["exp", "noexp"]);
  });

  it("عند تساوي الصلاحية يكسر التعادل بالأقدم استلامًا (FIFO)", () => {
    const order = sortBatchesFefo([
      { id: "new", remaining: 5, costPrice: 1, expiryDate: null, receivedAt: "2026-03-01" },
      { id: "old", remaining: 5, costPrice: 1, expiryDate: null, receivedAt: "2026-01-01" },
    ]).map((x) => x.id);
    expect(order).toEqual(["old", "new"]);
  });
});

describe("allocateFefo", () => {
  it("يخصّص من دفعة واحدة كافية ويحسب التكلفة", () => {
    const r = allocateFefo(
      [{ id: "a", remaining: 10, costPrice: 2, receivedAt: "2026-01-01" }],
      3,
    );
    expect(r.allocated).toBe(3);
    expect(r.shortfall).toBe(0);
    expect(r.costTotal).toBe(6);
    expect(r.allocations).toEqual([{ batchId: "a", quantity: 3, costPrice: 2 }]);
  });

  it("يمتدّ عبر عدّة دفعات بترتيب FEFO ويجمع تكلفتها", () => {
    const r = allocateFefo(
      [
        { id: "later", remaining: 5, costPrice: 4, expiryDate: "2026-12-01", receivedAt: "2026-01-01" },
        { id: "sooner", remaining: 4, costPrice: 3, expiryDate: "2026-06-01", receivedAt: "2026-01-01" },
      ],
      6,
    );
    // 4 من sooner (×3=12) + 2 من later (×4=8) = 20
    expect(r.allocated).toBe(6);
    expect(r.shortfall).toBe(0);
    expect(r.costTotal).toBe(20);
    expect(r.allocations).toEqual([
      { batchId: "sooner", quantity: 4, costPrice: 3 },
      { batchId: "later", quantity: 2, costPrice: 4 },
    ]);
  });

  it("عند نقص المخزون يخصّص المتاح ويُرجع shortfall", () => {
    const r = allocateFefo(
      [{ id: "a", remaining: 2, costPrice: 5, receivedAt: "2026-01-01" }],
      5,
    );
    expect(r.allocated).toBe(2);
    expect(r.shortfall).toBe(3);
    expect(r.costTotal).toBe(10);
  });

  it("لا دفعات → كل الكمية shortfall وتكلفة صفر", () => {
    const r = allocateFefo([], 4);
    expect(r.allocated).toBe(0);
    expect(r.shortfall).toBe(4);
    expect(r.costTotal).toBe(0);
    expect(r.allocations).toEqual([]);
  });
});
