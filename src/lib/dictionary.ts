import type { Locale } from "@/config/i18n";
import en from "@/dictionaries/en.json";
import bn from "@/dictionaries/bn.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  bn,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}
