"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function CartIcon() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  return (
    <Link
      href="/cart"
      aria-label="السلة"
      className="relative flex h-10 w-10 items-center justify-center transition-colors"
      style={{ borderRadius: "var(--radius)", color: "var(--color-primary-hover)", background: count > 0 ? "var(--color-primary-light)" : "transparent" }}
    >
      <ShoppingCart className="h-[22px] w-[22px]" />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center px-1 text-[10px] font-bold text-white"
          style={{ borderRadius: 9999, background: "var(--color-primary)" }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
