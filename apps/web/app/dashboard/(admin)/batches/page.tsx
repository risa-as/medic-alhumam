"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Truck,
  X,
  Check,
  AlertTriangle,
  Pencil,
  Package,
  CheckCircle2,
  Hash,
  Banknote,
  Search,
  Trash2,
  Inbox,
} from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { Btn, DeleteDialog, PageHeader, StatCard, StatusBadge } from "@/components/ui";

const fmt = (n: number) => n.toLocaleString("ar-IQ");
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("ar-IQ");
const toIso = (d: string) => (d ? new Date(`${d}T00:00:00.000Z`).toISOString() : undefined);
const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

interface Batch {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  costPrice: number;
  quantity: number;
  remaining: number;
  consumed: number;
  stockValue: number;
  expiryDate: string | null;
  receivedAt: string;
  reason: string | null;
}

interface BatchStats {
  totalBatches: number;
  activeBatches: number;
  unitsInStock: number;
  stockValue: number;
}

interface ProductLite {
  id: string;
  nameAr: string;
  sku: string;
  salePrice: number;
}

type StatusFilter = "all" | "active" | "depleted";

/** معلومات حالة الصلاحية للعرض. */
function expiryInfo(iso: string | null) {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  return { days, expired: days < 0, soon: days >= 0 && days <= 30 };
}

