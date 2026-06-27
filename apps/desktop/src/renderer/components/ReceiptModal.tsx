import { useEffect } from "react";
import { Banknote, CreditCard, CalendarClock, Receipt, Stethoscope, Leaf, Printer, type LucideIcon } from "lucide-react";
import type { LocalSale } from "../types";

export type PayMethod = "CASH" | "CARD" | "CREDIT";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

const METHOD: Record<string, { label: string; icon: LucideIcon; color: string; bg: string }> = {
  CASH:    { label: "نقدي",      icon: Banknote,      color: "#059669", bg: "#ECFDF5" },
  CARD:    { label: "بطاقة",     icon: CreditCard,    color: "#1A5276", bg: "#EAF2F9" },
  CREDIT:  { label: "آجل",       icon: CalendarClock, color: "#D97706", bg: "#FFFBEB" },
  PARTIAL: { label: "دفع جزئي", icon: Receipt,       color: "#7C3AED", bg: "#F5F3FF" },
};

/**
 * وصل بيع منبثق بنمط الأنظمة العالمية (إيصال حراري).
 * يُعرض فور إتمام البيع ويدعم الطباعة وبدء فاتورة جديدة.
 */
export function ReceiptModal({
  sale, method, onClose, primaryLabel = "+ فاتورة جديدة",
}: {
  sale: LocalSale;
  /** طريقة الدفع المعروضة؛ إن لم تُمرَّر تُشتق من نوع دفع الفاتورة (لإعادة العرض من سجل الفواتير). */
  method?: PayMethod;
  onClose: () => void;
  /** نص الزر الأساسي (افتراضيًا «+ فاتورة جديدة» في نقطة البيع؛ مرّر «إغلاق» لإعادة العرض). */
  primaryLabel?: string;
}) {
  const m =
    METHOD[method ?? sale.paymentType] ??
    { label: "نقدي", icon: Banknote, color: "#059669", bg: "#ECFDF5" };
  const MethodIcon = m.icon;

  /* إغلاق بمفتاح Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const date = new Date(sale.createdAt);

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ zIndex: 1100 }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>

        {/* ── ورقة الوصل ── */}
        <div className="receipt-paper receipt-print">

          {/* ترويسة المتجر */}
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%", margin: "0 auto 8px",
              background: "linear-gradient(135deg, #154360, #2E6E96)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}><Stethoscope size={24} /></div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              متجر المستلزمات الطبية
            </h2>
            <p style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
              مستلزمات وأجهزة طبية
            </p>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
              إيصال بيع · نقطة البيع (POS)
            </p>
          </div>

          <hr className="receipt-divider" />

          {/* بيانات الفاتورة */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div className="receipt-row">
              <span style={{ color: "#64748B" }}>رقم الفاتورة</span>
              <span className="receipt-num" style={{ fontWeight: 700, fontFamily: "monospace" }}>{sale.invoiceNo}</span>
            </div>
            <div className="receipt-row">
              <span style={{ color: "#64748B" }}>التاريخ</span>
              <span className="receipt-num">{date.toLocaleDateString("ar-IQ", { year: "numeric", month: "2-digit", day: "2-digit" })}</span>
            </div>
            <div className="receipt-row">
              <span style={{ color: "#64748B" }}>الوقت</span>
              <span className="receipt-num">{date.toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            {sale.customerName && (
              <div className="receipt-row">
                <span style={{ color: "#64748B" }}>الزبون</span>
                <span style={{ fontWeight: 600 }}>{sale.customerName}</span>
              </div>
            )}
          </div>

          <hr className="receipt-divider" />

          {/* ترويسة جدول الأصناف */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 10.5, fontWeight: 700, color: "#94A3B8",
            textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4,
          }}>
            <span>الصنف</span>
            <span>الإجمالي</span>
          </div>

          {/* الأصناف */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {sale.items.map(it => (
              <div key={it.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "#0F172A", lineHeight: 1.35 }}>{it.nameAr}</p>
                  <p className="receipt-num" style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                    {fmt(it.quantity)} × {fmt(it.unitPrice)}
                    {it.lineDiscount > 0 && <span style={{ color: "#DC2626" }}> − {fmt(it.lineDiscount)}</span>}
                  </p>
                </div>
                <span className="receipt-num" style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>
                  {fmt(it.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          <hr className="receipt-divider" />

          {/* الإجماليات */}
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <div className="receipt-row">
              <span style={{ color: "#64748B" }}>المجموع الفرعي</span>
              <span className="receipt-num">{fmt(sale.subtotal)} د.ع</span>
            </div>
            {sale.discount > 0 && (
              <div className="receipt-row" style={{ color: "#DC2626" }}>
                <span>الخصم</span>
                <span className="receipt-num">− {fmt(sale.discount)} د.ع</span>
              </div>
            )}
          </div>

          {/* الإجمالي الكلي */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            margin: "10px 0", padding: "9px 12px",
            background: "#0F172A", borderRadius: "var(--radius)", color: "#fff",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>الإجمالي</span>
            <span className="receipt-num" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {fmt(sale.total)} <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>د.ع</span>
            </span>
          </div>

          {/* المدفوع / المتبقّي */}
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <div className="receipt-row">
              <span style={{ color: "#64748B" }}>المدفوع</span>
              <span className="receipt-num" style={{ fontWeight: 600 }}>{fmt(sale.paid)} د.ع</span>
            </div>
            {sale.remaining > 0 && (
              <div className="receipt-row" style={{ color: "#DC2626", fontWeight: 700 }}>
                <span>المتبقّي (دين)</span>
                <span className="receipt-num">{fmt(sale.remaining)} د.ع</span>
              </div>
            )}
          </div>

          {/* طريقة الدفع */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 800,
              background: m.bg, color: m.color,
              padding: "6px 16px", borderRadius: 999,
              border: `1.5px solid ${m.color}33`,
            }}>
              <MethodIcon size={14} /> طريقة الدفع: {m.label}
            </span>
          </div>

          <hr className="receipt-divider" />

          {/* تذييل */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A", display: "inline-flex", alignItems: "center", gap: 5 }}>شكراً لتعاملكم معنا <Leaf size={13} style={{ color: "#1A7F5A" }} /></p>
            <p style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 3 }}>
              نتمنى لكم دوام الصحة والعافية
            </p>
            <div className="receipt-barcode" style={{ margin: "12px 0 5px" }} />
            <p className="receipt-num" style={{ fontSize: 11, color: "#475569", letterSpacing: "0.18em", fontFamily: "monospace" }}>
              {sale.invoiceNo}
            </p>
          </div>
        </div>

        {/* ── أزرار الإجراءات ── */}
        <div className="no-print" style={{ display: "flex", gap: 10, width: 360, maxWidth: "calc(100vw - 40px)" }}>
          <button
            onClick={() => window.print()}
            style={{
              flex: 1, padding: "11px", borderRadius: "var(--radius)",
              border: "1.5px solid var(--color-border)", background: "var(--color-surface)",
              fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              color: "var(--color-text)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              transition: "all 150ms",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text)"; }}
          >
            <Printer size={15} /> طباعة الوصل
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px", borderRadius: "var(--radius)", border: "none",
              background: "linear-gradient(135deg, #154360, #2E6E96)",
              fontSize: 13, fontWeight: 800, cursor: "pointer", color: "#fff", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              boxShadow: "0 3px 10px rgba(26,82,118,0.35)", transition: "all 150ms",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 16px rgba(26,82,118,0.45)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(26,82,118,0.35)"; }}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
