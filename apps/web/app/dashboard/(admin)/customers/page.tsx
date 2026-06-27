"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, UserPlus, X, Users, HandCoins, Wallet, AlertTriangle, Search, Phone, MapPin, Trash2, Receipt, FileText } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { fmt, fmtDate } from "@/lib/format";
import type { Customer } from "@/lib/types";
import { Btn, DataTable, DeleteDialog, PageHeader, StatCard, type Column } from "@/components/ui";
import { CustomerStatement } from "@/components/CustomerStatement";

interface CustomerDebt {
  id: string;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
  sale: { invoiceNo: string } | null;
}
interface CustomerSale {
  id: string;
  invoiceNo: string;
  total: number;
  paymentType: string;
  createdAt: string;
}
type CustomerDetail = Customer & {
  salesCount: number;
  salesTotal: number;
  debts: CustomerDebt[];
  sales: CustomerSale[];
};

const initialsOf = (name: string) => name.trim().slice(0, 2);

const PAYMENT: Record<string, string> = { CASH: "نقدي", CREDIT: "آجل", PARTIAL: "جزئي" };

/* ════════════════ نافذة إضافة/تعديل زبون ════════════════ */
function CustomerModal({ customer, onClose, onDone }: { customer?: Customer; onClose: () => void; onDone: () => void }) {
  const isEdit = !!customer;
  const [name, setName]       = useState(customer?.name ?? "");
  const [phone, setPhone]     = useState(customer?.phone ?? "");
  const [address, setAddress] = useState(customer?.address ?? "");
  const [err, setErr]         = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!name.trim()) { setErr("الاسم مطلوب"); return; }
    setLoading(true); setErr(null);
    try {
      const body = JSON.stringify({ name: name.trim(), phone: phone.trim() || undefined, address: address.trim() || undefined });
      if (isEdit) await apiFetch(`/customers/${customer!.id}`, { method: "PATCH", body });
      else        await apiFetch("/customers", { method: "POST", body });
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر الحفظ");
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="modal-box w-[400px] max-w-[calc(100vw-32px)] rounded-lg bg-surface p-7 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-base font-bold text-txt">
            {isEdit ? <><Pencil className="h-4 w-4 text-primary" /> تعديل الزبون</> : <><UserPlus className="h-4 w-4 text-primary" /> إضافة زبون جديد</>}
          </h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-txt-secondary">الاسم <span className="text-state-danger">*</span></label>
            <input className="rounded border border-border px-3 py-2 text-sm text-txt outline-none focus:border-primary" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-txt-secondary">الهاتف</label>
            <input className="rounded border border-border px-3 py-2 text-sm text-txt outline-none focus:border-primary placeholder:text-txt-muted" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07X XXXX XXXX" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-txt-secondary">العنوان</label>
            <input className="rounded border border-border px-3 py-2 text-sm text-txt outline-none focus:border-primary placeholder:text-txt-muted" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="المنطقة، الشارع، رقم المنزل..." />
          </div>

          {err && <div className="rounded border border-state-danger-light bg-state-danger-light px-3 py-2 text-xs text-state-danger">{err}</div>}

          <div className="flex gap-2 pt-1">
            <Btn variant="secondary" fullWidth type="button" onClick={onClose} disabled={loading}>إلغاء</Btn>
            <Btn variant="primary" fullWidth type="button" loading={loading} loadingText="جارٍ الحفظ..." onClick={submit}>
              {isEdit ? "حفظ التعديلات" : "حفظ"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ الصفحة ════════════════ */
export default function CustomersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [modal, setModal] = useState<"new" | Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const customersQ = useQuery({
    queryKey: ["customers", q],
    queryFn: () => apiFetch<{ data: Customer[] }>(`/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  });

  const selectedQ = useQuery({
    queryKey: ["customer", selected],
    queryFn: () => apiFetch<CustomerDetail>(`/customers/${selected}`),
    enabled: !!selected,
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/customers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      setDeleteTarget(null);
      setSelected(null);
    },
    onError: (e) => {
      setDeleteTarget(null);
      setBanner(e instanceof Error ? e.message : "تعذّر حذف الزبون");
    },
  });

  const customers = customersQ.data?.data ?? [];
  const debtors = customers.filter((c) => c.balance > 0);
  const totalOutstanding = customers.reduce((s, c) => s + c.balance, 0);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["customers"] });
    if (selected) qc.invalidateQueries({ queryKey: ["customer", selected] });
  }

  return (
    <div>
      <PageHeader
        title="الزبائن"
        subtitle="قائمة الزبائن وأرصدتهم ومعاملاتهم"
        actions={<Btn variant="primary" onClick={() => { setBanner(null); setModal("new"); }}>+ زبون جديد</Btn>}
      />

      {/* إحصائيات */}
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="إجمالي الزبائن" value={fmt(customers.length)} accentColor="#1D4ED8" icon={<Users className="h-[18px] w-[18px]" />} />
        <StatCard label="المدينون" value={fmt(debtors.length)} accentColor="#B45309" icon={<HandCoins className="h-[18px] w-[18px]" />} sub="زبائن لهم رصيد مستحق" />
        <StatCard label="إجمالي الأرصدة المستحقة" value={`${fmt(totalOutstanding)} د.ع`} accentColor={totalOutstanding > 0 ? "#B91C1C" : "#1A7F5A"} icon={<Wallet className="h-[18px] w-[18px]" />} />
      </div>

      {banner && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded border border-state-warning-light bg-state-warning-light px-4 py-3 text-sm text-state-warning">
          <span className="inline-flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 shrink-0" /> {banner}</span>
          <button onClick={() => setBanner(null)} className="shrink-0 text-state-warning hover:opacity-70"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex gap-4">
        {/* ─── قائمة الزبائن ─── */}
        <div className="w-72 shrink-0">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-muted" />
            <input
              className="w-full rounded border border-border bg-surface py-2 pr-9 pl-3 text-sm text-txt outline-none transition-colors focus:border-primary placeholder:text-txt-muted"
              placeholder="بحث بالاسم أو الهاتف..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex max-h-[calc(100vh-260px)] flex-col gap-1 overflow-auto pl-1">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => { setBanner(null); setSelected(c.id); }}
                className={[
                  "flex w-full items-center gap-3 rounded-lg border p-2.5 text-right transition-all duration-150",
                  selected === c.id ? "border-primary bg-primary-light" : "border-border bg-surface hover:bg-app-bg",
                ].join(" ")}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: c.balance > 0 ? "#B91C1C" : "var(--color-primary)" }}
                >
                  {initialsOf(c.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${selected === c.id ? "text-primary" : "text-txt"}`}>{c.name}</p>
                  <p className="flex items-center justify-between text-xs text-txt-secondary">
                    <span>{c.phone ?? "—"}</span>
                    {c.balance > 0 && <span className="font-bold text-state-danger">{fmt(c.balance)} د.ع</span>}
                  </p>
                </div>
              </button>
            ))}
            {customers.length === 0 && (
              <p className="py-6 text-center text-sm text-txt-muted">
                {customersQ.isLoading ? "جارٍ التحميل..." : "لا توجد نتائج"}
              </p>
            )}
          </div>
        </div>

        {/* ─── تفاصيل الزبون ─── */}
        <div className="min-w-0 flex-1">
          {!selected && (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface">
              <Users className="h-9 w-9 text-txt-muted" strokeWidth={1.5} />
              <p className="text-sm text-txt-muted">اختر زبونًا لعرض تفاصيله</p>
            </div>
          )}
          {selected && selectedQ.isLoading && (
            <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-surface">
              <span className="spinner spinner-dark" />
              <span className="mr-2 text-sm text-txt-muted">جارٍ التحميل...</span>
            </div>
          )}
          {selected && selectedQ.data && (
            <CustomerDetailPanel
              customer={selectedQ.data}
              onEdit={() => { setBanner(null); setModal(selectedQ.data!); }}
              onDelete={() => {
                setBanner(null);
                const d = selectedQ.data!;
                if (d.debts.length > 0 || d.sales.length > 0) {
                  setBanner(`لا يمكن حذف «${d.name}» لأن له فواتير أو ديون مرتبطة.`);
                  return;
                }
                setDeleteTarget(d);
              }}
            />
          )}
        </div>
      </div>

      {modal && (
        <CustomerModal
          customer={modal === "new" ? undefined : modal}
          onClose={() => setModal(null)}
          onDone={() => { refresh(); setModal(null); }}
        />
      )}

      <DeleteDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.name ?? ""}
        loading={deleteMut.isPending}
        onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget.id); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

