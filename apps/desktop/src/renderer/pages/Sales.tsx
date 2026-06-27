import { useEffect, useState } from "react";
import { Tag, PenLine, Check, Eye, Receipt, Wallet, Hourglass, Search, X } from "lucide-react";
import { ReceiptModal } from "../components/ReceiptModal";
import { PageHeader, DataTable, StatusBadge, Btn, type Column } from "../components/ui";
import type { LocalSale } from "../types";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

/* ══════════════════════════════════════
   فلتر الفترة الزمنية
══════════════════════════════════════ */
type Period = "all" | "today" | "yesterday" | "week" | "month" | "lastMonth" | "custom";

const PERIODS: { key: Period; label: string }[] = [
  { key: "all",       label: "الكل" },
  { key: "today",     label: "اليوم" },
  { key: "yesterday", label: "أمس" },
  { key: "week",      label: "هذا الأسبوع" },
  { key: "month",     label: "هذا الشهر" },
  { key: "lastMonth", label: "الشهر الماضي" },
  { key: "custom",    label: "مخصّص" },
];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** يحوّل "yyyy-mm-dd" إلى تاريخ محلي (منتصف ليل محلي) لتفادي انزياح المنطقة الزمنية. */
function parseLocalDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** يحسب نطاق [from, to) بصيغة ISO من الفترة المختارة (حدود الأيام محلية). */
function computeRange(period: Period, customFrom: string, customTo: string): { from?: string; to?: string } {
  const now = new Date();
  const today = startOfDay(now);

  switch (period) {
    case "today": {
      const to = new Date(today); to.setDate(today.getDate() + 1);
      return { from: today.toISOString(), to: to.toISOString() };
    }
    case "yesterday": {
      const from = new Date(today); from.setDate(today.getDate() - 1);
      return { from: from.toISOString(), to: today.toISOString() };
    }
    case "week": {
      // أسبوع يبدأ السبت (المتعارف عليه محليًا)
      const sinceSat = (today.getDay() + 1) % 7; // 0=أحد..6=سبت
      const from = new Date(today); from.setDate(today.getDate() - sinceSat);
      const to = new Date(from); to.setDate(from.getDate() + 7);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    case "month": {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    case "lastMonth": {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    case "custom": {
      const fromD = parseLocalDate(customFrom);
      const toD = parseLocalDate(customTo);
      let to: string | undefined;
      if (toD) { const t = new Date(toD); t.setDate(toD.getDate() + 1); to = t.toISOString(); }
      return { from: fromD ? fromD.toISOString() : undefined, to };
    }
    default:
      return {};
  }
}

/* ══════════════════════════════════════
   علامات الفاتورة (خصم / تعديل سعر)
══════════════════════════════════════ */
function SaleFlags({ sale }: { sale: LocalSale }) {
  const discounted = sale.discount > 0 || sale.items.some((i) => i.lineDiscount > 0);
  if (!discounted && !sale.priceEdited) return null;

  const chip = (bg: string, color: string): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: 3,
    fontSize: 9.5, fontWeight: 700, padding: "1px 6px",
    borderRadius: 999, background: bg, color, whiteSpace: "nowrap",
  });

  return (
    <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
      {discounted && (
        <span style={chip("var(--color-danger-light)", "var(--color-danger)")} title="طُبّق خصم على هذه الفاتورة">
          <Tag size={11} /> خصم
        </span>
      )}
      {sale.priceEdited && (
        <span style={chip("#F5F3FF", "#7C3AED")} title="عُدّل سعر أحد أصنافها يدويًا">
          <PenLine size={11} /> تعديل سعر
        </span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   صفحة الفواتير
══════════════════════════════════════ */
export function Sales() {
  const [sales, setSales]       = useState<LocalSale[]>([]);
  const [selected, setSelected] = useState<LocalSale | null>(null);
  const [loading, setLoading]   = useState(true);

  // فلاتر
  const [invoiceQuery, setInvoiceQuery] = useState("");
  const [period, setPeriod]             = useState<Period>("all");
  const [customFrom, setCustomFrom]     = useState("");
  const [customTo, setCustomTo]         = useState("");

  /* جلب الفواتير عند تغيّر أيّ فلتر (مع debounce بسيط لحقل البحث) */
  useEffect(() => {
    const range = computeRange(period, customFrom, customTo);
    const handle = setTimeout(() => {
      setLoading(true);
      void window.medic
        .listSales({
          invoiceNo: invoiceQuery.trim() || undefined,
          from: range.from,
          to: range.to,
        })
        .then((s) => { setSales(s); setLoading(false); });
    }, 250);
    return () => clearTimeout(handle);
  }, [invoiceQuery, period, customFrom, customTo]);

  const pendingCount = sales.filter((s) => !s.synced).length;
  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const hasFilter    = !!invoiceQuery.trim() || period !== "all";

  const columns: Column<LocalSale>[] = [
    {
      key: "invoiceNo",
      label: "رقم الفاتورة",
      render: (s) => (
        <div>
          <span style={{ fontWeight: 600, color: "var(--color-primary)", fontFamily: "monospace" }}>
            {s.invoiceNo}
          </span>
          <SaleFlags sale={s} />
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "التاريخ",
      render: (s) => (
        <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>
          {new Date(s.createdAt).toLocaleString("ar-IQ")}
        </span>
      ),
    },
    {
      key: "customerName",
      label: "الزبون",
      render: (s) => s.customerName
        ? <span style={{ fontWeight: 500 }}>{s.customerName}</span>
        : <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>—</span>,
    },
    {
      key: "total",
      label: "الإجمالي",
      render: (s) => (
        <span style={{ fontWeight: 700, color: "var(--color-text)" }}>
          {fmt(s.total)} <span style={{ fontSize: 10, fontWeight: 400, color: "var(--color-text-muted)" }}>د.ع</span>
        </span>
      ),
    },
    {
      key: "remaining",
      label: "المتبقّي",
      render: (s) => (
        <span style={{ fontWeight: 600, color: s.remaining > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
          {s.remaining > 0 ? `${fmt(s.remaining)} د.ع` : <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Check size={13} strokeWidth={3} /> مكتمل</span>}
        </span>
      ),
    },
    {
      key: "synced",
      label: "المزامنة",
      render: (s) => (
        <StatusBadge status={s.synced ? "success" : "warning"} label={s.synced ? "مزامن" : "بانتظار"} />
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      render: (s) => (
        <Btn variant="ghost" size="sm" onClick={() => setSelected(s)}>
          <Eye size={14} /> عرض
        </Btn>
      ),
    },
  ];

  const dateInputStyle: React.CSSProperties = {
    padding: "7px 10px", borderRadius: "var(--radius)",
    border: "1.5px solid var(--color-border)", fontSize: 12,
    fontFamily: "inherit", outline: "none", color: "var(--color-text)",
    background: "var(--color-surface)",
  };

  return (
    <div>
      <PageHeader
        title="الفواتير"
        subtitle="سجل المبيعات المحلية"
      />

      {/* إحصائيات */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
        {[
          { label: hasFilter ? "فواتير ضمن الفلتر" : "إجمالي الفواتير", value: sales.length,            color: "#1A5276", icon: <Receipt size={18} /> },
          { label: hasFilter ? "إيرادات الفلتر"     : "إجمالي الإيرادات", value: `${fmt(totalRevenue)} د.ع`, color: "#059669", icon: <Wallet size={18} /> },
          { label: "بانتظار المزامنة",               value: pendingCount,            color: pendingCount > 0 ? "#D97706" : "#94A3B8", icon: <Hourglass size={18} /> },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ borderRight: `3px solid ${s.color}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <p className="stat-card-label">{s.label}</p>
                <p className="stat-card-value" style={{ fontSize: 20 }}>{s.value}</p>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: "var(--radius)", background: `${s.color}14`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── لوحة الفلاتر ── */}
      <div style={{
        background: "var(--color-surface)", border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)", padding: 14, marginBottom: 18,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {/* البحث برقم الفاتورة */}
        <div style={{ position: "relative", maxWidth: 360 }}>
          <span style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            pointerEvents: "none", color: "var(--color-text-muted)",
          }}><Search size={14} /></span>
          <input
            type="search"
            value={invoiceQuery}
            placeholder="ابحث برقم الفاتورة..."
            onChange={(e) => setInvoiceQuery(e.target.value)}
            style={{
              width: "100%", padding: "9px 38px 9px 34px",
              borderRadius: "var(--radius)", border: "1.5px solid var(--color-border)",
              fontSize: 13, fontFamily: "inherit", outline: "none",
              background: "var(--color-surface)", color: "var(--color-text)",
              boxSizing: "border-box", transition: "border-color 150ms, box-shadow 150ms",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,82,118,0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {invoiceQuery && (
            <button
              onClick={() => setInvoiceQuery("")}
              style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--color-text-muted)", fontSize: 13, padding: 2,
              }}
            ><X size={13} /></button>
          )}
        </div>

        {/* أزرار الفترة */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", marginLeft: 4 }}>الفترة:</span>
          {PERIODS.map((p) => {
            const active = period === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: "6px 12px", borderRadius: "var(--radius)",
                  border: `1.5px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                  background: active ? "var(--color-primary)" : "var(--color-surface)",
                  color: active ? "#fff" : "var(--color-text-secondary)",
                  fontSize: 12, fontWeight: active ? 700 : 500,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 140ms",
                }}
                onMouseOver={(e) => { if (!active) { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)"; } }}
                onMouseOut={(e) => { if (!active) { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-secondary)"; } }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* نطاق مخصّص */}
        {period === "custom" && (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", paddingTop: 2 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
              من
              <input type="date" value={customFrom} max={customTo || undefined} onChange={(e) => setCustomFrom(e.target.value)} style={dateInputStyle} />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
              إلى
              <input type="date" value={customTo} min={customFrom || undefined} onChange={(e) => setCustomTo(e.target.value)} style={dateInputStyle} />
            </label>
          </div>
        )}
      </div>

      {pendingCount > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 20 }}>
          <Hourglass size={16} style={{ flexShrink: 0 }} />
          <span>{pendingCount} فاتورة بانتظار المزامنة — شغّل المزامنة من الشريط الجانبي</span>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={sales}
        loading={loading}
        emptyMessage={
          hasFilter
            ? "لا توجد فواتير مطابقة للبحث أو الفترة المحدّدة"
            : "لا توجد فواتير بعد — أنجز بعض المبيعات من نقطة البيع"
        }
      />

      {/* نافذة تفاصيل الفاتورة */}
      {selected && (
        <ReceiptModal
          sale={selected}
          onClose={() => setSelected(null)}
          primaryLabel="إغلاق"
        />
      )}
    </div>
  );
}
