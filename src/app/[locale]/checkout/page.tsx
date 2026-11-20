"use client";

import { Link } from "@/src/i18n/routing";
import { useCart } from "@/src/lib/cart";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const items = useCart((state) => state.items);
  const total = useCart((state) => state.total());
  const clear = useCart((state) => state.clear);
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          city: form.get("city"),
          address: form.get("address"),
          payment,
          comment: form.get("comment"),
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            size: item.size,
            qty: item.qty,
            price: item.price,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data.error === "ORDER_SUBMISSION_FAILED"
          ? t("submitError")
          : data.error ?? t("submitError");
        throw new Error(message);
      }
      setOrderId(data.orderId);
      clear();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  if (orderId) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl uppercase">{t("thanks")}</h1>
        <p className="mt-4 text-muted-foreground">{t("orderNumber")} {orderId}</p>
        <Link href="/catalog" className="mt-6 inline-flex rounded bg-primary px-6 py-3 text-sm text-white">
          {t("toCatalog")}
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl uppercase">{t("emptyCart")}</h1>
        <Link href="/catalog" className="mt-6 inline-flex rounded bg-primary px-6 py-3 text-sm text-white">
          {t("toCatalog")}
        </Link>
      </main>
    );
  }

  const fieldClass = "mt-1 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 font-display text-3xl uppercase tracking-widest">{t("title")}</h1>
      <form onSubmit={submit} className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>{t("fullName")}<input required name="name" className={fieldClass} /></label>
            <label>{t("phone")}<input required name="phone" type="tel" className={fieldClass} /></label>
          </div>
          <label className="block">{t("email")}<input name="email" type="email" className={fieldClass} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>{t("city")}<input required name="city" className={fieldClass} /></label>
            <label>{t("address")}<input required name="address" className={fieldClass} /></label>
          </div>
          <label className="block">{t("comment")}<textarea name="comment" rows={4} className={fieldClass} /></label>
          <fieldset>
            <legend className="mb-3 font-display text-sm uppercase">{t("paymentMethod")}</legend>
            <label className="flex items-center gap-2 py-2">
              <input type="radio" checked={payment === "cod"} onChange={() => setPayment("cod")} />
              {t("cashOnDelivery")}
            </label>
            <label className="flex items-center gap-2 py-2">
              <input type="radio" checked={payment === "card"} onChange={() => setPayment("card")} />
              {t("cardPayment")}
            </label>
          </fieldset>
        </div>

        <aside className="h-fit border border-border p-5">
          <h2 className="font-display text-lg uppercase">{t("yourOrder")}</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 border-b border-border pb-3 text-sm">
                <span>{item.name} × {item.qty}</span>
                <strong>{item.price * item.qty} ₴</strong>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between text-lg font-semibold">
            <span>{t("amountDue")}</span>
            <span>{total} ₴</span>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="mt-5 w-full rounded bg-primary px-4 py-3 text-sm uppercase text-white disabled:opacity-60">
            {loading ? t("submitting") : t("confirm")}
          </button>
        </aside>
      </form>
    </main>
  );
}
