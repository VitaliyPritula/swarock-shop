"use client";
"use client";
import { useCart } from "@/src/lib/cart";
import { uah } from "@/src/lib/format";
import { img } from "@/src/lib/images";
import { useWishlist } from "@/src/lib/wishlist";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Variant = { id: string; size: string; stock?: number };

export default function ProductModal({
  p,
  onClose,
}: {
  p: any;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | null>(p?.product_variants?.[0]?.size ?? null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!p || !mounted) return null;

  const image = p.image_url?.startsWith("http") ? p.image_url : img(p.image_url);

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div onClick={(e) => e.stopPropagation()} className="relative z-10 w-[720px] max-w-full rounded bg-white p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground">
          <X className="h-5 w-5" />
        </button>
        <div className="flex gap-6">
          <div className="w-1/2">
            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
              <Image
                src={image}
                alt={p.name}
                width={600}
                height={800}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="w-1/2">
            <h2 className="mb-2 text-sm font-semibold uppercase">{p.name}</h2>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full border border-green-600 bg-green-50 px-2 py-0.5 text-xs text-green-700">В наявності</div>
              <div className="text-lg font-display">{uah(p.price)}</div>
            </div>

            <div className="mb-3">
              <label className="block mb-1 text-xs text-muted-foreground">Кількість</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 rounded border">-</button>
                <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-16 rounded border px-2 text-center" />
                <button type="button" onClick={() => setQty(qty + 1)} className="w-8 rounded border">+</button>
              </div>
            </div>

            {p.product_variants?.length > 0 && (
              <div className="mb-3">
                <label className="block mb-1 text-xs text-muted-foreground">Розмір</label>
                <select value={size ?? ""} onChange={(e) => setSize(e.target.value)} className="w-full rounded border px-2 py-1">
                  {p.product_variants.map((v: Variant) => (
                    <option key={v.id} value={v.size}>{v.size}</option>
                  ))}
                </select>
                <div className="mt-2 text-xs"><a className="underline">Таблиця розмірів</a></div>
              </div>
            )}

            <div className="mb-4 text-xs">Код товару: <span className="text-[color:var(--brand)]">{p.id}</span></div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  useCart.getState().add({
                    productId: String(p.id ?? p.slug),
                    slug: p.slug,
                    name: p.name,
                    image: typeof image === "string" ? image : (image as any)?.src ?? "",
                    size: size,
                    price: p.price,
                  }, qty);
                  onClose();
                }}
                className="flex-1 rounded bg-primary py-2 text-sm text-white"
              >
                Додати в корзину
              </button>
              <WishlistHeart p={p} size={size} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

function WishlistHeart({ p, size }: { p: any; size: string | null }) {
  const has = useWishlist((s) => s.has(String(p.id ?? p.slug), size));
  const toggle = useWishlist((s) => s.toggle);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle({
          productId: String(p.id ?? p.slug),
          slug: p.slug,
          name: p.name,
          image: typeof p.image_url === "string" ? p.image_url : "",
          size: size,
        });
      }}
      className={`rounded border p-2 ${has ? "text-[color:var(--brand)]" : "text-muted-foreground"}`}
      aria-pressed={has}
    >
      <Heart className="h-4 w-4" />
    </button>
  );
}
