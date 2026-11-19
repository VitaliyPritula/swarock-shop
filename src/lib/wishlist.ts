import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishItem = {
  id: string; // productId + size
  productId: string;
  code: string | null;
  slug: string;
  name: string;
  image: string;
  size: string | null;
  price: number;
};

type WishState = {
  items: WishItem[];
  add: (item: Omit<WishItem, "id">) => void;
  remove: (id: string) => void;
  toggle: (item: Omit<WishItem, "id">) => void;
  has: (productId: string, size?: string | null) => boolean;
};

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (i) => {
        const id = `${i.productId}::${i.size ?? ""}`;
        if (get().items.find((x) => x.id === id)) return;
        set({ items: [...get().items, { ...i, id }] });
      },
      remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      toggle: (i) => {
        const id = `${i.productId}::${i.size ?? ""}`;
        if (get().items.find((x) => x.id === id)) set({ items: get().items.filter((x) => x.id !== id) });
        else set({ items: [...get().items, { ...i, id }] });
      },
      has: (productId, size) => !!get().items.find((x) => x.productId === productId && x.size === (size ?? null)),
    }),
    { name: "svarock-wishlist" },
  ),
);
