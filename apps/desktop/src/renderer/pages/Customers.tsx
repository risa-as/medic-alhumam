import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check, AlertTriangle, Phone, MapPin, Pencil, Trash2, CreditCard, Receipt, Package,
  ClipboardList, Users, NotebookPen, Wallet, RefreshCw, X, Search,
} from "lucide-react";
import { PageHeader, StatusBadge, StatCard, Btn, DeleteDialog } from "../components/ui";
import type { CustomerRow, CustomerDetail, CustomerDebt, CustomerSale } from "../types";

const fmt    = (n: number) => n.toLocaleString("ar-IQ");
const fmtIQD = (n: number) => `${n.toLocaleString("ar-IQ")} د.ع`;
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("ar-IQ", { year: "numeric", month: "short", day: "numeric" });

const DEBT_STATUS: Record<string, { label: string; badge: "danger" | "warning" | "success" }> = {
  OPEN:    { label: "مفتوح",  badge: "danger" },
  PARTIAL: { label: "جزئي",   badge: "warning" },
  PAID:    { label: "مسدّد",  badge: "success" },
};
const PT_LABEL: Record<string, string> = {
  CASH: "نقدي", CREDIT: "آجل", PARTIAL: "جزئي",
};

/* ══════════════════════════════════════
   Toast
══════════════════════════════════════ */
function Toast({ msg, type }: { msg: string; type: "success" | "danger" }) {
  return (
    <div style={{
      position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
      zIndex: 1200, minWidth: 300, borderRadius: "var(--radius)",
      padding: "12px 18px", fontSize: 13, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "var(--shadow-xl)", animation: "scaleIn 200ms ease-out",
      background: type === "success" ? "#ECFDF5" : "#FEF2F2",
      border: `1px solid ${type === "success" ? "#6EE7B7" : "#FECACA"}`,
      color: type === "success" ? "#064E3B" : "#7F1D1D",
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
        background: type === "success" ? "#D1FAE5" : "#FEE2E2",
        color: type === "success" ? "#059669" : "#DC2626",
      }}>
        {type === "success" ? <Check size={13} strokeWidth={3} /> : <AlertTriangle size={13} />}
      </span>
      {msg}
    </div>
  );
}

/* ══════════════════════════════════════
   Modal إضافة / تعديل زبون
══════════════════════════════════════ */
function CustomerModal({
  initial, onSave, onClose,
}: {
  initial?: CustomerRow;
  onSave: (name: string, phone: string, address: string) => Promise<void>;
  onClose: () => void;
}) {
  const [name,    setName]    = useState(initial?.name    ?? "");
  const [phone,   setPhone]   = useState(initial?.phone   ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true); setError(null);
    try {
      await onSave(name.trim(), phone.trim(), address.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <div className="modal-box" style={{ width: 400 }}>
        <div className="modal-header">
          <p className="modal-title">{initial ? "تعديل بيانات الزبون" : "إضافة زبون جديد"}</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">
                الاسم <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input value={name} onChange={e => setName(e.target.value)}
                required autoFocus placeholder="اسم الزبون" className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">رقم الهاتف</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="07X XXXX XXXX" className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">العنوان</label>
              <input value={address} onChange={e => setAddress(e.target.value)}
                placeholder="المنطقة، الشارع، رقم المنزل..." className="input-field" />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginTop: 14 }}>
              <AlertTriangle size={15} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <div className="modal-footer">
            <Btn variant="secondary" type="button" onClick={onClose} disabled={saving}>إلغاء</Btn>
            <Btn variant="primary" type="submit" loading={saving} loadingText="جارٍ الحفظ...">
              {initial ? "حفظ التعديلات" : "إضافة الزبون"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   بطاقة الزبون في القائمة
══════════════════════════════════════ */
function CustomerCard({
  customer, selected, onClick,
}: { customer: CustomerRow; selected: boolean; onClick: () => void }) {
  const initials = customer.name.slice(0, 2);
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", textAlign: "right", fontFamily: "inherit",
        padding: "11px 12px",
        background: selected ? "var(--color-primary-light)" : "var(--color-surface)",
        border: `1.5px solid ${selected ? "var(--color-primary-mid)" : "var(--color-border)"}`,
        borderRadius: "var(--radius)", cursor: "pointer",
        transition: "all 150ms", display: "flex", alignItems: "center", gap: 10,
        boxShadow: selected ? "0 0 0 2px rgba(26,82,118,0.1)" : "var(--shadow-xs)",
      }}
      onMouseOver={e => { if (!selected) e.currentTarget.style.background = "var(--color-surface-2)"; }}
      onMouseOut={e => { if (!selected) e.currentTarget.style.background = "var(--color-surface)"; }}
    >
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: selected
          ? "linear-gradient(135deg, #1A5276, #4A90BC)"
          : "linear-gradient(135deg, #E2E8F0, #CBD5E1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700,
        color: selected ? "#fff" : "var(--color-text-secondary)",
      }}>
        {initials}
      </div>

      {/* معلومات */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 600, color: selected ? "var(--color-primary)" : "var(--color-text)",
          lineHeight: 1.3, marginBottom: 2,
        }}>
          {customer.name}
        </p>
        <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
          {customer.phone ?? "—"}
        </p>
      </div>

      {/* الرصيد */}
      {customer.balance > 0 && (
        <span style={{
          fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
          color: "var(--color-danger)", background: "var(--color-danger-light)",
          padding: "2px 7px", borderRadius: 3,
          border: "1px solid #FECACA",
        }}>
          {fmt(customer.balance)}
        </span>
      )}
    </button>
  );
}

