"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRef, useState, type ReactNode } from "react";
import { Loader2, FileText, Image as ImageIcon, Settings, Wallet, Package, Globe, Camera, Clapperboard, X, AlertTriangle } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing-client";
import { Btn, InputField, SelectField, TextareaField } from "@/components/ui";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

export interface ProductFormValues {
  nameAr: string;
  sku: string;
  categoryId: string;
  costPrice: number;
  salePrice: number;
  compareAtPrice?: number | null;
  deliveryPrice: number;
  quantity: number;
  minQuantity: number;
  description?: string;
  isOnline: boolean;
  images: string[];
  videoUrl?: string;
  customFields: {
    id: string;
    name: string;
    type: "select" | "text";
    optionsText?: string;
    required: boolean;
  }[];
}

/* ─── زر رفع مخصّص ─── */
function UploadTrigger({
  endpoint,
  accept,
  multiple,
  icon,
  label,
  hint,
  onUploaded,
  onError,
}: {
  endpoint: "productImage" | "productVideo";
  accept: string;
  multiple?: boolean;
  icon: ReactNode;
  label: string;
  hint: string;
  onUploaded: (urls: string[]) => void;
  onError: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);

  const { startUpload } = useUploadThing(endpoint, {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      onUploaded(res.map((r) => r.serverData.url));
      setUploading(false);
      setProgress(0);
    },
    onUploadError: (e) => {
      onError(e.message);
      setUploading(false);
      setProgress(0);
    },
  });

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setProgress(0);
    await startUpload(files);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
        disabled={uploading}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={[
          "flex w-full flex-col items-center justify-center gap-2 rounded border-2 border-dashed",
          "py-5 px-4 transition-all duration-150 text-center",
          uploading
            ? "cursor-wait border-primary bg-primary-light opacity-80"
            : "cursor-pointer border-border hover:border-primary hover:bg-primary-light/40",
        ].join(" ")}
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div className="w-full max-w-[120px]">
              <div className="mb-1 flex justify-between text-[10px] text-primary">
                <span>جارٍ الرفع...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-primary-light">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="text-primary">{icon}</span>
            <div>
              <p className="text-xs font-semibold text-primary">{label}</p>
              <p className="text-[10px] text-txt-muted">{hint}</p>
            </div>
          </>
        )}
      </button>
    </div>
  );
}

