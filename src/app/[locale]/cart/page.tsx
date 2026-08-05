'use client';
import { Link } from '@/src/i18n/routing';
import { useCart } from '@/src/lib/cart';
import { img } from "@/src/lib/images";
import { uah } from "@/src/lib/format";
import { Trash2 } from "lucide-react";


export default function CartPage() {
  
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const total = useCart((s) => s.total());

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
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-3xl uppercase tracking-widest mb-8">Ваш кошик</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 rounded border p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.size ? `Розмір: ${item.size}` : 'Без розміру'}</div>
              <div className="text-sm">Ціна: {item.price} ₴</div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Кількість</label>
              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) => setQty(item.id, Math.max(1, Number(e.target.value) || 1))}
                className="w-20 rounded border px-2 py-1 text-center"
              />
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded border border-red-500 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t pt-6 md:flex-row md:items-center md:justify-between">
        <div className="text-lg font-semibold">Загалом: {total} ₴</div>
        <Link href="/checkout" className="inline-flex rounded bg-[color:var(--brand)] px-6 py-3 text-white">
          Оформити замовлення
        </Link>
      </div>
    </div>
  );
}
