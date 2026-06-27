"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Wallet, TrendingUp, TrendingDown, Landmark, Receipt, Boxes, Hourglass, CalendarX, PackageX, Trophy, ChevronLeft,
} from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { KpiCard } from "./_components/KpiCard";
import { fmt, usePeriod } from "./_components/helpers";
import type { FinancialReport, InventoryReport } from "./_components/types";

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-border bg-surface px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold text-txt">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)} د.ع</p>
      ))}
    </div>
  );
};

export default function ReportsOverviewPage() {
  const { qs } = usePeriod();

  const finQ = useQuery({
    queryKey: ["report-financial", qs],
    queryFn: () => apiFetch<FinancialReport>(`/reports/financial?${qs}`),
  });
  const invQ = useQuery({
    queryKey: ["report-inventory"],
    queryFn: () => apiFetch<InventoryReport>(`/reports/inventory`),
  });

  const d = finQ.data;
  const inv = invQ.data;

  if (finQ.isLoading) {
    return (
      <div className="flex h-48 items-center justify-center gap-2 text-txt-muted">
        <span className="spinner spinner-dark" /> جارٍ تحميل لوحة القيادة...
      </div>
    );
  }
  if (finQ.error) {
    return (
      <div className="rounded border border-state-danger-light bg-state-danger-light px-4 py-3 text-sm text-state-danger">
        {finQ.error instanceof Error ? finQ.error.message : "تعذّر تحميل التقرير"}
      </div>
    );
  }
  if (!d) return null;

  const topByProfit = [...d.topProducts].sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 5);
  const maxProfit = topByProfit[0]?.totalProfit || 1;

  return (
    <div className="space-y-5">
      {/* ─── KPIs المالية مع مقارنة الفترة السابقة ─── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="الإيرادات" value={`${fmt(d.totalRevenue)} د.ع`} color="#1A7F5A"
          icon={<Wallet className="h-[18px] w-[18px]" />}
          current={d.totalRevenue} previous={d.previous.totalRevenue} sub="مقابل الفترة السابقة"
        />
        <KpiCard
          label="صافي الربح" value={`${fmt(d.netProfit)} د.ع`} color={d.netProfit >= 0 ? "#1A7F5A" : "#B91C1C"}
          icon={<Landmark className="h-[18px] w-[18px]" />}
          current={d.netProfit} previous={d.previous.netProfit}
          sub={`بعد المصاريف · ربح البضاعة ${fmt(d.totalProfit)}`}
        />
        <KpiCard
          label="المصاريف" value={`${fmt(d.expensesTotal)} د.ع`} color="#B45309"
          icon={<TrendingDown className="h-[18px] w-[18px]" />}
          current={d.expensesTotal} previous={d.previous.expensesTotal} goodUp={false}
          sub={d.margin !== null ? `هامش البضاعة ${d.margin}%` : "تشغيلية"}
        />
        <KpiCard
          label="متوسط الفاتورة" value={`${fmt(d.avgOrder)} د.ع`} color="#B45309"
          icon={<Receipt className="h-[18px] w-[18px]" />}
          current={d.avgOrder} previous={d.previous.avgOrder} sub={`${fmt(d.totalCount)} فاتورة`}
        />
      </div>

      {/* ─── رسم الإيراد + الربح ─── */}
      <div className="rounded-lg border border-border bg-surface p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-txt">الإيراد والربح {d.groupBy === "day" ? "يوميًا" : "أسبوعيًا"}</h3>
          <div className="flex items-center gap-3 text-[11px] text-txt-muted">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "#1A5276" }} /> الإيراد</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "#1A7F5A" }} /> الربح</span>
          </div>
        </div>
        {d.totalCount === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2">
            <TrendingUp className="h-9 w-9 text-txt-muted" strokeWidth={1.5} />
            <p className="text-sm text-txt-muted">لا توجد مبيعات في هذه الفترة</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={d.series} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ovRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A5276" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#1A5276" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ovProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A7F5A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1A7F5A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" name="الإيراد" stroke="#1A5276" strokeWidth={2} fill="url(#ovRev)" dot={false} />
              <Area type="monotone" dataKey="profit" name="الربح" stroke="#1A7F5A" strokeWidth={2} fill="url(#ovProfit)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ─── بطاقات صحّة المخزون (روابط لتبويب المخزون) ─── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <InvHealthCard href="/dashboard/reports/inventory" label="قيمة المخزون (تكلفة)" value={inv ? `${fmt(inv.stockValueCost)} د.ع` : "…"} sub={inv ? `${fmt(inv.totalUnits)} وحدة` : ""} color="#1A5276" icon={<Boxes className="h-[18px] w-[18px]" />} />
        <InvHealthCard href="/dashboard/reports/inventory" label="بضاعة راكدة" value={inv ? `${fmt(inv.deadStockValue)} د.ع` : "…"} sub={inv ? `${fmt(inv.deadStockCount)} منتج دون مبيعات` : ""} color={inv && inv.deadStockCount > 0 ? "#B45309" : "#94A3B8"} icon={<PackageX className="h-[18px] w-[18px]" />} />
        <InvHealthCard href="/dashboard/reports/inventory" label="قرب انتهاء الصلاحية" value={inv ? `${fmt(inv.expiringCount)}` : "…"} sub={inv ? `بقيمة ${fmt(inv.expiringValue)} د.ع` : ""} color={inv && inv.expiringCount > 0 ? "#B91C1C" : "#94A3B8"} icon={<CalendarX className="h-[18px] w-[18px]" />} />
        <InvHealthCard href="/dashboard/reports/inventory" label="نواقص المخزون" value={inv ? `${fmt(inv.lowStockCount)}` : "…"} sub="منتج تحت حد التنبيه" color={inv && inv.lowStockCount > 0 ? "#B91C1C" : "#94A3B8"} icon={<Hourglass className="h-[18px] w-[18px]" />} />
      </div>

      {/* ─── أعلى المنتجات ربحًا + الخصومات ─── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-5 lg:col-span-2" style={{ boxShadow: "var(--shadow-sm)" }}>
          <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-txt"><Trophy className="h-4 w-4 text-state-warning" /> أعلى المنتجات ربحًا</h3>
          {topByProfit.length === 0 ? (
            <p className="text-xs text-txt-muted">لا توجد بيانات مُسعّرة بعد</p>
          ) : (
            <div className="space-y-2.5">
              {topByProfit.map((p, i) => (
                <div key={p.productId}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold" style={{ background: i === 0 ? "#FEF3C7" : "#F0F4F8", color: i === 0 ? "#B45309" : "#5A6A7E" }}>{i + 1}</span>
                      <span className="truncate text-xs text-txt">{p.nameAr}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[10px] text-txt-muted">{fmt(p.totalQty)} قطعة</span>
                      <span className="text-xs font-semibold text-state-success">+{fmt(p.totalProfit)} د.ع</span>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-app-bg">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(3, Math.round((p.totalProfit / maxProfit) * 100))}%`, background: i === 0 ? "#1A7F5A" : "#86C7AC" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
            <p className="text-xs text-txt-muted">الخصومات الممنوحة</p>
            <p className="mt-1.5 text-xl font-bold text-state-danger">− {fmt(d.discountsGiven)} د.ع</p>
            <p className="mt-1 text-xs text-txt-muted">خلال الفترة المحددة</p>
          </div>
          <Link href="/dashboard/reports/financial" className="flex items-center justify-between rounded-lg border border-border bg-surface p-5 transition-colors hover:bg-app-bg" style={{ boxShadow: "var(--shadow-sm)" }}>
            <div>
              <p className="text-sm font-semibold text-txt">التقرير المالي التفصيلي</p>
              <p className="mt-0.5 text-xs text-txt-muted">نقدي/آجل · الفئات · الموظفون · جدول يومي</p>
            </div>
            <ChevronLeft className="h-5 w-5 text-txt-muted" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function InvHealthCard({ href, label, value, sub, color, icon }: { href: string; label: string; value: string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-lg border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderRight: `3px solid ${color}`, boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs text-txt-muted">{label}</p>
          <p className="mt-1.5 text-xl font-bold text-txt">{value}</p>
          {sub && <p className="mt-1 truncate text-xs text-txt-muted">{sub}</p>}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded" style={{ background: `${color}18`, color }}>{icon}</div>
      </div>
    </Link>
  );
}
