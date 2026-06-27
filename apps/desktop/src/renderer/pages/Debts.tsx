import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle2, Hourglass, AlertTriangle, RefreshCw, FileText, X } from "lucide-react";
import { PageHeader, DataTable, StatusBadge, StatCard, Btn, type Column } from "../components/ui";
import type { CustomerDebtGroup, DebtListResult } from "../types";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

const STATUS_LABEL: Record<string, string> = {
  OPEN: "مفتوح", PARTIAL: "جزئي", PAID: "مسدّد",
};
const STATUS_BADGE: Record<string, "danger" | "warning" | "success"> = {
  OPEN: "danger", PARTIAL: "warning", PAID: "success",
};

const FILTERS = [
  { key: "",        label: "الكل" },
  { key: "OPEN",    label: "مفتوح" },
  { key: "PARTIAL", label: "جزئي" },
  { key: "PAID",    label: "مسدّد" },
];

export function Debts() {
  const [result, setResult]         = useState<DebtListResult | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paying, setPaying]         = useState<CustomerDebtGroup | null>(null);
  const [payAmount, setPayAmount]   = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError]     = useState<string | null>(null);
  const [detailOf, setDetailOf]     = useState<CustomerDebtGroup | null>(null);

  async function load(status = "") {
    const r = await window.medic.listDebts(status || undefined);
    setResult(r);
  }

  useEffect(() => { void load(statusFilter); }, [statusFilter]);

  async function submitPayment() {
    if (!paying) return;
    setPayLoading(true);
    setPayError(null);
    const res = await window.medic.payCustomerDebt(paying.customerId, Number(payAmount));
    setPayLoading(false);
    if (res.ok) {
      setPaying(null);
      setPayAmount("");
      void load(statusFilter);
    } else {
      setPayError(res.error ?? "تعذّر تسجيل الدفعة");
    }
  }

  const debts = result?.data ?? [];

  const columns: Column<CustomerDebtGroup>[] = [
    { key: "customerName",  label: "الزبون",   render: (d) => <span style={{ fontWeight: 500 }}>{d.customerName}</span> },
    { key: "customerPhone", label: "الهاتف",   render: (d) => d.customerPhone ?? "—" },
    {
      key: "invoiceCount",
      label: "الفواتير",
      render: (d) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--color-text-secondary)" }}>
          <FileText size={14} /> {fmt(d.invoiceCount)}
        </span>
      ),
    },
    { key: "amount",        label: "المبلغ",   render: (d) => `${fmt(d.amount)} د.ع` },
    { key: "paid",          label: "المسدّد",  render: (d) => <span style={{ color: "var(--color-success)" }}>{fmt(d.paid)} د.ع</span> },
    {
      key: "remaining",
      label: "المتبقّي",
      render: (d) => (
        <span style={{ fontWeight: 700, color: d.remaining > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
          {fmt(d.remaining)} د.ع
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (d) => (
        <StatusBadge status={STATUS_BADGE[d.status] ?? "neutral"} label={STATUS_LABEL[d.status] ?? d.status} />
      ),
    },
    {
      key: "action",
      label: "إجراءات",
      render: (d) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Btn variant="secondary" size="sm" onClick={() => setDetailOf(d)} title="عرض فواتير الزبون">
            <FileText size={14} /> الفواتير
          </Btn>
          {d.status !== "PAID" && (
            <Btn
              variant="success"
              size="sm"
              onClick={() => { setPaying(d); setPayAmount(String(d.remaining)); setPayError(null); }}
            >
              سداد
            </Btn>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="دفتر الديون" />

      {result && !result.online && (
        <div className="alert alert-danger"><AlertTriangle size={15} style={{ flexShrink: 0 }} /> لا يوجد اتصال بالخادم. {result.error}</div>
      )}

      {/* StatCards */}
      {result?.online && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
          <StatCard label="إجمالي الديون"  value={`${fmt(result.totalAmount)} د.ع`}    accentColor="#B91C1C" icon={<ClipboardList size={18} />} />
          <StatCard label="إجمالي المسدّد"  value={`${fmt(result.totalPaid)} د.ع`}      accentColor="#1A7F5A" icon={<CheckCircle2 size={18} />} />
          <StatCard label="المتبقّي"         value={`${fmt(result.totalRemaining)} د.ع`} accentColor="#B45309" icon={<Hourglass size={18} />} />
        </div>
      )}

      {/* فلاتر + تحديث */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div className="filter-pills">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`pill ${statusFilter === f.key ? "active" : ""}`}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Btn variant="secondary" size="sm" onClick={() => void load(statusFilter)}><RefreshCw size={14} /> تحديث</Btn>
      </div>

      <DataTable
        columns={columns}
        rows={debts}
        loading={!result}
        emptyMessage={result?.online ? "لا توجد ديون" : "—"}
      />

      {/* Modal السداد */}
      {paying && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget && !payLoading) setPaying(null); }}
        >
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">تسجيل دفعة سداد</h3>
            </div>
            <div className="surface" style={{ marginBottom: 16, padding: "12px 14px" }}>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                الزبون: <strong style={{ color: "var(--color-text)" }}>{paying.customerName}</strong>
              </p>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                إجمالي المتبقّي ({fmt(paying.invoiceCount)} فاتورة):{" "}
                <strong style={{ color: "var(--color-danger)" }}>{fmt(paying.remaining)} د.ع</strong>
              </p>
              <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
                تُوزَّع الدفعة على فواتير الزبون بدءًا من الأقدم.
              </p>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">مبلغ الدفعة</label>
              <input
                type="number"
                min={1}
                max={paying.remaining}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="input-field"
              />
            </div>
            {payError && <div className="alert alert-danger" style={{ marginBottom: 12 }}>{payError}</div>}
            <div className="modal-footer">
              <Btn variant="secondary" onClick={() => { setPaying(null); setPayError(null); }} disabled={payLoading}>
                إلغاء
              </Btn>
              <Btn
                variant="success"
                loading={payLoading}
                loadingText="جارٍ التسجيل..."
                disabled={!payAmount || Number(payAmount) <= 0}
                onClick={submitPayment}
              >
                تأكيد السداد
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Modal تفاصيل فواتير الزبون */}
      {detailOf && (
        <InvoiceBreakdownModal group={detailOf} onClose={() => setDetailOf(null)} />
      )}
    </div>
  );
}

