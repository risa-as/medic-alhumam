"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, CheckCircle2, AlertTriangle, Ban, ShoppingCart, Check, X, Truck, Banknote, type LucideIcon } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { availabilityOf, discountPercent, type StorefrontProduct } from "@/lib/storefront";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

export function ProductDetail({ product }: { product: StorefrontProduct }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [attrs, setAttrs] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const updateQty = useCart((s) => s.updateQty);
  const cartQty = useCart((s) => s.items.find((i) => i.productId === product.id)?.quantity ?? 0);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  const toggleWish = useWishlist((s) => s.toggle);
  const wishItems = useWishlist((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const inWishlist = mounted && wishItems.some((i) => i.id === product.id);

  const availability = availabilityOf(product);
  const soldOut = availability === "out_of_stock";
  const discount = discountPercent(product);
  const hasImages = product.images.length > 0;
  const hasVideo = !!product.videoUrl;
  const maxQty = product.quantity > 0 ? product.quantity : 1;

  // بمجرد دخول المنتج للسلة يصبح العداد المعروض هو كميته الفعلية فيها (gated بـ mounted لتفادي عدم تطابق الـ hydration).
  const inCart = mounted && cartQty > 0;
  const displayQty = inCart ? cartQty : qty;

  function changeQty(next: number) {
    const clamped = Math.max(1, Math.min(maxQty, next));
    if (inCart) updateQty(product.id, clamped);
    else setQty(clamped);
  }

  function handleAdd() {
    if (soldOut) return;
    // داخل السلة: زِد الكمية الفعلية بمقدار 1. خارجها: أضِف المنتج بالكمية المختارة.
    if (inCart) updateQty(product.id, Math.min(maxQty, cartQty + 1));
    else addItem({ productId: product.id, nameAr: product.nameAr, salePrice: product.salePrice, image: product.images[activeImg] ?? product.images[0], selectedAttributes: attrs }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs" style={{ color: "#94A3B8" }}>
        <Link href="/" className="no-underline" style={{ color: "#94A3B8" }}>الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="no-underline" style={{ color: "#94A3B8" }}>المنتجات</Link>
        {product.category && (<><span>/</span><span>{product.category.nameAr}</span></>)}
        <span>/</span>
        <span className="font-medium" style={{ color: "#475569" }}>{product.nameAr}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* ═══ المعرض ═══ */}
        <div>
          <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", borderRadius: "var(--radius)", border: "1px solid #EEF2F6", background: "#F1F5F9" }}>
            {hasImages ? (
              <Image src={product.images[activeImg]!} alt={product.nameAr} fill className="object-contain p-6" sizes="(max-width:768px) 100vw, 520px" />
            ) : (
              <div className="flex h-full items-center justify-center opacity-10"><Package className="h-24 w-24" strokeWidth={1.25} /></div>
            )}

            {/* الشارات */}
            <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
              {discount !== null && (
                <span className="px-2.5 py-1 text-xs font-bold text-white" style={{ borderRadius: "var(--radius)", background: "#E11D48" }}>-{fmt(discount)}%</span>
              )}
              {product.isNew && (
                <span className="px-2.5 py-1 text-[11px] font-bold text-white" style={{ borderRadius: "var(--radius)", background: "var(--color-primary)" }}>جديد</span>
              )}
            </div>

            {/* المفضّلة */}
            <button
              type="button"
              onClick={() => toggleWish(product)}
              aria-label="إضافة للمفضّلة"
              className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center transition-all"
              style={{ borderRadius: "var(--radius)", background: "rgba(255,255,255,0.95)", boxShadow: "0 1px 6px rgba(0,0,0,0.12)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? "#E11D48" : "none"} stroke={inWishlist ? "#E11D48" : "#64748B"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {hasVideo && (
              <button
                onClick={() => setVideoOpen(true)}
                className="absolute bottom-3 right-3 flex items-center gap-2 transition-all"
                style={{ borderRadius: "var(--radius)", background: "rgba(15,23,42,0.8)", backdropFilter: "blur(8px)", padding: "8px 14px", color: "#fff", fontSize: 12, fontWeight: 600 }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </span>
                مشاهدة الفيديو
              </button>
            )}
          </div>

          {/* المصغّرات */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="relative shrink-0 overflow-hidden transition-all"
                  style={{ width: 64, height: 64, borderRadius: "var(--radius)", border: activeImg === i ? "2px solid var(--color-primary)" : "2px solid #E2E8F0", background: "#F1F5F9" }}
                >
                  <Image src={img} alt="" fill className="object-contain p-1" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══ المعلومات ═══ */}
        <div className="flex flex-col gap-4">
          {product.category?.nameAr && (
            <span className="inline-flex w-fit items-center px-2.5 py-1 text-xs font-semibold" style={{ borderRadius: "var(--radius)", background: "var(--color-primary-light)", color: "var(--color-primary-hover)", border: "1px solid var(--color-primary-light)" }}>
              {product.category.nameAr}
            </span>
          )}

          <h1 className="text-2xl font-extrabold leading-snug" style={{ color: "#0F172A" }}>{product.nameAr}</h1>

          {/* حالة التوفّر */}
          <div className="flex items-center gap-2 text-sm">
            {availability === "in_stock" && <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "var(--color-success)" }}><CheckCircle2 className="h-4 w-4" /> متوفّر في المخزون</span>}
            {availability === "low_stock" && <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "#B45309" }}><AlertTriangle className="h-4 w-4" /> كمية محدودة — سارع بالطلب</span>}
            {availability === "out_of_stock" && <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "#64748B" }}><Ban className="h-4 w-4" /> نفد المخزون حاليًا</span>}
          </div>

          {/* السعر */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderRadius: "var(--radius)", background: discount !== null ? "#FFF1F2" : "var(--color-primary-light)", border: `1px solid ${discount !== null ? "#FECDD3" : "var(--color-primary-light)"}` }}>
            <span className="text-3xl font-extrabold" style={{ color: discount !== null ? "#E11D48" : "var(--color-primary-hover)" }}>{fmt(product.salePrice)}</span>
            <span className="text-sm" style={{ color: discount !== null ? "#FB7185" : "var(--color-primary)" }}>د.ع</span>
            {discount !== null && product.compareAtPrice && (
              <>
                <span className="text-base line-through" style={{ color: "#CBD5E1" }}>{fmt(product.compareAtPrice)}</span>
                <span className="mr-auto px-2 py-0.5 text-xs font-bold text-white" style={{ borderRadius: "var(--radius)", background: "#E11D48" }}>وفّر {fmt(product.compareAtPrice - product.salePrice)} د.ع</span>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{product.description}</p>
          )}

          {/* الحقول المخصّصة */}
          {product.customFields.length > 0 && (
            <div className="space-y-3">
              {product.customFields.map((f) => (
                <div key={f.id}>
                  <p className="mb-1.5 text-sm font-semibold" style={{ color: "#374151" }}>
                    {f.name}{f.required && <span className="mr-0.5 text-red-500">*</span>}
                  </p>
                  {f.type === "select" ? (
                    <div className="flex flex-wrap gap-2">
                      {(f.options ?? []).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setAttrs((p) => ({ ...p, [f.name]: opt }))}
                          className="px-3 py-1.5 text-sm font-medium transition-all"
                          style={{ borderRadius: "var(--radius)", border: attrs[f.name] === opt ? "2px solid var(--color-primary)" : "1px solid #E2E8F0", background: attrs[f.name] === opt ? "var(--color-primary-light)" : "#fff", color: attrs[f.name] === opt ? "var(--color-primary-hover)" : "#475569" }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      className="w-full px-3 py-2 text-sm outline-none"
                      style={{ borderRadius: "var(--radius)", border: "1px solid #E2E8F0", color: "#0F172A" }}
                      placeholder={`أدخل ${f.name}`}
                      value={attrs[f.name] ?? ""}
                      onChange={(e) => setAttrs((p) => ({ ...p, [f.name]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* الكمية */}
          {!soldOut && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: "#374151" }}>الكمية</span>
              <div className="flex items-center gap-1" style={{ borderRadius: "var(--radius)", border: "1px solid #E2E8F0", padding: 2 }}>
                <button onClick={() => changeQty(displayQty - 1)} className="flex h-8 w-8 items-center justify-center text-lg font-bold" style={{ borderRadius: "var(--radius)", color: "#475569" }}>−</button>
                <span className="w-9 text-center text-sm font-bold" style={{ color: "#0F172A" }}>{displayQty}</span>
                <button onClick={() => changeQty(displayQty + 1)} className="flex h-8 w-8 items-center justify-center text-lg font-bold" style={{ borderRadius: "var(--radius)", color: "var(--color-primary-hover)" }}>+</button>
              </div>
              {product.quantity > 0 && product.quantity <= 10 && (
                <span className="text-xs" style={{ color: "#94A3B8" }}>متبقّي {fmt(product.quantity)}</span>
              )}
            </div>
          )}

          {/* أزرار الإجراء */}
          <div className="mt-2 flex flex-col gap-2">
            <button
              onClick={handleAdd}
              disabled={soldOut}
              className="w-full py-3 text-sm font-bold transition-all"
              style={{
                borderRadius: "var(--radius)",
                color: soldOut ? "#94A3B8" : "#fff",
                background: soldOut ? "#F1F5F9" : added ? "var(--color-primary-hover)" : "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)",
                boxShadow: soldOut ? "none" : "0 4px 14px rgba(26,82,118,0.3)",
                cursor: soldOut ? "not-allowed" : "pointer",
              }}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {soldOut ? "غير متوفر حاليًا" : added ? <><Check className="h-4 w-4" strokeWidth={3} /> تمت الإضافة للسلة</> : <><ShoppingCart className="h-4 w-4" /> إضافة للسلة</>}
              </span>
            </button>
            {mounted && cartCount > 0 && (
              <Link href="/cart" className="inline-flex w-full items-center justify-center gap-2 py-3 text-center text-sm font-bold no-underline transition-all" style={{ borderRadius: "var(--radius)", border: "2px solid var(--color-primary)", color: "var(--color-primary-hover)" }}>
                <ShoppingCart className="h-4 w-4" /> عرض السلة ({fmt(cartCount)}) ←
              </Link>
            )}
          </div>

          {/* شارات الثقة */}
          <div className="mt-2 grid grid-cols-3 gap-2 border-t pt-4" style={{ borderColor: "#F1F5F9" }}>
            {([{ i: Truck, t: "توصيل سريع" }, { i: Banknote, t: "دفع عند الاستلام" }, { i: CheckCircle2, t: "أصلي مضمون" }] as { i: LucideIcon; t: string }[]).map((b) => (
              <div key={b.t} className="flex flex-col items-center gap-1 text-center">
                <b.i className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                <span className="text-[11px] font-medium" style={{ color: "#64748B" }}>{b.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ شريط شراء سفلي لاصق (جوال) ═══ */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-3 border-t px-4 py-3 md:hidden" style={{ background: "#fff", borderColor: "#E2E8F0", boxShadow: "0 -2px 12px rgba(15,23,42,0.06)" }}>
        <div className="shrink-0">
          <p className="text-lg font-extrabold leading-none" style={{ color: discount !== null ? "#E11D48" : "var(--color-primary-hover)" }}>{fmt(product.salePrice)} <span className="text-[10px] font-normal" style={{ color: "#94A3B8" }}>د.ع</span></p>
        </div>
        <button
          onClick={handleAdd}
          disabled={soldOut}
          className="flex-1 py-2.5 text-sm font-bold transition-all"
          style={{ borderRadius: "var(--radius)", color: soldOut ? "#94A3B8" : "#fff", background: soldOut ? "#F1F5F9" : "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)", cursor: soldOut ? "not-allowed" : "pointer" }}
        >
          {soldOut ? "غير متوفر" : added ? <span className="inline-flex items-center justify-center gap-1"><Check className="h-4 w-4" strokeWidth={3} /> أُضيف</span> : "إضافة للسلة"}
        </button>
        {mounted && cartCount > 0 && (
          <Link href="/cart" aria-label="عرض السلة" className="relative flex h-11 w-12 shrink-0 items-center justify-center no-underline" style={{ borderRadius: "var(--radius)", border: "2px solid var(--color-primary)", color: "var(--color-primary-hover)" }}>
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1.5 -left-1.5 flex h-4 min-w-4 items-center justify-center px-1 text-[10px] font-bold text-white" style={{ borderRadius: 9999, background: "var(--color-primary)" }}>{fmt(cartCount)}</span>
          </Link>
        )}
      </div>

      {/* ═══ Modal الفيديو ═══ */}
      {videoOpen && product.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.9)", backdropFilter: "blur(6px)" }} onClick={() => setVideoOpen(false)}>
          <div className="relative w-full max-w-3xl overflow-hidden" style={{ borderRadius: "var(--radius)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "#0F172A" }}>
              <p className="text-sm font-semibold text-white">{product.nameAr}</p>
              <button onClick={() => setVideoOpen(false)} className="flex h-7 w-7 items-center justify-center rounded text-white" style={{ background: "rgba(255,255,255,0.1)" }}><X className="h-4 w-4" /></button>
            </div>
            <video src={product.videoUrl} controls autoPlay style={{ display: "block", width: "100%", maxHeight: "75vh", background: "#000" }} />
          </div>
        </div>
      )}
    </div>
  );
}
