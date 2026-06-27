"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Boxes, Wallet, TrendingUp, PackageX, CalendarX, AlertTriangle, Tags } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { fmt, fmtDate } from "../_components/helpers";
import type { InventoryReport } from "../_components/types";

const StatCard = ({ label, value, sub, color, icon }: { label: string; value: string; sub?: string; color: string; icon: React.ReactNode }) => (
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

const Card = ({ title, icon, badge, children }: { title: string; icon: React.ReactNode; badge?: React.ReactNode; children: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-surface p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
    <div className="mb-4 flex items-center justify-between">
      <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-txt">{icon} {title}</h3>
      {badge}
    </div>
    {children}
  </div>
);

const WINDOWS = [30, 60, 90];

export default function InventoryReportPage() {
  const [staleDays, setStaleDays] = useState(60);
  const [expiryDays, setExpiryDays] = useState(60);

  const { data: d, isLoading, error } = useQuery({
    queryKey: ["report-inventory", staleDays, expiryDays],
    queryFn: () => apiFetch<InventoryReport>(`/reports/inventory?staleDays=${staleDays}&expiryDays=${expiryDays}`),
  });

  if (isLoading) {
    return <div className="flex h-48 items-center justify-center gap-2 text-txt-muted"><span className="spinner spinner-dark" /> جارٍ تحميل تقرير المخزون...</div>;
  }
  if (error) {
    return <div className="rounded border border-state-danger-light bg-state-danger-light px-4 py-3 text-sm text-state-danger">{error instanceof Error ? error.message : "تعذّر تحميل التقرير"}</div>;
  }
  if (!d) return null;

  return (
    <div className="space-y-5">
      {/* ─── بطاقات قيمة المخزون ─── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="قيمة المخزون (تكلفة)" value={`${fmt(d.stockValueCost)} د.ع`} sub={`${fmt(d.totalUnits)} وحدة · ${fmt(d.totalSkus)} صنف`} color="#1A5276" icon={<Boxes className="h-[18px] w-[18px]" />} />
        <StatCard label="قيمة المخزون (بيع)" value={`${fmt(d.stockValueRetail)} د.ع`} sub="بسعر البيع الحالي" color="#1D4ED8" icon={<Wallet className="h-[18px] w-[18px]" />} />
        <StatCard label="الربح الكامن" value={`${fmt(d.potentialProfit)} د.ع`} sub="إذا بيع كامل المخزون" color="#1A7F5A" icon={<TrendingUp className="h-[18px] w-[18px]" />} />
        <StatCard label="بضاعة راكدة" value={`${fmt(d.deadStockValue)} د.ع`} sub={`${fmt(d.deadStockCount)} منتج · رأس مال مجمّد`} color={d.deadStockCount > 0 ? "#B45309" : "#94A3B8"} icon={<PackageX className="h-[18px] w-[18px]" />} />
      </div>

      {/* ─── الركود ─── */}
      <Card
        title="المنتجات الراكدة"
        icon={<PackageX className="h-4 w-4 text-state-warning" />}
        badge={
          <div className="flex items-center gap-1">
            <span className="ml-2 text-[11px] text-txt-muted">بلا مبيعات منذ</span>
            {WINDOWS.map((w) => (
              <button key={w} onClick={() => setStaleDays(w)} className={["rounded border px-2 py-1 text-[11px] font-medium transition-all", staleDays === w ? "border-primary bg-primary text-white" : "border-border text-txt-secondary hover:bg-app-bg"].join(" ")}>{w} يوم</button>
            ))}
          </div>
        }
      >
        {d.deadStock.length === 0 ? (
          <p className="py-6 text-center text-sm text-txt-muted">لا توجد منتجات راكدة خلال آخر {staleDays} يومًا ✓</p>
        ) : (
          <>
            <p className="mb-3 text-xs text-txt-muted">{fmt(d.deadStockCount)} منتج لم يُبَع خلال {staleDays} يومًا، بقيمة تكلفة <span className="font-semibold text-state-warning">{fmt(d.deadStockValue)} د.ع</span>{d.deadStockCount > d.deadStock.length ? ` — يُعرض أعلى ${d.deadStock.length}` : ""}</p>
            <Table head={["#", "المنتج", "الرمز", "الكمية", "قيمة التكلفة", "آخر تحديث"]}>
              {d.deadStock.map((p, i) => (
                <tr key={p.id} className="border-b border-border-light last:border-b-0 hover:bg-[#F7F9FC]">
                  <td className="px-3 py-2.5 text-xs text-txt-muted">{i + 1}</td>
                  <td className="px-3 py-2.5 font-medium text-txt">{p.nameAr}</td>
                  <td className="px-3 py-2.5"><code className="rounded bg-app-bg px-1.5 py-0.5 text-xs text-txt-secondary">{p.sku}</code></td>
                  <td className="px-3 py-2.5 text-txt">{fmt(p.quantity)}</td>
                  <td className="px-3 py-2.5 font-semibold text-state-warning">{fmt(p.value)} د.ع</td>
                  <td className="px-3 py-2.5 text-txt-muted">{fmtDate(p.lastUpdated)}</td>
                </tr>
              ))}
            </Table>
          </>
        )}
      </Card>

      {/* ─── قرب انتهاء الصلاحية ─── */}
      <Card
        title="قرب انتهاء الصلاحية"
        icon={<CalendarX className="h-4 w-4 text-state-danger" />}
        badge={
          <div className="flex items-center gap-1">
            <span className="ml-2 text-[11px] text-txt-muted">خلال</span>
            {WINDOWS.map((w) => (
              <button key={w} onClick={() => setExpiryDays(w)} className={["rounded border px-2 py-1 text-[11px] font-medium transition-all", expiryDays === w ? "border-primary bg-primary text-white" : "border-border text-txt-secondary hover:bg-app-bg"].join(" ")}>{w} يوم</button>
            ))}
          </div>
        }
      >
        {d.expiring.length === 0 ? (
          <p className="py-6 text-center text-sm text-txt-muted">لا توجد دفعات تنتهي خلال {expiryDays} يومًا ✓</p>
        ) : (
          <>
            <p className="mb-3 text-xs text-txt-muted">{fmt(d.expiringCount)} دفعة بقيمة <span className="font-semibold text-state-danger">{fmt(d.expiringValue)} د.ع</span>{d.expiredCount > 0 ? ` — منها ${fmt(d.expiredCount)} منتهية الصلاحية فعلًا` : ""}</p>
            <Table head={["#", "المنتج", "المتبقّي", "قيمة التكلفة", "تاريخ الانتهاء", "المتبقّي للانتهاء"]}>
              {d.expiring.map((b, i) => {
                const expired = b.daysLeft < 0;
                return (
                  <tr key={b.id} className="border-b border-border-light last:border-b-0 hover:bg-[#F7F9FC]">
                    <td className="px-3 py-2.5 text-xs text-txt-muted">{i + 1}</td>
                    <td className="px-3 py-2.5 font-medium text-txt">{b.nameAr}</td>
                    <td className="px-3 py-2.5 text-txt">{fmt(b.remaining)}</td>
                    <td className="px-3 py-2.5 text-txt">{fmt(b.value)} د.ع</td>
                    <td className="px-3 py-2.5 text-txt-muted">{fmtDate(b.expiryDate)}</td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${expired ? "bg-state-danger-light text-state-danger" : b.daysLeft <= 14 ? "bg-state-warning-light text-state-warning" : "bg-app-bg text-txt-secondary"}`}>
                        {expired ? "منتهٍ" : `${b.daysLeft} يوم`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </Table>
          </>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ─── النواقص ─── */}
        <Card title="نواقص المخزون" icon={<AlertTriangle className="h-4 w-4 text-state-danger" />} badge={<span className="rounded bg-app-bg px-2 py-0.5 text-xs font-semibold text-txt-secondary">{fmt(d.lowStockCount)}</span>}>
          {d.lowStock.length === 0 ? (
            <p className="py-6 text-center text-sm text-txt-muted">المخزون كافٍ لجميع المنتجات ✓</p>
          ) : (
            <Table head={["#", "المنتج", "المتوفّر", "الحد الأدنى"]}>
              {d.lowStock.map((p, i) => (
                <tr key={p.id} className="border-b border-border-light last:border-b-0 hover:bg-[#F7F9FC]">
                  <td className="px-3 py-2.5 text-xs text-txt-muted">{i + 1}</td>
                  <td className="px-3 py-2.5 font-medium text-txt">{p.nameAr}</td>
                  <td className="px-3 py-2.5"><span className={`font-bold ${p.quantity === 0 ? "text-state-danger" : "text-state-warning"}`}>{fmt(p.quantity)}</span></td>
                  <td className="px-3 py-2.5 text-txt-muted">{fmt(p.minQuantity)}</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        {/* ─── القيمة حسب الفئة ─── */}
        <Card title="قيمة المخزون حسب الفئة" icon={<Tags className="h-4 w-4 text-primary" />}>
          {d.byCategory.length === 0 ? <p className="text-xs text-txt-muted">لا توجد بيانات</p> : (
            <div className="space-y-2.5">
              {(() => {
                const maxCost = Math.max(1, ...d.byCategory.map((c) => c.cost));
                return d.byCategory.slice(0, 8).map((c) => (
                  <div key={c.name}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="truncate text-txt">{c.name}</span>
                      <span className="shrink-0 text-txt"><span className="font-semibold">{fmt(c.cost)} د.ع</span> <span className="text-[10px] text-txt-muted">({fmt(c.units)} وحدة)</span></span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-app-bg">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(3, Math.round((c.cost / maxCost) * 100))}%` }} />
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead className="border-b-2 border-border bg-app-bg">
          <tr>{head.map((h) => <th key={h} className="whitespace-nowrap px-3 py-2.5 text-right text-xs font-semibold text-txt-secondary">{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
