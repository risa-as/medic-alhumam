"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  nameAr: string;
  salePrice: number;
  quantity: number;
  image?: string;
  selectedAttributes: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) =>
        set((s) => {
          const exists = s.items.find((i) => i.productId === item.productId);
          if (exists) {
            return { items: s.items.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i) };
          }
          return { items: [...s.items, { ...item, quantity: qty }] };
        }),
      updateQty: (productId, quantity) =>
        set((s) => ({
          items: quantity <= 0
            ? s.items.filter((i) => i.productId !== productId)
            : s.items.map((i) => i.productId === productId ? { ...i, quantity } : i),
        })),
      removeItem: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.salePrice * i.quantity, 0),
    }),
    { name: "medic-cart" },
  ),
);
