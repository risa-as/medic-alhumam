"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { X, Phone, Truck, Pencil, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import type { Order, Product, Setting } from "@/lib/types";
import { IRAQ_GOVERNORATES } from "@medic/ui";
import { Btn, PageHeader, StatusBadge, InputField, SelectField, TextareaField } from "@/components/ui";

/* ─── الحالات ───
   HOME(الرئيسية) · PENDING(معلق) · COMPLETED(مكتمل) · RETURNED(راجع) · CANCELLED(الغاء) · DELETED(حذف).
   HOME هي حالة الطلبات الواردة الجديدة (الافتراضية)، وكل تاب = حالة واحدة. */
const STATUS_VALUES = ["HOME", "PENDING", "COMPLETED", "RETURNED", "CANCELLED", "DELETED"] as const;

const STATUS_LABEL: Record<string, string> = {
  HOME: "الرئيسية",
  PENDING: "معلق",
  COMPLETED: "مكتمل",
  RETURNED: "راجع",
  CANCELLED: "الغاء",
  DELETED: "حذف",
};
const STATUS_BADGE: Record<string, "info" | "warning" | "neutral" | "success" | "danger" | "primary"> = {
  HOME: "primary",
  PENDING: "warning",
  COMPLETED: "success",
  RETURNED: "info",
  CANCELLED: "danger",
  DELETED: "neutral",
};
// نقل حرّ: أي حالة يمكن تحويلها إلى أي حالة أخرى.
const VALID_NEXT: Record<string, string[]> = Object.fromEntries(
  STATUS_VALUES.map((s) => [s, STATUS_VALUES.filter((t) => t !== s)]),
);

const TABS: { value: string; label: string }[] = [
  { value: "HOME", label: "الرئيسية" },
  { value: "PENDING", label: "معلق" },
  { value: "COMPLETED", label: "مكتمل" },
  { value: "RETURNED", label: "راجع" },
  { value: "CANCELLED", label: "الغاء" },
  { value: "DELETED", label: "حذف" },
];

const fmt = (n: number) => n.toLocaleString("ar-IQ");

function statusVariant(s: string): "primary" | "success" | "danger" {
  if (s === "CANCELLED" || s === "DELETED") return "danger";
  if (s === "COMPLETED") return "success";
  return "primary";
}

/* رابط واتساب من رقم عراقي: 07XXXXXXXXX → 9647XXXXXXXXX */
function waLink(phone: string): string {
  let d = (phone ?? "").replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  else if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "964" + d.slice(1);
  else if (!d.startsWith("964")) d = "964" + d;
  return `https://wa.me/${d}`;
}

/* ملخّص أصناف الطلب كنص + الكمية الإجمالية */
function productSummary(o: Order): string {
  const names = (o.items ?? []).map((i) => i.product?.nameAr ?? i.productId);
  const first = names[0];
  if (!first) return "—";
  return names.length > 1 ? `${first} (+${names.length - 1})` : first;
}
function totalQty(o: Order): number {
  return (o.items ?? []).reduce((s, i) => s + i.quantity, 0);
}

interface ManualOrderForm {
  customerName: string;
  customerPhone: string;
  governorate: string;
  customerAddress?: string;
  productId: string;
  quantity: number;
  notes?: string;
}

