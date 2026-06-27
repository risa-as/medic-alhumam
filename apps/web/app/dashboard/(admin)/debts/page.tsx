"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, CheckCircle2, Hourglass, Search, X, NotebookPen, FileText, HandCoins } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { fmt } from "@/lib/format";
import { DEBT_STATUS, DEBT_FILTERS } from "@/lib/debt-status";
import type { CustomerDebtGroup } from "@/lib/types";
import { Btn, DataTable, PageHeader, StatCard, StatusBadge, type Column } from "@/components/ui";
import { CustomerStatement } from "@/components/CustomerStatement";

export default function DebtsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [paying, setPaying] = useState<CustomerDebtGroup | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [statementOf, setStatementOf] = useState<{ id: string; name: string } | null>(null);

  const debtsQ = useQuery({
    queryKey: ["debts", statusFilter, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const qs = params.toString();
      return apiFetch<{ data: CustomerDebtGroup[]; totalRemaining: number; totalAmount: number }>(
        `/debts${qs ? `?${qs}` : ""}`,
      );
    },
  });

  const payMut = useMutation({
    mutationFn: ({ customerId, amount }: { customerId: string; amount: number }) =>
      apiFetch(`/customers/${customerId}/debt-payments`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts"] });
      setPaying(null);
      setPayAmount("");
    },
  });

  const debts = debtsQ.data?.data ?? [];
  const totalAmount    = debtsQ.data?.totalAmount ?? 0;
  const totalRemaining = debtsQ.data?.totalRemaining ?? 0;
  const totalPaid      = totalAmount - totalRemaining;

  const columns: Column<CustomerDebtGroup>[] = [
    {
      key: "customer",
      label: "الزبون",
      render: (d) => <span className="font-medium text-txt">{d.customerName}</span>,
    },
    { key: "phone",     label: "الهاتف",   render: (d) => d.customerPhone ?? "—" },
    {
      key: "invoices",
      label: "الفواتير",
      render: (d) => (
        <span className="inline-flex items-center gap-1 text-txt-secondary">
          <FileText className="h-3.5 w-3.5" /> {fmt(d.invoiceCount)}
        </span>
      ),
    },
    { key: "amount",    label: "المبلغ",   render: (d) => fmt(d.amount) },
    { key: "paid",      label: "المسدّد",  render: (d) => <span className="text-state-success">{fmt(d.paid)}</span> },
    {
      key: "remaining",
      label: "المتبقّي",
      render: (d) => (
        <span className={`font-bold ${d.remaining > 0 ? "text-state-danger" : "text-state-success"}`}>
          {fmt(d.remaining)}
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
        <div className="flex items-center gap-1.5">
          <Btn
            variant="secondary"
            size="sm"
            title="كشف حساب"
            aria-label="كشف حساب"
            onClick={() => setStatementOf({ id: d.customerId, name: d.customerName })}
          >
            <FileText className="h-4 w-4" />
          </Btn>
          {d.status !== "PAID" && (
            <Btn
              variant="success"
              size="sm"
              title="سداد"
              aria-label="سداد"
              onClick={() => { setPaying(d); setPayAmount(String(d.remaining)); }}
            >
              <HandCoins className="h-4 w-4" />
            </Btn>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="دفتر الديون" subtitle="متابعة مديونيات الزبائن" />

      {/* StatCards */}
      {debtsQ.data && (
        <div className="mb-6 grid grid-cols-3 gap-4">
          <StatCard label="إجمالي الديون"  value={`${fmt(totalAmount)} د.ع`}    accentColor="#B91C1C" icon={<ClipboardList className="h-[18px] w-[18px]" />} />
          <StatCard label="إجمالي المسدّد"  value={`${fmt(totalPaid)} د.ع`}      accentColor="#1A7F5A" icon={<CheckCircle2 className="h-[18px] w-[18px]" />} />
          <StatCard label="المتبقّي"         value={`${fmt(totalRemaining)} د.ع`} accentColor="#B45309" icon={<Hourglass className="h-[18px] w-[18px]" />} />
        </div>
      )}

      {/* البحث + فلاتر الحالة */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {DEBT_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={[
                "rounded border px-3 py-1.5 text-sm font-medium transition-all duration-150",
                statusFilter === f.key
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-txt-secondary hover:bg-app-bg",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-muted" />
          <input
            className="w-full rounded border border-border bg-surface py-2 pr-9 pl-8 text-sm text-txt outline-none transition-colors focus:border-primary placeholder:text-txt-muted"
            placeholder="بحث باسم الزبون أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"
              title="مسح البحث"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* الجدول */}
      <DataTable
        columns={columns}
        rows={debts}
        loading={debtsQ.isLoading}
        emptyMessage="لا توجد ديون"
      />

      {/* Modal السداد */}
      {paying && (
        <div
          className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(13,27,42,0.55)" }}
          onClick={(e) => { if (e.target === e.currentTarget && !payMut.isPending) setPaying(null); }}
        >
          <div className="modal-box bg-surface rounded-lg shadow-lg p-7 w-[380px]">
            <h3 className="mb-4 text-base font-bold text-txt">تسجيل دفعة سداد</h3>
            <div className="mb-4 rounded border border-border-light bg-app-bg px-4 py-3 text-sm">
              <p className="text-txt-secondary">
                الزبون: <span className="font-semibold text-txt">{paying.customerName}</span>
              </p>
              <p className="mt-1 text-txt-secondary">
                إجمالي المتبقّي ({fmt(paying.invoiceCount)} فاتورة):{" "}
                <span className="font-bold text-state-danger">{fmt(paying.remaining)} د.ع</span>
              </p>
              <p className="mt-1 text-xs text-txt-muted">
                تُوزَّع الدفعة على فواتير الزبون بدءًا من الأقدم.
              </p>
            </div>
            <div className="mb-5 flex flex-col gap-1">
              <label className="text-xs font-semibold text-txt-secondary">مبلغ الدفعة</label>
              <input
                type="number"
                min={1}
                max={paying.remaining}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="rounded border border-border px-3 py-2 text-sm text-txt outline-none focus:border-primary"
              />
            </div>
            {payMut.isError && (
              <p className="mb-3 rounded bg-state-danger-light px-3 py-2 text-xs text-state-danger">
                {(payMut.error as Error).message}
              </p>
            )}
            <div className="flex gap-2">
              <Btn
                variant="secondary"
                fullWidth
                onClick={() => { setPaying(null); setPayAmount(""); }}
                disabled={payMut.isPending}
              >
                إلغاء
              </Btn>
              <Btn
                variant="success"
                fullWidth
                loading={payMut.isPending}
                loadingText="جارٍ التسجيل..."
                disabled={!payAmount || Number(payAmount) <= 0}
                onClick={() => payMut.mutate({ customerId: paying.customerId, amount: Number(payAmount) })}
              >
                تأكيد السداد
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* كشف حساب الزبون */}
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

/* ════════════════ مودال كشف حساب الزبون ════════════════ */
function StatementModal({ customerId, name, onClose }: { customerId: string; name: string; onClose: () => void }) {
  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box flex max-h-[88vh] w-[760px] max-w-full flex-col overflow-hidden rounded-lg bg-surface shadow-lg">
        <div className="flex items-center justify-between gap-4 border-b border-border p-5">
          <h3 className="inline-flex items-center gap-2 text-base font-bold text-txt"><NotebookPen className="h-[18px] w-[18px] text-primary" /> كشف حساب الزبون · <span className="text-primary">{name}</span></h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-auto p-5">
          <CustomerStatement customerId={customerId} />
        </div>
      </div>
    </div>
  );
}
