'use client';
import { Link } from '@/src/i18n/routing';
import { useCart } from '@/src/lib/cart';
import { useWishlist } from '@/src/lib/wishlist';
import { supabase } from '@/src/lovable/client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_SIZES = ['s', 'm', 'l', 'xl', 'xxl'];

export default function CartPage() {
  const t = useTranslations("Cart");
  const cartCount = useCart((s) => s.items.reduce((acc, x) => acc + x.qty, 0));
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const setSize = useCart((s) => s.setSize);
  const setCode = useCart((s) => s.setCode);
  const total = useCart((s) => s.total());

  const toggleWishlist = useWishlist((s) => s.toggle);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [loadingSizes, setLoadingSizes] = useState(false);

  const editSize = async (itemId: string, slug: string, currentSize: string | null) => {
    setEditingItemId(itemId);
    setSelectedSize(currentSize ?? '');
    setLoadingSizes(true);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('product_variants(size,stock)')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        setEditingItemId(null);
        toast.error(t("loadSizesError", { message: error.message }));
        return;
      }

      const variants = data?.product_variants ?? [];
      const sizes = variants.length
        ? variants
          .filter((variant) => variant.stock > 0 || variant.size === currentSize)
          .map((variant) => variant.size)
        : DEFAULT_SIZES;

      if (currentSize && !sizes.includes(currentSize)) sizes.unshift(currentSize);
      if (sizes.length === 0) {
        setEditingItemId(null);
        toast.error(t("noSizesAvailable"));
        return;
      }

      setAvailableSizes([...new Set(sizes)]);
    } catch (error) {
      setEditingItemId(null);
      toast.error(t("loadSizesError", { message: error instanceof Error ? error.message : t("unknownError") }));
    } finally {
      setLoadingSizes(false);
    }
  };
  const editingItem = items.find((item) => item.id === editingItemId) ?? null;

  useEffect(() => {
    const itemsWithoutCode = items.filter((item) => !item.code);
    const slugs = [...new Set(itemsWithoutCode.map((item) => item.slug))];
    if (slugs.length === 0) return;

    let active = true;
    void supabase
      .from('products')
      .select('slug,code')
      .in('slug', slugs)
      .then(({ data, error }) => {
        if (error) {
          return;
        }
        if (!active) return;

        for (const product of data ?? []) {
          if (!product.code) continue;
          for (const item of itemsWithoutCode.filter((entry) => entry.slug === product.slug)) {
            setCode(item.id, product.code);
          }
        }
      });

    return () => {
      active = false;
    };
  }, [items, setCode]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-6 text-center">
        <h1 className="font-display text-2xl uppercase tracking-widest">{t("empty")}</h1>
        <Link href="/catalog" className="mt-6 inline-flex rounded bg-primary px-4 py-2 text-white">
          {t("toCatalog")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="border-b border-border py-4">
        <h1 className=" text-center font-display text-2xl uppercase tracking-widest">
          {t("title", { count: cartCount })}
        </h1>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            {items.map((item) => (
              <article key={item.id} className="border-b border-border py-6 sm:grid grid-cols-[88px_minmax(0,1fr)] gap-x-4 gap-y-4 sm:grid-cols-[112px_minmax(0,1fr)] md:grid-cols-[160px_minmax(20px,1fr)] md:gap-x-5">
                <div className="row-span-1 aspect-square overflow-hidden bg-white md:row-span-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="">
                  <div className="flex flex-wrap items-center sm:gap-25 gap-8">
                    <div className="mt-3 space-y-1 text-primary">
                      <h2 className="font-medium text-l">{item.name}</h2>
                      {item.code && <p>{t("productCode")} {item.code}</p>}
                      <p className="text-sm">{item.size ? <>{t("size")} {item.size.toUpperCase()}</> : t("noSize")}</p>
                      <p className="text-sm">{item.price} {t("currency")}</p>
                    </div>

                    <div className="">
                      <label htmlFor={`quantity-${item.id}`} className="mb-2 block text-sm">
                        {t("quantity")}
                      </label>
                      <div className="flex w-fit items-center border border-border bg-white">
                        <button
                          type="button"
                          aria-label={`${t("quantity")} −`}
                          onClick={() => setQty(item.id, Math.max(1, item.qty - 1))}
                          className="h-8 w-8 border-r border-border text-primary hover:bg-primary/10"
                        >
                          −
                        </button>
                        <input
                          id={`quantity-${item.id}`}
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(event) => setQty(item.id, Math.max(1, Number(event.target.value) || 1))}
                          className="w-10 border-0 bg-transparent px-1 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          aria-label={`${t("quantity")} +`}
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="h-8 w-8 border-l border-border text-primary hover:bg-primary/10"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="my-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <button type="button" onClick={() => remove(item.id)} className="underline underline-offset-2 hover:text-primary/70">
                      {t("remove")}
                    </button>
                    <button
                      type="button"
                      onClick={() => void editSize(item.id, item.slug, item.size)}
                      disabled={loadingSizes}
                      className="underline underline-offset-2 hover:text-primary/70"
                    >
                      {t("edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist({
                        productId: item.productId,
                        code: item.code,
                        slug: item.slug,
                        name: item.name,
                        image: item.image,
                        size: item.size,
                        price: item.price,
                      })}
                      className="underline underline-offset-2 hover:text-primary/70"
                    >
                      {t("addToWishlist")}
                    </button>
                  </div>
                </div>
                <div className="col-start-2 row-start-3 text-left md:col-start-4 md:row-start-1 md:text-right">
                  <span className="mb-2 block text-sm">{t("price")}</span>
                  <span className="">{item.price * item.qty} {t("currency")}</span>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit space-y-4 lg:sticky lg:top-6">
            <Link href="/checkout" className="block w-full bg-primary px-4 py-3 text-center text-white transition hover:bg-primary/90">
              {t("pay")}
            </Link>
            <div className="border border-border">
              <div className="p-4 sm:p-5">
                <h2 className="font-display text-xl uppercase">{t("orderSummary")}</h2>
                <div className="mt-4 flex items-start justify-between gap-4 text-sm">
                  <div>
                    <p className="font-semibold">{t("subtotal")}</p>
                    <p className="mt-1 text-primary">{t("itemCount", { count: cartCount })}</p>
                  </div>
                  <p className="font-semibold">{total} {t("currency")}</p>
                </div>
                <div className="mt-6 space-y-3">
                  {[t("promoCodePlaceholder"), t("giftCertificatePlaceholder")].map((placeholder) => (
                    <div key={placeholder} className="flex">
                      <input
                        type="text"
                        aria-label={placeholder}
                        placeholder={placeholder}
                        className="min-w-0 flex-1 border border-border px-2 py-2 text-xs outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => toast.info(t("discountUnavailable"))}
                        className="shrink-0 bg-primary px-3 text-xs text-white"
                      >
                        {t("discount")}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between gap-4 text-sm font-semibold">
                  <span>{t("total")}</span>
                  <span className="text-lg">{total} {t("currency")}</span>
                </div>
              </div>
              <Link href="/checkout" className="block bg-primary px-4 py-3 text-center text-white transition hover:bg-primary/90">
                {t("pay")}
              </Link>
            </div>
            <Link href="/catalog" className="block border border-border px-4 py-2 text-center transition hover:bg-secondary">
              {t("continueShopping")}
            </Link>
          </aside>
        </div>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-cart-item-title"
              className="w-full max-w-md rounded bg-white p-6 shadow-xl"
            >
              <h2 id="edit-cart-item-title" className="font-display text-xl uppercase">
                {t("editTitle")}
              </h2>
              <div className="h-40 w-40 overflow-hidden rounded bg-white shadow-sm">
                <Image
                  src={editingItem.image}
                  alt={editingItem.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-2 text-sm text-primary">{editingItem.name}</p>
              <label htmlFor="edit-cart-item-size" className="mt-5 block text-sm">
                {t("size")}
              </label>
              <div className="relative mt-2">
                <select
                  id="edit-cart-item-size"
                  value={selectedSize}
                  onChange={(event) => setSelectedSize(event.target.value)}
                  disabled={loadingSizes}
                  className="w-full appearance-none rounded border border-border bg-white px-3 py-2 pr-9 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingItem.size === null && <option value="">{t("noSize")}</option>}
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>{size.toUpperCase()}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg width="13" height="13" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.6597 1.44721C18.9921 0.782314 18.5086 -3.82322e-08 17.7653 -7.07265e-08L1.00134 -8.03501e-07C0.257954 -8.35995e-07 -0.225544 0.782312 0.106907 1.44721L8.48887 18.2111C8.8574 18.9482 9.9092 18.9482 10.2777 18.2111L18.6597 1.44721Z" fill="#1D1D24" />
                  </svg>
                </span>
              </div>
              {loadingSizes && <p className="mt-2 text-sm text-primary">{t("loadingSizes")}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSize(editingItem.id, selectedSize || null);
                    setEditingItemId(null);
                    toast.success(t("sizeUpdated"));
                  }}
                  disabled={loadingSizes}
                  className="rounded border border-border px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white"
                >
                  {t("save")}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItemId(null)}
                  className="rounded border border-border px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

    </>
  );
}
