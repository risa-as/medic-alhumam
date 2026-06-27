"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/lib/cart-store";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center" style={{ borderRadius: "var(--radius)", background: "var(--color-primary-light)", color: "var(--color-primary)" }}><ShoppingCart className="h-9 w-9" /></div>
        <div>
          <p className="text-lg font-bold" style={{ color: "#0F172A" }}>السلة فارغة</p>
          <p className="mt-1 text-sm" style={{ color: "#94A3B8" }}>لم تضف أي منتجات بعد</p>
        </div>
        <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all" style={{ borderRadius: "var(--radius)", background: "var(--color-primary)" }}>
          تصفّح المنتجات ←
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold" style={{ color: "#0F172A" }}>سلة الشراء</h1>
        <p className="mt-0.5 text-sm" style={{ color: "#94A3B8" }}>{items.length.toLocaleString("ar-IQ")} صنف</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ─── قائمة المنتجات ─── */}
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 p-4" style={{ borderRadius: "var(--radius)", border: "1px solid #EEF2F6", background: "#fff" }}>
              {/* صورة المنتج */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden" style={{ borderRadius: "var(--radius)", background: "#F1F5F9" }}>
                {item.image ? (
                  <Image src={item.image} alt={item.nameAr} fill className="object-contain p-1.5" sizes="64px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-txt-muted"><Package className="h-6 w-6" /></div>
                )}
              </div>

              {/* التفاصيل */}
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.productId}`} className="no-underline">
                  <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{item.nameAr}</p>
                </Link>
                <p className="mt-0.5 text-xs" style={{ color: "#94A3B8" }}>{fmt(item.salePrice)} د.ع للقطعة</p>
                {Object.entries(item.selectedAttributes).map(([k, v]) => (
                  <span key={k} className="mr-1 mt-1 inline-flex items-center px-1.5 py-0.5 text-[10px]" style={{ borderRadius: "var(--radius)", background: "var(--color-primary-light)", color: "var(--color-primary-hover)" }}>{k}: {v}</span>
                ))}
              </div>

              {/* الكمية */}
              <div className="flex shrink-0 items-center gap-1" style={{ borderRadius: "var(--radius)", border: "1px solid #E2E8F0", padding: 2 }}>
                <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center text-base font-bold" style={{ borderRadius: "var(--radius)", color: "#475569" }}>−</button>
                <span className="w-7 text-center text-sm font-bold" style={{ color: "#0F172A" }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center text-base font-bold" style={{ borderRadius: "var(--radius)", color: "var(--color-primary-hover)" }}>+</button>
              </div>

              {/* الإجمالي + حذف */}
              <div className="shrink-0 text-left">
                <p className="text-sm font-extrabold" style={{ color: "var(--color-primary-hover)" }}>{fmt(item.salePrice * item.quantity)}</p>
                <button onClick={() => removeItem(item.productId)} className="mt-1 text-xs" style={{ color: "#E11D48" }}>حذف</button>
              </div>
            </div>
          ))}
        </div>

        {/* ─── ملخص الطلب ─── */}
        <div className="h-fit space-y-4 p-5" style={{ borderRadius: "var(--radius)", border: "1px solid #EEF2F6", background: "#fff", position: "sticky", top: 88 }}>
          <h2 className="text-base font-bold" style={{ color: "#0F172A" }}>ملخص الطلب</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-xs" style={{ color: "#64748B" }}>
                <span>{item.nameAr} × {item.quantity}</span>
                <span>{fmt(item.salePrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t pt-3" style={{ borderColor: "#F1F5F9" }}>
            <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>الإجمالي</span>
            <span className="text-base font-extrabold" style={{ color: "var(--color-primary-hover)" }}>{fmt(total())} د.ع</span>
          </div>
          <Link href="/checkout" className="block w-full py-3 text-center text-sm font-bold text-white no-underline transition-all" style={{ borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)", boxShadow: "0 4px 14px rgba(26,82,118,0.3)" }}>
            إتمام الطلب ←
          </Link>
          <Link href="/products" className="block text-center text-xs no-underline" style={{ color: "#94A3B8" }}>متابعة التسوّق</Link>
        </div>
      </div>
    </div>
  );
}