/* ══════════════════════════════════════
   لوحة تفاصيل الزبون
══════════════════════════════════════ */
function DetailPanel({
  detail, onEdit, onDelete,
}: { detail: CustomerDetail; onEdit: () => void; onDelete: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* بطاقة رأس الزبون */}
      <div style={{
        background: "var(--color-surface)", border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius)", padding: "18px 20px",
        boxShadow: "var(--shadow-sm)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Avatar كبير */}
          <div style={{
            width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #1A5276, #4A90BC)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#fff",
          }}>
            {detail.name.slice(0, 2)}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.03em", marginBottom: 3 }}>
              {detail.name}
            </h2>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <Phone size={13} style={{ flexShrink: 0 }} />
              {detail.phone ?? "لا يوجد رقم هاتف"}
            </p>
            {detail.address && (
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                <MapPin size={13} style={{ flexShrink: 0 }} />
                {detail.address}
              </p>
            )}
            <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
              عميل منذ {fmtDate(detail.createdAt)}
            </p>
          </div>
        </div>

        {/* الأزرار */}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" size="sm" onClick={onEdit}><Pencil size={14} /> تعديل</Btn>
          <Btn variant="ghost" size="sm" onClick={onDelete} style={{ color: "var(--color-danger)" }}><Trash2 size={14} /> حذف</Btn>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <StatCard
          label="الرصيد المستحق"
          value={fmtIQD(detail.balance)}
          accentColor={detail.balance > 0 ? "#DC2626" : "#059669"}
          icon={detail.balance > 0 ? <CreditCard size={18} /> : <Check size={18} strokeWidth={3} />}
          sub={detail.balance > 0 ? "دين مفتوح" : "لا ديون"}
        />
        <StatCard
          label="إجمالي المبيعات"
          value={fmtIQD(detail.salesTotal)}
          accentColor="#059669"
          icon={<Receipt size={18} />}
          sub={`${fmt(detail.salesCount)} فاتورة`}
        />
        <StatCard
          label="عدد الفواتير"
          value={fmt(detail.salesCount)}
          accentColor="#1A5276"
          icon={<Package size={18} />}
        />
      </div>

      {/* جدول الديون */}
      {detail.debts.length > 0 && (
        <SectionTable
          title="الديون"
          icon={<ClipboardList size={15} />}
          empty="لا توجد ديون"
          cols={["#", "الفاتورة", "المبلغ", "المسدّد", "المتبقّي", "الحالة", "التاريخ"]}
        >
          {detail.debts.map((d, i) => {
            const s = DEBT_STATUS[d.status];
            return (
              <tr key={d.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}
                className="debt-row">
                <td style={{ padding: "9px 14px", fontSize: 12, color: "var(--color-text-muted)" }}>{i + 1}</td>
                <td style={{ padding: "9px 14px", fontSize: 12, fontFamily: "monospace", color: "var(--color-text-secondary)" }}>
                  {d.sale?.invoiceNo ?? "—"}
                </td>
                <td style={{ padding: "9px 14px", fontSize: 12 }}>{fmtIQD(d.amount)}</td>
                <td style={{ padding: "9px 14px", fontSize: 12, color: "var(--color-success)", fontWeight: 600 }}>
                  {fmtIQD(d.paid)}
                </td>
                <td style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700, color: d.remaining > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                  {fmtIQD(d.remaining)}
                </td>
                <td style={{ padding: "9px 14px" }}>
                  {s ? <StatusBadge status={s.badge} label={s.label} /> : <span>{d.status}</span>}
                </td>
                <td style={{ padding: "9px 14px", fontSize: 11, color: "var(--color-text-muted)" }}>
                  {fmtDate(d.createdAt)}
                </td>
              </tr>
            );
          })}
        </SectionTable>
      )}

      {/* جدول الفواتير */}
      {detail.sales.length > 0 && (
        <SectionTable
          title="آخر الفواتير"
          icon={<Receipt size={15} />}
          empty="لا توجد فواتير"
          cols={["#", "رقم الفاتورة", "الإجمالي", "نوع الدفع", "التاريخ"]}
        >
          {detail.sales.map((s, i) => (
            <tr key={s.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
              <td style={{ padding: "9px 14px", fontSize: 12, color: "var(--color-text-muted)" }}>{i + 1}</td>
              <td style={{ padding: "9px 14px", fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "var(--color-primary)" }}>
                {s.invoiceNo}
              </td>
              <td style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700 }}>{fmtIQD(s.total)}</td>
              <td style={{ padding: "9px 14px" }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3,
                  background: s.paymentType === "CASH" ? "var(--color-success-light)" : s.paymentType === "CREDIT" ? "var(--color-danger-light)" : "var(--color-warning-light)",
                  color: s.paymentType === "CASH" ? "var(--color-success)" : s.paymentType === "CREDIT" ? "var(--color-danger)" : "var(--color-warning)",
                }}>
                  {PT_LABEL[s.paymentType] ?? s.paymentType}
                </span>
              </td>
              <td style={{ padding: "9px 14px", fontSize: 11, color: "var(--color-text-muted)" }}>
                {fmtDate(s.createdAt)}
              </td>
            </tr>
          ))}
        </SectionTable>
      )}
    </div>
  );
}

