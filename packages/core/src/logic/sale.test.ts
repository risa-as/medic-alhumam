import { describe, it, expect } from "vitest";
import { calculateSaleTotals } from "./sale";

describe("calculateSaleTotals", () => {
  it("يحسب فاتورة نقدية بسيطة", () => {
    const r = calculateSaleTotals([{ quantity: 2, unitPrice: 25000 }], 0, 50000);
    expect(r.subtotal).toBe(50000);
    expect(r.total).toBe(50000);
    expect(r.remaining).toBe(0);
    expect(r.paymentType).toBe("CASH");
  });

  it("يشتق دفعًا جزئيًا ومتبقّيًا (سيناريو الدين 50000 ودفع 30000)", () => {
    const r = calculateSaleTotals([{ quantity: 1, unitPrice: 50000 }], 0, 30000);
    expect(r.total).toBe(50000);
    expect(r.remaining).toBe(20000);
    expect(r.paymentType).toBe("PARTIAL");
  });

  it("يشتق بيعًا آجلًا كاملًا (CREDIT) عند عدم الدفع", () => {
    const r = calculateSaleTotals([{ quantity: 1, unitPrice: 40000 }], 0, 0);
    expect(r.remaining).toBe(40000);
    expect(r.paymentType).toBe("CREDIT");
  });

  it("يطبّق خصم الصنف وخصم الفاتورة", () => {
    const r = calculateSaleTotals(
      [
        { quantity: 2, unitPrice: 10000, lineDiscount: 2000 },
        { quantity: 1, unitPrice: 5000 },
      ],
      3000,
      0,
    );
    // line1 = 20000 - 2000 = 18000 ; line2 = 5000 => subtotal 23000 ; total 20000
    expect(r.subtotal).toBe(23000);
    expect(r.total).toBe(20000);
  });

  it("لا يسمح بإجمالي سالب عند خصم أكبر من المجموع", () => {
    const r = calculateSaleTotals([{ quantity: 1, unitPrice: 1000 }], 5000, 0);
    expect(r.total).toBe(0);
  });
});
