"use client";

import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Clock, Wallet, Banknote, CreditCard, NotebookPen, Scale, ChevronLeft,
  CircleDot, CheckCircle2, Monitor, Smartphone, Receipt,
} from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { fmt, usePeriod } from "../_components/helpers";

/* ─── الأنواع ─── */
interface ShiftTotals {
  salesCount: number;
  totalSales: number;
  collectedCash: number;
  cashCollected: number;
  cardCollected: number;
  creditTotal: number;
  totalDiscount: number;
  expectedCash: number;
  countedCash: number | null;
  discrepancy: number | null;
}
interface ShiftItem {
  id: string;
  userId: string;
  platform: string;
  status: "OPEN" | "CLOSED";
  openedAt: string;
  closedAt: string | null;
  note: string | null;
  openingFloat: number;
  closingCountedCash: number | null;
  user: { id: string; name: string } | null;
  totals: ShiftTotals;
}
interface ShiftDetailSale {
  id: string;
  invoiceNo: string;
  total: number;
  paid: number;
  remaining: number;
  paymentType: string;
  paymentMethod: string | null;
  customerName: string | null;
  createdAt: string;
}
interface ShiftDetail extends ShiftItem {
  sales: ShiftDetailSale[];
}

const PT_LABEL: Record<string, string> = { CASH: "نقدي", CREDIT: "آجل", PARTIAL: "جزئي" };
const METHOD_LABEL: Record<string, string> = { CASH: "نقدي", CARD: "بطاقة", CREDIT: "آجل" };
const PLATFORM = (p: string) =>
  p === "POS_MOBILE"
    ? { label: "الهاتف", icon: Smartphone }
    : p === "WEB"
      ? { label: "الويب", icon: Monitor }
      : { label: "سطح المكتب", icon: Monitor };

const dt = (iso: string) =>
  new Date(iso).toLocaleString("ar-IQ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const tm = (iso: string) => new Date(iso).toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" });

/* ─── بطاقة مؤشّر ─── */
function Kpi({ label, value, color, icon, sub }: { label: string; value: string; color: string; icon: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5" style={{ borderRight: `3px solid ${color}`, boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs text-txt-muted">{label}</p>
          <p className="mt-1.5 text-xl font-bold text-txt">{value}</p>
          {sub && <p className="mt-1 truncate text-xs text-txt-muted">{sub}</p>}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded" style={{ background: `${color}18`, color }}>{icon}</div>
      </div>
    </div>
  );
}

