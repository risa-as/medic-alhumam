"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Package, Play, X, Stethoscope, Truck, Banknote, ShieldCheck,
  User, Phone, MapPin, Home, Minus, Plus, Sparkles, Lock,
  ChevronRight, ChevronLeft, Images,
} from "lucide-react";
import { IRAQ_GOVERNORATES } from "@medic/ui";
import { apiFetch } from "@/lib/fetcher";
import { discountPercent, availabilityOf, type Availability, type StorefrontProduct } from "@/lib/storefront";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

interface LandingFormValues {
  name: string;
  phone: string;
  governorate: string;
  address: string;
  [key: string]: string;
}

const AVAIL: Record<Availability, { label: string; cls: string; dot: string }> = {
  in_stock:     { label: "متوفّر الآن",   cls: "bg-emerald-50 text-emerald-700 ring-emerald-100", dot: "bg-emerald-500" },
  low_stock:    { label: "كمية محدودة",   cls: "bg-amber-50 text-amber-700 ring-amber-100",       dot: "bg-amber-500" },
  out_of_stock: { label: "غير متوفّر",    cls: "bg-red-50 text-red-700 ring-red-100",             dot: "bg-red-400" },
};

/* حقل إدخال مع أيقونة */
const fieldCls =
  "w-full rounded-[10px] border border-gray-200 bg-white py-2.5 pr-10 pl-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-gray-400";

