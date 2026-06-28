import { useEffect, useState } from "react";
import {
  ClipboardList, CheckCircle2, Hourglass, AlertTriangle, FileText,
  HandCoins, Search, X, NotebookPen,
} from "lucide-react";
import { PageHeader, DataTable, StatusBadge, StatCard, Btn, type Column } from "../components/ui";
import type { CustomerDebtGroup, DebtListResult } from "../types";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

const DEBT_STATUS: Record<string, { label: string; badge: "danger" | "warning" | "success" }> = {
  OPEN:    { label: "مفتوح",  badge: "danger"  },
  PARTIAL: { label: "جزئي",   badge: "warning" },
  PAID:    { label: "مسدّد",  badge: "success" },
};

const FILTERS = [
  { key: "",        label: "الكل"   },
  { key: "OPEN",    label: "مفتوح"  },
  { key: "PARTIAL", label: "جزئي"   },
  { key: "PAID",    label: "مسدّد"  },
];

/* ══════════════════════════════════════
   مودال كشف الحساب
══════════════════════════════════════ */
function StatementModal({
  customerId, name, onClose,
}: { customerId: string; name: string; onClose: () => void }) {
  type Entry = {
    id: string; type: string; date: string; invoiceNo?: string | null;
    amount: number; paid?: number; remaining?: number; status?: string; note?: string | null;
  };
  const [entries,  setEntries]  = useState<Entry[]>([]);
  const [totals,   setTotals]   = useState<{ totalDebt: number; totalPaid: number; balance: number } | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    window.medic.getCustomerStatement(customerId)
      .then((r: { entries: Entry[]; totalDebt: number; totalPaid: number; balance: number; online: boolean; error?: string }) => {
        if (!r.online || r.error) { setError(r.error ?? "تعذّر جلب البيانات"); }
        else { setEntries(r.entries ?? []); setTotals({ totalDebt: r.totalDebt, totalPaid: r.totalPaid, balance: r.balance }); }
      })
      .catch(() => setError("تعذّر الاتصال بالخادم"))
      .finally(() => setLoading(false));
  }, [customerId]);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("ar-IQ", { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 1050 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-box"
        style={{ width: 760, maxWidth: "95vw", maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        {/* الرأس */}
        <div className="modal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <NotebookPen size={18} style={{ color: "var(--color-primary)" }} />
            <h3 className="modal-title">
              كشف حساب الزبون · <span style={{ color: "var(--color-primary)" }}>{name}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer",
              background: "var(--color-surface-2)", color: "var(--color-text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* المحتوى */}
        <div style={{ overflowY: "auto", padding: "16px 20px", flex: 1 }}>
          {loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "40px 0", color: "var(--color-text-muted)" }}>
              <span className="spinner spinner-dark" /> جارٍ التحميل...
            </div>
          )}
          {error && (
            <div className="alert alert-danger"><AlertTriangle size={15} /> {error}</div>
          )}
          {!loading && !error && totals && (
            <>
              {/* إحصائيات */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
                <StatCard label="إجمالي الديون"  value={`${fmt(totals.totalDebt)} د.ع`}  accentColor="#B91C1C" icon={<ClipboardList size={16} />} />
                <StatCard label="المسدّد"         value={`${fmt(totals.totalPaid)} د.ع`}  accentColor="#1A7F5A" icon={<CheckCircle2 size={16} />} />
                <StatCard label="الرصيد المتبقّي" value={`${fmt(totals.balance)} د.ع`}   accentColor={totals.balance > 0 ? "#B45309" : "#1A7F5A"} icon={<Hourglass size={16} />} />
              </div>

              {/* الجدول */}
              {entries.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "30px 0", fontSize: 13 }}>لا توجد حركات</p>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>النوع</th>
                        <th>التاريخ</th>
                        <th>الفاتورة</th>
                        <th>المبلغ</th>
                        <th>المسدّد</th>
                        <th>المتبقّي</th>
                        <th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e) => (
                        <tr key={e.id}>
                          <td>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3,
                              background: e.type === "PAYMENT" ? "var(--color-success-light)" : "var(--color-danger-light)",
                              color: e.type === "PAYMENT" ? "var(--color-success)" : "var(--color-danger)",
                            }}>
                              {e.type === "PAYMENT" ? "دفعة" : "دين"}
                            </span>
                          </td>
                          <td style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{fmtDate(e.date)}</td>
                          <td style={{ fontFamily: "monospace", fontSize: 12 }}>{e.invoiceNo ?? "—"}</td>
                          <td style={{ fontWeight: 600 }}>{fmt(e.amount)} د.ع</td>
                          <td style={{ color: "var(--color-success)" }}>{e.paid !== undefined ? `${fmt(e.paid)} د.ع` : "—"}</td>
                          <td style={{ fontWeight: 700, color: (e.remaining ?? 0) > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                            {e.remaining !== undefined ? `${fmt(e.remaining)} د.ع` : "—"}
                          </td>
                          <td>
                            {e.status
                              ? <StatusBadge status={DEBT_STATUS[e.status]?.badge ?? "neutral"} label={DEBT_STATUS[e.status]?.label ?? e.status} />
                              : "—"
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   الصفحة الرئيسية
══════════════════════════════════════ */
export function Debts() {
  const [result,       setResult]       = useState<DebtListResult | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search,       setSearch]       = useState("");
  const [paying,       setPaying]       = useState<CustomerDebtGroup | null>(null);
  const [payAmount,    setPayAmount]    = useState("");
  const [payLoading,   setPayLoading]   = useState(false);
  const [payError,     setPayError]     = useState<string | null>(null);
  const [statementOf,  setStatementOf]  = useState<{ id: string; name: string } | null>(null);

  async function load(status = "", q = "") {
    const r = await window.medic.listDebts(status || undefined, q || undefined);
    setResult(r as DebtListResult);
  }

  useEffect(() => { void load(statusFilter, search); }, [statusFilter]);

  /* البحث بتأخير */
  useEffect(() => {
    const t = setTimeout(() => void load(statusFilter, search), 350);
    return () => clearTimeout(t);
  }, [search]);

  async function submitPayment() {
    if (!paying) return;
    setPayLoading(true); setPayError(null);
    const res = await window.medic.payCustomerDebt(paying.customerId, Number(payAmount));
    setPayLoading(false);
    if (res.ok) {
      setPaying(null); setPayAmount("");
      void load(statusFilter, search);
    } else {
      setPayError(res.error ?? "تعذّر تسجيل الدفعة");
    }
  }

  const debts = result?.data ?? [];

  const columns: Column<CustomerDebtGroup>[] = [
    { key: "customerName",  label: "الزبون",  render: (d) => <span style={{ fontWeight: 500 }}>{d.customerName}</span> },
    { key: "customerPhone", label: "الهاتف",  render: (d) => d.customerPhone ?? "—" },
    {
      key: "invoiceCount",
      label: "الفواتير",
      render: (d) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--color-text-secondary)" }}>
          <FileText size={14} /> {fmt(d.invoiceCount)}
        </span>
      ),
    },
    { key: "amount",    label: "المبلغ",   render: (d) => `${fmt(d.amount)} د.ع` },
    { key: "paid",      label: "المسدّد",  render: (d) => <span style={{ color: "var(--color-success)" }}>{fmt(d.paid)} د.ع</span> },
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
      render: (d) => {
        const s = DEBT_STATUS[d.status];
        return s ? <StatusBadge status={s.badge} label={s.label} /> : <span>{d.status}</span>;
      },
    },
    {
      key: "action",
      label: "إجراءات",
      render: (d) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* زر كشف الحساب — أيقونة فقط مثل الويب */}
          <Btn
            variant="secondary"
            size="sm"
            title="كشف حساب"
            onClick={() => setStatementOf({ id: d.customerId, name: d.customerName })}
          >
            <FileText size={14} />
          </Btn>
          {/* زر السداد — أيقونة فقط مثل الويب */}
          {d.status !== "PAID" && (
            <Btn
              variant="success"
              size="sm"
              title="سداد"
              onClick={() => { setPaying(d); setPayAmount(String(d.remaining)); setPayError(null); }}
            >
              <HandCoins size={14} />
            </Btn>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="دفتر الديون" subtitle="متابعة مديونيات الزبائن" />

      {result && !result.online && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          <AlertTriangle size={15} style={{ flexShrink: 0 }} /> لا يوجد اتصال بالخادم. {result.error}
        </div>
      )}

      {/* StatCards */}
      {result?.online && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
          <StatCard label="إجمالي الديون"  value={`${fmt(result.totalAmount)} د.ع`}    accentColor="#B91C1C" icon={<ClipboardList size={18} />} />
          <StatCard label="إجمالي المسدّد"  value={`${fmt(result.totalPaid)} د.ع`}      accentColor="#1A7F5A" icon={<CheckCircle2 size={18} />} />
          <StatCard label="المتبقّي"         value={`${fmt(result.totalRemaining)} د.ع`} accentColor="#B45309" icon={<Hourglass size={18} />} />
        </div>
      )}

      {/* فلاتر الحالة + البحث — مطابق للويب */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              style={{
                borderRadius: "var(--radius)", padding: "6px 14px", fontSize: 13, fontWeight: 500,
                border: "1px solid",
                borderColor: statusFilter === f.key ? "var(--color-primary)" : "var(--color-border)",
                background: statusFilter === f.key ? "var(--color-primary)" : "var(--color-surface)",
                color: statusFilter === f.key ? "#fff" : "var(--color-text-secondary)",
                cursor: "pointer", transition: "all 150ms", fontFamily: "inherit",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* حقل البحث — مطابق للويب */}
        <div style={{ position: "relative", width: 280 }}>
          <Search
            size={15}
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              color: "var(--color-text-muted)", pointerEvents: "none",
            }}
          />
          <input
            className="input-field"
            style={{ paddingRight: 34, paddingLeft: search ? 32 : 12 }}
            placeholder="بحث باسم الزبون أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              title="مسح البحث"
              style={{
                position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                width: 20, height: 20, borderRadius: "var(--radius-sm)", border: "none",
                background: "transparent", cursor: "pointer", color: "var(--color-text-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>
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
          <div className="modal-box" style={{ width: 380 }}>
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
                autoFocus
              />
            </div>
            {payError && <div className="alert alert-danger" style={{ marginBottom: 12 }}>{payError}</div>}
            <div className="modal-footer">
              <Btn variant="secondary" fullWidth onClick={() => { setPaying(null); setPayError(null); }} disabled={payLoading}>
                إلغاء
              </Btn>
              <Btn
                variant="success"
                fullWidth
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

      {/* مودال كشف الحساب */}
      {statementOf && (
        <StatementModal
          customerId={statementOf.id}
          name={statementOf.name}
          onClose={() => setStatementOf(null)}
        />
      )}
    </div>
  );
}
