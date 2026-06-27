"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, ScanBarcode, ScanLine, Package, AlertTriangle, Globe, Search, Eye, Pencil, Truck, Trash2, Inbox, Check } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import type { Category, Product } from "@/lib/types";
import { ProductForm, type ProductFormValues } from "./ProductForm";
import { Btn, DeleteDialog, PageHeader, StatusBadge } from "@/components/ui";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

function toPayload(v: ProductFormValues) {
  return {
    nameAr: v.nameAr,
    sku: v.sku,
    categoryId: v.categoryId,
    costPrice: Number(v.costPrice),
    salePrice: Number(v.salePrice),
    compareAtPrice:
      v.compareAtPrice === undefined || v.compareAtPrice === null || String(v.compareAtPrice) === ""
        ? null
        : Number(v.compareAtPrice),
    deliveryPrice: Number(v.deliveryPrice) || 0,
    quantity: Number(v.quantity),
    minQuantity: Number(v.minQuantity),
    description: v.description || undefined,
    isOnline: v.isOnline,
    images: v.images,
    videoUrl: v.videoUrl,
    customFields: v.customFields.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      required: c.required,
      options:
        c.type === "select"
          ? (c.optionsText ?? "")
              .split(/[،,]/)
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
    })),
  };
}

/* ─── بطاقة إحصائية صغيرة ─── */
function MiniStat({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number | string;
  color: string;
  icon: ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
      style={{ borderRight: `3px solid ${color}` }}
    >
      <span style={{ color }}>{icon}</span>
      <div>
        <p className="text-[11px] text-txt-muted">{label}</p>
        <p className="text-base font-bold text-txt">{value}</p>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [createSku, setCreateSku] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [purchaseTarget, setPurchaseTarget] = useState<Product | null>(null);
  const [purchaseQty, setPurchaseQty] = useState("10");
  const [purchaseCost, setPurchaseCost] = useState("");

  // قارئ الباركود (ADMIN فقط) — موجود ← إدخال شحنة · جديد ← إضافة منتج
  const [barcode, setBarcode] = useState("");
  const [scanMsg, setScanMsg] = useState<{ text: string; type: "found" | "new" | "error" } | null>(
    null,
  );
  const [scanning, setScanning] = useState(false);
  const barcodeRef = useRef<HTMLInputElement>(null);

  const meQ = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<{ role: "ADMIN" | "CASHIER" }>("/me"),
  });
  const isAdmin = meQ.data?.role === "ADMIN";

  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<{ data: Category[] }>("/categories"),
    enabled: isAdmin,
  });

  const productsQ = useQuery({
    queryKey: ["products", query, lowOnly],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (lowOnly) params.set("lowStock", "true");
      return apiFetch<{ data: Product[] }>(`/products?${params.toString()}`);
    },
  });

  const saveMut = useMutation({
    mutationFn: async (v: ProductFormValues) => {
      const payload = toPayload(v);
      if (editing)
        return apiFetch(`/products/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      return apiFetch("/products", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setShowForm(false);
      setEditing(null);
      setCreateSku("");
      setScanMsg(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setDeleteTarget(null);
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  const purchaseMut = useMutation({
    mutationFn: ({
      productId,
      quantity,
      costPrice,
    }: {
      productId: string;
      quantity: number;
      costPrice: number;
    }) =>
      apiFetch("/stock-movements", {
        method: "POST",
        body: JSON.stringify({
          productId,
          type: "PURCHASE",
          quantity,
          costPrice,
          reason: "إدخال شحنة",
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setPurchaseTarget(null);
      setScanMsg(null);
    },
  });

  const categories = categoriesQ.data?.data ?? [];
  const products = productsQ.data?.data ?? [];

  const lowCount = products.filter((p) => p.quantity <= p.minQuantity).length;
  const onlineCount = products.filter((p) => p.isOnline).length;

  /* ─── قراءة الباركود ───
     بحث دقيق على الـ sku عبر /products?q= (الـ sku فريد) ثم التوجيه:
     • موجود → نافذة إدخال شحنة · جديد → نموذج إضافة منتج بالباركود مُعبّأً. */
  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    const code = barcode.trim();
    if (!code || scanning) return;
    setScanning(true);
    setScanMsg(null);
    try {
      const res = await apiFetch<{ data: Product[] }>(`/products?q=${encodeURIComponent(code)}`);
      const found =
        res.data.find((p) => p.sku === code) ??
        res.data.find((p) => p.sku.toLowerCase() === code.toLowerCase());
      setBarcode("");
      if (found) {
        setScanMsg({ text: `تم العثور على «${found.nameAr}» — إدخال شحنة`, type: "found" });
        setPurchaseTarget(found);
        setPurchaseQty("10");
        setPurchaseCost("");
      } else {
        setScanMsg({ text: `باركود جديد (${code}) — إضافة منتج`, type: "new" });
        setEditing(null);
        setCreateSku(code);
        setShowForm(true);
      }
    } catch (err) {
      console.error("barcode lookup failed:", err);
      setScanMsg({
        text: err instanceof Error ? err.message : "تعذّر قراءة الباركود",
        type: "error",
      });
    } finally {
      setScanning(false);
    }
  }

  /* إعادة التركيز على حقل المسح بعد إغلاق أي نافذة (جاهزية للمسح التالي) */
  useEffect(() => {
    if (isAdmin && !showForm && !purchaseTarget && !deleteTarget) {
      barcodeRef.current?.focus();
    }
  }, [isAdmin, showForm, purchaseTarget, deleteTarget]);

  /* ─── شاشة النموذج ─── */
  if (showForm) {
    return (
      <div>
        {/* شريط التنقل العلوي */}
        <div className="mb-5 flex items-center gap-2">
          <button
            onClick={() => {
              setShowForm(false);
              setEditing(null);
            }}
            className="flex items-center gap-1.5 rounded border border-border bg-surface px-3 py-1.5 text-xs text-txt-secondary transition-colors hover:bg-app-bg hover:text-txt"
          >
            <ArrowRight className="h-3.5 w-3.5" /> المخزون
          </button>
          <span className="text-txt-muted">/</span>
          <span className="text-xs text-txt">
            {editing ? `تعديل: ${editing.nameAr}` : "إضافة منتج جديد"}
          </span>
        </div>
        <ProductForm
          categories={categories}
          initial={editing ?? undefined}
          initialSku={editing ? undefined : createSku}
          onSubmit={async (v) => {
            await saveMut.mutateAsync(v);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="المخزون"
        subtitle="إدارة المنتجات والكميات والأسعار"
        actions={
          isAdmin ? (
            <Btn
              variant="primary"
              onClick={() => {
                setEditing(null);
                setCreateSku("");
                setShowForm(true);
              }}
            >
              + إضافة منتج
            </Btn>
          ) : undefined
        }
      />

      {/* ─── قارئ الباركود (ADMIN فقط) ─── */}
      {isAdmin && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded"
            style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
          >
            <ScanBarcode className="h-5 w-5" />
          </div>
          <div className="shrink-0">
            <p className="text-[13px] font-bold text-txt">قراءة الباركود</p>
            <p className="text-[11px] text-txt-muted">
              امسح المنتج: موجود ← إدخال شحنة · جديد ← إضافة منتج
            </p>
          </div>

          <form onSubmit={handleScan} className="flex min-w-[240px] flex-1 gap-2">
            <div className="relative flex-1">
              <ScanLine className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-muted" />
              <input
                ref={barcodeRef}
                dir="ltr"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                  if (scanMsg) setScanMsg(null);
                }}
                placeholder="امسح أو اكتب الباركود ثم اضغط Enter..."
                className="w-full rounded border border-border bg-surface py-2 pr-9 pl-3 text-left text-sm text-txt outline-none transition-colors focus:border-primary placeholder:text-txt-muted"
                autoFocus
              />
            </div>
            <Btn variant="primary" type="submit" loading={scanning} loadingText="بحث...">
              تحقّق
            </Btn>
          </form>

          {scanMsg && (
            <span
              className={[
                "shrink-0 rounded px-2.5 py-1 text-xs font-medium",
                scanMsg.type === "found"
                  ? "bg-state-success-light text-state-success"
                  : scanMsg.type === "new"
                    ? "bg-primary-light text-primary"
                    : "bg-state-danger-light text-state-danger",
              ].join(" ")}
            >
              {scanMsg.text}
            </span>
          )}
        </div>
      )}

      {/* ─── إحصائيات سريعة ─── */}
      {!productsQ.isLoading && (
        <div className="mb-5 grid grid-cols-3 gap-3">
          <MiniStat label="إجمالي المنتجات" value={products.length} color="#1A5276" icon={<Package className="h-5 w-5" />} />
          <MiniStat label="نواقص المخزون" value={lowCount} color="#B45309" icon={<AlertTriangle className="h-5 w-5" />} />
          <MiniStat label="نشط في المتجر" value={onlineCount} color="#1A7F5A" icon={<Globe className="h-5 w-5" />} />
        </div>
      )}

      {/* ─── شريط البحث والفلترة ─── */}
      <div className="mb-4 flex items-center gap-2">
        {/* حقل البحث */}
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-muted" />
          <input
            className="w-full rounded border border-border bg-surface py-2 pr-9 pl-3 text-sm text-txt outline-none transition-colors focus:border-primary placeholder:text-txt-muted"
            placeholder="بحث بالاسم أو الباركود..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* زر النواقص */}
        <button
          onClick={() => setLowOnly(!lowOnly)}
          className={[
            "flex items-center gap-1.5 rounded border px-3 py-2 text-sm font-medium transition-all duration-150",
            lowOnly
              ? "border-state-warning bg-state-warning-light text-state-warning"
              : "border-border bg-surface text-txt-secondary hover:bg-app-bg",
          ].join(" ")}
        >
          <AlertTriangle className="h-4 w-4" /> النواقص فقط
          {lowCount > 0 && (
            <span
              className="rounded text-[10px] font-bold px-1.5 py-0.5"
              style={{
                background: lowOnly ? "#B45309" : "#FEF3C7",
                color: lowOnly ? "#fff" : "#B45309",
              }}
            >
              {lowCount}
            </span>
          )}
        </button>
      </div>

      {/* ─── الجدول ─── */}
      <div
        className="overflow-hidden rounded-lg border border-border bg-surface"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-app-bg">
              <th className="w-px whitespace-nowrap px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                #
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                المنتج
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                الباركود
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                سعر الشراء
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                سعر البيع
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                التوصيل
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                الكمية
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                المتجر
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-txt-secondary">
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {productsQ.isLoading && (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-txt-muted">
                    <span className="spinner spinner-dark" />
                    جارٍ التحميل...
                  </div>
                </td>
              </tr>
            )}

            {!productsQ.isLoading &&
              products.map((p, index) => {
                const isLow = p.quantity <= p.minQuantity;
                const isDeleting = deletingId === p.id;
                return (
                  <tr
                    key={p.id}
                    className={[
                      "border-b border-border-light transition-colors duration-100 last:border-b-0",
                      isLow ? "bg-state-warning-light/30" : "hover:bg-[#F7F9FC]",
                      isDeleting ? "row-deleting" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-txt-muted">{index + 1}</td>
                    {/* اسم المنتج + الوصف */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* أيقونة المنتج */}
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-sm"
                          style={{ background: "#D6EAF8", color: "#1A5276" }}
                        >
                          {p.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.images[0]}
                              alt=""
                              className="h-full w-full rounded object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-txt">{p.nameAr}</p>
                          {p.description && (
                            <p className="text-[11px] text-txt-muted line-clamp-1">
                              {p.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <code className="rounded bg-app-bg px-1.5 py-0.5 text-xs text-txt-secondary">
                        {p.sku}
                      </code>
                    </td>

                    <td className="px-4 py-3 text-xs text-txt-muted">{fmt(p.costPrice)} د.ع</td>

                    <td className="px-4 py-3 font-semibold text-txt">
                      {fmt(p.salePrice)} د.ع
                    </td>

                    {/* التوصيل — عمود منفصل */}
                    <td className="px-4 py-3">
                      {p.deliveryPrice > 0 ? (
                        <span className="flex items-center gap-1 text-xs text-txt-secondary">
                          <Truck className="h-3.5 w-3.5 text-txt-muted" /> {fmt(p.deliveryPrice)} د.ع
                        </span>
                      ) : (
                        <span className="text-xs text-txt-muted">—</span>
                      )}
                    </td>

                    {/* الكمية */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-bold"
                          style={{ color: isLow ? "#B45309" : "#0D1B2A" }}
                        >
                          {p.quantity}
                        </span>
                        {isLow && <StatusBadge status="warning" label="نقص" />}
                      </div>
                      <p className="text-[10px] text-txt-muted">حد: {p.minQuantity}</p>
                    </td>

                    <td className="px-4 py-3">
                      {p.isOnline ? (
                        <StatusBadge status="success" label="نشط" />
                      ) : (
                        <StatusBadge status="neutral" label="مخفي" />
                      )}
                    </td>

                    {/* الإجراءات */}
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {p.isOnline ? (
                            <a
                              href={`/landing/${p.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="معاينة صفحة الهبوط"
                              aria-label="معاينة صفحة الهبوط"
                              className="flex h-8 w-8 items-center justify-center rounded text-txt-secondary transition-colors hover:bg-app-bg hover:text-primary"
                            >
                              <Eye className="h-[15px] w-[15px]" />
                            </a>
                          ) : (
                            <span
                              title="انشر المنتج في المتجر لتظهر صفحة الهبوط"
                              aria-label="صفحة الهبوط غير متاحة — المنتج غير منشور"
                              className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded text-txt-muted opacity-40"
                            >
                              <Eye className="h-[15px] w-[15px]" />
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setEditing(p);
                              setShowForm(true);
                            }}
                            title="تعديل"
                            aria-label="تعديل"
                            className="flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-primary-light"
                          >
                            <Pencil className="h-[15px] w-[15px]" />
                          </button>
                          <button
                            onClick={() => {
                              setPurchaseTarget(p);
                              setPurchaseQty("10");
                              setPurchaseCost("");
                            }}
                            title="إضافة شحنة"
                            aria-label="إضافة شحنة"
                            className="flex h-8 w-8 items-center justify-center rounded text-state-success transition-colors hover:bg-state-success-light"
                          >
                            <Truck className="h-[15px] w-[15px]" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            title="حذف"
                            aria-label="حذف"
                            className="flex h-8 w-8 items-center justify-center rounded text-state-danger transition-colors hover:bg-state-danger-light"
                          >
                            <Trash2 className="h-[15px] w-[15px]" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

            {!productsQ.isLoading && products.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-9 w-9 text-txt-muted" strokeWidth={1.5} />
                    <p className="text-sm text-txt-muted">
                      {query ? `لا توجد نتائج لـ "${query}"` : "لا توجد منتجات"}
                    </p>
                    {isAdmin && !query && (
                      <Btn
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setEditing(null);
                          setCreateSku("");
                          setShowForm(true);
                        }}
                      >
                        أضف أول منتج
                      </Btn>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── DeleteDialog ─── */}
      <DeleteDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.nameAr ?? ""}
        loading={deleteMut.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          setDeletingId(deleteTarget.id);
          deleteMut.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ─── Modal الشراء ─── */}
      {purchaseTarget && (
        <div
          className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(13,27,42,0.55)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPurchaseTarget(null);
          }}
        >
          <div
            className="w-[380px] overflow-hidden rounded-lg bg-surface"
            style={{ boxShadow: "var(--shadow-lg)" }}
          >
            {/* رأس الـ modal */}
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-sm font-bold text-txt">إضافة شحنة للمخزون</h3>
            </div>

            <div className="p-6">
              {/* معلومات المنتج */}
              <div className="mb-5 flex items-center gap-3 rounded border border-border-light bg-app-bg px-4 py-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded"
                  style={{ background: "#D6EAF8", color: "#1A5276" }}
                >
                  <Package className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-txt">{purchaseTarget.nameAr}</p>
                  <p className="text-xs text-txt-muted">
                    الكمية الحالية: {purchaseTarget.quantity}
                  </p>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-txt-secondary">الكمية المضافة</label>
                  <input
                    type="number"
                    min={1}
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(e.target.value)}
                    className="rounded border border-border px-3 py-2.5 text-sm text-txt outline-none focus:border-primary"
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-txt-secondary">
                    سعر شراء الوحدة *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(e.target.value)}
                    placeholder="تكلفة هذه الشحنة"
                    className="rounded border border-border px-3 py-2.5 text-sm text-txt outline-none focus:border-primary placeholder:text-txt-muted"
                  />
                </div>
              </div>

              {Number(purchaseQty) > 0 && (
                <p className="mb-2 inline-flex flex-wrap items-center gap-x-1 text-xs text-state-success">
                  <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} /> الكمية بعد الإضافة: {purchaseTarget.quantity + Number(purchaseQty)}
                  {Number(purchaseCost) > 0 && (
                    <> · تكلفة الشحنة: {fmt(Number(purchaseCost) * Number(purchaseQty))} د.ع</>
                  )}
                </p>
              )}
              {Number(purchaseCost) > 0 && purchaseTarget.salePrice > 0 && (
                <p className="mb-4 text-xs text-txt-muted">
                  هامش الربح للوحدة:{" "}
                  {Math.round(
                    ((purchaseTarget.salePrice - Number(purchaseCost)) / purchaseTarget.salePrice) *
                      100,
                  )}
                  %
                  {Number(purchaseCost) > purchaseTarget.salePrice && (
                    <span className="inline-flex items-center gap-1 text-state-danger"><AlertTriangle className="h-3.5 w-3.5" /> التكلفة أعلى من سعر البيع</span>
                  )}
                </p>
              )}

              <div className="flex gap-2">
                <Btn variant="secondary" fullWidth onClick={() => setPurchaseTarget(null)}>
                  إلغاء
                </Btn>
                <Btn
                  variant="success"
                  fullWidth
                  loading={purchaseMut.isPending}
                  loadingText="جارٍ الإضافة..."
                  onClick={() =>
                    purchaseMut.mutate({
                      productId: purchaseTarget.id,
                      quantity: Number(purchaseQty),
                      costPrice: Number(purchaseCost),
                    })
                  }
                  disabled={
                    Number(purchaseQty) <= 0 ||
                    purchaseCost.trim() === "" ||
                    Number(purchaseCost) < 0
                  }
                >
                  إضافة للمخزون
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