export function LandingClient({
  product,
  source,
  storeName,
  logoUrl,
}: {
  product: StorefrontProduct;
  source: string;
  storeName: string;
  logoUrl: string | null;
}) {
  const router = useRouter();
  const [videoOpen, setVideoOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LandingFormValues>({
    defaultValues: { name: "", phone: "", governorate: "", address: "" },
  });

  async function onSubmit(values: LandingFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      // حفظ معلومات الزبون في كوكي الجلسة (FR-035)
      await apiFetch("/session/customer", {
        method: "POST",
        body: JSON.stringify({ name: values.name, phone: values.phone, governorate: values.governorate, address: values.address }),
      });

      const selectedAttributes: Record<string, string> = {};
      for (const f of product.customFields) {
        const val = values[f.name];
        if (val !== undefined && val !== "") selectedAttributes[f.name] = String(val);
      }

      const clientEventId = `landing-${product.id}-${Date.now()}`;
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          clientEventId,
          customerName: values.name,
          customerPhone: values.phone,
          governorate: values.governorate,
          customerAddress: values.address || undefined,
          source: source || "LANDING_PAGE",
          items: [{
            productId: product.id,
            quantity: qty,
            unitPrice: product.salePrice,
            selectedAttributes,
          }],
        }),
      });

      router.push("/thank-you");
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر إرسال الطلب");
    } finally {
      setSubmitting(false);
    }
  }

  const images   = product.images;
  const img      = images[active];
  const hasMany  = images.length > 1;
  const disc     = discountPercent(product);
  const avail    = AVAIL[availabilityOf(product)];
  const soldOut  = availabilityOf(product) === "out_of_stock";
  const itemsTotal = product.salePrice * qty;          // مجموع المنتج (× الكمية)
  const delivery   = product.deliveryPrice;            // التوصيل ثابت لكل طلب
  const grandTotal = itemsTotal + delivery;            // الإجمالي المعروض للزبون

  const go = (i: number) => images.length && setActive((images.length + i) % images.length);
  function onTouchStart(e: React.TouchEvent) { touchX.current = e.touches[0]?.clientX ?? null; }
  function onTouchEnd(e: React.TouchEvent) {
    const end = e.changedTouches[0]?.clientX;
    if (touchX.current == null || end == null) return;
    const dx = end - touchX.current;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1)); // سحب لليسار = التالي
    touchX.current = null;
  }

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: "#F6F8FB" }}>
      {/* ═══ علامة المتجر (مبسّطة) ═══ */}
      <header className="border-b border-[#EAF0F6] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2.5 px-4 py-3">
          {logoUrl ? (
            <Image src={logoUrl} alt={storeName} width={36} height={36} className="rounded-[8px] object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] text-white" style={{ background: "linear-gradient(135deg, var(--color-primary-hover), var(--color-primary))" }}>
              <Stethoscope className="h-[18px] w-[18px]" />
            </div>
          )}
          <div className="text-center leading-tight">
            <p className="text-sm font-extrabold text-[#0F172A]">{storeName}</p>
            <p className="text-[10px] tracking-wide text-gray-400">Medical Supplies Store</p>
          </div>
        </div>
      </header>

      {/* ═══ القسم البطل ═══ */}
      <section className="mx-auto max-w-5xl px-4 pt-6 lg:pt-10">
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">

          {/* الوسائط — معرض الصور */}
          <div className="flex flex-col gap-3">
            {/* الصورة الرئيسية */}
            <div
              className="group relative aspect-square select-none overflow-hidden rounded-[18px] border border-[#EAF0F6] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
              onTouchStart={hasMany ? onTouchStart : undefined}
              onTouchEnd={hasMany ? onTouchEnd : undefined}
            >
              {img ? (
                <Image key={active} src={img} alt={`${product.nameAr} — صورة ${active + 1}`} fill className="object-contain p-6 transition-opacity duration-300" sizes="(max-width:1024px) 100vw, 480px" priority />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-200"><Package className="h-24 w-24" strokeWidth={1} /></div>
              )}

              {/* شارات */}
              <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
                {disc != null && (
                  <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-extrabold text-white shadow">− {disc}%</span>
                )}
                {product.isNew && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white shadow"><Sparkles className="h-3 w-3" /> جديد</span>
                )}
              </div>

              {/* عدّاد الصور — إشارة عصرية */}
              {hasMany && (
                <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white shadow backdrop-blur">
                  <Images className="h-3 w-3" /> {fmt(active + 1)} / {fmt(images.length)}
                </span>
              )}

              {/* أسهم التنقّل — تظهر على الشاشات الكبيرة */}
              {hasMany && (
                <>
                  <button type="button" onClick={() => go(active - 1)} aria-label="الصورة السابقة"
                    className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-700 shadow-md ring-1 ring-black/5 backdrop-blur transition hover:bg-white hover:text-primary md:flex md:opacity-0 group-hover:md:opacity-100">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => go(active + 1)} aria-label="الصورة التالية"
                    className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-700 shadow-md ring-1 ring-black/5 backdrop-blur transition hover:bg-white hover:text-primary md:flex md:opacity-0 group-hover:md:opacity-100">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* مؤشّر النقاط */}
              {hasMany && (
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur">
                  {images.map((_, i) => (
                    <button key={i} type="button" onClick={() => setActive(i)} aria-label={`عرض الصورة ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80"}`} />
                  ))}
                </div>
              )}

              {product.videoUrl && (
                <button
                  onClick={() => setVideoOpen(true)}
                  className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/80"
                >
                  <Play className="h-4 w-4" fill="currentColor" /> شاهد الفيديو
                </button>
              )}
            </div>

            {/* الصور المصغّرة */}
            {hasMany && (
              <div className="flex gap-2.5 overflow-x-auto px-0.5 py-1.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
                {images.map((src, i) => (
                  <button key={i} type="button" onClick={() => setActive(i)} aria-label={`صورة مصغّرة ${i + 1}`}
                    className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-[12px] border bg-white transition lg:w-[88px] ${i === active ? "border-primary ring-2 ring-primary/30" : "border-[#EAF0F6] hover:border-primary/40"}`}>
                    <Image src={src} alt={`${product.nameAr} مصغّرة ${i + 1}`} fill className="object-contain p-1.5" sizes="88px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* المعلومات */}
          <div className="flex flex-col">
            {product.category && (
              <span className="w-fit rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary-hover">{product.category.nameAr}</span>
            )}

            <h1 className="mt-3 text-2xl font-extrabold leading-snug text-[#0F172A] lg:text-[28px]">{product.nameAr}</h1>

            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${avail.cls}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${avail.dot}`} /> {avail.label}
              </span>
            </div>

            {/* السعر */}
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="text-[34px] font-extrabold leading-none text-primary">
                {fmt(product.salePrice)} <span className="text-base font-bold text-gray-400">د.ع</span>
              </span>
              {product.compareAtPrice != null && product.compareAtPrice > product.salePrice && (
                <span className="mb-1 text-lg font-semibold text-gray-400 line-through">{fmt(product.compareAtPrice)}</span>
              )}
              {product.deliveryPrice > 0 && (
                <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-sm font-bold text-primary-hover">
                  <Truck className="h-4 w-4" /> + {fmt(product.deliveryPrice)} توصيل
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-4 text-[15px] leading-relaxed text-gray-600">{product.description}</p>
            )}

            {/* مزايا الشراء */}
            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {[
                { icon: Truck,       t: "توصيل لكل المحافظات" },
                { icon: Banknote,    t: "الدفع عند الاستلام" },
                { icon: ShieldCheck, t: "منتج أصلي مضمون" },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="flex flex-col items-center gap-1.5 rounded-[12px] border border-[#EAF0F6] bg-white px-2 py-3 text-center">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-[11px] font-semibold leading-tight text-gray-600">{t}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══ نموذج الطلب ═══ */}
      <section id="order" className="mx-auto max-w-2xl px-4 pb-16 pt-10">
        <div className="overflow-hidden rounded-[18px] border border-[#EAF0F6] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          {/* ترويسة النموذج */}
          <div className="px-6 py-5 text-white" style={{ background: "linear-gradient(135deg, var(--color-primary-hover), var(--color-primary))" }}>
            <h2 className="text-lg font-extrabold">أكمل طلبك خلال دقيقة</h2>
            <p className="mt-0.5 text-sm text-primary-light">أدخل بياناتك وسنتواصل معك لتأكيد الطلب — الدفع عند الاستلام</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
            {/* الاسم */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">الاسم الكامل <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input className={fieldCls} placeholder="أدخل اسمك" {...register("name", { required: "الاسم مطلوب" })} />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            {/* الهاتف */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">رقم الهاتف <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input className={fieldCls} type="tel" inputMode="tel" placeholder="07X XXXX XXXX" {...register("phone", { required: "الهاتف مطلوب" })} />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>

            {/* المحافظة */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">المحافظة <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select className={`${fieldCls} appearance-none`} {...register("governorate", { required: "المحافظة مطلوبة" })}>
                  <option value="">اختر المحافظة</option>
                  {IRAQ_GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              {errors.governorate && <p className="mt-1 text-xs text-red-600">{errors.governorate.message}</p>}
            </div>

            {/* العنوان */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">العنوان التفصيلي</label>
              <div className="relative">
                <Home className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <textarea className={`${fieldCls} pl-3`} rows={2} placeholder="الحي، الشارع، رقم المنزل..." {...register("address")} />
              </div>
            </div>

            {/* الكمية */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">الكمية</label>
              <div className="flex w-full items-center rounded-[10px] border border-gray-200 bg-white">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}
                  className="flex h-11 w-14 shrink-0 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex-1 border-x border-gray-200 text-center text-base font-bold text-gray-900 self-stretch leading-[44px]">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)}
                  className="flex h-11 w-14 shrink-0 items-center justify-center text-primary transition hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* الحقول المخصّصة للمنتج */}
            {product.customFields.map((f) => (
              <div key={f.id}>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  {f.name} {f.required && <span className="text-red-500">*</span>}
                </label>
                {f.type === "select" ? (
                  <select className={`${fieldCls} appearance-none pr-3`}
                    {...(register as (n: string, o?: object) => object)(f.name, { required: f.required ? `${f.name} مطلوب` : false })}>
                    <option value="">اختر...</option>
                    {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input className={`${fieldCls} pr-3`} placeholder={`أدخل ${f.name}`}
                    {...(register as (n: string, o?: object) => object)(f.name, { required: f.required ? `${f.name} مطلوب` : false })} />
                )}
              </div>
            ))}

            {/* ملخّص الإجمالي */}
            <div className="space-y-2 rounded-[12px] border border-[#EAF0F6] bg-[#F8FAFC] px-4 py-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>المنتج{qty > 1 ? ` (${qty} قطعة)` : ""}</span>
                <span className="font-semibold text-gray-800">{fmt(itemsTotal)} د.ع</span>
              </div>
              {delivery > 0 && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4" /> التوصيل</span>
                  <span className="font-semibold text-gray-800">{fmt(delivery)} د.ع</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-[#EAF0F6] pt-2">
                <span className="text-sm font-bold text-gray-700">الإجمالي</span>
                <span className="text-xl font-extrabold text-primary">{fmt(grandTotal)} <span className="text-sm font-bold text-gray-400">د.ع</span></span>
              </div>
            </div>

            {error && (
              <p className="rounded-[10px] bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}

            <button type="submit" disabled={submitting || soldOut}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] py-3.5 text-base font-extrabold text-white shadow-[0_8px_20px_rgba(26,82,118,0.25)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              style={!(submitting || soldOut) ? { background: "linear-gradient(135deg, var(--color-primary-hover), var(--color-primary))" } : undefined}
            >
              {submitting ? "جارٍ الإرسال..." : soldOut ? "غير متوفّر حاليًا" : "تأكيد الطلب"}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
              <Lock className="h-3.5 w-3.5" /> بياناتك آمنة ولن تُستخدم إلا لتوصيل طلبك
            </p>
          </form>
        </div>
      </section>

      {/* ═══ نافذة الفيديو ═══ */}
      {videoOpen && product.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setVideoOpen(false)}>
          <button
            onClick={() => setVideoOpen(false)}
            aria-label="إغلاق"
            className="absolute left-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
          <video
            src={product.videoUrl}
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-auto max-w-[min(100%,48rem)] rounded-[14px] bg-black"
          />
        </div>
      )}
    </div>
  );
}
