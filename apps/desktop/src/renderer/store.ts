import { create } from "zustand";
import { calculateSaleTotals, type SaleTotals } from "@medic/core";
import type { LocalProduct } from "./types";

export interface CartLine {
  productId: string;
  nameAr: string;
  unitPrice: number;
  available: number;
  quantity: number;
  lineDiscount: number;
}

/** فاتورة معلّقة: لقطة كاملة للسلة تُحفظ مؤقتًا لاستعادتها لاحقًا. */
export interface HeldInvoice {
  id: string;
  lines: CartLine[];
  discount: number;
  paid: number;
  customerName: string;
  customerPhone: string;
  /** الإجمالي المحسوب لحظة التعليق — للعرض في القائمة. */
  total: number;
  /** عدد الأصناف لحظة التعليق. */
  itemCount: number;
  /** طابع زمني (ms) لحظة التعليق. */
  heldAt: number;
}

interface CartState {
  lines: CartLine[];
  discount: number;
  paid: number;
  customerName: string;
  customerPhone: string;
  heldInvoices: HeldInvoice[];
  addProduct: (p: LocalProduct) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setUnitPrice: (productId: string, unitPrice: number) => void;
  setLineDiscount: (productId: string, lineDiscount: number) => void;
  removeLine: (productId: string) => void;
  setDiscount: (discount: number) => void;
  setPaid: (paid: number) => void;
  setCustomerName: (v: string) => void;
  setCustomerPhone: (v: string) => void;
  clear: () => void;
  /** يُعلّق الفاتورة الحالية (يحفظها في القائمة) ويبدأ فاتورة فارغة جديدة. */
  holdCurrent: () => void;
  /** يستعيد فاتورة معلّقة إلى السلة الحالية؛ وإن كانت الحالية غير فارغة عُلِّقت تلقائيًا أولًا. */
  restoreHeld: (id: string) => void;
  /** يحذف فاتورة معلّقة نهائيًا دون استعادتها. */
  discardHeld: (id: string) => void;
  totals: () => SaleTotals;
}

const genId = (): string =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** يبني لقطة فاتورة معلّقة من الحالة الراهنة للسلة. */
function snapshotHeld(s: Pick<CartState, "lines" | "discount" | "paid" | "customerName" | "customerPhone">): HeldInvoice {
  const totals = calculateSaleTotals(
    s.lines.map((l) => ({ quantity: l.quantity, unitPrice: l.unitPrice, lineDiscount: l.lineDiscount })),
    s.discount,
    s.paid,
  );
  return {
    id: genId(),
    lines: s.lines,
    discount: s.discount,
    paid: s.paid,
    customerName: s.customerName,
    customerPhone: s.customerPhone,
    total: totals.total,
    itemCount: s.lines.length,
    heldAt: Date.now(),
  };
}

export const useCart = create<CartState>((set, get) => ({
  lines: [],
  discount: 0,
  paid: 0,
  customerName: "",
  customerPhone: "",
  heldInvoices: [],

  addProduct: (p) =>
    set((s) => {
      const existing = s.lines.find((l) => l.productId === p.id);
      if (existing) {
        return {
          lines: s.lines.map((l) =>
            l.productId === p.id ? { ...l, quantity: Math.min(l.quantity + 1, l.available) } : l,
          ),
        };
      }
      return {
        lines: [
          ...s.lines,
          {
            productId: p.id,
            nameAr: p.nameAr,
            unitPrice: p.salePrice,
            available: p.quantity,
            quantity: 1,
            lineDiscount: 0,
          },
        ],
      };
    }),

  setQuantity: (productId, quantity) =>
    set((s) => ({
      lines: s.lines.map((l) =>
        l.productId === productId
          ? { ...l, quantity: Math.max(1, Math.min(quantity, l.available)) }
          : l,
      ),
    })),

  setUnitPrice: (productId, unitPrice) =>
    set((s) => ({
      lines: s.lines.map((l) =>
        l.productId === productId ? { ...l, unitPrice: Math.max(0, unitPrice) } : l,
      ),
    })),

  setLineDiscount: (productId, lineDiscount) =>
    set((s) => ({
      lines: s.lines.map((l) =>
        l.productId === productId ? { ...l, lineDiscount: Math.max(0, lineDiscount) } : l,
      ),
    })),

  removeLine: (productId) =>
    set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),

  setDiscount: (discount) => set({ discount: Math.max(0, discount) }),
  setPaid: (paid) => set({ paid: Math.max(0, paid) }),
  setCustomerName: (customerName) => set({ customerName }),
  setCustomerPhone: (customerPhone) => set({ customerPhone }),
  clear: () =>
    set({ lines: [], discount: 0, paid: 0, customerName: "", customerPhone: "" }),

  holdCurrent: () =>
    set((s) => {
      if (s.lines.length === 0) return {};
      return {
        heldInvoices: [...s.heldInvoices, snapshotHeld(s)],
        lines: [], discount: 0, paid: 0, customerName: "", customerPhone: "",
      };
    }),

  restoreHeld: (id) =>
    set((s) => {
      const target = s.heldInvoices.find((h) => h.id === id);
      if (!target) return {};
      let remaining = s.heldInvoices.filter((h) => h.id !== id);
      // إن كانت الفاتورة الحالية غير فارغة نُعلّقها تلقائيًا حتى لا تُفقد
      if (s.lines.length > 0) remaining = [...remaining, snapshotHeld(s)];
      return {
        heldInvoices: remaining,
        lines: target.lines,
        discount: target.discount,
        paid: target.paid,
        customerName: target.customerName,
        customerPhone: target.customerPhone,
      };
    }),

  discardHeld: (id) =>
    set((s) => ({ heldInvoices: s.heldInvoices.filter((h) => h.id !== id) })),

  totals: () => {
    const s = get();
    return calculateSaleTotals(
      s.lines.map((l) => ({
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        lineDiscount: l.lineDiscount,
      })),
      s.discount,
      s.paid,
    );
  },
}));
