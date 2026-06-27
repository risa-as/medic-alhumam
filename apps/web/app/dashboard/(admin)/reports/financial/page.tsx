"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Area, AreaChart, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Wallet, TrendingUp, TrendingDown, Landmark, BadgePercent, Receipt, Banknote, Tags, Users, Globe, CalendarDays, Coins } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { KpiCard } from "../_components/KpiCard";
import { fmt, fmtDate, usePeriod } from "../_components/helpers";
import { expenseLabel, expenseColor } from "@/lib/expense-categories";
import type { FinancialReport } from "../_components/types";

const PAY_COLORS: Record<string, string> = { CASH: "#1A7F5A", CREDIT: "#B45309", PARTIAL: "#7C3AED" };

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

const Card = ({ title, icon, children, className = "" }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border border-border bg-surface p-5 ${className}`} style={{ boxShadow: "var(--shadow-sm)" }}>
    <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-txt">{icon} {title}</h3>
    {children}
  </div>
);

export default function FinancialReportPage() {
  const { qs, g } = usePeriod();
  const { data: d, isLoading, error } = useQuery({
    queryKey: ["report-financial", qs],
    queryFn: () => apiFetch<FinancialReport>(`/reports/financial?${qs}`),
  });

  if (isLoading) {
    return <div className="flex h-48 items-center justify-center gap-2 text-txt-muted"><span className="spinner spinner-dark" /> جارٍ تحميل التقرير المالي...</div>;
  }
  if (error) {
    return <div className="rounded border border-state-danger-light bg-state-danger-light px-4 py-3 text-sm text-state-danger">{error instanceof Error ? error.message : "تعذّر تحميل التقرير"}</div>;
  }
  if (!d) return null;

  const payTotal = d.byPaymentType.reduce((s, p) => s + p.revenue, 0) || 1;
  const maxCatRev = Math.max(1, ...d.byCategory.map((c) => c.revenue));

  return (
    <div className="space-y-5">
      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KpiCard label="الإيرادات" value={`${fmt(d.totalRevenue)} د.ع`} color="#1A7F5A" icon={<Wallet className="h-[18px] w-[18px]" />} current={d.totalRevenue} previous={d.previous.totalRevenue} sub="مقابل الفترة السابقة" />
        <KpiCard label="ربح البضاعة (FEFO)" value={`${fmt(d.totalProfit)} د.ع`} color="#7C3AED" icon={<TrendingUp className="h-[18px] w-[18px]" />} current={d.totalProfit} previous={d.previous.totalProfit} sub={d.margin !== null ? `هامش ${d.margin}% · تكلفة ${fmt(d.totalCost)}` : "قبل المصاريف"} />
        <KpiCard label="المصاريف" value={`${fmt(d.expensesTotal)} د.ع`} color="#B45309" icon={<TrendingDown className="h-[18px] w-[18px]" />} current={d.expensesTotal} previous={d.previous.expensesTotal} goodUp={false} sub="تشغيلية" />
        <KpiCard label="صافي الربح" value={`${fmt(d.netProfit)} د.ع`} color={d.netProfit >= 0 ? "#1A7F5A" : "#B91C1C"} icon={<Landmark className="h-[18px] w-[18px]" />} current={d.netProfit} previous={d.previous.netProfit} sub="بعد المصاريف" />
        <KpiCard label="الخصومات الممنوحة" value={`${fmt(d.discountsGiven)} د.ع`} color="#B91C1C" icon={<BadgePercent className="h-[18px] w-[18px]" />} current={d.discountsGiven} previous={d.previous.discountsGiven} goodUp={false} sub="تخفيض من الإيراد" />
        <KpiCard label="عدد الفواتير" value={fmt(d.totalCount)} color="#1D4ED8" icon={<Receipt className="h-[18px] w-[18px]" />} current={d.totalCount} previous={d.previous.totalCount} sub={`متوسط ${fmt(d.avgOrder)} د.ع`} />
      </div>

      {/* ─── رسم الإيراد + الربح ─── */}
      <Card title={`الإيراد والربح ${g === "day" ? "يوميًا" : "أسبوعيًا"}`} icon={<TrendingUp className="h-4 w-4 text-state-success" />}>
        {d.totalCount === 0 ? (
          <p className="py-10 text-center text-sm text-txt-muted">لا توجد بيانات في هذه الفترة</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={d.series} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="finRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1A5276" stopOpacity={0.18} /><stop offset="95%" stopColor="#1A5276" stopOpacity={0} /></linearGradient>
                <linearGradient id="finProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1A7F5A" stopOpacity={0.2} /><stop offset="95%" stopColor="#1A7F5A" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" name="الإيراد" stroke="#1A5276" strokeWidth={2} fill="url(#finRev)" dot={false} />
              <Area type="monotone" dataKey="profit" name="الربح" stroke="#1A7F5A" strokeWidth={2} fill="url(#finProfit)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ─── نقدي مقابل آجل ─── */}
        <Card title="نقدي مقابل آجل" icon={<Banknote className="h-4 w-4 text-state-success" />}>
          {d.byPaymentType.length === 0 ? (
            <p className="text-xs text-txt-muted">لا توجد بيانات</p>
          ) : (
            <div className="flex items-center gap-5">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={d.byPaymentType} dataKey="revenue" nameKey="label" innerRadius={42} outerRadius={62} paddingAngle={2}>
                    {d.byPaymentType.map((p) => <Cell key={p.type} fill={PAY_COLORS[p.type] ?? "#94A3B8"} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {d.byPaymentType.map((p) => (
                  <div key={p.type}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 text-txt"><span className="h-2 w-2 rounded-full" style={{ background: PAY_COLORS[p.type] ?? "#94A3B8" }} /> {p.label}</span>
                      <span className="font-semibold text-txt">{fmt(p.revenue)} د.ع <span className="text-[10px] font-normal text-txt-muted">({Math.round((p.revenue / payTotal) * 100)}%)</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* ─── حسب الفئة ─── */}
        <Card title="الأداء حسب الفئة" icon={<Tags className="h-4 w-4 text-primary" />}>
          {d.byCategory.length === 0 ? (
            <p className="text-xs text-txt-muted">لا توجد بيانات</p>
          ) : (
            <div className="space-y-2.5">
              {d.byCategory.slice(0, 6).map((c) => (
                <div key={c.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate text-txt">{c.name}</span>
                    <span className="shrink-0"><span className="font-semibold text-txt">{fmt(c.revenue)}</span> <span className="text-state-success">+{fmt(c.profit)}</span></span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-app-bg">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(3, Math.round((c.revenue / maxCatRev) * 100))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ─── المصاريف حسب الفئة ─── */}
      <Card title="المصاريف حسب الفئة" icon={<Coins className="h-4 w-4 text-state-warning" />}>
        {d.expensesByCategory.length === 0 ? (
          <p className="text-xs text-txt-muted">لا توجد مصاريف مسجّلة في هذه الفترة</p>
        ) : (
          <div className="space-y-2.5">
            {(() => {
              const maxExp = Math.max(1, ...d.expensesByCategory.map((c) => c.amount));
              return d.expensesByCategory.map((c) => (
                <div key={c.category}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate text-txt">{expenseLabel(c.category)}</span>
                    <span className="shrink-0 font-semibold text-state-danger">{fmt(c.amount)} د.ع</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-app-bg">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(3, Math.round((c.amount / maxExp) * 100))}%`, background: expenseColor(c.category) }} />
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </Card>

      {/* ─── أعلى المنتجات ─── */}
      <Card title="أكثر المنتجات مبيعًا وربحًا" icon={<Receipt className="h-4 w-4 text-primary" />}>
        {d.topProducts.length === 0 ? (
          <p className="text-xs text-txt-muted">لا توجد بيانات</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b-2 border-border bg-app-bg">
                <tr>
                  {["#", "المنتج", "الكمية", "الإيراد", "الربح"].map((h) => <th key={h} className="px-3 py-2.5 text-right text-xs font-semibold text-txt-secondary">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {d.topProducts.map((p, i) => (
                  <tr key={p.productId} className="border-b border-border-light last:border-b-0 hover:bg-[#F7F9FC]">
                    <td className="px-3 py-2.5 text-txt-muted">{i + 1}</td>
                    <td className="px-3 py-2.5 font-medium text-txt">{p.nameAr}</td>
                    <td className="px-3 py-2.5 text-txt">{fmt(p.totalQty)}</td>
                    <td className="px-3 py-2.5 text-txt">{fmt(p.totalRevenue)} د.ع</td>
                    <td className="px-3 py-2.5 font-semibold text-state-success">+{fmt(p.totalProfit)} د.ع</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* حسب الموظف */}
        <Card title="حسب الموظف" icon={<Users className="h-4 w-4 text-txt-secondary" />}>
          {d.byUser.length === 0 ? <p className="text-xs text-txt-muted">لا توجد بيانات</p> : (
            <div className="space-y-2">
              {d.byUser.map((u) => (
                <div key={u.name} className="flex items-center justify-between text-xs">
                  <span className="text-txt">{u.name}</span>
                  <span className="text-txt"><span className="font-semibold">{fmt(u.revenue)} د.ع</span> <span className="text-[10px] text-txt-muted">({u.count})</span></span>
                </div>
              ))}
            </div>
          )}
        </Card>
        {/* حسب المنصّة */}
        <Card title="حسب المنصّة" icon={<Globe className="h-4 w-4 text-txt-secondary" />}>
          {d.byPlatform.length === 0 ? <p className="text-xs text-txt-muted">لا توجد بيانات</p> : (
            <div className="space-y-2">
              {d.byPlatform.map((pl) => (
                <div key={pl.platform} className="flex items-center justify-between text-xs">
                  <span className="text-txt">{pl.label}</span>
                  <span className="text-txt"><span className="font-semibold">{fmt(pl.revenue)} د.ع</span> <span className="text-[10px] text-txt-muted">({pl.count})</span></span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ─── الجدول التفصيلي ─── */}
      <Card title={`التفصيل ${g === "day" ? "اليومي" : "الأسبوعي"}`} icon={<CalendarDays className="h-4 w-4 text-primary" />}>
        {d.totalCount === 0 ? <p className="text-xs text-txt-muted">لا توجد بيانات</p> : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b-2 border-border bg-app-bg">
                <tr>{["#", "التاريخ", "الفواتير", "الإيراد", "الربح"].map((h) => <th key={h} className="px-3 py-2.5 text-right text-xs font-semibold text-txt-secondary">{h}</th>)}</tr>
              </thead>
              <tbody>
                {[...d.series].reverse().filter((s) => s.count > 0).map((s, i) => (
                  <tr key={s.date} className="border-b border-border-light last:border-b-0 hover:bg-[#F7F9FC]">
                    <td className="px-3 py-2.5 text-xs text-txt-muted">{i + 1}</td>
                    <td className="px-3 py-2.5 text-txt-muted">{fmtDate(s.date)}</td>
                    <td className="px-3 py-2.5 text-txt">{fmt(s.count)}</td>
                    <td className="px-3 py-2.5 font-medium text-txt">{fmt(s.revenue)} د.ع</td>
                    <td className="px-3 py-2.5 font-semibold text-state-success">+{fmt(s.profit)} د.ع</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
