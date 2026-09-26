"use client";

import React, { createContext, useContext, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  type Locale,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  buildLocalizedPath,
} from "@/config/i18n";
import type { Dictionary } from "@/lib/dictionary";

interface LocaleContextType {
  locale: Locale;
  dict: Dictionary;
  switchLocale: (newLocale: Locale) => void;
  isPending: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({
  children,
  locale,
  dict,
}: {
  children: React.ReactNode;
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // 1. Set cookie for 1 year
    const maxAge = 60 * 60 * 24 * 365; // 365 days
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${maxAge}; SameSite=Lax`;

    // 2. Build target path and route smoothly
    const targetPath = buildLocalizedPath(pathname, newLocale);
    startTransition(() => {
      router.push(targetPath);
      router.refresh();
    });
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        dict,
        switchLocale,
        isPending,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