function SectionTable({
  title, icon, cols, children,
}: { title: string; icon: ReactNode; empty: string; cols: string[]; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--color-surface)", border: "1.5px solid var(--color-border)",
      borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{
        padding: "12px 16px", borderBottom: "1px solid var(--color-border-light)",
        background: "#FAFBFC", display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ color: "var(--color-primary)", display: "inline-flex" }}>{icon}</span>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)" }}>{title}</p>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#FAFBFC", borderBottom: "1px solid var(--color-border-light)" }}>
            {cols.map(c => (
              <th key={c} style={{ padding: "8px 14px", fontSize: 10, fontWeight: 700, color: "var(--color-text-muted)", textAlign: "right", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════
   الصفحة الرئيسية
══════════════════════════════════════ */
export function Customers() {
  const [customers,    setCustomers]    = useState<CustomerRow[]>([]);
  const [query,        setQuery]        = useState("");
  const [loading,      setLoading]      = useState(true);
  const [syncing,      setSyncing]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [detail,       setDetail]       = useState<CustomerDetail | null>(null);
  const [detailLoading,setDetailLoading]= useState(false);

  const [showModal,    setShowModal]    = useState(false);
  const [editTarget,   setEditTarget]   = useState<CustomerRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerRow | null>(null);
  const [deleting,     setDeleting]     = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "danger" } | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, type: "success" | "danger") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* ── تحميل قائمة الزبائن ── */
  const loadList = useCallback(async (q = "") => {
    setLoading(true); setError(null);
    try {
      const data = await window.medic.listCustomers(q || undefined);
      setCustomers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر تحميل الزبائن");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadList(); }, []);

  /* ── تحميل تفاصيل زبون ── */
  async function selectCustomer(id: string) {
    setBanner(null);
    setSelectedId(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const d = await window.medic.getCustomerDetail(id);
      setDetail(d);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }

  /* ── مزامنة ── */
  async function syncList() {
    setSyncing(true);
    await loadList(query);
    setSyncing(false);
    showToast("تمت مزامنة بيانات الزبائن", "success");
  }

  /* ── حفظ (إضافة أو تعديل) ── */
  async function handleSave(name: string, phone: string, address: string) {
    if (editTarget) {
      const updated = await window.medic.updateCustomer(editTarget.id, name, phone || undefined, address || undefined);
      setCustomers(prev => prev.map(c => c.id === updated.id ? { ...c, name: updated.name, phone: updated.phone, address: updated.address } : c));
      if (selectedId === editTarget.id) setDetail(d => d ? { ...d, name: updated.name, phone: updated.phone, address: updated.address } : d);
      showToast("تم تحديث بيانات الزبون", "success");
    } else {
      await window.medic.createCustomer(name, phone || undefined, address || undefined);
      await loadList(query);
      showToast("تمت إضافة الزبون بنجاح", "success");
    }
    setEditTarget(null);
  }

  /* ── حذف ── */
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await window.medic.deleteCustomer(deleteTarget.id);
      setCustomers(prev => prev.filter(c => c.id !== deleteTarget.id));
      if (selectedId === deleteTarget.id) { setSelectedId(null); setDetail(null); }
      showToast("تم حذف الزبون", "success");
      setDeleteTarget(null);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "فشل الحذف", "danger");
    } finally {
      setDeleting(false);
    }
  }

  const debtors = customers.filter(c => c.balance > 0);
  const totalOutstanding = customers.reduce((s, c) => s + c.balance, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Header ── */}
      <PageHeader
        title="الزبائن"
        subtitle="قائمة الزبائن وأرصدتهم ومعاملاتهم"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm" loading={syncing} loadingText="مزامنة..." onClick={syncList}>
              <RefreshCw size={14} /> مزامنة
            </Btn>
            <Btn variant="primary" size="sm" onClick={() => { setBanner(null); setEditTarget(null); setShowModal(true); }}>
              + زبون جديد
            </Btn>
          </div>
        }
      />

      {/* ── خطأ الاتصال ── */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{error} — تحقق من الاتصال بالخادم</span>
        </div>
      )}

      {/* ── إحصائيات علوية ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16, flexShrink: 0 }}>
        <StatCard label="إجمالي الزبائن" value={fmt(customers.length)} accentColor="#154360" icon={<Users size={18} />} />
        <StatCard label="المدينون" value={fmt(debtors.length)} accentColor="#B45309" icon={<NotebookPen size={18} />} sub="زبائن لهم رصيد مستحق" />
        <StatCard
          label="إجمالي الأرصدة المستحقة"
          value={fmtIQD(totalOutstanding)}
          accentColor={totalOutstanding > 0 ? "#DC2626" : "#059669"}
          icon={<Wallet size={18} />}
        />
      </div>

      {/* ── بانر منع الحذف ── */}
      {banner && (
        <div className="alert alert-warning" style={{ marginBottom: 16, flexShrink: 0 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{banner}</span>
          <button
            onClick={() => setBanner(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: 14, lineHeight: 1, padding: 0 }}
          ><X size={14} /></button>
        </div>
      )}

      {/* ── المحتوى الرئيسي ── */}
      <div style={{ display: "flex", gap: 18, flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* ── القائمة الجانبية ── */}
        <div style={{
          width: 280, flexShrink: 0,
          display: "flex", flexDirection: "column", gap: 10,
          overflow: "hidden",
        }}>
          {/* البحث */}
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)",
              color: "var(--color-text-muted)", pointerEvents: "none",
            }}><Search size={14} /></span>
            <input
              ref={searchRef}
              type="search"
              placeholder="بحث بالاسم أو الهاتف..."
              value={query}
              onChange={e => { setQuery(e.target.value); void loadList(e.target.value); }}
              className="input-field"
              style={{ paddingRight: 36 }}
            />
          </div>

          {/* العداد */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2px" }}>
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              {loading ? "جارٍ التحميل..." : `${customers.length} زبون`}
            </span>
            {customers.filter(c => c.balance > 0).length > 0 && (
              <span style={{ fontSize: 10, fontWeight: 600, color: "var(--color-danger)" }}>
                {customers.filter(c => c.balance > 0).length} لديهم ديون
              </span>
            )}
          </div>

          {/* القائمة */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {loading && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "40px 0", color: "var(--color-text-muted)" }}>
                <span className="spinner spinner-dark" />
                جارٍ التحميل...
              </div>
            )}
            {!loading && customers.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-muted)" }}>
                <Users size={36} strokeWidth={1.5} style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 13, fontWeight: 500 }}>
                  {query ? `لا توجد نتائج لـ "${query}"` : "لا يوجد زبائن بعد"}
                </p>
                {!query && (
                  <button
                    onClick={() => { setBanner(null); setEditTarget(null); setShowModal(true); }}
                    style={{
                      marginTop: 12, padding: "7px 16px", borderRadius: "var(--radius)",
                      background: "var(--color-primary)", color: "#fff",
                      border: "none", fontSize: 12, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    + أضف أول زبون
                  </button>
                )}
              </div>
            )}
            {!loading && customers.map(c => (
              <CustomerCard
                key={c.id}
                customer={c}
                selected={selectedId === c.id}
                onClick={() => void selectCustomer(c.id)}
              />
            ))}
          </div>
        </div>

        {/* ── لوحة التفاصيل ── */}
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
          {!selectedId && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              height: "100%", gap: 12, color: "var(--color-text-muted)",
              background: "var(--color-surface)", border: "1.5px dashed var(--color-border)",
              borderRadius: "var(--radius)",
            }}>
              <Users size={48} strokeWidth={1.25} />
              <p style={{ fontSize: 14, fontWeight: 500 }}>اختر زبونًا لعرض تفاصيله</p>
              <p style={{ fontSize: 12 }}>الديون والفواتير والرصيد</p>
            </div>
          )}

          {selectedId && detailLoading && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              height: "100%", color: "var(--color-text-muted)",
            }}>
              <span className="spinner spinner-dark" />
              جارٍ تحميل البيانات...
            </div>
          )}

          {selectedId && !detailLoading && detail && (
            <DetailPanel
              detail={detail}
              onEdit={() => { setBanner(null); setEditTarget(detail); setShowModal(true); }}
              onDelete={() => {
                setBanner(null);
                if (detail.debts.length > 0 || detail.sales.length > 0) {
                  setBanner(`لا يمكن حذف «${detail.name}» لأن له فواتير أو ديون مرتبطة.`);
                  return;
                }
                setDeleteTarget(detail);
              }}
            />
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {showModal && (
        <CustomerModal
          initial={editTarget ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
        />
      )}

      <DeleteDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.name ?? ""}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
