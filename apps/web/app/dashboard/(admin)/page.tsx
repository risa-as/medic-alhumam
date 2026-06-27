"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Hand, Calendar, RefreshCw, Wallet, BarChart3, ShoppingCart, Package,
  Receipt, NotebookPen, CreditCard, Check, ChevronLeft, AlertTriangle,
  CheckCircle2, Plus, type LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import type { Sale } from "@/lib/types";
import { StatusBadge } from "@/components/ui";

interface Summary {
  todayRevenue: number;
  todayProfit: number;
  todayCount: number;
  topProducts: Array<{ productId: string; nameAr: string; totalQty: number }>;
  lowStockAlerts: Array<{ id: string; nameAr: string; quantity: number; minQuantity: number }>;
  pendingOrders: number;
  reviewCount: number;
}

const fmt    = (n: number) => Number(n).toLocaleString("ar-IQ");
const fmtIQD = (n: number) => `${Number(n).toLocaleString("ar-IQ")} د.ع`;

/* ── وقت الترحيب ── */
function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "صباح الخير";
  if (h < 17) return "مساء الخير";
  return "مساء النور";
}

/* ── تنسيق التاريخ ── */
function todayLabel(): string {
  return new Date().toLocaleDateString("ar-IQ", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

/* ── وقت مضى ── */
function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return "منذ لحظات";
  if (diff < 3600)  return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return new Date(iso).toLocaleDateString("ar-IQ");
}

/* ══════════════════════════════════════
   KPI Card
══════════════════════════════════════ */
function KpiCard({
  label, value, icon, color, sub, alert, href,
}: {
  label: string; value: string | number; icon: React.ReactNode;
  color: string; sub?: string; alert?: boolean; href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={alert ? { borderColor: `${color}55` } : undefined}
    >
      {/* خط ملوّن علوي */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-txt-muted">{label}</p>
          <p className="text-2xl font-extrabold leading-none text-txt" style={{ letterSpacing: "-0.04em" }}>{value}</p>
          {sub && (
            <p className="mt-1.5 text-[11px] text-txt-muted" style={alert ? { color, fontWeight: 600 } : undefined}>
              {sub}
            </p>
          )}
        </div>
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border"
          style={{ background: `${color}15`, color, borderColor: `${color}22` }}
        >
          {icon}
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════
   بطاقة وصول سريع
══════════════════════════════════════ */
function QuickCard({
  icon: Icon, label, desc, color, badge, href,
}: {
  icon: LucideIcon; label: string; desc: string; color: string; badge?: number; href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${color}14`, color, borderColor: `${color}22` }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-txt">{label}</p>
        <p className="text-[11px] text-txt-muted">{desc}</p>
      </div>
      {badge != null && badge > 0 && (
        <span className="flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: color }}>
          {badge}
        </span>
      )}
      <ChevronLeft className="h-3.5 w-3.5 flex-shrink-0 text-txt-muted" />
    </Link>
  );
}

/* ══════════════════════════════════════
   سطر فاتورة أخيرة
══════════════════════════════════════ */
const PT_LABEL: Record<string, string> = { CASH: "نقدي", CREDIT: "آجل", PARTIAL: "جزئي" };

function SaleRow({ sale }: { sale: Sale }) {
  const isToday = new Date(sale.createdAt).toDateString() === new Date().toDateString();
  const credit = sale.remaining > 0;
  return (
    <div className="flex items-center gap-3 border-b border-border-light py-2.5 last:border-b-0">
      {/* أيقونة */}
      <div
        className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded"
        style={{ background: credit ? "var(--color-warning-light)" : "var(--color-success-light)" }}
      >
        {credit
          ? <CreditCard className="h-[15px] w-[15px] text-state-warning" />
          : <Check className="h-[15px] w-[15px] text-state-success" strokeWidth={3} />}
      </div>

      {/* تفاصيل */}
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold text-txt">{sale.invoiceNo}</span>
          {isToday && (
            <span className="rounded bg-primary-light px-1.5 py-px text-[9px] font-semibold text-primary">اليوم</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-txt-muted">
          <span>{sale.customerName ?? "زبون عام"}</span>
          <span>·</span>
          <span>{PT_LABEL[sale.paymentType] ?? sale.paymentType}</span>
        </div>
      </div>

      {/* المبلغ والوقت */}
      <div className="flex-shrink-0 text-left">
        <p className="text-[13px] font-bold text-txt">{fmt(sale.total)}</p>
        <p className="text-[10px] text-txt-muted">{timeAgo(sale.createdAt)}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   الصفحة الرئيسية
══════════════════════════════════════ */
export default function DashboardHome() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "مستخدم";
  const role = (session?.user as { role?: string } | undefined)?.role ?? "ADMIN";
  const isAdmin = role === "ADMIN";

  const summaryQ = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => apiFetch<Summary>("/dashboard/summary"),
    refetchInterval: 60_000,
  });
  const salesQ = useQuery({
    queryKey: ["recent-sales"],
    queryFn: () => apiFetch<{ data: Sale[] }>("/sales?limit=6"),
    refetchInterval: 60_000,
  });

  const data       = summaryQ.data;
  const recent     = salesQ.data?.data ?? [];
  const lowStock   = data?.lowStockAlerts ?? [];
  const refreshing = summaryQ.isFetching || salesQ.isFetching;

  function refresh() {
    void summaryQ.refetch();
    void salesQ.refetch();
  }

  return (
    <div>
      {/* تنبيه تسويات المزامنة */}
      {(data?.reviewCount ?? 0) > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-state-warning-light bg-state-warning-light px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-state-warning" />
          <div>
            <p className="text-sm font-semibold text-state-warning">
              {data!.reviewCount} حركة تسوية مخزون تحتاج مراجعة
            </p>
            <p className="text-xs text-state-warning/80">
              ناتجة عن تعارض بيع أوفلاين/أونلاين — راجع الكميات الفعلية.
            </p>
          </div>
        </div>
      )}

      {/* ══ شريط الترحيب ══ */}
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-txt" style={{ letterSpacing: "-0.04em" }}>
              {greeting()}، {name} <Hand className="inline h-5 w-5 align-[-3px] text-amber-500" />
            </h1>
            <span
              className={[
                "rounded border px-2.5 py-0.5 text-[11px] font-semibold",
                isAdmin
                  ? "border-primary/30 bg-primary-light text-primary"
                  : "border-state-success/30 bg-state-success-light text-state-success",
              ].join(" ")}
            >
              {isAdmin ? "مدير النظام" : "موظف"}
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-[13px] text-txt-muted">
            <Calendar className="h-3.5 w-3.5" />
            <span>{todayLabel()}</span>
          </p>
        </div>

        {/* زر تحديث */}
        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex shrink-0 items-center gap-1.5 rounded border border-border bg-surface px-4 py-2 text-xs font-semibold text-txt-secondary shadow-sm transition-all hover:border-primary hover:text-primary disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "جارٍ التحديث..." : "تحديث"}
        </button>
      </div>

      {/* خطأ */}
      {summaryQ.isError && (
        <div className="mb-5 rounded-lg border border-state-danger-light bg-state-danger-light px-4 py-3 text-sm text-state-danger">
          {summaryQ.error instanceof Error ? summaryQ.error.message : "تعذّر تحميل البيانات"}
        </div>
      )}

      {/* ══ KPI Cards ══ */}
      <div className="mb-7 grid grid-cols-2 gap-3.5 md:grid-cols-4">
        {summaryQ.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <div className="h-2.5 w-3/5 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-7 w-4/5 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-2.5 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
          ))
        ) : (
          <>
            <KpiCard
              label="مبيعات اليوم"
              value={fmtIQD(data?.todayRevenue ?? 0)}
              icon={<Wallet className="h-[22px] w-[22px]" />}
              color="#1A7F5A"
              sub={`${data?.todayCount ?? 0} فاتورة`}
              href="/dashboard/sales"
            />
            <KpiCard
              label="ربح اليوم"
              value={fmtIQD(data?.todayProfit ?? 0)}
              icon={<BarChart3 className="h-[22px] w-[22px]" />}
              color="#7C3AED"
              sub="صافي بعد التكلفة (FEFO)"
              href="/dashboard/reports"
            />
            <KpiCard
              label="طلبات جديدة"
              value={data?.pendingOrders ?? 0}
              icon={<ShoppingCart className="h-[22px] w-[22px]" />}
              color="#1D4ED8"
              sub="في انتظار المعالجة"
              alert={(data?.pendingOrders ?? 0) > 0}
              href="/dashboard/orders"
            />
            <KpiCard
              label="تنبيهات المخزون"
              value={lowStock.length}
              icon={<Package className="h-[22px] w-[22px]" />}
              color="#B45309"
              sub={lowStock.length > 0 ? "منتج تحت الحد" : "المخزون كافٍ"}
              alert={lowStock.length > 0}
              href="/dashboard/inventory"
            />
          </>
        )}
      </div>

      {/* ══ المحتوى الرئيسي: عمودان ══ */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">

        {/* ── آخر الفواتير ── */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-txt">آخر الفواتير</h2>
              <p className="mt-0.5 text-[11px] text-txt-muted">أحدث عمليات البيع المسجّلة</p>
            </div>
            <Link
              href="/dashboard/sales"
              className="inline-flex items-center gap-1 rounded bg-primary-light px-3 py-1.5 text-[11px] font-semibold text-primary transition-opacity hover:opacity-80"
            >
              عرض الكل <ChevronLeft className="h-3 w-3" />
            </Link>
          </div>

          {salesQ.isLoading ? (
            <div className="flex flex-col gap-3.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <div className="h-[34px] w-[34px] animate-pulse rounded bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-3 w-3/5 animate-pulse rounded bg-slate-200" />
                    <div className="mt-1.5 h-2.5 w-2/5 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-3.5 w-12 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-txt-muted">
              <Receipt className="h-10 w-10" strokeWidth={1.5} />
              <p className="text-sm">لا توجد فواتير بعد</p>
              <Link
                href="/dashboard/sales"
                className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <Plus className="h-3.5 w-3.5" /> عرض الفواتير
              </Link>
            </div>
          ) : (
            <div>
              {recent.map((s) => <SaleRow key={s.id} sale={s} />)}
            </div>
          )}
        </div>

        {/* ── العمود الأيمن ── */}
        <div className="flex flex-col gap-4">

          {/* وصول سريع */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-3.5 text-[13px] font-bold text-txt">وصول سريع</h2>
            <div className="flex flex-col gap-2">
              <QuickCard icon={Receipt} label="الفواتير" desc="سجل المبيعات" color="#1A7F5A" href="/dashboard/sales" />
              <QuickCard
                icon={Package} label="المخزون" desc="المنتجات والكميات" color="#B45309"
                badge={lowStock.length > 0 ? lowStock.length : undefined}
                href="/dashboard/inventory"
              />
              <QuickCard
                icon={ShoppingCart} label="الطلبات" desc="طلبات المتجر" color="#1D4ED8"
                badge={(data?.pendingOrders ?? 0) > 0 ? data!.pendingOrders : undefined}
                href="/dashboard/orders"
              />
              {isAdmin && (
                <QuickCard icon={NotebookPen} label="دفتر الديون" desc="متابعة الديون والسداد" color="#7C3AED" href="/dashboard/debts" />
              )}
            </div>
          </div>

          {/* أكثر المنتجات مبيعًا */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-3.5 text-[13px] font-bold text-txt">أكثر المنتجات مبيعًا</h2>
            {(data?.topProducts.length ?? 0) === 0 ? (
              <p className="text-sm text-txt-muted">لا توجد مبيعات بعد</p>
            ) : (
              <ol className="space-y-2.5">
                {data?.topProducts.map((p, i) => (
                  <li key={p.productId} className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-primary-light text-[11px] font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="truncate text-sm text-txt">{p.nameAr}</span>
                    </div>
                    <span className="flex-shrink-0 text-sm font-semibold text-txt-secondary">{fmt(p.totalQty)} قطعة</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      {/* ══ تنبيهات نقص المخزون ══ */}
      <div className="mt-5 rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-sm font-bold text-txt">تنبيهات نقص المخزون</h2>
          {lowStock.length > 0 && <StatusBadge status="danger" label={String(lowStock.length)} />}
        </div>
        {lowStock.length === 0 ? (
          <p className="inline-flex items-center gap-1.5 text-sm text-txt-muted">
            المخزون كافٍ لجميع المنتجات <CheckCircle2 className="h-4 w-4 text-state-success" />
          </p>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded border border-state-danger-light bg-state-danger-light px-3 py-2">
                  <span className="truncate text-sm font-medium text-state-danger">{p.nameAr}</span>
                  <span className="flex-shrink-0 text-xs text-state-danger">متبقّي: {p.quantity} (حد: {p.minQuantity})</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/inventory" className="mt-3 block text-center text-xs text-primary transition-colors hover:text-primary-hover">
              عرض المخزون كاملًا ←
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
