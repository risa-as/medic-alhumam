"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";

/** أيقونة المفضّلة في الهيدر مع عدّاد العناصر. */
export function WishlistIcon() {
  const count = useWishlist((s) => s.items.length);
  return (
    <Link
      href="/favorites"
      aria-label="المفضّلة"
      className="relative flex h-10 w-10 items-center justify-center transition-colors"
      style={{ borderRadius: "var(--radius)", color: "#E11D48", background: count > 0 ? "#FFE4E6" : "transparent" }}
    >
      <Heart className="h-[22px] w-[22px]" fill={count > 0 ? "currentColor" : "none"} />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center px-1 text-[10px] font-bold text-white"
          style={{ borderRadius: 9999, background: "#E11D48" }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
