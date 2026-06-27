"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, Check, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { availabilityOf, discountPercent, type StorefrontProduct } from "@/lib/storefront";

// إعادة تصدير للنوع للحفاظ على التوافق مع المستوردين القدامى
export type { StorefrontProduct } from "@/lib/storefront";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

function HeartButton({ product }: { product: StorefrontProduct }) {
  const toggle = useWishlist((s) => s.toggle);
  const items = useWishlist((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const active = mounted && items.some((i) => i.id === product.id);

  return (
    <button
      type="button"
      aria-label="إضافة للمفضّلة"
      onClick={(e) => { e.preventDefault(); toggle(product); }}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center transition-all"
      style={{
        borderRadius: "var(--radius)",
        background: "rgba(255,255,255,0.92)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24"
        fill={active ? "#E11D48" : "none"} stroke={active ? "#E11D48" : "#64748B"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

export function ProductCard({ product }: { product: StorefrontProduct }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  const availability = availabilityOf(product);
  const soldOut = availability === "out_of_stock";
  const discount = discountPercent(product);
  const hasImages = product.images.length > 0;
  const hasVideo = !!product.videoUrl;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (soldOut) return;
    addItem({ productId: product.id, nameAr: product.nameAr, salePrice: product.salePrice, image: product.images[0], selectedAttributes: {} });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <>
      <div
        className="group flex flex-col overflow-hidden transition-all"
        style={{ borderRadius: "var(--radius)", background: "#fff", border: "1px solid #EEF2F6" }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,0.10)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {/* ─── الصورة ─── */}
        <div className="relative" style={{ aspectRatio: "3/4", background: "#F1F5F9" }}>
          <HeartButton product={product} />

          {/* الشارات العلوية اليسرى */}
          <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1">
            {discount !== null && (
              <span className="px-2 py-0.5 text-[11px] font-bold text-white" style={{ borderRadius: "var(--radius)", background: "#E11D48" }}>
                -{fmt(discount)}%
              </span>
            )}
            {product.isNew && discount === null && (
              <span className="px-2 py-0.5 text-[10px] font-bold text-white" style={{ borderRadius: "var(--radius)", background: "var(--color-primary)" }}>
                جديد
              </span>
            )}
            {availability === "low_stock" && (
              <span className="px-2 py-0.5 text-[10px] font-bold" style={{ borderRadius: "var(--radius)", background: "#FEF3C7", color: "#B45309" }}>
                كمية محدودة
              </span>
            )}
          </div>

          <Link href={`/products/${product.id}`} className="block h-full w-full">
            {hasImages ? (
              <Image
                src={product.images[0]!}
                alt={product.nameAr}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center opacity-20"><Package className="h-14 w-14" strokeWidth={1.5} /></div>
            )}
          </Link>

          {/* طبقة "نفد" */}
          {soldOut && (
            <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: "rgba(248,250,252,0.7)" }}>
              <span className="px-3 py-1 text-xs font-bold text-white" style={{ borderRadius: "var(--radius)", background: "#64748B" }}>
                نفد المخزون
              </span>
            </div>
          )}

          {/* زر الفيديو */}
          {hasVideo && !soldOut && (
            <button
              onClick={(e) => { e.preventDefault(); setVideoOpen(true); }}
              className="absolute bottom-2 left-2 z-10 flex items-center gap-1 transition-all"
              style={{ background: "rgba(15,23,42,0.72)", borderRadius: "var(--radius)", padding: "4px 9px", color: "#fff", fontSize: 10, fontWeight: 600, backdropFilter: "blur(4px)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              فيديو
            </button>
          )}
        </div>

        {/* ─── التفاصيل ─── */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          <Link href={`/products/${product.id}`} className="no-underline">
            <h3 className="text-[13px] font-medium leading-snug line-clamp-2" style={{ color: "#1E293B", minHeight: 34 }}>
              {product.nameAr}
            </h3>
          </Link>

          {/* السعر */}
          <div className="mt-auto flex items-baseline gap-2">
            <span className="text-base font-extrabold" style={{ color: discount !== null ? "#E11D48" : "var(--color-primary-hover)" }}>
              {fmt(product.salePrice)}
              <span className="mr-0.5 text-[10px] font-normal" style={{ color: "#94A3B8" }}> د.ع</span>
            </span>
            {discount !== null && product.compareAtPrice && (
              <span className="text-xs line-through" style={{ color: "#CBD5E1" }}>{fmt(product.compareAtPrice)}</span>
            )}
          </div>

          {/* زر الإضافة */}
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className="w-full py-2 text-xs font-bold transition-all"
            style={{
              borderRadius: "var(--radius)",
              color: soldOut ? "#94A3B8" : "#fff",
              background: soldOut ? "#F1F5F9" : added ? "var(--color-primary-hover)" : "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)",
              cursor: soldOut ? "not-allowed" : "pointer",
            }}
          >
            {soldOut ? "غير متوفر" : added ? <span className="inline-flex items-center justify-center gap-1"><Check className="h-3.5 w-3.5" strokeWidth={3} /> أُضيف للسلة</span> : "إضافة للسلة"}
          </button>
        </div>
      </div>

      {/* ─── Modal الفيديو ─── */}
      {videoOpen && product.videoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(4px)" }}
          onClick={() => setVideoOpen(false)}
        >
          <div className="relative w-full max-w-3xl overflow-hidden" style={{ borderRadius: "var(--radius)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "#0F172A" }}>
              <p className="text-sm font-semibold text-white">{product.nameAr}</p>
              <button onClick={() => setVideoOpen(false)} className="flex h-7 w-7 items-center justify-center rounded text-white" style={{ background: "rgba(255,255,255,0.1)" }}><X className="h-4 w-4" /></button>
            </div>
            <video src={product.videoUrl} controls autoPlay className="w-full" style={{ display: "block", maxHeight: "75vh", background: "#000" }} />
          </div>
        </div>
      )}
    </>
  );
}
