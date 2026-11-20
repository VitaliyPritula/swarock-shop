"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ProductDetails({ name }: { name: string }) {
  const t = useTranslations("ProductDetails");
  const [showSizeTable, setShowSizeTable] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="mt-8 space-y-4">
      <button
        type="button"
        onClick={() => setShowSizeTable((value) => !value)}
        className="text-sm underline underline-offset-4"
      >
        {t("sizeTable")}
      </button>

      {showSizeTable && (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-center text-sm">
            <thead className="bg-secondary">
              <tr><th className="p-3">{t("size")}</th><th className="p-3">{t("chest")}</th><th className="p-3">{t("waist")}</th><th className="p-3">{t("hips")}</th></tr>
            </thead>
            <tbody>
              <tr className="border-t border-border"><td className="p-3">S</td><td>86–92</td><td>70–76</td><td>92–98</td></tr>
              <tr className="border-t border-border"><td className="p-3">M</td><td>92–98</td><td>76–82</td><td>98–104</td></tr>
              <tr className="border-t border-border"><td className="p-3">L</td><td>98–104</td><td>82–88</td><td>104–110</td></tr>
              <tr className="border-t border-border"><td className="p-3">XL</td><td>104–110</td><td>88–94</td><td>110–116</td></tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-border pt-4">
        <button
          type="button"
          onClick={() => setReviewOpen((value) => !value)}
          className="font-display text-sm uppercase"
        >
          {t("leaveReview")}
        </button>
        {reviewOpen && (
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setReviewOpen(false);
            }}
          >
            <input required name="name" placeholder={t("yourName")} className="w-full rounded border border-border px-3 py-2" />
            <textarea required name="review" placeholder={t("reviewPlaceholder", { name })} rows={4} className="w-full rounded border border-border px-3 py-2" />
            <button className="rounded bg-primary px-5 py-2 text-sm text-white">{t("submitReview")}</button>
          </form>
        )}
        {sent && <p className="mt-3 text-sm text-green-700">{t("reviewSent")}</p>}
      </div>
    </div>
  );
}