function FormSection({
  icon, title, children,
}: { icon: ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-surface"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-center gap-2.5 border-b border-border-light bg-app-bg px-5 py-3">
        <span className="text-primary">{icon}</span>
        <p className="text-xs font-semibold text-txt-secondary">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function ProductForm({
  categories,
  initial,
  initialSku,
  onSubmit,
  onCancel,
}: {
  categories: Category[];
  initial?: Product;
  /** باركود مُعبّأ مسبقًا عند إنشاء منتج جديد من قارئ الباركود */
  initialSku?: string;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [images, setImages]       = useState<string[]>(initial?.images ?? []);
  const [videoUrl, setVideoUrl]   = useState<string | undefined>(initial?.videoUrl ?? undefined);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const { register, control, handleSubmit, watch, formState } = useForm<ProductFormValues>({
    defaultValues: initial
      ? {
          nameAr:       initial.nameAr,
          sku:          initial.sku,
          categoryId:   initial.categoryId,
          costPrice:    initial.costPrice,
          salePrice:    initial.salePrice,
          compareAtPrice: initial.compareAtPrice ?? undefined,
          deliveryPrice: initial.deliveryPrice ?? 0,
          quantity:     initial.quantity,
          minQuantity:  initial.minQuantity,
          description:  initial.description ?? "",
          isOnline:     initial.isOnline,
          images:       initial.images,
          videoUrl:     initial.videoUrl ?? undefined,
          customFields: initial.customFields.map((c) => ({
            id: c.id, name: c.name, type: c.type,
            optionsText: (c.options ?? []).join("، "),
            required: c.required,
          })),
        }
      : {
          nameAr: "", sku: initialSku ?? "", categoryId: categories[0]?.id ?? "",
          costPrice: 0, salePrice: 0, compareAtPrice: undefined, deliveryPrice: 0, quantity: 0, minQuantity: 0,
          description: "", isOnline: false, images: [], customFields: [],
        },
  });

  const fields = useFieldArray({ control, name: "customFields" });

  const costPrice  = watch("costPrice");
  const salePrice  = watch("salePrice");
  const compareAtPrice = watch("compareAtPrice");
  const margin     = salePrice > 0 && costPrice > 0
    ? Math.round(((salePrice - costPrice) / salePrice) * 100)
    : null;

  async function submit(values: ProductFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ ...values, images, videoUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر الحفظ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      {/* ─── عنوان الصفحة ─── */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-txt">
            {initial ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h2>
          <p className="text-xs text-txt-muted">
            {initial ? `تعديل بيانات: ${initial.nameAr}` : "أدخل بيانات المنتج الجديد"}
          </p>
        </div>
      </div>

      {/* ─── تخطيط عمودين ─── */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

        {/* ═══ العمود الرئيسي (يمين — أوسع) ═══ */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* البيانات الأساسية */}
          <FormSection icon={<FileText className="h-[18px] w-[18px]" />} title="البيانات الأساسية">
            <div className="space-y-4">
              <InputField
                label="اسم المنتج"
                required
                placeholder="مثال: باراسيتامول 500mg"
                error={formState.errors.nameAr?.message}
                {...register("nameAr", { required: "الاسم مطلوب" })}
              />
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="الرمز / الباركود"
                  required
                  placeholder="مثال: MED-001"
                  error={formState.errors.sku?.message}
                  {...register("sku", { required: "الرمز مطلوب" })}
                />
                <SelectField label="الفئة" required {...register("categoryId", { required: true })}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameAr}</option>
                  ))}
                </SelectField>
              </div>
              <TextareaField
                label="الوصف"
                rows={2}
                placeholder="وصف مختصر للمنتج (اختياري)"
                {...register("description")}
              />
            </div>
          </FormSection>

          {/* الوسائط */}
          <FormSection icon={<ImageIcon className="h-[18px] w-[18px]" />} title="الصور والوسائط">
            {/* معاينة الصور المرفوعة */}
            {(images.length > 0 || videoUrl) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {images.map((u, i) => (
                  <div
                    key={u}
                    className="group relative overflow-hidden rounded border border-border"
                    style={{ width: 64, height: 64 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((x) => x !== u))}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 text-lg"
                    >
                      ×
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 right-0 left-0 bg-primary/80 py-0.5 text-center text-[9px] text-white">
                        رئيسية
                      </span>
                    )}
                  </div>
                ))}
                {videoUrl && (
                  <div
                    className="group relative flex items-center justify-center overflow-hidden rounded border border-border bg-app-bg"
                    style={{ width: 64, height: 64 }}
                  >
                    <Clapperboard className="h-6 w-6 text-txt-muted" />
                    <button
                      type="button"
                      onClick={() => setVideoUrl(undefined)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {(images.length === 0 && !videoUrl) && (
              <div className="mb-4 flex items-center justify-center rounded border border-dashed border-border bg-app-bg py-6">
                <p className="text-xs text-txt-muted">لم يتم رفع وسائط بعد</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <UploadTrigger
                endpoint="productImage"
                accept="image/*"
                multiple
                icon={<Camera className="h-6 w-6" />}
                label="رفع صور المنتج"
                hint="JPG، PNG، WEBP — حتى 8MB لكل صورة، بحد أقصى 5"
                onUploaded={(urls) => setImages((prev) => [...prev, ...urls])}
                onError={(msg) => setError(msg)}
              />
              <UploadTrigger
                endpoint="productVideo"
                accept="video/*"
                icon={<Clapperboard className="h-6 w-6" />}
                label="رفع فيديو المنتج"
                hint="MP4، MOV — حتى 64MB، فيديو واحد فقط"
                onUploaded={(urls) => setVideoUrl(urls[0])}
                onError={(msg) => setError(msg)}
              />
            </div>
          </FormSection>

          {/* الحقول المخصّصة */}
          <FormSection icon={<Settings className="h-[18px] w-[18px]" />} title="الحقول المخصّصة">
            <div className="space-y-2">
              {fields.fields.map((f, idx) => (
                <div
                  key={f.id}
                  className="grid grid-cols-12 items-center gap-2 rounded border border-border-light bg-app-bg p-2"
                >
                  <input
                    placeholder="اسم الحقل (مثل: اللون)"
                    className="col-span-3 rounded border border-border bg-surface px-2 py-1.5 text-xs text-txt outline-none focus:border-primary"
                    {...register(`customFields.${idx}.name`, { required: true })}
                  />
                  <select
                    className="col-span-2 rounded border border-border bg-surface px-2 py-1.5 text-xs text-txt outline-none focus:border-primary"
                    {...register(`customFields.${idx}.type`)}
                  >
                    <option value="select">قائمة</option>
                    <option value="text">نص حر</option>
                  </select>
                  <input
                    placeholder="أحمر، أزرق، أخضر..."
                    className="col-span-5 rounded border border-border bg-surface px-2 py-1.5 text-xs text-txt outline-none focus:border-primary"
                    {...register(`customFields.${idx}.optionsText`)}
                  />
                  <label className="col-span-1 flex items-center gap-1 text-xs text-txt-secondary">
                    <input type="checkbox" className="accent-primary" {...register(`customFields.${idx}.required`)} />
                    إلزامي
                  </label>
                  <button
                    type="button"
                    onClick={() => fields.remove(idx)}
                    className="col-span-1 flex h-6 w-6 items-center justify-center rounded text-state-danger transition-colors hover:bg-state-danger-light text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

              {fields.fields.length === 0 && (
                <div className="flex items-center justify-center rounded border border-dashed border-border py-5">
                  <p className="text-xs text-txt-muted">لا توجد حقول مخصّصة</p>
                </div>
              )}
            </div>
            <div className="mt-3">
              <Btn
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  fields.append({
                    id: crypto.randomUUID(),
                    name: "",
                    type: "select",
                    optionsText: "",
                    required: false,
                  })
                }
              >
                + إضافة حقل
              </Btn>
            </div>
          </FormSection>
        </div>

        {/* ═══ العمود الجانبي (يسار — أضيق) ═══ */}
        <div className="w-full shrink-0 space-y-4 lg:w-64">

          {/* الأسعار */}
          <FormSection icon={<Wallet className="h-[18px] w-[18px]" />} title="التسعير">
            <div className="space-y-3">
              <InputField
                label="سعر الشراء (د.ع)"
                type="number"
                min={0}
                {...register("costPrice", { valueAsNumber: true })}
              />
              <InputField
                label="سعر البيع (د.ع)"
                type="number"
                min={0}
                required
                {...register("salePrice", { valueAsNumber: true })}
              />
              <InputField
                label="السعر قبل الخصم (د.ع)"
                type="number"
                min={0}
                placeholder="اتركه فارغًا إن لا يوجد خصم"
                {...register("compareAtPrice", { setValueAs: (v) => (v === "" || v == null ? null : Number(v)) })}
              />
              <InputField
                label="سعر التوصيل (د.ع)"
                type="number"
                min={0}
                placeholder="يظهر للزبون بجانب سعر المنتج"
                {...register("deliveryPrice", { valueAsNumber: true })}
              />
              {/* شارة الخصم — تظهر في المتجر عند تجاوز السعر القديم سعر البيع */}
              {typeof compareAtPrice === "number" && compareAtPrice > salePrice && salePrice > 0 && (
                <div
                  className="flex items-center justify-between rounded px-3 py-2 text-xs"
                  style={{ background: "#FFE4E6", color: "#E11D48" }}
                >
                  <span>نسبة الخصم في المتجر</span>
                  <span className="font-bold">
                    -{Math.round(((compareAtPrice - salePrice) / compareAtPrice) * 100)}%
                  </span>
                </div>
              )}
              {/* هامش الربح */}
              {margin !== null && (
                <div
                  className="flex items-center justify-between rounded px-3 py-2 text-xs"
                  style={{
                    background: margin >= 20 ? "#D1FAE5" : margin >= 10 ? "#FEF3C7" : "#FEE2E2",
                    color: margin >= 20 ? "#1A7F5A" : margin >= 10 ? "#B45309" : "#B91C1C",
                  }}
                >
                  <span>هامش الربح</span>
                  <span className="font-bold">{margin}%</span>
                </div>
              )}
            </div>
          </FormSection>

          {/* المخزون */}
          <FormSection icon={<Package className="h-[18px] w-[18px]" />} title="المخزون">
            <div className="space-y-3">
              <InputField
                label="الكمية الحالية"
                type="number"
                min={0}
                {...register("quantity", { valueAsNumber: true })}
              />
              <InputField
                label="حد التنبيه"
                type="number"
                min={0}
                {...register("minQuantity", { valueAsNumber: true })}
              />
            </div>
          </FormSection>

          {/* الحالة */}
          <FormSection icon={<Globe className="h-[18px] w-[18px]" />} title="المتجر الإلكتروني">
            <label className="flex cursor-pointer items-start gap-3">
              <div className="relative mt-0.5">
                <input
                  id="isOnline"
                  type="checkbox"
                  {...register("isOnline")}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full border border-border bg-app-bg transition-colors peer-checked:border-primary peer-checked:bg-primary" />
                <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-txt-muted shadow transition-all peer-checked:right-auto peer-checked:left-0.5 peer-checked:bg-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-txt">عرض في المتجر</p>
                <p className="text-[11px] text-txt-muted">يظهر للزبائن عبر الإنترنت</p>
              </div>
            </label>
          </FormSection>

          {/* معاينة سريعة */}
          {watch("nameAr") && (
            <div className="rounded-lg border border-primary-light bg-primary-light p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-primary">
                معاينة البطاقة
              </p>
              <p className="text-sm font-bold text-txt">{watch("nameAr")}</p>
              {watch("sku") && (
                <code className="text-[11px] text-txt-muted">{watch("sku")}</code>
              )}
              {watch("salePrice") > 0 && (
                <p className="mt-1.5 text-base font-bold text-primary">
                  {fmt(watch("salePrice"))} د.ع
                  {watch("deliveryPrice") > 0 && (
                    <span className="text-xs font-semibold text-txt-muted"> + {fmt(watch("deliveryPrice"))} توصيل</span>
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── شريط الإجراءات السفلي ─── */}
      <div
        className="mt-6 flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div>
          {error && (
            <p className="flex items-center gap-1.5 text-xs text-state-danger">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Btn type="button" variant="secondary" onClick={onCancel}>
            إلغاء
          </Btn>
          <Btn
            type="submit"
            variant="primary"
            loading={submitting || formState.isSubmitting}
            loadingText="جارٍ الحفظ..."
          >
            {initial ? "حفظ التعديلات" : "إضافة المنتج"}
          </Btn>
        </div>
      </div>
    </form>
  );
}