/* ─── شارة الفرق (زيادة/عجز) ─── */
function Discrepancy({ value }: { value: number | null }) {
  if (value == null) return <span className="text-xs text-txt-muted">—</span>;
  if (value === 0) return <span className="rounded bg-state-success-light px-2 py-0.5 text-[11px] font-bold text-state-success">مطابق</span>;
  const over = value > 0;
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${over ? "bg-state-success-light text-state-success" : "bg-state-danger-light text-state-danger"}`}>
      {over ? "زيادة" : "عجز"} {fmt(Math.abs(value))} د.ع
    </span>
  );
}

/* ─── تفاصيل وردية (فواتيرها) — تُجلب عند التوسيع ─── */
function ShiftDetailPanel({ id }: { id: string }) {
  const { data: d, isLoading, error } = useQuery({
    queryKey: ["shift-detail", id],
    queryFn: () => apiFetch<ShiftDetail>(`/shifts/${id}`),
  });

  if (isLoading) return <div className="flex items-center gap-2 px-4 py-5 text-xs text-txt-muted"><span className="spinner spinner-dark" /> جارٍ تحميل فواتير الوردية...</div>;
  if (error) return <div className="px-4 py-4 text-xs text-state-danger">{error instanceof Error ? error.message : "تعذّر التحميل"}</div>;
  if (!d) return null;

  const t = d.totals;
  return (
    <div className="border-t border-border-light bg-app-bg/40 p-4">
      {/* تفصيل المبالغ */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <MoneyRow label="الرصيد الافتتاحي" value={d.openingFloat} />
        <MoneyRow label="مبيعات نقدي" value={t.cashCollected} accent="#1A7F5A" />
        <MoneyRow label="مبيعات بطاقة" value={t.cardCollected} accent="#1D4ED8" />
        <MoneyRow label="مبيعات آجل (متبقّي)" value={t.creditTotal} accent="#B45309" />
        <MoneyRow label="الخصومات" value={t.totalDiscount} />
        <MoneyRow label="النقد المتوقَّع في الصندوق" value={t.expectedCash} accent="#1D4ED8" />
        <MoneyRow label="النقد المعدود" value={t.countedCash} />
        <MoneyRow label="إجمالي المبيعات" value={t.totalSales} accent="#1A5276" />
        <div className="rounded border border-border bg-surface px-3 py-2">
          <p className="text-[11px] text-txt-muted">فرق العدّ</p>
          <div className="mt-1"><Discrepancy value={t.discrepancy} /></div>
        </div>
      </div>

      {/* فواتير الوردية */}
      {d.sales.length === 0 ? (
        <p className="py-3 text-center text-xs text-txt-muted">لا توجد فواتير في هذه الوردية</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full border-collapse whitespace-nowrap text-sm">
            <thead className="border-b-2 border-border bg-app-bg">
              <tr>{["#", "رقم الفاتورة", "الزبون", "الوقت", "النوع", "المدفوع", "المتبقّي", "الإجمالي"].map((h) => (
                <th key={h} className="px-3 py-2 text-right text-[11px] font-semibold text-txt-secondary">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {d.sales.map((s, i) => (
                <tr key={s.id} className="border-b border-border-light last:border-b-0 hover:bg-[#F7F9FC]">
                  <td className="px-3 py-2 text-xs text-txt-muted">{i + 1}</td>
                  <td className="px-3 py-2 font-mono text-xs font-bold text-txt">{s.invoiceNo}</td>
                  <td className="px-3 py-2 text-txt">{s.customerName ?? "زبون عام"}</td>
                  <td className="px-3 py-2 text-xs text-txt-muted">{tm(s.createdAt)}</td>
                  <td className="px-3 py-2 text-xs text-txt-secondary">{(s.paymentMethod && METHOD_LABEL[s.paymentMethod]) ?? PT_LABEL[s.paymentType] ?? s.paymentType}</td>
                  <td className="px-3 py-2 text-state-success">{fmt(s.paid)}</td>
                  <td className="px-3 py-2 text-state-warning">{s.remaining > 0 ? fmt(s.remaining) : "—"}</td>
                  <td className="px-3 py-2 font-bold text-txt">{fmt(s.total)} د.ع</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MoneyRow({ label, value, accent }: { label: string; value: number | null; accent?: string }) {
  return (
    <div className="rounded border border-border bg-surface px-3 py-2">
      <p className="text-[11px] text-txt-muted">{label}</p>
      <p className="mt-0.5 text-sm font-bold" style={{ color: accent ?? "var(--color-text)" }}>
        {value == null ? "—" : `${fmt(value)} د.ع`}
      </p>
    </div>
  );
}

/* ═══════════════ الصفحة ═══════════════ */
export default function ShiftsReportPage() {
  const { qs } = usePeriod();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["report-shifts", qs],
    queryFn: () => apiFetch<{ data: ShiftItem[] }>(`/shifts?${qs}`),
  });

  if (isLoading) {
    return <div className="flex h-48 items-center justify-center gap-2 text-txt-muted"><span className="spinner spinner-dark" /> جارٍ تحميل الورديات...</div>;
  }
  if (error) {
    return <div className="rounded border border-state-danger-light bg-state-danger-light px-4 py-3 text-sm text-state-danger">{error instanceof Error ? error.message : "تعذّر تحميل الورديات"}</div>;
  }

  const shifts = data?.data ?? [];
  const totalCash = shifts.reduce((s, x) => s + x.totals.cashCollected, 0);
  const totalCard = shifts.reduce((s, x) => s + x.totals.cardCollected, 0);
  const totalCredit = shifts.reduce((s, x) => s + x.totals.creditTotal, 0);
  const totalSales = shifts.reduce((s, x) => s + x.totals.totalSales, 0);
  const netDiscrepancy = shifts.reduce((s, x) => s + (x.totals.discrepancy ?? 0), 0);
  const openCount = shifts.filter((s) => s.status === "OPEN").length;

  return (
    <div className="space-y-5">
      {/* ─── مؤشّرات إجمالية حسب طريقة الدفع ─── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="مبيعات نقدي" value={`${fmt(totalCash)} د.ع`} color="#1A7F5A" icon={<Banknote className="h-[18px] w-[18px]" />} sub="ما دخل الصندوق نقدًا" />
        <Kpi label="مبيعات البطاقة" value={`${fmt(totalCard)} د.ع`} color="#1D4ED8" icon={<CreditCard className="h-[18px] w-[18px]" />} sub="مدفوعات عبر البطاقة" />
        <Kpi label="المبيعات الآجلة" value={`${fmt(totalCredit)} د.ع`} color="#B45309" icon={<NotebookPen className="h-[18px] w-[18px]" />} sub="ديون غير مسدَّدة" />
        <Kpi label="صافي فروقات العدّ" value={`${fmt(netDiscrepancy)} د.ع`} color={netDiscrepancy < 0 ? "#B91C1C" : "#1A7F5A"} icon={<Scale className="h-[18px] w-[18px]" />} sub={`${fmt(shifts.length)} وردية · ${openCount} مفتوحة`} />
      </div>

      {/* ─── جدول الورديات ─── */}
      <div className="overflow-hidden rounded-lg border border-border bg-surface" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center justify-between border-b border-border-light px-5 py-3.5">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-txt"><Wallet className="h-4 w-4 text-primary" /> تفصيل مبالغ الورديات</h3>
          <span className="text-xs text-txt-muted">إجمالي المبيعات: <span className="font-bold text-txt">{fmt(totalSales)} د.ع</span></span>
        </div>

        {shifts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-txt-muted">
            <Clock className="h-9 w-9" strokeWidth={1.5} />
            <p className="text-sm">لا توجد ورديات في هذه الفترة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse whitespace-nowrap text-sm">
              <thead className="border-b-2 border-border bg-app-bg">
                <tr>
                  {["", "الموظف", "الجهاز", "الفتح", "الإغلاق", "نقدي", "بطاقة", "آجل", "النقد المتوقَّع", "المعدود", "الفرق", "الحالة"].map((h) => (
                    <th key={h} className="px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-txt-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => {
                  const open = expanded === s.id;
                  const Plat = PLATFORM(s.platform);
                  return (
                    <Fragment key={s.id}>
                      <tr
                        onClick={() => setExpanded(open ? null : s.id)}
                        className={`cursor-pointer border-b border-border-light transition-colors last:border-b-0 ${open ? "bg-primary-light/40" : "hover:bg-[#F7F9FC]"}`}
                      >
                        <td className="px-3 py-3 text-txt-muted"><ChevronLeft className={`h-4 w-4 transition-transform ${open ? "-rotate-90" : ""}`} /></td>
                        <td className="px-3 py-3 font-semibold text-txt">{s.user?.name ?? "—"}</td>
                        <td className="px-3 py-3"><span className="inline-flex items-center gap-1 text-xs text-txt-secondary"><Plat.icon className="h-3.5 w-3.5" /> {Plat.label}</span></td>
                        <td className="px-3 py-3 text-xs text-txt-secondary">{dt(s.openedAt)}</td>
                        <td className="px-3 py-3 text-xs text-txt-secondary">{s.closedAt ? dt(s.closedAt) : "—"}</td>
                        <td className="px-3 py-3 font-bold text-state-success">{fmt(s.totals.cashCollected)}</td>
                        <td className="px-3 py-3 font-semibold text-primary">{s.totals.cardCollected > 0 ? fmt(s.totals.cardCollected) : "—"}</td>
                        <td className="px-3 py-3 text-state-warning">{s.totals.creditTotal > 0 ? fmt(s.totals.creditTotal) : "—"}</td>
                        <td className="px-3 py-3 font-bold text-txt">{fmt(s.totals.expectedCash)}</td>
                        <td className="px-3 py-3 text-txt">{s.totals.countedCash == null ? "—" : fmt(s.totals.countedCash)}</td>
                        <td className="px-3 py-3"><Discrepancy value={s.totals.discrepancy} /></td>
                        <td className="px-3 py-3">
                          {s.status === "OPEN" ? (
                            <span className="inline-flex items-center gap-1 rounded bg-primary-light px-2 py-0.5 text-[11px] font-bold text-primary"><CircleDot className="h-3 w-3" /> مفتوحة</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-state-success-light px-2 py-0.5 text-[11px] font-bold text-state-success"><CheckCircle2 className="h-3 w-3" /> مغلقة</span>
                          )}
                        </td>
                      </tr>
                      {open && (
                        <tr>
                          <td colSpan={12} className="p-0"><ShiftDetailPanel id={s.id} /></td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-txt-muted">
        <Receipt className="h-3.5 w-3.5" /> اضغط على أي وردية لعرض فواتيرها وتفصيل مبالغها.
      </p>
    </div>
  );
}
