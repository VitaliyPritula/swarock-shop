import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string; // product_id + size
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string | null;
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "id" | "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (i, qty = 1) => {
        const id = `${i.productId}::${i.size ?? ""}`;
        const items = [...get().items];
        const idx = items.findIndex((x) => x.id === id);
        if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + qty };
        else items.push({ ...i, id, qty });
        set({ items });
      },
      remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      setQty: (id, qty) =>
        set({
          items: get().items.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)),
        }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, x) => s + x.qty, 0),
      total: () => get().items.reduce((s, x) => s + x.qty * x.price, 0),
    }),
    { name: "svarock-cart" },
  ),
);
