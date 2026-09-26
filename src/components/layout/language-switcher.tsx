"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import { Globe, Loader2 } from "lucide-react";
import { LOCALES, LOCALE_METADATA, type Locale } from "@/config/i18n";
import { useLocale } from "./locale-provider";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, switchLocale, isPending } = useLocale();
  const [hoveredLocale, setHoveredLocale] = useState<Locale | null>(null);

  const toggleLocale = () => {
    if (isPending) return;
    const nextLocale = locale === "en" ? "bn" : "en";
    switchLocale(nextLocale);
  };

  return (
    <LayoutGroup id="footer-language-switcher">
      <div
        role="radiogroup"
        aria-label={locale === "bn" ? "ভাষা নির্বাচন করুন" : "Select language"}
        className={cn(
          "group/lang relative inline-flex items-center gap-1 rounded-full border border-neutral-200/90 bg-white/95 p-1 shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-neutral-300 hover:shadow-xs",
          className,
        )}
      >
        {/* Animated Globe / Fast Toggle Button */}
        <button
          type="button"
          onClick={toggleLocale}
          disabled={isPending}
          title={
            locale === "en"
              ? "বাংলা ভাষায় পরিবর্তন করুন (Click to switch)"
              : "Switch to English (ক্লিক করে পরিবর্তন করুন)"
          }
          aria-label={locale === "en" ? "Switch to Bengali" : "Switch to English"}
          className="relative flex size-6 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50"
        >
          <motion.div
            animate={{
              rotate: locale === "bn" ? 180 : 0,
              scale: isPending ? [1, 0.85, 1] : 1,
            }}
            transition={{
              rotate: { type: "spring", stiffness: 320, damping: 22 },
              scale: { repeat: isPending ? Infinity : 0, duration: 0.8 },
            }}
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin text-neutral-600" />
            ) : (
              <Globe className="size-3.5" />
            )}
          </motion.div>
        </button>

        {/* Morphing Segmented Options */}
        <div className="relative flex items-center gap-0.5">
          {LOCALES.map((loc) => {
            const meta = LOCALE_METADATA[loc];
            const isSelected = loc === locale;

            return (
              <motion.button
                key={loc}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isPending}
                onClick={() => switchLocale(loc)}
                onMouseEnter={() => setHoveredLocale(loc)}
                onMouseLeave={() => setHoveredLocale(null)}
                whileTap={{ scale: 0.93 }}
                title={`${meta.nativeLabel} (${meta.label})`}
                className={cn(
                  "relative z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed",
                  isSelected
                    ? "font-semibold text-white"
                    : "font-medium text-neutral-500 hover:text-neutral-900",
                )}
              >
                {/* Active Fluid Morph Pill */}
                {isSelected && (
                  <motion.div
                    layoutId="active-language-morph-pill"
                    className="absolute inset-0 rounded-full bg-neutral-900 shadow-xs"
                    transition={{
                      type: "spring",
                      stiffness: 460,
                      damping: 32,
                      mass: 0.8,
                    }}
                  />
                )}

                {/* Hover Morph Pill for Inactive Option */}
                {!isSelected && hoveredLocale === loc && (
                  <motion.div
                    layoutId="hover-language-morph-pill"
                    className="absolute inset-0 rounded-full bg-neutral-100"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                {/* Label Content */}
                <span className="relative z-10 flex items-center gap-1.5 px-0.5">
                  <span
                    className={cn(
                      "text-[11px] font-semibold tracking-wider uppercase",
                      loc === "bn" && "font-bangla font-medium tracking-normal text-xs",
                    )}
                  >
                    {meta.short}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
}
