import { describe, it, expect } from "vitest";
import { deriveDebtStatus, applyDebtPayment } from "./debt";

describe("deriveDebtStatus", () => {
  it("OPEN عند عدم السداد", () => expect(deriveDebtStatus(20000, 0)).toBe("OPEN"));
  it("PARTIAL عند سداد جزئي", () => expect(deriveDebtStatus(20000, 5000)).toBe("PARTIAL"));
  it("PAID عند السداد الكامل", () => expect(deriveDebtStatus(20000, 20000)).toBe("PAID"));
});

describe("applyDebtPayment", () => {
  it("يسدّد الدين بالكامل (سيناريو 20000 ودفع 20000)", () => {
    const r = applyDebtPayment(20000, 0, 20000);
    expect(r.paid).toBe(20000);
    expect(r.remaining).toBe(0);
    expect(r.status).toBe("PAID");
  });

  it("يسجّل دفعة جزئية", () => {
    const r = applyDebtPayment(20000, 0, 5000);
    expect(r.remaining).toBe(15000);
    expect(r.status).toBe("PARTIAL");
  });

  it("يرفض دفعة تتجاوز الرصيد", () => {
    expect(() => applyDebtPayment(20000, 15000, 10000)).toThrow();
  });

  it("يرفض مبلغًا غير موجب", () => {
    expect(() => applyDebtPayment(20000, 0, 0)).toThrow();
  });
});
