'use client';
import { Link } from '@/src/i18n/routing';
import { useCart } from '@/src/lib/cart';
import { useWishlist } from '@/src/lib/wishlist';
import { img } from "@/src/lib/images";
import Image from 'next/image';

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  const addToCart = useCart((s) => s.add);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl uppercase tracking-widest">Ваше обране порожнє</h1>
        <p className="mt-4 text-muted-foreground">Додайте товари до обраного, щоб швидко повернутися до них пізніше.</p>
        <Link href="/catalog" className="mt-6 inline-flex rounded bg-[color:var(--brand)] px-4 py-2 text-white">
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-display text-3xl uppercase tracking-widest mb-8">Обране</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 rounded border p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 overflow-hidden rounded bg-white shadow-sm">
                <Image
                  src={img(item.image)}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.size ? `Розмір: ${item.size}` : 'Без розміру'}</div>
                <div className="text-sm">Ціна: {item.price ? `${item.price} ₴` : '—'}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => addToCart({
                  productId: item.productId,
                  slug: item.slug,
                  name: item.name,
                  image: item.image,
                  size: item.size,
                  price: item.price ?? 0,
                }, 1)}
                className="rounded bg-[color:var(--brand)] px-4 py-2 text-sm uppercase tracking-widest text-white transition hover:bg-[color:var(--brand)]/90"
              >
                Додати в кошик
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