/* ════════════════ نافذة إضافة دفعة ════════════════ */
function AddBatchModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [costPrice, setCostPrice] = useState("");
  const [expiry, setExpiry] = useState("");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const productsQ = useQuery({
    queryKey: ["products", "all-for-batch"],
    queryFn: () => apiFetch<{ data: ProductLite[] }>("/products"),
  });
  const products = productsQ.data?.data ?? [];
  const selected = products.find((p) => p.id === productId);

  const qtyN = Number(quantity);
  const costN = Number(costPrice);
  const margin =
    selected && selected.salePrice > 0 && costN > 0
      ? Math.round(((selected.salePrice - costN) / selected.salePrice) * 100)
      : null;

  async function submit() {
    if (!productId) {
      setErr("اختر المنتج");
      return;
    }
    if (!(qtyN > 0)) {
      setErr("الكمية يجب أن تكون أكبر من صفر");
      return;
    }
    if (costPrice.trim() === "" || !(costN >= 0)) {
      setErr("سعر الشراء مطلوب");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      await apiFetch("/stock-movements", {
        method: "POST",
        body: JSON.stringify({
          productId,
          type: "PURCHASE",
          quantity: qtyN,
          costPrice: costN,
          expiryDate: toIso(expiry),
          reason: reason.trim() || "إدخال دفعة",
        }),
      });
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر إضافة الدفعة");
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="modal-box w-[480px] max-w-[calc(100vw-32px)] rounded-lg bg-surface p-7 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-base font-bold text-txt">
            <Truck className="h-[18px] w-[18px] text-primary" /> إضافة دفعة مخزون
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-txt-secondary">المنتج *</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="rounded border border-border bg-surface px-3 py-2.5 text-sm text-txt outline-none focus:border-primary"
            >
              <option value="">— اختر المنتج —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameAr} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-txt-secondary">الكمية *</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="rounded border border-border px-3 py-2.5 text-sm text-txt outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-txt-secondary">سعر شراء الوحدة *</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="تكلفة الدفعة"
                className="rounded border border-border px-3 py-2.5 text-sm text-txt outline-none focus:border-primary placeholder:text-txt-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-txt-secondary">
                تاريخ الصلاحية (اختياري)
              </label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="rounded border border-border px-3 py-2.5 text-sm text-txt outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-txt-secondary">ملاحظة (اختياري)</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="رقم الفاتورة، المورّد..."
                className="rounded border border-border px-3 py-2.5 text-sm text-txt outline-none focus:border-primary placeholder:text-txt-muted"
              />
            </div>
          </div>

          {qtyN > 0 && costN > 0 && (
            <p className="inline-flex flex-wrap items-center gap-x-1 text-xs text-state-success">
              <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} /> إجمالي تكلفة الدفعة:{" "}
              {fmt(qtyN * costN)} د.ع
              {margin !== null && <span className="text-txt-muted"> · هامش الوحدة: {margin}%</span>}
              {selected && costN > selected.salePrice && (
                <span className="inline-flex items-center gap-1 text-state-danger">
                  <AlertTriangle className="h-3.5 w-3.5" /> التكلفة أعلى من سعر البيع
                </span>
              )}
            </p>
          )}

          {err && (
            <div className="rounded border border-state-danger-light bg-state-danger-light px-3 py-2 text-xs text-state-danger">
              {err}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Btn variant="secondary" fullWidth type="button" onClick={onClose} disabled={loading}>
              إلغاء
            </Btn>
            <Btn
              variant="success"
              fullWidth
              type="button"
              loading={loading}
              loadingText="جارٍ الإضافة..."
              onClick={submit}
            >
              إضافة الدفعة
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ نافذة تعديل دفعة ════════════════ */
function EditBatchModal({
  batch,
  onClose,
  onDone,
}: {
  batch: Batch;
  onClose: () => void;
  onDone: () => void;
}) {
  const [costPrice, setCostPrice] = useState(String(batch.costPrice));
  const [expiry, setExpiry] = useState(toDateInput(batch.expiryDate));
  const [reason, setReason] = useState(batch.reason ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    const costN = Number(costPrice);
    if (costPrice.trim() === "" || !(costN >= 0)) {
      setErr("سعر الشراء مطلوب");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      await apiFetch(`/batches/${batch.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          costPrice: costN,
          expiryDate: expiry ? toIso(expiry) : null,
          reason: reason.trim() || null,
        }),
      });
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر حفظ التعديل");
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="modal-box w-[440px] max-w-[calc(100vw-32px)] rounded-lg bg-surface p-7 shadow-lg">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-base font-bold text-txt">
            <Pencil className="h-4 w-4 text-primary" /> تعديل الدفعة
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-xs text-txt-muted">
          {batch.productName} · متبقّي {batch.remaining} من {batch.quantity}
        </p>

        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-txt-secondary">سعر شراء الوحدة *</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="rounded border border-border px-3 py-2.5 text-sm text-txt outline-none focus:border-primary"
            />
            <p className="text-[11px] text-txt-muted">
              يؤثّر على تكلفة ما يُباع لاحقًا من هذه الدفعة فقط — لا يغيّر الفواتير السابقة.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-txt-secondary">
              تاريخ الصلاحية (اختياري)
            </label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="rounded border border-border px-3 py-2.5 text-sm text-txt outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-txt-secondary">ملاحظة</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded border border-border px-3 py-2.5 text-sm text-txt outline-none focus:border-primary"
            />
          </div>

          {err && (
            <div className="rounded border border-state-danger-light bg-state-danger-light px-3 py-2 text-xs text-state-danger">
              {err}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Btn variant="secondary" fullWidth type="button" onClick={onClose} disabled={loading}>
              إلغاء
            </Btn>
            <Btn
              variant="primary"
              fullWidth
              type="button"
              loading={loading}
              loadingText="جارٍ الحفظ..."
              onClick={submit}
            >
              حفظ التعديلات
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ الصفحة ════════════════ */
export default function BatchesPage() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("active");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Batch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Batch | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const batchesQ = useQuery({
    queryKey: ["batches", query, status],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (status !== "all") params.set("status", status);
      return apiFetch<{ data: Batch[]; stats: BatchStats }>(`/batches?${params.toString()}`);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/batches/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["batches"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setDeleteTarget(null);
      setDeletingId(null);
    },
    onError: (e) => {
      setDeletingId(null);
      setDeleteTarget(null);
      setBanner(e instanceof Error ? e.message : "تعذّر حذف الدفعة");
    },
  });

  const batches = batchesQ.data?.data ?? [];
  const stats = batchesQ.data?.stats;

  function refresh() {
    qc.invalidateQueries({ queryKey: ["batches"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <div>
      <PageHeader
        title="دفعات المخزون"
        subtitle="الشحنات المُدخلة وتكلفتها وأساس حساب الربح (FEFO)"
        actions={
          <Btn
            variant="primary"
            onClick={() => {
              setBanner(null);
              setShowAdd(true);
            }}
          >
            + إضافة دفعة
          </Btn>
        }
      />

      {/* إحصائيات */}
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="إجمالي الدفعات"
          value={stats ? fmt(stats.totalBatches) : "—"}
          accentColor="#1D4ED8"
          icon={<Package className="h-[18px] w-[18px]" />}
        />
        <StatCard
          label="الدفعات النشطة"
          value={stats ? fmt(stats.activeBatches) : "—"}
          accentColor="#1A7F5A"
          icon={<CheckCircle2 className="h-[18px] w-[18px]" />}
          sub="بها رصيد متبقٍّ"
        />
        <StatCard
          label="وحدات في المخزون"
          value={stats ? fmt(stats.unitsInStock) : "—"}
          accentColor="#B45309"
          icon={<Hash className="h-[18px] w-[18px]" />}
        />
        <StatCard
          label="قيمة المخزون بالتكلفة"
          value={stats ? `${fmt(Math.round(stats.stockValue))} د.ع` : "—"}
          accentColor="#7C3AED"
          icon={<Banknote className="h-[18px] w-[18px]" />}
        />
      </div>

      {banner && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded border border-state-warning-light bg-state-warning-light px-4 py-3 text-sm text-state-warning">
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {banner}
          </span>
          <button
            onClick={() => setBanner(null)}
            className="shrink-0 text-state-warning hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* بحث + فلتر الحالة */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-muted" />
          <input
            className="w-full rounded border border-border bg-surface py-2 pr-9 pl-3 text-sm text-txt outline-none transition-colors focus:border-primary placeholder:text-txt-muted"
            placeholder="بحث باسم المنتج أو الرمز..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {(
            [
              ["active", "النشطة"],
              ["depleted", "المنتهية"],
              ["all", "الكل"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setStatus(val)}
              className={[
                "rounded border px-3 py-2 text-sm font-medium transition-all",
                status === val
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-txt-secondary hover:bg-app-bg",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* الجدول */}
      <div
        className="overflow-x-auto rounded-lg border border-border bg-surface"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <table className="w-full border-collapse whitespace-nowrap text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-app-bg">
              <th className="w-px whitespace-nowrap px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                #
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                المنتج
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                سعر الشراء
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                الكمية / المتبقّي
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                قيمة المتبقّي
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                تاريخ الاستلام
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {batchesQ.isLoading && (
              <tr>
                <td colSpan={8} className="py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-txt-muted">
                    <span className="spinner spinner-dark" /> جارٍ التحميل...
                  </div>
                </td>
              </tr>
            )}

            {!batchesQ.isLoading &&
              batches.map((b, index) => {
                const exp = expiryInfo(b.expiryDate);
                const isDeleting = deletingId === b.id;
                const consumedPct =
                  b.quantity > 0 ? Math.round((b.consumed / b.quantity) * 100) : 0;
                return (
                  <tr
                    key={b.id}
                    className={[
                      "border-b border-border-light transition-colors last:border-b-0 hover:bg-[#F7F9FC]",
                      isDeleting ? "row-deleting" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-txt-muted">
                      {index + 1}
                    </td>
                    {/* المنتج */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-txt">{b.productName}</p>
                      <code className="text-[11px] text-txt-muted">{b.productSku}</code>
                    </td>
                    {/* سعر الشراء */}
                    <td className="px-4 py-3 text-txt-secondary">{fmt(b.costPrice)} د.ع</td>
                    {/* الكمية/المتبقّي */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-txt">{b.remaining}</span>
                        <span className="text-[11px] text-txt-muted">من {b.quantity}</span>
                        {b.remaining === 0 ? (
                          <StatusBadge status="neutral" label="منتهية" />
                        ) : (
                          b.consumed > 0 && (
                            <StatusBadge status="info" label={`بيع ${consumedPct}%`} />
                          )
                        )}
                      </div>
                    </td>
                    {/* قيمة المتبقّي */}
                    <td className="px-4 py-3 font-semibold text-txt">
                      {fmt(Math.round(b.stockValue))} د.ع
                    </td>
                    {/* تاريخ الاستلام */}
                    <td className="px-4 py-3 text-txt-muted">{fmtDate(b.receivedAt)}</td>
                    {/* إجراءات */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditing(b)}
                          title="تعديل"
                          aria-label="تعديل"
                          className="flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-primary-light"
                        >
                          <Pencil className="h-[15px] w-[15px]" />
                        </button>
                        <button
                          onClick={() => {
                            setBanner(null);
                            if (b.remaining !== b.quantity) {
                              setBanner(
                                `لا يمكن حذف دفعة «${b.productName}» لأنه استُهلك منها كمية (مرتبطة بمبيعات). يمكنك تصحيحها فقط.`,
                              );
                              return;
                            }
                            setDeleteTarget(b);
                          }}
                          title={b.remaining === b.quantity ? "حذف" : "غير قابلة للحذف (مستهلَكة)"}
                          aria-label="حذف"
                          className={[
                            "flex h-8 w-8 items-center justify-center rounded text-[15px] transition-colors",
                            b.remaining === b.quantity
                              ? "text-state-danger hover:bg-state-danger-light"
                              : "cursor-not-allowed text-txt-muted opacity-40",
                          ].join(" ")}
                        >
                          <Trash2 className="h-[15px] w-[15px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

            {!batchesQ.isLoading && batches.length === 0 && (
              <tr>
                <td colSpan={8} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-9 w-9 text-txt-muted" strokeWidth={1.5} />
                    <p className="text-sm text-txt-muted">
                      {query ? `لا توجد نتائج لـ "${query}"` : "لا توجد دفعات"}
                    </p>
                    <Btn variant="primary" size="sm" onClick={() => setShowAdd(true)}>
                      + إضافة دفعة
                    </Btn>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddBatchModal
          onClose={() => setShowAdd(false)}
          onDone={() => {
            refresh();
            setShowAdd(false);
          }}
        />
      )}
      {editing && (
        <EditBatchModal
          batch={editing}
          onClose={() => setEditing(null)}
          onDone={() => {
            refresh();
            setEditing(null);
          }}
        />
      )}

      <DeleteDialog
        open={!!deleteTarget}
        itemName={
          deleteTarget ? `دفعة ${deleteTarget.productName} (${deleteTarget.quantity} وحدة)` : ""
        }
        loading={deleteMut.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          setDeletingId(deleteTarget.id);
          deleteMut.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