/* ════════════════ مودال فواتير الزبون ════════════════ */
function InvoiceBreakdownModal({ group, onClose }: { group: CustomerDebtGroup; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ zIndex: 1050 }}>
      <div className="modal-box" style={{ width: 600, maxHeight: "82vh", display: "flex", flexDirection: "column" }}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "var(--radius)",
              background: "var(--color-primary-light)", border: "1px solid var(--color-primary-mid)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)",
            }}><FileText size={16} /></div>
            <div>
              <h3 className="modal-title">فواتير الزبون · {group.customerName}</h3>
              <p style={{ fontSize: 11.5, color: "var(--color-text-muted)", marginTop: 1 }}>
                {fmt(group.invoiceCount)} فاتورة · المتبقّي{" "}
                <strong style={{ color: "var(--color-danger)" }}>{fmt(group.remaining)} د.ع</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer",
              background: "var(--color-surface-2)", color: "var(--color-text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          ><X size={16} /></button>
        </div>

        {/* ترويسة الأعمدة */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr 0.9fr",
          gap: 8, padding: "8px 10px", marginTop: 6,
          fontSize: 10.5, fontWeight: 700, color: "var(--color-text-muted)",
          borderBottom: "1px solid var(--color-border)",
        }}>
          <span>الفاتورة</span>
          <span>التاريخ</span>
          <span>المبلغ</span>
          <span>المتبقّي</span>
          <span style={{ textAlign: "left" }}>الحالة</span>
        </div>

        {/* صفوف الفواتير */}
        <div style={{ overflowY: "auto" }}>
          {group.invoices.map((inv) => (
            <div
              key={inv.id}
              style={{
                display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr 0.9fr",
                gap: 8, padding: "10px", alignItems: "center",
                borderBottom: "1px solid var(--color-border-light)", fontSize: 12,
              }}
            >
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--color-text)" }}>{inv.invoiceNo ?? "—"}</span>
              <span style={{ color: "var(--color-text-secondary)" }}>
                {new Date(inv.createdAt).toLocaleDateString("ar-IQ", { year: "numeric", month: "2-digit", day: "2-digit" })}
              </span>
              <span>{fmt(inv.amount)} د.ع</span>
              <span style={{ fontWeight: 700, color: inv.remaining > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                {fmt(inv.remaining)} د.ع
              </span>
              <span style={{ textAlign: "left" }}>
                <StatusBadge status={STATUS_BADGE[inv.status] ?? "neutral"} label={STATUS_LABEL[inv.status] ?? inv.status} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
