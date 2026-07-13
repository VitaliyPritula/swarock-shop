'use client'
import Image from "next/image";
import { Link } from "@/src/i18n/routing";
import { img } from "@/src/lib/images";
import { uah } from "@/src/lib/format";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  image_url: string | null;
  material?: string | null;
};

export function ProductCard({ p }: { p: ProductCardData }) {
  const image = p.image_url?.startsWith("http") ? p.image_url : img(p.image_url);
  return (
    <Link
      href={`/product/${p.slug}`}
      className="group flex w-full flex-col text-center"
    >
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
    </Link>
  );
}
