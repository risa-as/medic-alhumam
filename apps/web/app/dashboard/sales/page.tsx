"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe, Monitor, Smartphone, Check, Tag, Eye, Receipt, Wallet, Hourglass, Search, X, Stethoscope, Printer, type LucideIcon } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import type { Sale } from "@/lib/types";
import { Btn, DataTable, PageHeader, StatCard, StatusBadge, type Column } from "@/components/ui";

const fmt = (n: number) => Number(n).toLocaleString("ar-IQ");

/* ══════════════════════════════════════
   فلتر الفترة الزمنية
══════════════════════════════════════ */
type Period = "all" | "today" | "yesterday" | "week" | "month" | "lastMonth" | "custom";

const PERIODS: { key: Period; label: string }[] = [
  { key: "all",       label: "الكل" },
  { key: "today",     label: "اليوم" },
  { key: "yesterday", label: "أمس" },
  { key: "week",      label: "هذا الأسبوع" },
  { key: "month",     label: "هذا الشهر" },
  { key: "lastMonth", label: "الشهر الماضي" },
  { key: "custom",    label: "مخصّص" },
];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** يحوّل "yyyy-mm-dd" إلى تاريخ محلي (منتصف ليل محلي) لتفادي انزياح المنطقة الزمنية. */
function parseLocalDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** يحسب نطاق [from, to) بصيغة ISO من الفترة المختارة (حدود الأيام محلية). */
function computeRange(period: Period, customFrom: string, customTo: string): { from?: string; to?: string } {
  const now = new Date();
  const today = startOfDay(now);

  switch (period) {
    case "today": {
      const to = new Date(today); to.setDate(today.getDate() + 1);
      return { from: today.toISOString(), to: to.toISOString() };
    }
    case "yesterday": {
      const from = new Date(today); from.setDate(today.getDate() - 1);
      return { from: from.toISOString(), to: today.toISOString() };
    }
    case "week": {
      // أسبوع يبدأ السبت (المتعارف عليه محليًا)
      const sinceSat = (today.getDay() + 1) % 7; // 0=أحد..6=سبت
      const from = new Date(today); from.setDate(today.getDate() - sinceSat);
      const to = new Date(from); to.setDate(from.getDate() + 7);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    case "month": {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    case "lastMonth": {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: from.toISOString(), to: to.toISOString() };
    }
    case "custom": {
      const fromD = parseLocalDate(customFrom);
      const toD = parseLocalDate(customTo);
      let to: string | undefined;
      if (toD) { const t = new Date(toD); t.setDate(toD.getDate() + 1); to = t.toISOString(); }
      return { from: fromD ? fromD.toISOString() : undefined, to };
    }
    default:
      return {};
  }
}

/* ══════════════════════════════════════
   خرائط نوع الدفع والمنصّة
══════════════════════════════════════ */
const PAY: Record<Sale["paymentType"], { label: string; badge: "success" | "warning" | "info" }> = {
  CASH:    { label: "نقدي", badge: "success" },
  CREDIT:  { label: "آجل",  badge: "warning" },
  PARTIAL: { label: "جزئي", badge: "info" },
};

const PLATFORM: Record<Sale["platform"], { label: string; icon: LucideIcon }> = {
  WEB:         { label: "ويب",      icon: Globe },
  POS_DESKTOP: { label: "نقطة بيع", icon: Monitor },
  POS_MOBILE:  { label: "جوّال",    icon: Smartphone },
};

/* ══════════════════════════════════════
   علامات الفاتورة (خصم)
══════════════════════════════════════ */
function SaleFlags({ sale }: { sale: Sale }) {
  const discounted = sale.discount > 0 || sale.items.some((i) => i.lineDiscount > 0);
  const platform = PLATFORM[sale.platform];
  const PlatformIcon = platform?.icon;

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {platform && PlatformIcon && (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-semibold text-slate-500">
          <PlatformIcon className="h-3 w-3" /> {platform.label}
        </span>
      )}
      {discounted && (
        <span
          className="inline-flex items-center gap-0.5 rounded-full bg-state-danger-light px-1.5 py-0.5 text-[9.5px] font-bold text-state-danger"
          title="طُبّق خصم على هذه الفاتورة"
        >
          <Tag className="h-3 w-3" /> خصم
        </span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   صفحة الفواتير
══════════════════════════════════════ */
export default function SalesPage() {
  const [selected, setSelected] = useState<Sale | null>(null);

  // فلاتر
  const [invoiceQuery, setInvoiceQuery]   = useState("");
  const [debouncedInvoice, setDebounced]  = useState("");
  const [period, setPeriod]               = useState<Period>("all");
  const [customFrom, setCustomFrom]       = useState("");
  const [customTo, setCustomTo]           = useState("");

  /* debounce بسيط لحقل البحث برقم الفاتورة */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(invoiceQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [invoiceQuery]);

  const salesQ = useQuery({
    queryKey: ["sales", debouncedInvoice, period, customFrom, customTo],
    queryFn: () => {
      const range = computeRange(period, customFrom, customTo);
      const params = new URLSearchParams();
      if (debouncedInvoice) params.set("invoiceNo", debouncedInvoice);
      if (range.from) params.set("from", range.from);
      if (range.to) params.set("to", range.to);
      const qs = params.toString();
      return apiFetch<{ data: Sale[]; count: number; totalRevenue: number }>(
        `/sales${qs ? `?${qs}` : ""}`,
      );
    },
  });

  const storeName =
    useQuery({
      queryKey: ["store-name"],
      queryFn: () => apiFetch<{ storeName: string }>("/settings"),
      staleTime: 5 * 60_000,
    }).data?.storeName?.trim() || "متجر المستلزمات الطبية";

  const sales        = salesQ.data?.data ?? [];
  const totalRevenue = salesQ.data?.totalRevenue ?? 0;
  const totalRemaining = sales.reduce((s, x) => s + x.remaining, 0);
  const hasFilter    = !!debouncedInvoice || period !== "all";

  const columns: Column<Sale>[] = [
    {
      key: "invoiceNo",
      label: "رقم الفاتورة",
      render: (s) => (
        <div>
          <span className="font-mono font-semibold text-primary">{s.invoiceNo}</span>
          <SaleFlags sale={s} />
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "التاريخ",
      render: (s) => (
        <span className="text-xs text-txt-secondary">
          {new Date(s.createdAt).toLocaleString("ar-IQ")}
        </span>
      ),
    },
    {
      key: "customerName",
      label: "الزبون",
      render: (s) =>
        s.customerName
          ? <span className="font-medium">{s.customerName}</span>
          : <span className="text-xs text-txt-muted">—</span>,
    },
    {
      key: "total",
      label: "الإجمالي",
      render: (s) => (
        <span className="font-bold text-txt">
          {fmt(s.total)} <span className="text-[10px] font-normal text-txt-muted">د.ع</span>
        </span>
      ),
    },
    {
      key: "remaining",
      label: "المتبقّي",
      render: (s) => (
        <span className={`inline-flex items-center gap-1 font-semibold ${s.remaining > 0 ? "text-state-danger" : "text-state-success"}`}>
          {s.remaining > 0 ? `${fmt(s.remaining)} د.ع` : <><Check className="h-3.5 w-3.5" strokeWidth={3} /> مكتمل</>}
        </span>
      ),
    },
    {
      key: "paymentType",
      label: "نوع الدفع",
      render: (s) => {
        const p = PAY[s.paymentType];
        return p ? <StatusBadge status={p.badge} label={p.label} /> : <span>{s.paymentType}</span>;
      },
    },
    {
      key: "actions",
      label: "الإجراءات",
      render: (s) => (
        <Btn variant="ghost" size="sm" onClick={() => setSelected(s)}>
          <Eye className="h-3.5 w-3.5" /> عرض
        </Btn>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="الفواتير" subtitle="سجل المبيعات" />

      {/* إحصائيات */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard
          label={hasFilter ? "فواتير ضمن الفلتر" : "إجمالي الفواتير"}
          value={sales.length}
          accentColor="#1A5276"
          icon={<Receipt className="h-[18px] w-[18px]" />}
        />
        <StatCard
          label={hasFilter ? "إيرادات الفلتر" : "إجمالي الإيرادات"}
          value={`${fmt(totalRevenue)} د.ع`}
          accentColor="#1A7F5A"
          icon={<Wallet className="h-[18px] w-[18px]" />}
        />
        <StatCard
          label="إجمالي المتبقّي (ديون)"
          value={`${fmt(totalRemaining)} د.ع`}
          accentColor={totalRemaining > 0 ? "#B45309" : "#94A3B8"}
          icon={<Hourglass className="h-[18px] w-[18px]" />}
        />
      </div>

      {/* ── لوحة الفلاتر ── */}
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
        {/* البحث برقم الفاتورة */}
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-muted" />
          <input
            type="search"
            value={invoiceQuery}
            placeholder="ابحث برقم الفاتورة..."
            onChange={(e) => setInvoiceQuery(e.target.value)}
            className="w-full rounded border border-border bg-surface py-2 pr-9 pl-8 text-sm text-txt outline-none transition-colors focus:border-primary placeholder:text-txt-muted"
          />
          {invoiceQuery && (
            <button
              onClick={() => setInvoiceQuery("")}
              className="absolute left-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"
              title="مسح البحث"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* أزرار الفترة */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="ml-1 text-xs font-bold text-txt-muted">الفترة:</span>
          {PERIODS.map((p) => {
            const active = period === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={[
                  "rounded border px-3 py-1.5 text-xs transition-all duration-150",
                  active
                    ? "border-primary bg-primary font-bold text-white"
                    : "border-border bg-surface font-medium text-txt-secondary hover:border-primary hover:text-primary",
                ].join(" ")}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* نطاق مخصّص */}
        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-4 pt-0.5">
            <label className="flex items-center gap-2 text-xs text-txt-secondary">
              من
              <input
                type="date"
                value={customFrom}
                max={customTo || undefined}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded border border-border bg-surface px-2.5 py-1.5 text-xs text-txt outline-none focus:border-primary"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-txt-secondary">
              إلى
              <input
                type="date"
                value={customTo}
                min={customFrom || undefined}
                onChange={(e) => setCustomTo(e.target.value)}
                className="rounded border border-border bg-surface px-2.5 py-1.5 text-xs text-txt outline-none focus:border-primary"
              />
            </label>
          </div>
        )}
      </div>

      {salesQ.isError && (
        <p className="mb-4 rounded bg-state-danger-light px-3 py-2 text-sm text-state-danger">
          {(salesQ.error as Error).message}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={sales}
        loading={salesQ.isLoading}
        emptyMessage={
          hasFilter
            ? "لا توجد فواتير مطابقة للبحث أو الفترة المحدّدة"
            : "لا توجد فواتير بعد"
        }
      />

      {/* نافذة تفاصيل الفاتورة */}
      {selected && <ReceiptModal sale={selected} storeName={storeName} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ══════════════════════════════════════
   وصل الفاتورة (عرض + طباعة)
══════════════════════════════════════ */
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c),
  );
}

function ReceiptModal({ sale, storeName, onClose }: { sale: Sale; storeName: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const date = new Date(sale.createdAt);
  const pay = PAY[sale.paymentType] ?? { label: sale.paymentType, badge: "info" as const };

  function print() {
    const itemRows = sale.items
      .map(
        (it) => `
        <div class="row item">
          <div class="iname">
            <div class="n">${escapeHtml(it.product?.nameAr ?? "—")}</div>
            <div class="q">${fmt(it.quantity)} × ${fmt(it.unitPrice)}${it.lineDiscount > 0 ? ` − ${fmt(it.lineDiscount)}` : ""}</div>
          </div>
          <div class="lt">${fmt(it.lineTotal)}</div>
        </div>`,
      )
      .join("");

    const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8" />
      <title>وصل ${escapeHtml(sale.invoiceNo)}</title>
      <style>
        * { font-family: "Segoe UI", Tahoma, sans-serif; box-sizing: border-box; }
        body { margin: 0; padding: 12px; color: #0F172A; }
        .paper { width: 280px; margin: 0 auto; }
        .center { text-align: center; }
        h1 { font-size: 16px; margin: 6px 0 2px; }
        .muted { color: #64748B; }
        .sm { font-size: 11px; }
        hr { border: none; border-top: 1px dashed #CBD5E1; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; font-size: 12px; margin: 2px 0; }
        .item { align-items: flex-start; gap: 8px; margin: 6px 0; }
        .iname .n { font-weight: 600; }
        .iname .q { font-size: 11px; color: #94A3B8; margin-top: 1px; }
        .lt { font-weight: 700; white-space: nowrap; }
        .total { display: flex; justify-content: space-between; align-items: center;
                 background: #0F172A; color: #fff; padding: 8px 12px; border-radius: 8px; margin: 10px 0; }
        .total .v { font-size: 17px; font-weight: 800; }
        .pay { text-align: center; margin-top: 10px; }
        .pay span { display: inline-block; border: 1.5px solid #cbd5e1; border-radius: 999px;
                    padding: 5px 14px; font-size: 12px; font-weight: 700; }
        .num { font-family: monospace; }
      </style></head><body>
      <div class="paper">
        <div class="center">
          <h1>${escapeHtml(storeName)}</h1>
          <p class="sm muted">مستلزمات وأجهزة طبية</p>
          <p class="sm muted">إيصال بيع</p>
        </div>
        <hr />
        <div class="row"><span class="muted">رقم الفاتورة</span><span class="num">${escapeHtml(sale.invoiceNo)}</span></div>
        <div class="row"><span class="muted">التاريخ</span><span class="num">${date.toLocaleDateString("ar-IQ")}</span></div>
        <div class="row"><span class="muted">الوقت</span><span class="num">${date.toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" })}</span></div>
        ${sale.customerName ? `<div class="row"><span class="muted">الزبون</span><span>${escapeHtml(sale.customerName)}</span></div>` : ""}
        <hr />
        ${itemRows}
        <hr />
        <div class="row"><span class="muted">المجموع الفرعي</span><span class="num">${fmt(sale.subtotal)} د.ع</span></div>
        ${sale.discount > 0 ? `<div class="row" style="color:#DC2626"><span>الخصم</span><span class="num">− ${fmt(sale.discount)} د.ع</span></div>` : ""}
        <div class="total"><span>الإجمالي</span><span class="v num">${fmt(sale.total)} د.ع</span></div>
        <div class="row"><span class="muted">المدفوع</span><span class="num">${fmt(sale.paid)} د.ع</span></div>
        ${sale.remaining > 0 ? `<div class="row" style="color:#DC2626;font-weight:700"><span>المتبقّي (دين)</span><span class="num">${fmt(sale.remaining)} د.ع</span></div>` : ""}
        <div class="pay"><span>طريقة الدفع: ${pay.label}</span></div>
        <hr />
        <div class="center">
          <p class="sm" style="font-weight:700">شكراً لتعاملكم معنا 🌿</p>
          <p class="num sm muted" style="letter-spacing:0.15em;margin-top:8px">${escapeHtml(sale.invoiceNo)}</p>
        </div>
      </div>
      <script>window.onload = () => { window.print(); }</script>
      </body></html>`;

    const w = window.open("", "_blank", "width=380,height=640");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box flex max-h-[90vh] w-[360px] max-w-full flex-col overflow-hidden rounded-lg bg-surface shadow-lg">
        {/* ترويسة */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="inline-flex items-center gap-2 text-base font-bold text-txt"><Receipt className="h-[18px] w-[18px] text-primary" /> تفاصيل الفاتورة</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* جسم الوصل */}
        <div className="overflow-auto px-5 py-4 text-sm">
          {/* رأس المتجر */}
          <div className="mb-3 text-center">
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(135deg,#1D4ED8,#3B82F6)" }}>
              <Stethoscope className="h-5 w-5" />
            </div>
            <p className="text-[15px] font-extrabold text-txt">{storeName}</p>
            <p className="mt-0.5 text-[11px] text-txt-muted">إيصال بيع</p>
          </div>

          <div className="my-2 border-t border-dashed border-border" />

          {/* بيانات الفاتورة */}
          <div className="flex flex-col gap-1">
            <Row label="رقم الفاتورة"><span className="font-mono font-bold">{sale.invoiceNo}</span></Row>
            <Row label="التاريخ"><span className="font-mono">{date.toLocaleDateString("ar-IQ")}</span></Row>
            <Row label="الوقت"><span className="font-mono">{date.toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" })}</span></Row>
            {sale.customerName && <Row label="الزبون"><span className="font-semibold">{sale.customerName}</span></Row>}
          </div>

          <div className="my-2 border-t border-dashed border-border" />

          {/* الأصناف */}
          <div className="mb-1 flex justify-between text-[10.5px] font-bold uppercase tracking-wide text-txt-muted">
            <span>الصنف</span><span>الإجمالي</span>
          </div>
          <div className="flex flex-col gap-2">
            {sale.items.map((it) => (
              <div key={it.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold leading-tight text-txt">{it.product?.nameAr ?? "—"}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-txt-muted">
                    {fmt(it.quantity)} × {fmt(it.unitPrice)}
                    {it.lineDiscount > 0 && <span className="text-state-danger"> − {fmt(it.lineDiscount)}</span>}
                  </p>
                </div>
                <span className="whitespace-nowrap font-mono text-[12.5px] font-bold text-txt">{fmt(it.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="my-2 border-t border-dashed border-border" />

          {/* الإجماليات */}
          <div className="flex flex-col gap-0.5">
            <Row label="المجموع الفرعي"><span className="font-mono">{fmt(sale.subtotal)} د.ع</span></Row>
            {sale.discount > 0 && (
              <div className="flex justify-between text-state-danger">
                <span>الخصم</span><span className="font-mono">− {fmt(sale.discount)} د.ع</span>
              </div>
            )}
          </div>

          {/* الإجمالي الكلي */}
          <div className="my-2.5 flex items-center justify-between rounded-md bg-[#0F172A] px-3 py-2 text-white">
            <span className="text-[13px] font-bold">الإجمالي</span>
            <span className="font-mono text-lg font-extrabold">
              {fmt(sale.total)} <span className="text-[11px] font-medium opacity-80">د.ع</span>
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <Row label="المدفوع"><span className="font-mono font-semibold">{fmt(sale.paid)} د.ع</span></Row>
            {sale.remaining > 0 && (
              <div className="flex justify-between font-bold text-state-danger">
                <span>المتبقّي (دين)</span><span className="font-mono">{fmt(sale.remaining)} د.ع</span>
              </div>
            )}
          </div>

          {/* طريقة الدفع */}
          <div className="mt-3 flex justify-center">
            <StatusBadge status={pay.badge} label={`طريقة الدفع: ${pay.label}`} />
          </div>
        </div>

        {/* أزرار */}
        <div className="flex gap-2 border-t border-border px-5 py-3">
          <Btn variant="secondary" fullWidth onClick={print}><Printer className="h-4 w-4" /> طباعة الوصل</Btn>
          <Btn variant="primary" fullWidth onClick={onClose}>إغلاق</Btn>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-txt-muted">{label}</span>
      {children}
    </div>
  );
}
