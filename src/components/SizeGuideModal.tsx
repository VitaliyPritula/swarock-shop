"use client";

import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export type SizeGuideType = "tshirt" | "jacket" | "shoes";

type SizeGuideModalProps = {
  open: boolean;
  onClose: () => void;
  closeLabel?: string;
  type?: SizeGuideType;
};

type Guide = {
  title: { uk: string; en: string };
  sizeLabel: { uk: string; en: string };
  columns: { uk: string[]; en: string[] };
  rows: string[][];
  hint?: { uk: string; en: string };
  showIllustration: boolean;
};

// Значення приклад: замініть на реальні заміри ваших виробів
const guides: Record<SizeGuideType, Guide> = {
  tshirt: {
    title: { uk: "Таблиця розмірів", en: "Size guide" },
    sizeLabel: { uk: "РОЗМІР", en: "SIZE" },
    columns: {
      uk: ["A - довжина", "B - довжина"],
      en: ["A - length", "B - length"],
    },
    rows: [
      ["S", "65", "42"],
      ["M", "67", "46"],
      ["L", "68", "50"],
      ["XL", "72", "53"],
      ["XXL", "75", "56"],
      ["XXXL", "78", "59"],
      ["4XL (XXXL euro)", "80", "67"],
    ],
    showIllustration: true,
  },
  jacket: {
    title: { uk: "Таблиця розмірів курток", en: "Jacket size guide" },
    sizeLabel: { uk: "РОЗМІР", en: "SIZE" },
    columns: {
      uk: ["Груди, см", "Довжина, см", "Рукав, см"],
      en: ["Chest, cm", "Length, cm", "Sleeve, cm"],
    },
    rows: [
      ["S", "52", "66", "61"],
      ["M", "54", "68", "62"],
      ["L", "57", "70", "63"],
      ["XL", "60", "72", "64"],
      ["XXL", "63", "74", "65"],
      ["XXXL", "66", "76", "66"],
    ],
    hint: {
      uk: "Розміри вказано для виробу, а не для тіла. Ширина виміряна по грудях від шва до шва.",
      en: "Measurements are of the garment, not the body. Chest is measured flat, seam to seam.",
    },
    showIllustration: false,
  },
  shoes: {
    title: { uk: "Таблиця розмірів взуття", en: "Shoe size guide" },
    sizeLabel: { uk: "РОЗМІР", en: "SIZE" },
    columns: { uk: [], en: [] },
    rows: [
      ["40"],
      ["41"],
      ["42"],
      ["43"],
      ["44"],
      ["45"],
      ["46"],
    ],
    showIllustration: false,
  },
};

export default function SizeGuideModal({
  open,
  onClose,
  closeLabel,
  type = "tshirt",
}: SizeGuideModalProps) {
  const locale = useLocale();
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const lang = locale.startsWith("uk") ? "uk" : "en";
  const guide = guides[type];
  const title = guide.title[lang];
  const sizeLabel = guide.sizeLabel[lang];
  const columns = guide.columns[lang];

  const modal = (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 max-h-[calc(100vh-24px)] w-full max-w-[980px] overflow-auto rounded-sm bg-white px-4 py-5 text-primary shadow-2xl sm:px-8 sm:py-7">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel ?? title}
          className="absolute right-3 top-3 p-1 sm:right-5 sm:top-5"
        >
          <X className="h-4 w-6 stroke-[1.5]" />
        </button>
        <h2 className="mb-5 text-center text-[16px] font-medium sm:mb-7">{title}</h2>
        <div className={guide.showIllustration
          ? "grid items-center gap-6 md:grid-cols-[240px_minmax(390px,1fr)]"
          : "grid items-stretch gap-6"}>
          {guide.showIllustration && (
          <div className="hidden items-center justify-center md:flex">
            <svg viewBox="0 0 330 270" className="h-[230px] w-[260px]" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter" strokeWidth="4">
                <path d="M99 38L54 47L54 128L80 128L80 236L231 236L231 128L257 128L257 47L212 38C206 78 188 101 155 101C122 101 105 78 99 38Z" />
              </g>
              <g fill="currentColor">
                <circle cx="42" cy="236" r="5" />
                <circle cx="269" cy="236" r="5" />
                <path d="M42 236L57 228V244ZM269 236L254 228V244Z" />
                <circle cx="257" cy="128" r="5" />
                <circle cx="257" cy="236" r="5" />
                <path d="M257 128L248 144H266ZM257 236L248 220H266Z" />
              </g>
              <g fill="none" stroke="currentColor" strokeWidth="4">
                <path d="M42 236H269" />
                <path d="M257 128V236" />
              </g>
              <g fontFamily="Arial, sans-serif" fontSize="21" fontWeight="700" textAnchor="middle" fill="currentColor">
                <text x="155" y="262">B</text>
                <text x="283" y="192">A</text>
              </g>
            </svg>
          </div>
          )}
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full table-fixed border-collapse border border-primary text-center text-[14px] sm:text-[16px]">
              <thead>
                {columns.length === 0 ? (
                  <tr className="h-14">
                    <th className="border border-primary px-2 font-medium">{sizeLabel}</th>
                    <th className="border border-primary px-2 font-medium">SvaROCK</th>
                  </tr>
                ) : (
                  <>
                    <tr className="h-12">
                      <th rowSpan={2} className="w-[34%] border border-primary px-2 text-[22px] font-medium sm:text-[26px]">{sizeLabel}</th>
                      <th colSpan={columns.length} className="border border-primary px-2 text-[18px] font-normal">SvaROCK</th>
                    </tr>
                    <tr className="h-10">
                      {columns.map((column) => (
                        <th key={column} className="border border-primary px-2 font-normal">{column}</th>
                      ))}
                    </tr>
                  </>
                )}
              </thead>
              <tbody>
                {guide.rows.map(([size, ...values]) => (
                  <tr key={size} className="h-[26px]">
                    <td className="border border-primary px-2">{size}</td>
                    {values.map((value, index) => (
                      <td key={`${size}-${index}`} className="border border-primary px-2">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {guide.hint && (
              <p className="mt-3 text-xs text-muted-foreground sm:text-sm">{guide.hint[lang]}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}