/* ════════════════ لوحة التفاصيل ════════════════ */
function CustomerDetailPanel({ customer, onEdit, onDelete }: { customer: CustomerDetail; onEdit: () => void; onDelete: () => void }) {
  const saleCols: Column<CustomerSale>[] = [
    { key: "invoiceNo",   label: "رقم الفاتورة" },
    { key: "total",       label: "الإجمالي",    render: (s) => `${fmt(s.total)} د.ع` },
    { key: "paymentType", label: "نوع الدفع",   render: (s) => PAYMENT[s.paymentType] ?? s.paymentType },
    { key: "createdAt",   label: "التاريخ",     render: (s) => <span className="text-txt-muted">{fmtDate(s.createdAt)}</span> },
  ];

  return (
    <div className="space-y-5">
      {/* رأس بطاقة الزبون */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white" style={{ background: "var(--color-primary)" }}>
              {initialsOf(customer.name)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-txt">{customer.name}</h3>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-txt-secondary"><Phone className="h-3.5 w-3.5" /> {customer.phone ?? "بدون هاتف"}</p>
              {customer.address && <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-txt-muted"><MapPin className="h-3.5 w-3.5" /> {customer.address}</p>}
              <p className="mt-0.5 text-[11px] text-txt-muted">عميل منذ {fmtDate(customer.createdAt)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Btn variant="secondary" size="sm" onClick={onEdit}><Pencil className="h-3.5 w-3.5" /> تعديل</Btn>
            <Btn variant="ghost" size="sm" className="text-state-danger hover:text-red-800" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /> حذف</Btn>
          </div>
        </div>

        {/* بطاقات ملخّص */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatCard label="الرصيد المستحق" value={`${fmt(customer.balance)} د.ع`} accentColor={customer.balance > 0 ? "#B91C1C" : "#1A7F5A"} icon={<Wallet className="h-[18px] w-[18px]" />} />
          <StatCard label="إجمالي المبيعات" value={`${fmt(customer.salesTotal)} د.ع`} accentColor="#1A7F5A" icon={<Receipt className="h-[18px] w-[18px]" />} />
          <StatCard label="عدد الفواتير" value={fmt(customer.salesCount)} accentColor="#1D4ED8" icon={<FileText className="h-[18px] w-[18px]" />} />
        </div>
      </div>

      {/* كشف الحساب (ديون + دفعات + رصيد جارٍ) */}
      <div>
        <p className="mb-2 text-sm font-semibold text-txt">كشف الحساب</p>
        <CustomerStatement customerId={customer.id} />
      </div>

      {/* الفواتير */}
      <div>
        <p className="mb-2 text-sm font-semibold text-txt">آخر الفواتير</p>
        {customer.sales.length > 0
          ? <DataTable columns={saleCols} rows={customer.sales} />
          : <div className="rounded-lg border border-border bg-surface px-4 py-6 text-center text-sm text-txt-muted">لا توجد فواتير لهذا الزبون</div>
        }
      </div>
    </div>
  );
}
