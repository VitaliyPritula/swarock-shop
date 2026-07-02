export const appLocales = ["uk", "en", "it"] as const;

export type AppLocale = (typeof appLocales)[number];
export type ContentLocale = "uk" | "en";

export type LocaleOption = {
  code: AppLocale;
  shortLabel: string;
  intlLabel: string;
  nativeLabel: string;
  ogLocale: string;
};

export const localeOptions: LocaleOption[] = [
  {
    code: "uk",
    shortLabel: "UA",
    intlLabel: "uk-UA",
    nativeLabel: "Українська",
    ogLocale: "uk_UA",
  },
  {
    code: "en",
    shortLabel: "EN",
    intlLabel: "en-GB",
    nativeLabel: "English",
    ogLocale: "en_GB",
  },
  {
    code: "it",
    shortLabel: "IT",
    intlLabel: "it-IT",
    nativeLabel: "Italiano",
    ogLocale: "it_IT",
  },
];

export const defaultLocale: AppLocale = "uk";

export function isAppLocale(value: string | undefined): value is AppLocale {
  return value !== undefined && appLocales.includes(value as AppLocale);
}

export function resolveAppLocale(value: string | null | undefined): AppLocale {
  const locale = value ?? undefined;
  return isAppLocale(locale) ? locale : defaultLocale;
}

export function isDefaultLocale(locale: AppLocale): boolean {
  return locale === defaultLocale;
}

export function getLocalePathPrefix(locale: AppLocale): "" | `/${AppLocale}` {
  return isDefaultLocale(locale) ? "" : `/${locale}`;
}

export function localizePath(path: string, locale: AppLocale): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const prefix = getLocalePathPrefix(locale);

  if (normalizedPath === "/") {
    return prefix || "/";
  }

  return `${prefix}${normalizedPath}`;
}

export function getContentLocale(locale: AppLocale): ContentLocale {
  return locale === "uk" ? "uk" : "en";
}
