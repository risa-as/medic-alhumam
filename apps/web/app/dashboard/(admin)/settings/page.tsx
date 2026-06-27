"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2, Upload, Store, Image as ImageIcon, Stethoscope, Info, Trash2, AlertTriangle, Check, Truck } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { Btn, InputField, SelectField, PageHeader } from "@/components/ui";

interface Setting {
  id: string;
  storeName: string;
  logoUrl: string | null;
  currency: string;
  printerConfig: Record<string, unknown>;
  deliveryCostBaghdad: number;
  deliveryCostOther: number;
  updatedAt: string;
}

interface SettingForm {
  storeName: string;
  currency: string;
  logoUrl: string;
  deliveryCostBaghdad: number;
  deliveryCostOther: number;
}

const CURRENCIES = [
  { value: "IQD", label: "دينار عراقي", symbol: "د.ع" },
  { value: "USD", label: "دولار أمريكي", symbol: "$" },
  { value: "EUR", label: "يورو", symbol: "€" },
];

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-surface"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-center gap-3 border-b border-border-light px-5 py-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded text-base"
          style={{ background: "#D6EAF8", color: "#1A5276" }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-txt">{title}</p>
          {subtitle && <p className="text-xs text-txt-muted">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ─── أداة رفع الشعار عبر UploadThing ─── */
function LogoUploader({
  onUploaded,
  onError,
}: {
  onUploaded: (url: string) => void;
  onError: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // يرفع عبر /api/uploads (UTApi خادم-جانبي بجلسة الكوكي) — نفس المسار الموثوق للديسكتوب،
  // تفاديًا لمفاوضة الحجم في تدفّق /api/uploadthing التي كانت تُسبّب FileSizeMismatch.
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { onError("الملف المختار ليس صورة صالحة"); return; }
    if (file.size > 8 * 1024 * 1024) { onError("حجم الصورة يتجاوز 8MB"); return; }
    onError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("kind", "image");
      fd.append("files", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd, credentials: "include" });
      const json = (await res.json().catch(() => null)) as { urls?: string[]; error?: { message?: string } } | null;
      if (!res.ok) throw new Error(json?.error?.message ?? "تعذّر رفع الشعار");
      const url = json?.urls?.[0];
      if (!url) throw new Error("لم يصل رابط الصورة من الخادم");
      onUploaded(url);
    } catch (err) {
      onError(err instanceof Error ? err.message : "تعذّر رفع الشعار");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
        disabled={uploading}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={[
          "flex w-full flex-col items-center justify-center gap-1.5 rounded border-2 border-dashed",
          "px-4 py-4 text-center transition-all duration-150",
          uploading
            ? "cursor-wait border-primary bg-primary-light opacity-80"
            : "cursor-pointer border-border hover:border-primary hover:bg-primary-light/40",
        ].join(" ")}
      >
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-xs font-semibold text-primary">جارٍ رفع الشعار...</span>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs font-semibold text-primary">رفع صورة الشعار</p>
              <p className="text-[10px] text-txt-muted">PNG / JPG / WEBP — حتى 8MB</p>
            </div>
          </>
        )}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const qc = useQueryClient();
  const [saved, setSaved]     = useState(false);
  const [logoErr, setLogoErr] = useState("");

  const { data: setting, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiFetch<Setting>("/settings"),
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<SettingForm>({
      values: {
        storeName: setting?.storeName ?? "",
        currency:  setting?.currency  ?? "IQD",
        logoUrl:   setting?.logoUrl   ?? "",
        deliveryCostBaghdad: setting?.deliveryCostBaghdad ?? 0,
        deliveryCostOther:   setting?.deliveryCostOther   ?? 0,
      },
    });

  const logoUrl     = watch("logoUrl");
  const currencyVal = watch("currency");
  const currencyInfo = CURRENCIES.find((c) => c.value === currencyVal);

  const saveMut = useMutation({
    mutationFn: (data: SettingForm) =>
      apiFetch<Setting>("/settings", {
        method: "PATCH",
        body: JSON.stringify({
          storeName: data.storeName,
          currency:  data.currency,
          logoUrl:   data.logoUrl || null,
          deliveryCostBaghdad: Number(data.deliveryCostBaghdad) || 0,
          deliveryCostOther:   Number(data.deliveryCostOther) || 0,
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center gap-2 text-txt-muted">
        <span className="spinner spinner-dark" />
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="إعدادات المتجر"
        subtitle="البيانات الأساسية والتفضيلات العامة للنظام"
      />

      <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-5">

        {/* ─── بيانات المتجر ─── */}
        <SectionCard icon={<Store className="h-[18px] w-[18px]" />} title="بيانات المتجر" subtitle="الاسم والعملة المستخدمة">
          <div className="space-y-4">
            <InputField
              label="اسم المتجر"
              required
              error={errors.storeName?.message}
              placeholder="مثال: صيدلية الشفاء"
              {...register("storeName", { required: "اسم المتجر مطلوب" })}
            />

            {/* العملة مع معاينة الرمز */}
            <div className="flex gap-3">
              <div className="flex-1">
                <SelectField label="العملة" {...register("currency")}>
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label} ({c.symbol})
                    </option>
                  ))}
                </SelectField>
              </div>
              {currencyInfo && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-txt-secondary opacity-0">
                    رمز
                  </span>
                  <div
                    className="flex h-[38px] w-16 items-center justify-center rounded border border-border bg-app-bg text-base font-bold text-txt"
                  >
                    {currencyInfo.symbol}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* ─── أسعار التوصيل الفعلية ─── */}
        <SectionCard
          icon={<Truck className="h-[18px] w-[18px]" />}
          title="أسعار التوصيل الفعلية"
          subtitle="تكلفة التوصيل التي تدفعها لشركة التوصيل — تُحتسب تلقائيًا لكل طلب جديد حسب المحافظة، ويمكن تعديلها هنا متى غيّرت الشركة أسعارها"
        >
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="توصيل بغداد (د.ع)"
              type="number"
              min={0}
              {...register("deliveryCostBaghdad", { valueAsNumber: true })}
            />
            <InputField
              label="توصيل بقية المحافظات (د.ع)"
              type="number"
              min={0}
              {...register("deliveryCostOther", { valueAsNumber: true })}
            />
          </div>
          <p className="mt-3 text-[11px] text-txt-muted">
            تنطبق القيم الجديدة على الطلبات القادمة فقط؛ الطلبات السابقة تحتفظ بالقيمة المسجّلة وقت إنشائها (ويمكن تعديلها يدويًا من صفحة الطلبات).
          </p>
        </SectionCard>

        {/* ─── الشعار ─── */}
        <SectionCard icon={<ImageIcon className="h-[18px] w-[18px]" />} title="شعار المتجر" subtitle="يظهر في الفواتير والوصولات — ارفع صورة أو الصق رابطًا">
          <div className="space-y-4">
            <div className="flex items-stretch gap-4">
              {/* المعاينة */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-txt-secondary">المعاينة</span>
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-app-bg">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={logoUrl}
                      src={logoUrl}
                      alt="شعار المتجر"
                      className="h-full w-full object-contain"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <Stethoscope className="h-8 w-8 text-txt-muted" strokeWidth={1.5} />
                  )}
                </div>
              </div>

              {/* الرفع */}
              <div className="flex flex-1 flex-col justify-center">
                <LogoUploader
                  onUploaded={(url) => { setValue("logoUrl", url, { shouldDirty: true }); setLogoErr(""); }}
                  onError={setLogoErr}
                />
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setValue("logoUrl", "", { shouldDirty: true })}
                    className="mt-2 self-start text-[11px] font-medium text-state-danger transition-colors hover:underline"
                  >
                    <span className="inline-flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> إزالة الشعار</span>
                  </button>
                )}
                {logoErr && <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-state-danger"><AlertTriangle className="h-3.5 w-3.5" /> {logoErr}</p>}
              </div>
            </div>

            {/* رابط بديل */}
            <InputField
              label="أو الصق رابط الصورة (URL)"
              placeholder="https://example.com/logo.png"
              {...register("logoUrl")}
            />
          </div>
        </SectionCard>

        {/* ─── رسائل الحالة + زر الحفظ ─── */}
        <div className="flex items-center gap-3">
          <Btn
            type="submit"
            variant="primary"
            loading={saveMut.isPending}
            loadingText="جارٍ الحفظ..."
          >
            حفظ الإعدادات
          </Btn>

          {saveMut.isError && (
            <span className="inline-flex items-center gap-1.5 text-xs text-state-danger">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {saveMut.error instanceof Error ? saveMut.error.message : "حدث خطأ"}
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-state-success">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-sm"
                style={{ background: "#D1FAE5" }}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              تم حفظ الإعدادات بنجاح
            </span>
          )}
        </div>
      </form>

      {/* ─── معلومات النظام ─── */}
      <div className="mt-5">
        <SectionCard icon={<Info className="h-[18px] w-[18px]" />} title="معلومات النظام" subtitle="بيانات تقنية للمرجع">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded border border-border-light bg-app-bg px-4 py-3">
              <p className="text-xs text-txt-muted">آخر تحديث</p>
              <p className="mt-1 text-sm font-medium text-txt">
                {setting
                  ? new Date(setting.updatedAt).toLocaleString("ar-IQ")
                  : "—"}
              </p>
            </div>
            <div className="rounded border border-border-light bg-app-bg px-4 py-3">
              <p className="text-xs text-txt-muted">إعدادات الطابعة</p>
              <p className="mt-1 text-sm font-medium text-txt">
                تُضبط من تطبيق سطح المكتب
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

    </div>
  );
}
