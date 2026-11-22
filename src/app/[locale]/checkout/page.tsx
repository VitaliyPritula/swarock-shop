"use client";

import { Link } from "@/src/i18n/routing";
import { useCart } from "@/src/lib/cart";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
  const [delivery, setDelivery] = useState("nova");

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
          delivery,
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
      <>
        <section className="border-b border-border py-4">
          <h1 className="text-center font-display text-2xl uppercase tracking-widest">{t("title")}</h1>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="mx-auto max-w-xl border border-border px-6 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary text-3xl">✓</div>
            <h2 className="mt-6 font-display text-3xl uppercase">{t("thanks")}</h2>
            <p className="mt-4 text-muted-foreground">{t("orderNumber")} <strong className="text-foreground">{orderId}</strong></p>
            <Link href="/catalog" className="mt-8 inline-flex bg-primary px-8 py-3 text-sm uppercase text-white">
              {t("toCatalog")}
            </Link>
          </div>
        </section>
      </>
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

  const fieldClass = "mt-2 w-full border border-border px-3 py-3 text-sm outline-none focus:border-primary";
  const labelClass = "block text-sm";

  return (
    <>
      <section className="border-b border-border py-4">
        <h1 className="text-center font-display text-2xl uppercase tracking-widest">{t("title")}</h1>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <form onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <fieldset>
              <legend className="mb-4 border-b border-border pb-2 font-display text-lg uppercase">{t("contactDetails")}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>{t("fullName")}<input required name="name" className={fieldClass} /></label>
                <label className={labelClass}>{t("phone")}<input required name="phone" type="tel" className={fieldClass} /></label>
              </div>
              <label className={`${labelClass} mt-4 block`}>{t("email")}<input name="email" type="email" className={fieldClass} /></label>
            </fieldset>

            <fieldset>
              <legend className="mb-4 border-b border-border pb-2 font-display text-lg uppercase">{t("deliveryMethod")}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 border p-4 ${delivery === "nova" ? "border-primary bg-secondary/30" : "border-border"}`}>
                  <input className="mt-1" type="radio" name="delivery" checked={delivery === "nova"} onChange={() => setDelivery("nova")} />
                  <span><strong className="block text-sm">{t("novaPost")}</strong><span className="mt-1 block text-xs text-muted-foreground">{t("novaPostText")}</span></span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 border p-4 ${delivery === "courier" ? "border-primary bg-secondary/30" : "border-border"}`}>
                  <input className="mt-1" type="radio" name="delivery" checked={delivery === "courier"} onChange={() => setDelivery("courier")} />
                  <span><strong className="block text-sm">{t("courier")}</strong><span className="mt-1 block text-xs text-muted-foreground">{t("courierText")}</span></span>
                </label>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>{t("city")}<input required name="city" className={fieldClass} /></label>
                <label className={labelClass}>{delivery === "nova" ? t("address") : t("courierAddress")}<input required name="address" className={fieldClass} /></label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-4 border-b border-border pb-2 font-display text-lg uppercase">{t("paymentMethod")}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 border p-4 ${payment === "cod" ? "border-primary bg-secondary/30" : "border-border"}`}>
                  <input className="mt-1" type="radio" name="payment" checked={payment === "cod"} onChange={() => setPayment("cod")} />
                  <span><strong className="block text-sm">{t("cashOnDelivery")}</strong><span className="mt-1 block text-xs text-muted-foreground">{t("codText")}</span></span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 border p-4 ${payment === "card" ? "border-primary bg-secondary/30" : "border-border"}`}>
                  <input className="mt-1" type="radio" name="payment" checked={payment === "card"} onChange={() => setPayment("card")} />
                  <span><strong className="block text-sm">{t("cardPayment")}</strong><span className="mt-1 block text-xs text-muted-foreground">{t("cardText")}</span></span>
                </label>
              </div>
              {payment === "card" && (
                <div className="mt-4 grid gap-4 rounded border border-border p-4 sm:grid-cols-2">
                  <label className={`${labelClass} sm:col-span-2`}>{t("cardNumber")}<input required inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" className={fieldClass} /></label>
                  <label className={labelClass}>{t("cardExpiry")}<input required inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" className={fieldClass} /></label>
                  <label className={labelClass}>CVV<input required inputMode="numeric" autoComplete="cc-csc" placeholder="000" className={fieldClass} /></label>
                </div>
              )}
            </fieldset>

            <label className={`${labelClass} block`}>{t("comment")}<textarea name="comment" rows={4} className={fieldClass} /></label>
          </div>

          <aside className="h-fit border border-border lg:sticky lg:top-6">
            <h2 className="border-b border-border px-5 py-4 font-display text-lg uppercase">{t("yourOrder")}</h2>
            <div className="space-y-4 px-5 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-border pb-4 last:border-0">
                  <div className="h-20 w-20 shrink-0 overflow-hidden bg-secondary/30">
                    <Image src={item.image} alt={item.name} width={80} height={80} className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    {item.size && <p className="mt-1 text-xs text-muted-foreground">{t("size")} {item.size.toUpperCase()}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">{t("qty")} {item.qty}</p>
                  </div>
                  <strong className="shrink-0 text-sm">{item.price * item.qty} ₴</strong>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-border px-5 py-5 text-lg font-semibold">
              <span>{t("amountDue")}</span>
              <span>{total} ₴</span>
            </div>
            {error && <p className="px-5 pb-4 text-sm text-red-600">{error}</p>}
            <button disabled={loading} className="w-full bg-primary px-4 py-4 text-sm uppercase text-white disabled:opacity-60">
              {loading ? t("submitting") : t("confirm")}
            </button>
          </aside>
        </form>
      </section>
    </>

  );
}
