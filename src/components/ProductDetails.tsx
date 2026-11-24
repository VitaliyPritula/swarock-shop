"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { type StaticImageData } from "next/image";
import { Heart, Minus, Plus } from "lucide-react";
import SizeGuideModal, { type SizeGuideType } from "./SizeGuideModal";
import { useCart } from "@/src/lib/cart";
import { useWishlist } from "@/src/lib/wishlist";
import { uah } from "@/src/lib/format";
import { ProductCard, type ProductCardData } from "./ProductCard";
import { useRouter } from "@/src/i18n/routing";

type Variant = { id: string; size: string; stock?: number };

export default function ProductDetails({
  name,
  guideType = "tshirt",
  id,
  code,
  slug,
  image,
  price,
  variants = [],
  related = [],
  material,
  description,
}: {
  name: string;
  guideType?: SizeGuideType;
  id?: string;
  code?: string | null;
  slug: string;
  image: string | StaticImageData;
  price: number;
  variants?: Variant[];
  related?: ProductCardData[];
  material?: string | null;
  description?: string | null;
}) {
  const t = useTranslations("ProductDetails");
  const productT = useTranslations("ProductModal");
  const cartT = useTranslations("Cart");
  const locale = useLocale();
  const router = useRouter();
  const [showSizeTable, setShowSizeTable] = useState(false);
  const [sent, setSent] = useState(false);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | null>(variants[0]?.size ?? null);
  const [reviewRating, setReviewRating] = useState(5);
  const imageSrc = typeof image === "string" ? image : image.src;
  const wishlistHas = useWishlist((s) => s.has(String(id ?? slug), size));
  const toggleWishlist = useWishlist((s) => s.toggle);

  const proceedToCheckout = () => {
    useCart.getState().add({
      productId: String(id ?? slug),
      code: code ?? null,
      slug,
      name,
      image: imageSrc,
      size,
      price,
    }, qty);
    router.push("/checkout");
  };

  const toggleWishlistItem = () => {
    toggleWishlist({
      productId: String(id ?? slug),
      code: code ?? null,
      slug,
      name,
      image: imageSrc,
      size,
      price,
    });
  };

  return (
    <div className="pt-8">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[22px] font-medium uppercase leading-tight text-primary">{name}</h3>
        <p className="font-display text-3xl text-primary">{uah(price, locale)}</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-2">
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.45298 7.88889L3.89498 9.44444L8.90282 14.4444L20.0313 3.33333L18.4734 1.77778L8.90282 11.3333L5.45298 7.88889ZM17.8056 17.7778H2.22571V2.22222H13.3542V0H2.22571C1.00157 0 0 1 0 2.22222V17.7778C0 19 1.00157 20 2.22571 20H17.8056C19.0298 20 20.0313 19 20.0313 17.7778V8.88889H17.8056V17.7778Z" fill="#44CD14" />
          </svg>
          <p className="text-[16px] font-Regular uppercase tracking-[0.12em] text-primary">{productT("inStock")}</p>
        </div>
        {code && <p className=" text-xs text-primary">{productT("productCode")}
          <span className="text-accen"> {code}</span></p>}
      </div>
      {(material || description) && (
        <div className="mt-5 space-y-2 text-sm text-primary">
          {material && <p>{material}</p>}
          {description && <p className="leading-relaxed">{description}</p>}
        </div>
      )}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-10 items-center border border-border">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-full w-9 place-items-center" aria-label="Decrease quantity">
            <Minus className="h-3 w-3" />
          </button>
          <input type="number" min={1} value={qty} onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))} className="h-full w-10 border-x border-border text-center text-sm" aria-label={productT("quantity")} />
          <button type="button" onClick={() => setQty(qty + 1)} className="grid h-full w-9 place-items-center" aria-label="Increase quantity">
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div>
        {variants.length > 0 && (
          <div className="mt-5">
            <label className="mb-2 block text-xs font-medium text-primary">{productT("size")}</label>
            <div className="flex items-center gap-6 mb-3">
              <div className="relative">
                <select
                  value={size ?? ""} onChange={(event) => setSize(event.target.value)}
                  className="w-[160px] appearance-none rounded border border-border bg-background px-1 py-2 pr-1 text-sm outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                >
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.size}>{variant.size.toUpperCase()}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute -inset-y-2 right-3 flex items-center">
                  <svg width="13" height="13" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.6597 1.44721C18.9921 0.782314 18.5086 -3.82322e-08 17.7653 -7.07265e-08L1.00134 -8.03501e-07C0.257954 -8.35995e-07 -0.225544 0.782312 0.106907 1.44721L8.48887 18.2111C8.8574 18.9482 9.9092 18.9482 10.2777 18.2111L18.6597 1.44721Z" fill="#1D1D24" />
                  </svg>
                </span>
              </div>
              <button type="button" onClick={() => setShowSizeTable(true)} className="text-[14px] underline underline-offset-4">
                {t("sizeTable")}
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-8">
          <button type="button" onClick={proceedToCheckout} className="h-10  rounded bg-primary px-[46px] max-w-[160px] text-xs font-semibold uppercase tracking-wider text-white">
            {cartT("checkout")}
          </button>
          <button type="button" onClick={toggleWishlistItem} className={`grid h-10 w-10 place-items-center rounded border border-border ${wishlistHas ? "text-[color:var(--brand)]" : "text-primary"}`} aria-pressed={wishlistHas}>
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-5 text-center font-display text-sm font-semibold uppercase tracking-[0.16em]">Ще товари на сайті</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {related.slice(0, 5).map((item) => <ProductCard key={item.id ?? item.slug} p={item} />)}
          </div>
        </section>
      )}
{/* 

      <section className="mt-10 border-t border-border pt-7">
        <h2 className="mb-4 text-center font-display text-sm font-semibold uppercase tracking-[0.16em]">Відгуки про товар</h2>
        <form className="mx-auto max-w-2xl" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required name="name" placeholder={t("yourName")} className="h-10 rounded border border-border px-3 text-sm" />
            <input name="email" type="email" placeholder="E-mail" className="h-10 rounded border border-border px-3 text-sm" />
          </div>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button key={rating} type="button" onClick={() => setReviewRating(rating)} className={rating <= reviewRating ? "text-[color:var(--brand)]" : "text-border"} aria-label={`${rating} stars`}>
                ★
              </button>
            ))}
          </div>
          <textarea required name="review" placeholder={t("reviewPlaceholder", { name })} rows={4} className="mt-3 w-full rounded border border-border px-3 py-2 text-sm" />
          <button type="submit" className="mt-3 h-10 rounded bg-primary px-6 text-xs font-semibold uppercase tracking-wider text-white">{t("submitReview")}</button>
          {sent && <p className="mt-3 text-sm text-green-700">{t("reviewSent")}</p>}
        </form>
      </section> */}

      <SizeGuideModal open={showSizeTable} onClose={() => setShowSizeTable(false)} type={guideType} />
    </div>
  );
}
