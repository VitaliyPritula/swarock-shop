export const uah = (n: number, locale = "uk") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(Number(n));
