"use client";
import { Link } from '@/src/i18n/routing';
import { useCart } from "@/src/lib/cart";
import { getLocalProductCode } from "@/src/lib/catalog";
import { uah } from "@/src/lib/format";
import { img } from "@/src/lib/images";
import { useWishlist } from "@/src/lib/wishlist";
import { Heart, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SizeGuideModal, { type SizeGuideType } from "./SizeGuideModal";

type Variant = { id: string; size: string; stock?: number };

type ProductModalItem = {
  id?: string;
  code?: string | null;
  slug: string;
  name: string;
  image_url?: string | null;
  price: number;
  categories?: { slug?: string | null; name?: string | null } | null;
  product_variants?: Variant[];
};

// Підлаштуйте шаблони під справжні slug ваших категорій у таблиці categories
function guideTypeFor(p: ProductModalItem): SizeGuideType {
  const categorySlug = (p.categories?.slug ?? "").toLowerCase();

  if (/shoe|boot|vzutt|взутт/.test(categorySlug)) return "shoes";
  if (/jacket|kurt|куртк/.test(categorySlug)) return "jacket";
  if (categorySlug) return "tshirt";

  // Запасний варіант, якщо категорію не передано: розміри взуття числові (30-50)
  const sizes = (p.product_variants ?? []).map((v) => v.size);
  const looksLikeShoes =
    sizes.length > 0 &&
    sizes.every((s) => {
      const n = Number(String(s).replace(",", "."));
      return Number.isFinite(n) && n >= 30 && n <= 50;
    });

  return looksLikeShoes ? "shoes" : "tshirt";
}

export default function ProductModal({
  p,
  onClose,
}: {
  p: ProductModalItem;
  onClose: () => void;
}) {
  const t = useTranslations("ProductModal");
  const locale = useLocale();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | null>(p?.product_variants?.[0]?.size ?? null);
  const [mounted, setMounted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!p || !mounted) return null;

  const image = p.image_url?.startsWith("http") ? p.image_url : img(p.image_url);
  const imageSrc = typeof image === "string" ? image : image.src;
  const productCode = p.code || getLocalProductCode(p.slug);

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div onClick={(e) => e.stopPropagation()} className="relative z-10 w-[720px] max-w-full rounded bg-white p-6 shadow-lg">
        <button onClick={onClose} aria-label={t("close")} className="absolute right-3 top-3 text-primary">
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-wrap sm:flex-nowrap gap-6">
          <div className="md:w-1/2">
            <Link href={`/product/${p.slug}`}>
              <div className="aspect-[4/5] overflow-hidden">
                <Image
                  src={image}
                  alt={p.name}
                  width={600}
                  height={600}
                  className=" w-full object-contain"
                />
              </div>
            </Link>
          </div>
          <div className="md:w-1/2 w-full">
            <h2 className="mb-8 text-sm underline uppercase">{p.name}</h2>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex gap-1 text-xs">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.45298 7.88889L3.89498 9.44444L8.90282 14.4444L20.0313 3.33333L18.4734 1.77778L8.90282 11.3333L5.45298 7.88889ZM17.8056 17.7778H2.22571V2.22222H13.3542V0H2.22571C1.00157 0 0 1 0 2.22222V17.7778C0 19 1.00157 20 2.22571 20H17.8056C19.0298 20 20.0313 19 20.0313 17.7778V8.88889H17.8056V17.7778Z" fill="#44CD14" />
                </svg>
                {t("inStock")}</div>
              <div className="text-lg font-display">{uah(p.price, locale)}</div>
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-xs text-primary">{t("quantity")}</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 rounded border">-</button>
                <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-10 rounded border pr-0 text-center" />
                <button type="button" onClick={() => setQty(qty + 1)} className="w-8 rounded border">+</button>
              </div>
            </div>

            {p.product_variants?.length ? (
              <div className="mb-3">
                <label className="block mb-1 text-xs text-primary">{t("size")}</label>
                <select value={size ?? ""} onChange={(e) => setSize(e.target.value)} className="w-full rounded border px-2 py-1">
                  {p.product_variants?.map((v: Variant) => (
                    <option key={v.id} value={v.size}>{v.size}</option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="mt-2 text-xs">
              <button type="button" onClick={() => setShowSizeGuide(true)} className="underline">
                {t("sizeTable")}
              </button>
            </div>

            {productCode && (
              <p className="mb-4 mt-2 text-sm text-primary">
                {t("productCode")}{" "}
                <span className="text-accent">{productCode}</span>
              </p>
            )}

          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              useCart.getState().add({
                productId: String(p.id ?? p.slug),
                code: p.code ?? null,
                slug: p.slug,
                name: p.name,
                image: imageSrc,
                size: size,
                price: p.price,
              }, qty);
              onClose();
            }}
            className="flex-1 rounded bg-primary py-2 text-sm text-white"
          >
            {t("addToCart")}
          </button>
          <WishlistHeart p={p} size={size} imageSrc={imageSrc} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modal, document.body)}
      <SizeGuideModal
        open={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        closeLabel={t("close")}
        type={guideTypeFor(p)}
      />
    </>
  );
}

function WishlistHeart({ p, size, imageSrc }: { p: ProductModalItem; size: string | null; imageSrc: string }) {
  const t = useTranslations("ProductModal");
  const has = useWishlist((s) => s.has(String(p.id ?? p.slug), size));
  const toggle = useWishlist((s) => s.toggle);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle({
          productId: String(p.id ?? p.slug),
          code: p.code ?? null,
          slug: p.slug,
          name: p.name,
          image: imageSrc,
          size: size,
          price: p.price,
        });
      }}
      className={`rounded border p-2 ${has ? "text-[color:var(--brand)]" : "text-primary"}`}
      aria-pressed={has}
      aria-label={has ? t("removeFromWishlist") : t("addToWishlist")}
    >
      <Heart className="h-4 w-4" />
    </button>
  );
}