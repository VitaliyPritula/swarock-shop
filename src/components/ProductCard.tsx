'use client'
import { Link } from "@/src/i18n/routing";
import { uah } from "@/src/lib/format";
import { img } from "@/src/lib/images";
import Image from "next/image";
import { useState } from "react";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  image_url: string | null;
  material?: string | null;
  sizes?: string[];
};

export function ProductCard({ p }: { p: ProductCardData }) {
  const [selectedSize, setSelectedSize] = useState(p.sizes?.[0] ?? "");
  const image = p.image_url?.startsWith("http") ? p.image_url : img(p.image_url);

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded bg-white text-center shadow-sm transition hover:shadow-md">
      <div className="aspect-square overflow-hidden bg-white">
        <Image
          src={image}
          alt={p.name}
          width={typeof image === "string" ? 800 : image.width}
          height={typeof image === "string" ? 600 : image.height}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col items-center px-2 pb-3">
        {p.material && (
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.material}</div>
        )}
        <div className="mt-1 line-clamp-2 text-sm font-medium uppercase">{p.name}</div>
        <div className="mt-2 font-display text-lg">{uah(p.price)}</div>
      </div>

      <div className="absolute inset-0 flex items-end justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/40 group-hover:opacity-100">
        <div className="w-full bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-5">
          <div className="flex flex-col gap-3">
            <label htmlFor={`size-${p.slug}`} className="text-xs uppercase tracking-widest text-zinc-900">
              Виберіть розмір
            </label>
            <div className="flex justify-between">
              <div className="relative">
                <select
                  id={`size-${p.slug}`}
                  value={selectedSize}
                  onChange={(event) => setSelectedSize(event.target.value)}
                  className="w-[150%] appearance-none rounded border border-border bg-background px-1 py-2 pr-1 text-sm outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                >
                  {p.sizes && p.sizes.length > 0 ? (
                    p.sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))
                  ) : (
                    <>
                      <option value="s">S</option>
                      <option value="m">M</option>
                      <option value="l">L</option>
                      <option value="xl">XL</option>
                      <option value="xxl">XXL</option>
                    </>
                  )}
                </select>
                <span className="pointer-events-none absolute -inset-y-2 -right-3 flex items-center">
                  <svg width="13" height="13" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.6597 1.44721C18.9921 0.782314 18.5086 -3.82322e-08 17.7653 -7.07265e-08L1.00134 -8.03501e-07C0.257954 -8.35995e-07 -0.225544 0.782312 0.106907 1.44721L8.48887 18.2111C8.8574 18.9482 9.9092 18.9482 10.2777 18.2111L18.6597 1.44721Z" fill="#1D1D24" />
                  </svg>

                </span>
              </div>
              <Link
                href={`/product/${p.slug}`}
                className="no-underline inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm uppercase tracking-widest text-white transition hover:bg-primary/90"
              >
                Купити
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
