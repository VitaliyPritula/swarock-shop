export const uah = (n: number, locale = "uk") =>
  `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Number(n))} ₴`;
