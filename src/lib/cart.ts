import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string; // product_id + size
  productId: string;
  code: string | null;
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
  setSize: (id: string, size: string | null) => void;
  setCode: (id: string, code: string) => void;
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
        if (idx >= 0) {
          items[idx] = {
            ...items[idx],
            code: items[idx].code ?? i.code,
            qty: items[idx].qty + qty,
          };
        }
        else items.push({ ...i, id, qty });
        set({ items });
      },
      remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      setQty: (id, qty) =>
        set({
          items: get().items.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)),
        }),
      setSize: (id, size) => {
        const items = get().items;
        const item = items.find((x) => x.id === id);
        if (!item) return;

        const newId = `${item.productId}::${size ?? ""}`;
        if (newId === id) return;

        const existingItem = items.find((x) => x.id === newId);
        if (existingItem) {
          set({
            items: items
              .filter((x) => x.id !== id)
              .map((x) =>
                x.id === newId
                  ? { ...x, code: x.code ?? item.code, qty: x.qty + item.qty }
                  : x,
              ),
          });
          return;
        }

        set({
          items: items.map((x) =>
            x.id === id ? { ...x, id: newId, size } : x,
          ),
        });
      },
      setCode: (id, code) =>
        set({
          items: get().items.map((x) => (x.id === id ? { ...x, code } : x)),
        }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, x) => s + x.qty, 0),
      total: () => get().items.reduce((s, x) => s + x.qty * x.price, 0),
    }),
    { name: "svarock-cart" },
  ),
);
