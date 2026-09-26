export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export interface LocaleConfig {
  label: string;
  nativeLabel: string;
  short: string;
  flag: string;
  dir: "ltr" | "rtl";
  code: string;
}

export const LOCALE_METADATA: Record<Locale, LocaleConfig> = {
  en: {
    label: "English",
    nativeLabel: "English",
    short: "EN",
    flag: "🇺🇸",
    dir: "ltr",
    code: "en-US",
  },
  bn: {
    label: "Bengali",
    nativeLabel: "বাংলা",
    short: "বাং",
    flag: "🇧🇩",
    dir: "ltr",
    code: "bn-BD",
  },
};

export function isSupportedLocale(locale: unknown): locale is Locale {
  return typeof locale === "string" && LOCALES.includes(locale as Locale);
}

export function getCleanPathnameWithoutLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}

export function buildLocalizedPath(pathname: string, targetLocale: Locale): string {
  const cleanPath = getCleanPathnameWithoutLocale(pathname);
  if (cleanPath === "/") {
    return `/${targetLocale}`;
  }
  return `/${targetLocale}${cleanPath}`;
}
