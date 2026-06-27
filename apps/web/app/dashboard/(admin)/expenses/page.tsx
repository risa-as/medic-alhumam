"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wallet, TrendingDown, ListChecks, Plus, Trash2, Pencil, X } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { fmt } from "@/lib/format";
import { EXPENSE_CATEGORY_OPTIONS, expenseLabel, expenseColor } from "@/lib/expense-categories";
import { Btn, DataTable, DeleteDialog, PageHeader, StatCard, InputField, SelectField, type Column } from "@/components/ui";

interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string | null;
  spentAt: string;
  createdAt: string;
  user?: { name: string };
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("ar-IQ");
const todayISO = () => new Date().toISOString().slice(0, 10);
const monthStartISO = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString().slice(0, 10);
};

/* ════════════ نافذة إضافة/تعديل مصروف ════════════ */
function ExpenseModal({ expense, onClose, onDone }: { expense?: Expense; onClose: () => void; onDone: () => void }) {
  const isEdit = !!expense;
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [category, setCategory] = useState(expense?.category ?? "RENT");
  const [spentAt, setSpentAt] = useState(expense ? expense.spentAt.slice(0, 10) : todayISO());
  const [note, setNote] = useState(expense?.note ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    const amt = Number(amount);
    if (!amt || amt <= 0) { setErr("المبلغ يجب أن يكون أكبر من صفر"); return; }
    setLoading(true); setErr(null);
    try {
      const body = JSON.stringify({
        amount: amt,
        category,
        spentAt: `${spentAt}T00:00:00.000Z`,
        note: note.trim() || undefined,
      });
      if (isEdit) await apiFetch(`/expenses/${expense!.id}`, { method: "PATCH", body });
      else await apiFetch("/expenses", { method: "POST", body });
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
            {isEdit ? <><Pencil className="h-4 w-4 text-primary" /> تعديل مصروف</> : <><Plus className="h-4 w-4 text-primary" /> إضافة مصروف</>}
          </h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <InputField label="المبلغ (د.ع)" type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} required autoFocus />
          <SelectField label="الفئة" value={category} onChange={(e) => setCategory(e.target.value)} required>
            {EXPENSE_CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </SelectField>
          <InputField label="التاريخ" type="date" max={todayISO()} value={spentAt} onChange={(e) => setSpentAt(e.target.value)} />
          <InputField label="ملاحظة (اختياري)" value={note} onChange={(e) => setNote(e.target.value)} placeholder="تفاصيل المصروف..." />

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
export default function ExpensesPage() {
  const qc = useQueryClient();
  const [from, setFrom] = useState(monthStartISO());
  const [to, setTo] = useState(todayISO());
  const [modal, setModal] = useState<"new" | Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  const expensesQ = useQuery({
    queryKey: ["expenses", from, to],
    queryFn: () =>
      apiFetch<{ data: Expense[]; total: number }>(
        `/expenses?from=${from}T00:00:00.000Z&to=${to}T23:59:59.999Z`,
      ),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/expenses/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["expenses"] }); setDeleteTarget(null); },
  });

  const expenses = useMemo(() => expensesQ.data?.data ?? [], [expensesQ.data]);
  const total = expensesQ.data?.total ?? 0;

  const topCategory = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of expenses) m.set(e.category, (m.get(e.category) ?? 0) + e.amount);
    let best: { key: string; amount: number } | null = null;
    for (const [key, amount] of m) if (!best || amount > best.amount) best = { key, amount };
    return best;
  }, [expenses]);

  function refresh() { qc.invalidateQueries({ queryKey: ["expenses"] }); setModal(null); }

  const columns: Column<Expense>[] = [
    { key: "spentAt", label: "التاريخ", render: (e) => <span className="text-txt-muted">{fmtDate(e.spentAt)}</span> },
    {
      key: "category",
      label: "الفئة",
      render: (e) => (
        <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold" style={{ background: `${expenseColor(e.category)}18`, color: expenseColor(e.category) }}>
          {expenseLabel(e.category)}
        </span>
      ),
    },
    { key: "note", label: "ملاحظة", render: (e) => e.note ? <span className="text-txt">{e.note}</span> : <span className="text-txt-muted">—</span> },
    { key: "amount", label: "المبلغ", render: (e) => <span className="font-bold text-state-danger">{fmt(e.amount)} د.ع</span> },
    {
      key: "actions",
      label: "إجراءات",
      render: (e) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setModal(e)} title="تعديل" aria-label="تعديل" className="flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-primary-light"><Pencil className="h-[15px] w-[15px]" /></button>
          <button onClick={() => setDeleteTarget(e)} title="حذف" aria-label="حذف" className="flex h-8 w-8 items-center justify-center rounded text-state-danger transition-colors hover:bg-state-danger-light"><Trash2 className="h-[15px] w-[15px]" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="المصروفات"
        subtitle="المصاريف التشغيلية — تُخصم من الأرباح في لوحة القيادة"
        actions={<Btn variant="primary" onClick={() => setModal("new")}><Plus className="h-4 w-4" /> مصروف جديد</Btn>}
      />

      {/* بطاقات ملخّص */}
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="إجمالي المصاريف" value={`${fmt(total)} د.ع`} accentColor="#B91C1C" icon={<TrendingDown className="h-[18px] w-[18px]" />} sub="خلال الفترة المحددة" />
        <StatCard label="عدد القيود" value={fmt(expenses.length)} accentColor="#1D4ED8" icon={<ListChecks className="h-[18px] w-[18px]" />} />
        <StatCard label="أعلى فئة" value={topCategory ? expenseLabel(topCategory.key) : "—"} accentColor="#B45309" icon={<Wallet className="h-[18px] w-[18px]" />} sub={topCategory ? `${fmt(topCategory.amount)} د.ع` : ""} />
      </div>

      {/* فلتر الفترة */}
      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-txt-secondary">من</label>
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className="rounded border border-border px-3 py-1.5 text-sm text-txt outline-none focus:border-primary" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-txt-secondary">إلى</label>
          <input type="date" value={to} max={todayISO()} onChange={(e) => setTo(e.target.value)} className="rounded border border-border px-3 py-1.5 text-sm text-txt outline-none focus:border-primary" />
        </div>
      </div>

      <DataTable columns={columns} rows={expenses} loading={expensesQ.isLoading} emptyMessage="لا توجد مصاريف في هذه الفترة" />

      {modal && (
        <ExpenseModal
          expense={modal === "new" ? undefined : modal}
          onClose={() => setModal(null)}
          onDone={refresh}
        />
      )}

      <DeleteDialog
        open={!!deleteTarget}
        itemName={deleteTarget ? `${expenseLabel(deleteTarget.category)} — ${fmt(deleteTarget.amount)} د.ع` : ""}
        loading={deleteMut.isPending}
        onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget.id); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
