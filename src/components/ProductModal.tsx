"use client";
import { uah } from "@/src/lib/format";
import { img } from "@/src/lib/images";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

  if (!p) return null;

  const image = p.image_url?.startsWith("http") ? p.image_url : img(p.image_url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[720px] max-w-full rounded bg-white p-6 shadow-lg">
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
              <button className="flex-1 rounded bg-[color:var(--brand)] py-2 text-sm text-white">Додати в корзину</button>
              <button className="rounded border p-2 text-muted-foreground"><Heart className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
