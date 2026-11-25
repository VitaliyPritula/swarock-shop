"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

type Tab = "description" | "delivery" | "payment";

type Props = {
  name: string;
  material?: string | null;
  description?: string | null;
};

export default function ProductInfoTabs({ name, material, description }: Props) {
  const t = useTranslations("ProductInfo");
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: t("tabs.description") },
    { id: "delivery", label: t("tabs.delivery") },
    { id: "payment", label: t("tabs.payment") },
  ];

  return (
    <div className="border-border">
      <div role="tablist" className=" border-b border-border">
        <div className="max-w-[1440px] flex justify-end xl:px-10 mx-auto w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-3 py-4 w-40 text-center text-sm font-medium uppercase tracking-widest transition ${activeTab === tab.id
                  ? "border-primary bg-primary text-white"
                  : "border-transparent text-primary hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" className="min-h-32 px-4 py-6 text-sm leading-relaxed text-primary md:px-8">
        {activeTab === "description" && (
          <div className="space-y-3">
            {material && <p className="font-medium">{material}</p>}
            {description && <p>{description}</p>}
            {!description && <p>{t("noDescription")}</p>}
          </div>
        )}
        {activeTab === "delivery" && (
          <div className="space-y-3">
            <p>{t("delivery.novaPost")}</p>
            <p>{t("delivery.courier")}</p>
            <p>{t("delivery.confirmation")}</p>
          </div>
        )}
        {activeTab === "payment" && (
          <div className="space-y-3">
            <p>{t("payment.online")}</p>
            <p>{t("payment.cod")}</p>
            <p>{t("payment.confirmation")}</p>
          </div>
        )}
      </div>

      <section className="border-t border-border py-8">
        <h2 className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.16em]">
          {t("reviews.title")}
        </h2>

        {sent && (
          <p className="mb-4 text-center text-sm text-green-700" role="status">
            {t("reviews.sent")}пк
          </p>
        )}

        <form
          className="mx-auto max-w-2xl px-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
            event.currentTarget.reset();
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              name="name"
              placeholder={t("reviews.name")}
              className="h-10 rounded border border-border px-3 text-sm"
            />
            <input
              name="email"
              type="email"
              placeholder={t("reviews.email")}
              className="h-10 rounded border border-border px-3 text-sm"
            />
          </div>

          <div className="mt-3 flex items-center gap-1" aria-label={t("reviews.rating")}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`text-xl ${value <= rating ? "text-[color:var(--brand)]" : "text-border"}`}
                aria-label={`${value}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            required
            name="review"
            placeholder={t("reviews.placeholder", { name })}
            rows={4}
            className="mt-3 w-full rounded border border-border px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="mt-3 h-10 rounded bg-primary px-6 text-xs font-semibold uppercase tracking-wider text-white"
          >
            {t("reviews.submit")}
          </button>
        </form>
      </section>
    </div>
  );
}
