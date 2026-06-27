"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";
import { ProductCard } from "../_components/ProductCard";

export default function FavoritesPage() {
  const items = useWishlist((s) => s.items);
  const clear = useWishlist((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // قبل ترطيب المتجر المحلي نعرض حالة محايدة لتفادي عدم تطابق الـ hydration
  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20 text-sm" style={{ color: "#94A3B8" }}>
        <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "#E2E8F0", borderTopColor: "var(--color-primary)" }} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center" style={{ borderRadius: "var(--radius)", background: "#FFF1F2", color: "#E11D48" }}><Heart className="h-9 w-9" /></div>
        <div>
          <p className="text-lg font-bold" style={{ color: "#0F172A" }}>قائمة المفضّلة فارغة</p>
          <p className="mt-1 inline-flex items-center gap-1 text-sm" style={{ color: "#94A3B8" }}>اضغط على <Heart className="h-3.5 w-3.5" style={{ color: "#E11D48" }} /> في أي منتج لإضافته هنا</p>
        </div>
        <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white no-underline" style={{ borderRadius: "var(--radius)", background: "var(--color-primary)" }}>
          تصفّح المنتجات ←
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="inline-flex items-center gap-2 text-xl font-extrabold" style={{ color: "#0F172A" }}>المفضّلة <Heart className="h-5 w-5" style={{ color: "#E11D48" }} fill="currentColor" /></h1>
          <p className="mt-0.5 text-sm" style={{ color: "#94A3B8" }}>{items.length.toLocaleString("ar-IQ")} منتج</p>
        </div>
        <button onClick={clear} className="text-xs font-medium" style={{ color: "#E11D48" }}>مسح الكل</button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