function ManualOrderModal({ products, onClose, onCreated }: {
  products: Product[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ManualOrderForm>({
    defaultValues: { quantity: 1 },
  });
  const [err, setErr]         = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(v: ManualOrderForm) {
    setLoading(true);
    setErr(null);
    const product = products.find((p) => p.id === v.productId);
    if (!product) { setErr("اختر منتجًا صالحًا"); setLoading(false); return; }
    try {
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          clientEventId: `manual-${Date.now()}`,
          customerName: v.customerName,
          customerPhone: v.customerPhone,
          governorate: v.governorate,
          customerAddress: v.customerAddress,
          notes: v.notes || undefined,
          items: [{ productId: product.id, quantity: Number(v.quantity), unitPrice: product.salePrice, selectedAttributes: {} }],
        }),
      });
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر إنشاء الطلب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="modal-box bg-surface rounded-lg shadow-lg w-[480px] max-w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto p-7">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-txt">إضافة طلب يدوي</h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded text-txt-muted hover:bg-app-bg hover:text-txt"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          {/* معلومات العميل */}
          <p className="text-xs font-semibold text-txt-secondary border-b border-border-light pb-1.5 mb-3">معلومات العميل</p>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="الاسم" required error={errors.customerName?.message}
              {...register("customerName", { required: "مطلوب" })} />
            <InputField label="الهاتف" required error={errors.customerPhone?.message}
              {...register("customerPhone", { required: "مطلوب" })} />
          </div>
          <SelectField label="المحافظة" required error={errors.governorate?.message}
            {...register("governorate", { required: "مطلوب" })}>
            <option value="">اختر...</option>
            {IRAQ_GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
          </SelectField>
          <TextareaField label="العنوان" rows={2} {...register("customerAddress")} />

          {/* تفاصيل الطلب */}
          <p className="text-xs font-semibold text-txt-secondary border-b border-border-light pb-1.5 mb-3 pt-2">تفاصيل الطلب</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <SelectField label="المنتج" required error={errors.productId?.message}
                {...register("productId", { required: "اختر منتجًا" })}>
                <option value="">اختر المنتج...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.nameAr} — {fmt(p.salePrice)} د.ع</option>
                ))}
              </SelectField>
            </div>
            <InputField label="الكمية" type="number" min={1} required
              {...register("quantity", { required: true, min: 1, valueAsNumber: true })} />
          </div>
          <TextareaField label="ملاحظات" rows={2} {...register("notes")} />

          {err && (
            <div className="rounded border border-state-danger-light bg-state-danger-light px-3 py-2 text-xs text-state-danger">
              {err}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Btn variant="secondary" fullWidth type="button" onClick={onClose} disabled={loading}>إلغاء</Btn>
            <Btn variant="primary" fullWidth type="submit" loading={loading} loadingText="جارٍ الإنشاء...">
              إنشاء الطلب
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

/* خلية تعديل رقمية inline (تكلفة التوصيل الفعلية) — تُحفظ عند الخروج/Enter. */
function DeliveryCostCell({ order, fallback, onCommit }: {
  order: Order;
  fallback: number | null;
  onCommit: (id: string, value: number | null) => void;
}) {
  const current = order.actualDeliveryCost;
  function commit(raw: string) {
    const trimmed = raw.trim();
    const num = trimmed === "" ? null : Number(trimmed);
    if (trimmed !== "" && (Number.isNaN(num) || (num as number) < 0)) return;
    if (num === (current ?? null)) return;
    onCommit(order.id, num);
  }
  return (
    <div className="flex items-center gap-1">
      <Truck className="h-3.5 w-3.5 shrink-0 text-txt-muted" />
      <input
        key={`dc-${order.id}-${current ?? "x"}`}
        type="number"
        min={0}
        dir="ltr"
        defaultValue={current != null ? String(current) : ""}
        placeholder={fallback != null ? fmt(fallback) : "—"}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
        className="w-20 rounded border border-border bg-surface px-2 py-1 text-left text-xs text-txt outline-none transition-colors focus:border-primary placeholder:text-txt-muted"
      />
    </div>
  );
}

interface EditOrderForm {
  customerName: string;
  customerPhone: string;
  governorate: string;
  customerAddress?: string;
  notes?: string;
}

/* نافذة تعديل تفاصيل الطلب (بيانات الزبون + الملاحظات) — ADMIN. */
function EditOrderModal({ order, onClose, onSaved }: {
  order: Order;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<EditOrderForm>({
    defaultValues: {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      governorate: order.governorate,
      customerAddress: order.customerAddress ?? "",
      notes: order.notes ?? "",
    },
  });
  const [err, setErr]         = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(v: EditOrderForm) {
    setLoading(true);
    setErr(null);
    try {
      await apiFetch(`/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          customerName: v.customerName,
          customerPhone: v.customerPhone,
          governorate: v.governorate,
          customerAddress: v.customerAddress?.trim() ? v.customerAddress.trim() : null,
          notes: v.notes?.trim() ? v.notes.trim() : null,
        }),
      });
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر حفظ التعديلات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="modal-box bg-surface rounded-lg shadow-lg w-[480px] max-w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-txt">تعديل تفاصيل الطلب</h3>
            <p className="text-xs text-txt-muted">{order.orderNo}</p>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded text-txt-muted hover:bg-app-bg hover:text-txt"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputField label="الاسم" required error={errors.customerName?.message}
              {...register("customerName", { required: "مطلوب" })} />
            <InputField label="الهاتف" required error={errors.customerPhone?.message}
              {...register("customerPhone", { required: "مطلوب" })} />
          </div>
          <SelectField label="المحافظة" required error={errors.governorate?.message}
            {...register("governorate", { required: "مطلوب" })}>
            <option value="">اختر...</option>
            {IRAQ_GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
          </SelectField>
          <TextareaField label="العنوان" rows={2} {...register("customerAddress")} />
          <TextareaField label="ملاحظات" rows={2} {...register("notes")} />

          {err && (
            <div className="rounded border border-state-danger-light bg-state-danger-light px-3 py-2 text-xs text-state-danger">
              {err}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Btn variant="secondary" fullWidth type="button" onClick={onClose} disabled={loading}>إلغاء</Btn>
            <Btn variant="primary" fullWidth type="submit" loading={loading} loadingText="جارٍ الحفظ...">
              حفظ التعديلات
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

/* نافذة تأكيد حذف الطلب (تحويله إلى حالة «حذف») — تمنع الحذف العَرَضي. */
function ConfirmDeleteModal({ order, loading, onClose, onConfirm }: {
  order: Order;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="modal-box bg-surface rounded-lg shadow-lg w-[420px] max-w-[calc(100vw-32px)] p-7">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-state-danger-light text-state-danger">
              <Trash2 className="h-[18px] w-[18px]" />
            </span>
            <h3 className="text-base font-bold text-txt">تأكيد حذف الطلب</h3>
          </div>
          <button onClick={onClose} disabled={loading} className="flex h-7 w-7 items-center justify-center rounded text-txt-muted hover:bg-app-bg hover:text-txt disabled:opacity-50"><X className="h-4 w-4" /></button>
        </div>
        <p className="mb-1 text-sm text-txt-secondary">
          هل أنت متأكد من حذف الطلب <span className="font-bold text-txt">{order.orderNo}</span>؟
        </p>
        <p className="mb-5 text-xs text-txt-muted">
          سيُنقل الطلب الخاص بـ «{order.customerName}» إلى قسم «حذف». يمكنك استرجاعه لاحقًا من هناك.
        </p>
        <div className="flex gap-2">
          <Btn variant="secondary" fullWidth type="button" onClick={onClose} disabled={loading}>إلغاء</Btn>
          <Btn variant="danger" fullWidth type="button" loading={loading} loadingText="جارٍ الحذف..." onClick={onConfirm}>
            تأكيد الحذف
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const qc = useQueryClient();
  const [tab, setTab]                   = useState("HOME");
  const [showManual, setShowManual]     = useState(false);
  const [editTarget, setEditTarget]     = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());
  const [bulkTarget, setBulkTarget]     = useState<string | null>(null);
  const [bulkMsg, setBulkMsg]           = useState<{ text: string; type: "ok" | "warn" } | null>(null);

  // نجلب كل الطلبات مرّة واحدة ونفلتر التابات في الواجهة (أعداد دقيقة لكل تاب).
  const ordersQ = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiFetch<{ data: Order[] }>("/orders"),
  });

  // إعدادات أسعار التوصيل الفعلية — لعرض القيمة التلقائية للطلبات القديمة (placeholder).
  const settingsQ = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiFetch<Setting>("/settings"),
  });

  const productsQ = useQuery({
    queryKey: ["products-for-order"],
    queryFn: () => apiFetch<{ data: Product[] }>("/products"),
    enabled: showManual,
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch<Order>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  // تعديل تكلفة التوصيل الفعلية / الملاحظات inline.
  const patchMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      apiFetch<Order>(`/orders/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  const deliveryFallback = (governorate: string): number | null => {
    const s = settingsQ.data;
    if (!s) return null;
    return governorate.trim() === "بغداد" ? s.deliveryCostBaghdad : s.deliveryCostOther;
  };

  const allOrders = ordersQ.data?.data ?? [];
  const counts: Record<string, number> = {};
  allOrders.forEach((o) => { counts[o.status] = (counts[o.status] ?? 0) + 1; });

  // كل تاب = حالة واحدة (الرئيسية/HOME هي الواردة الجديدة).
  const orders = allOrders.filter((o) => o.status === tab);

  /* ─── التحديد الجماعي للطلبات ─── */
  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.has(o.id));
  const someSelected = selectedIds.size > 0;

  function toggleOne(id: string) {
    setBulkMsg(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setBulkMsg(null);
    setSelectedIds(allSelected ? new Set() : new Set(orders.map((o) => o.id)));
  }
  function clearSelection() {
    setBulkMsg(null);
    setSelectedIds(new Set());
  }

  /* تحويل جماعي للحالة — يطبَّق على كل الطلبات المحدّدة (النقل حرّ بين الحالات). */
  async function bulkSetStatus(target: string) {
    const chosen = orders.filter((o) => selectedIds.has(o.id));
    const eligible = chosen.filter((o) => (VALID_NEXT[o.status] ?? []).includes(target));
    if (eligible.length === 0) {
      setBulkMsg({ text: `الطلبات المحدّدة في حالة "${STATUS_LABEL[target]}" أصلًا`, type: "warn" });
      return;
    }
    setBulkTarget(target);
    setBulkMsg(null);
    const results = await Promise.allSettled(
      eligible.map((o) =>
        apiFetch(`/orders/${o.id}/status`, { method: "PATCH", body: JSON.stringify({ status: target }) }),
      ),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - ok;
    const skipped = chosen.length - eligible.length;
    await qc.invalidateQueries({ queryKey: ["orders"] });
    setSelectedIds(new Set());
    setBulkTarget(null);
    const parts = [`تم تحويل ${ok} طلب إلى "${STATUS_LABEL[target]}"`];
    if (skipped) parts.push(`تُخطّي ${skipped}`);
    if (failed) parts.push(`فشل ${failed}`);
    setBulkMsg({ text: parts.join(" · "), type: failed ? "warn" : "ok" });
  }

  // وجهات التحويل الجماعي = كل الحالات عدا حالة التاب الحالي.
  const bulkTargets = STATUS_VALUES.filter((s) => s !== tab);

  const COLSPAN = 13;

  return (
    <div>
      <PageHeader
        title="الطلبات الواردة"
        actions={
          <Btn variant="primary" onClick={() => setShowManual(true)}>+ إضافة طلب يدوي</Btn>
        }
      />

      {/* تابات الحالة */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const count = counts[t.value] ?? 0;
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => { setTab(t.value); clearSelection(); }}
              className={[
                "rounded-md border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                active
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-surface text-txt-secondary hover:border-primary/40 hover:bg-app-bg",
              ].join(" ")}
            >
              {t.label}
              {count > 0 && (
                <span
                  className={[
                    "mr-1.5 inline-flex min-w-[18px] justify-center rounded px-1 py-px text-[10px] font-bold",
                    active ? "bg-white/25 text-white" : "bg-app-bg text-txt-muted",
                  ].join(" ")}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* شريط الإجراءات الجماعية — يظهر عند تحديد طلب أو أكثر */}
      {someSelected && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-primary bg-primary-light px-3 py-2.5">
          <span className="text-xs font-bold text-primary">{selectedIds.size} طلب محدّد</span>
          <span className="text-xs text-txt-muted">— تحويل إلى:</span>
          {bulkTargets.map((s) => (
            <Btn
              key={s}
              size="sm"
              variant={statusVariant(s)}
              disabled={bulkTarget !== null}
              loading={bulkTarget === s}
              onClick={() => bulkSetStatus(s)}
            >
              {STATUS_LABEL[s]}
            </Btn>
          ))}
          <button
            onClick={clearSelection}
            disabled={bulkTarget !== null}
            className="mr-auto rounded border border-border bg-surface px-2.5 py-1 text-xs text-txt-secondary transition-colors hover:bg-app-bg disabled:opacity-50"
          >
            إلغاء التحديد
          </button>
        </div>
      )}

      {bulkMsg && (
        <div
          className={[
            "mb-3 rounded border px-3 py-2 text-xs font-medium",
            bulkMsg.type === "ok"
              ? "border-state-success-light bg-state-success-light text-state-success"
              : "border-state-warning-light bg-state-warning-light text-state-warning",
          ].join(" ")}
        >
          {bulkMsg.text}
        </div>
      )}

      {/* جدول الطلبات */}
      <div
        className="overflow-hidden rounded-lg border border-border bg-surface"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="overflow-auto">
          <table className="w-full border-collapse whitespace-nowrap text-sm">
            <thead className="sticky top-0 z-10 border-b-2 border-border bg-app-bg">
              <tr>
                <th className="w-px whitespace-nowrap px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    aria-label="تحديد كل الطلبات"
                    className="h-4 w-4 cursor-pointer align-middle accent-[var(--color-primary)]"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                    onChange={toggleAll}
                  />
                </th>
                {["ت", "التاريخ", "الاسم", "المنتج", "رقم الهاتف", "المحافظة", "العنوان", "الكمية", "السعر", "تكلفة التوصيل الفعلية", "الحالة", "إجراءات"].map((h) => (
                  <th key={h} className="px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-txt-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordersQ.isLoading && (
                <tr>
                  <td colSpan={COLSPAN} className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-txt-muted">
                      <span className="spinner spinner-dark" /> جارٍ التحميل...
                    </div>
                  </td>
                </tr>
              )}

              {!ordersQ.isLoading && orders.map((o, index) => {
                const isChecked = selectedIds.has(o.id);
                return (
                  <tr
                    key={o.id}
                    className={[
                      "border-b border-border-light transition-colors duration-100 last:border-b-0",
                      isChecked ? "bg-primary-light/50" : "bg-surface hover:bg-[#F7F9FC]",
                    ].join(" ")}
                  >
                    {/* تحديد */}
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        aria-label={`تحديد الطلب ${o.orderNo}`}
                        className="h-4 w-4 cursor-pointer align-middle accent-[var(--color-primary)]"
                        checked={isChecked}
                        onChange={() => toggleOne(o.id)}
                      />
                    </td>

                    {/* ت */}
                    <td className="px-3 py-3 text-xs text-txt-muted">{index + 1}</td>

                    {/* التاريخ */}
                    <td className="px-3 py-3 text-xs text-txt-secondary">
                      <p>{new Date(o.createdAt).toLocaleDateString("ar-IQ", { day: "numeric", month: "short", year: "numeric" })}</p>
                      <p className="text-[11px] text-txt-muted">{new Date(o.createdAt).toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" })}</p>
                    </td>

                    {/* الاسم */}
                    <td className="px-3 py-3 font-semibold text-txt">{o.customerName}</td>

                    {/* المنتج */}
                    <td className="max-w-[200px] truncate px-3 py-3 text-txt" title={productSummary(o)}>{productSummary(o)}</td>

                    {/* رقم الهاتف → واتساب */}
                    <td className="px-3 py-3">
                      <a
                        href={waLink(o.customerPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        title="فتح محادثة واتساب"
                        className="inline-flex items-center gap-1 font-medium text-state-success transition-colors hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5 shrink-0" /> {o.customerPhone}
                      </a>
                    </td>

                    {/* المحافظة */}
                    <td className="px-3 py-3 text-txt">{o.governorate}</td>

                    {/* العنوان */}
                    <td className="max-w-[180px] truncate px-3 py-3 text-txt-secondary" title={o.customerAddress ?? ""}>{o.customerAddress || "—"}</td>

                    {/* الكمية */}
                    <td className="px-3 py-3 text-center font-semibold text-txt">{totalQty(o)}</td>

                    {/* السعر */}
                    <td className="px-3 py-3 text-left">
                      <span className="font-bold text-txt">{fmt(o.total)}</span>
                      <span className="text-[11px] text-txt-muted"> د.ع</span>
                    </td>

                    {/* تكلفة التوصيل الفعلية (تعديل inline) */}
                    <td className="px-3 py-3">
                      <DeliveryCostCell
                        order={o}
                        fallback={deliveryFallback(o.governorate)}
                        onCommit={(id, value) => patchMut.mutate({ id, body: { actualDeliveryCost: value } })}
                      />
                    </td>

                    {/* الحالة */}
                    <td className="px-3 py-3">
                      <StatusBadge status={STATUS_BADGE[o.status] ?? "neutral"} label={STATUS_LABEL[o.status] ?? o.status} />
                    </td>

                    {/* إجراءات — تعديل التفاصيل · حذف (تحويل إلى "حذف") */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditTarget(o)}
                          title="تعديل تفاصيل الطلب"
                          aria-label={`تعديل تفاصيل الطلب ${o.orderNo}`}
                          className="flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-primary-light"
                        >
                          <Pencil className="h-[15px] w-[15px]" />
                        </button>
                        {o.status !== "DELETED" && (
                          <button
                            onClick={() => setDeleteTarget(o)}
                            title="حذف الطلب (تحويل إلى «حذف»)"
                            aria-label={`حذف الطلب ${o.orderNo}`}
                            className="flex h-8 w-8 items-center justify-center rounded text-state-danger transition-colors hover:bg-state-danger-light disabled:opacity-50"
                          >
                            <Trash2 className="h-[15px] w-[15px]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!ordersQ.isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={COLSPAN} className="py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-txt-muted">
                      <p className="text-sm">لا توجد طلبات في هذا القسم</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة الإدخال اليدوي */}
      {showManual && (
        <ManualOrderModal
          products={productsQ.data?.data ?? []}
          onClose={() => setShowManual(false)}
          onCreated={() => {
            qc.invalidateQueries({ queryKey: ["orders"] });
            setShowManual(false);
          }}
        />
      )}

      {/* نافذة تعديل تفاصيل الطلب */}
      {editTarget && (
        <EditOrderModal
          order={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["orders"] });
            setEditTarget(null);
          }}
        />
      )}

      {/* نافذة تأكيد الحذف */}
      {deleteTarget && (
        <ConfirmDeleteModal
          order={deleteTarget}
          loading={statusMut.isPending}
          onClose={() => { if (!statusMut.isPending) setDeleteTarget(null); }}
          onConfirm={() =>
            statusMut.mutate(
              { id: deleteTarget.id, status: "DELETED" },
              { onSuccess: () => setDeleteTarget(null) },
            )
          }
        />
      )}
    </div>
  );
}
