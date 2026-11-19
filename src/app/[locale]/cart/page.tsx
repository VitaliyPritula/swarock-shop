'use client';
import { Link } from '@/src/i18n/routing';
import { useCart } from '@/src/lib/cart';
import { useWishlist } from '@/src/lib/wishlist';
import { supabase } from '@/src/lovable/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_SIZES = ['s', 'm', 'l', 'xl', 'xxl'];

export default function CartPage() {
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
        toast.error(`Не вдалося завантажити розміри: ${error.message}`);
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
        toast.error('Для цього товару немає доступних розмірів.');
        return;
      }

      setAvailableSizes([...new Set(sizes)]);
    } catch (error) {
      setEditingItemId(null);
      toast.error(`Не вдалося завантажити розміри: ${error instanceof Error ? error.message : 'Невідома помилка'}`);
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

  const getProductWord = (count: number) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return 'товар';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return 'товари';
    }
    return 'товарів';
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl uppercase tracking-widest">Кошик порожній</h1>
        <Link href="/catalog" className="mt-6 inline-flex rounded bg-[color:var(--brand)] px-4 py-2 text-white">
          До каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16">
      <h1 className="font-display text-3xl text-center uppercase tracking-widest mb-8">Кошик ({cartCount} <span className="normal-case">
        {getProductWord(items.length)}
      </span>)</h1>
      <div className="flex">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-4  p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-40 w-40 overflow-hidden rounded bg-white shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="">
                  <div className="flex gap-6 mb-5">
                    <div className="">
                      <div className="font-semibold">{item.name}</div>
                      {item.code && <div className="text-sm text-muted-foreground normal-case">Код товару: <span>{item.code}</span></div>}
                      <div className="text-sm text-muted-foreground normal-case">{item.size ? <>Розмір: <span className="uppercase">{item.size}</span></> : 'Без розміру'}</div>
                      <div className="font-semibold">
                        {item.price} грн.
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-center">Кількість</label>
                      <div className="flex items-center rounded border bg-white">
                        <button
                          type="button"
                          onClick={() => setQty(item.id, Math.max(1, item.qty - 1))}
                          className="h-9 w-9 border-r border-border text-lg leading-none text-muted-foreground transition hover:bg-slate-100"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => setQty(item.id, Math.max(1, Number(e.target.value) || 1))}
                          className="w-16 border-0 bg-transparent px-2 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="h-9 w-9 border-l border-border text-lg leading-none text-muted-foreground transition hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="">
                        Ціна:
                      </span>
                      <span className="font-semibold">
                        {item.price} грн.
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-sm hover:text-red-600"
                    >
                      Видалити
                    </button>
                    <button
                      type="button"
                      onClick={() => void editSize(item.id, item.slug, item.size)}
                      disabled={loadingSizes}
                      className="text-sm hover:text-red-600"
                    >
                      Редагувати
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
                      className="text-sm hover:text-red-600"
                    >
                      Додати в обране
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 border-l pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-semibold">Загалом: {total} грн.</div>
          <Link href="/checkout" className="inline-flex rounded bg-[color:var(--brand)] px-6 py-3 text-white">
            Оформити замовлення
          </Link>
        </div>
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
              Редагувати товар
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
            <p className="mt-2 text-sm text-muted-foreground">{editingItem.name}</p>
            <label htmlFor="edit-cart-item-size" className="mt-5 block text-sm">
              Розмір
            </label>
            <select
              id="edit-cart-item-size"
              value={selectedSize}
              onChange={(event) => setSelectedSize(event.target.value)}
              disabled={loadingSizes}
              className="mt-2 w-full rounded border border-border bg-white px-3 py-2"
            >
              {editingItem.size === null && <option value="">Без розміру</option>}
              {availableSizes.map((size) => (
                <option key={size} value={size}>{size.toUpperCase()}</option>
              ))}
            </select>
            {loadingSizes && <p className="mt-2 text-sm text-muted-foreground">Завантаження розмірів…</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSize(editingItem.id, selectedSize || null);
                  setEditingItemId(null);
                  toast.success('Розмір товару оновлено');
                }}
                disabled={loadingSizes}
                className="rounded bg-[color:var(--brand)] px-4 py-2 text-sm disabled:opacity-50"
              >
                Зберегти
              </button>
              <button
                type="button"
                onClick={() => setEditingItemId(null)}
                className="rounded border border-border px-4 py-2 text-sm"
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
