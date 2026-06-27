"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StorefrontProduct } from "./storefront";

interface WishlistState {
  items: StorefrontProduct[];
  toggle: (p: StorefrontProduct) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

/** قائمة المفضّلة — محفوظة محليًا في المتصفّح (مثل السلة). */
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (p) =>
        set((s) =>
          s.items.some((i) => i.id === p.id)
            ? { items: s.items.filter((i) => i.id !== p.id) }
            : { items: [p, ...s.items] },
        ),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      has: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: "medic-wishlist" },
  ),
);
