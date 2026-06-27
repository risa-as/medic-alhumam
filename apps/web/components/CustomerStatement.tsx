"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleArrowUp, CircleArrowDown, Printer, ClipboardList, CheckCircle2, Hourglass } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { fmt, fmtDate } from "@/lib/format";
import { Btn, DataTable, StatCard, type Column } from "@/components/ui";

export interface LedgerEntry {
  id: string;
  date: string;
  type: "DEBT" | "PAYMENT";
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface Statement {
  customer: { id: string; name: string; phone: string | null; address: string | null; createdAt: string };
  ledger: LedgerEntry[];
  totalDebt: number;
  totalPaid: number;
  totalRemaining: number;
}

const ledgerCols: Column<LedgerEntry>[] = [
  { key: "date", label: "التاريخ", render: (e) => <span className="text-txt-muted">{fmtDate(e.date)}</span> },
  {
    key: "description",
    label: "البيان",
    render: (e) => (
      <span className="inline-flex items-center gap-1.5">
        {e.type === "DEBT"
          ? <CircleArrowUp className="h-4 w-4 shrink-0 text-state-danger" />
          : <CircleArrowDown className="h-4 w-4 shrink-0 text-state-success" />}
        {e.description}
      </span>
    ),
  },
  { key: "debit", label: "دين", render: (e) => (e.debit ? <span className="text-state-danger">{fmt(e.debit)}</span> : <span className="text-txt-muted">—</span>) },
  { key: "credit", label: "تسديد", render: (e) => (e.credit ? <span className="text-state-success">{fmt(e.credit)}</span> : <span className="text-txt-muted">—</span>) },
  { key: "balance", label: "الرصيد", render: (e) => <span className={`font-bold ${e.balance > 0 ? "text-state-danger" : "text-state-success"}`}>{fmt(e.balance)}</span> },
];

/** يبني نسخة HTML قابلة للطباعة من كشف الحساب ويفتحها في نافذة طباعة. */
function printStatement(s: Statement) {
  const rows = s.ledger
    .map(
      (e) => `
        <tr>
          <td>${fmtDate(e.date)}</td>
          <td>${e.description}</td>
          <td class="num debit">${e.debit ? fmt(e.debit) : "—"}</td>
          <td class="num credit">${e.credit ? fmt(e.credit) : "—"}</td>
          <td class="num bal">${fmt(e.balance)}</td>
        </tr>`,
    )
    .join("");
  const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8" />
      <title>كشف حساب - ${s.customer.name}</title>
      <style>
        * { font-family: "Segoe UI", Tahoma, sans-serif; }
        body { margin: 24px; color: #0F172A; }
        h1 { font-size: 20px; margin: 0 0 4px; }
        .meta { font-size: 13px; color: #475569; margin-bottom: 16px; }
        .meta span { margin-left: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { border: 1px solid #CBD5E1; padding: 7px 10px; text-align: right; }
        th { background: #F1F5F9; font-size: 12px; }
        .num { font-family: monospace; }
        .debit { color: #B91C1C; }
        .credit { color: #15803D; }
        .bal { font-weight: 700; }
        tfoot td { font-weight: 700; background: #F8FAFC; }
        .summary { margin-top: 18px; font-size: 14px; }
        .summary b { font-size: 16px; }
      </style></head><body>
      <h1>كشف حساب الزبون</h1>
      <div class="meta">
        <span><b>${s.customer.name}</b></span>
        <span>الهاتف: ${s.customer.phone ?? "—"}</span>
        <span>التاريخ: ${new Date().toLocaleDateString("ar-IQ")}</span>
      </div>
      <table>
        <thead><tr><th>التاريخ</th><th>البيان</th><th>دين (مدين)</th><th>تسديد (دائن)</th><th>الرصيد</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5" style="text-align:center">لا توجد حركات</td></tr>`}</tbody>
        <tfoot><tr>
          <td colspan="2">الإجماليات</td>
          <td class="num debit">${fmt(s.totalDebt)}</td>
          <td class="num credit">${fmt(s.totalPaid)}</td>
          <td class="num bal">${fmt(s.totalRemaining)}</td>
        </tr></tfoot>
      </table>
      <p class="summary">الرصيد المتبقّي على الزبون: <b>${fmt(s.totalRemaining)} د.ع</b></p>
      <script>window.onload = () => { window.print(); }</script>
      </body></html>`;
  const w = window.open("", "_blank", "width=820,height=640");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

/**
 * كشف حساب الزبون: بطاقات ملخّص + جدول حركات (دين/تسديد/رصيد جارٍ) + طباعة.
 * مكوّن موحّد يُستخدم في صفحة الديون (داخل مودال) وصفحة الزبائن (مضمّنًا).
 */
export function CustomerStatement({
  customerId,
  showSummary = true,
  showPrint = true,
}: {
  customerId: string;
  showSummary?: boolean;
  showPrint?: boolean;
}) {
  const stmtQ = useQuery({
    queryKey: ["customer-statement", customerId],
    queryFn: () => apiFetch<Statement>(`/customers/${customerId}/statement`),
  });
  const s = stmtQ.data;

  return (
    <div className="space-y-4">
      {showPrint && (
        <div className="flex justify-end">
          <Btn variant="secondary" size="sm" onClick={() => s && printStatement(s)} disabled={!s}>
            <Printer className="h-4 w-4" /> طباعة كشف الحساب
          </Btn>
        </div>
      )}

      {showSummary && s && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="إجمالي الديون" value={`${fmt(s.totalDebt)} د.ع`} accentColor="#B91C1C" icon={<ClipboardList className="h-[18px] w-[18px]" />} />
          <StatCard label="إجمالي المسدّد" value={`${fmt(s.totalPaid)} د.ع`} accentColor="#1A7F5A" icon={<CheckCircle2 className="h-[18px] w-[18px]" />} />
          <StatCard label="الرصيد المتبقّي" value={`${fmt(s.totalRemaining)} د.ع`} accentColor={s.totalRemaining > 0 ? "#B45309" : "#1A7F5A"} icon={<Hourglass className="h-[18px] w-[18px]" />} />
        </div>
      )}

      {stmtQ.isError && (
        <p className="rounded bg-state-danger-light px-3 py-2 text-sm text-state-danger">
          {(stmtQ.error as Error).message}
        </p>
      )}

      <DataTable
        columns={ledgerCols}
        rows={s?.ledger ?? []}
        loading={stmtQ.isLoading}
        emptyMessage="لا توجد حركات على هذا الزبون"
      />
    </div>
  );
}
