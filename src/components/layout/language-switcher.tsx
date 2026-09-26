"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LOCALES, LOCALE_METADATA, type Locale } from "@/config/i18n";
import { useLocale } from "./locale-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  className,
  align = "right",
}: {
  className?: string;
  align?: "left" | "right";
}) {
  const { locale, switchLocale, isPending } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMeta = LOCALE_METADATA[locale];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isPending}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/90 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs backdrop-blur-xs transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-neutral-900 active:scale-95 disabled:opacity-60",
          isOpen && "border-neutral-400 bg-neutral-50",
        )}
      >
        <Globe className="size-3.5 text-neutral-500" />
        <span className="flex items-center gap-1">
          <span>{currentMeta.flag}</span>
          <span>{currentMeta.short}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-3 text-neutral-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={cn(
            "absolute z-50 mt-1.5 w-40 rounded-xl border border-neutral-200 bg-white/95 p-1 shadow-lg shadow-neutral-900/5 backdrop-blur-md animate-in fade-in-0 zoom-in-95",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {LOCALES.map((loc) => {
            const meta = LOCALE_METADATA[loc];
            const isSelected = loc === locale;
            return (
              <button
                key={loc}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  switchLocale(loc);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-neutral-100 text-neutral-900 font-semibold"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{meta.flag}</span>
                  <span>{meta.nativeLabel}</span>
                </span>
                {isSelected && <Check className="size-3.5 text-neutral-900" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
