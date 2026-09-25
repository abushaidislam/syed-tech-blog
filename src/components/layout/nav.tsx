"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SyedBlogWordmark } from "./brand";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "./locale-provider";
import { LanguageSwitcher } from "./language-switcher";

export function Nav() {
  const { locale, dict } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let frameId: number;

    const handleScroll = () => {
      if (!ticking) {
        frameId = window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-grid-border bg-white/85 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)]"
          : "border-b border-grid-border/80 bg-white/70 backdrop-blur-md shadow-none",
      )}
    >
      <div className="mx-auto flex h-14 max-w-grid-width items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href={`/${locale}/blog`} className="flex items-center gap-2">
            <SyedBlogWordmark />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <Link
              href={`/${locale}/blog`}
              className="text-neutral-900 transition-colors hover:text-black"
            >
              {dict.nav.allArticles}
            </Link>
            <Link
              href={`/${locale}/blog/category/engineering`}
              className="transition-colors hover:text-neutral-900"
            >
              {dict.nav.engineering}
            </Link>
            <Link
              href={`/${locale}/blog/category/company`}
              className="transition-colors hover:text-neutral-900"
            >
              {dict.nav.company}
            </Link>
            <Link
              href={`/${locale}/blog/category/education`}
              className="transition-colors hover:text-neutral-900"
            >
              {dict.nav.education}
            </Link>
            <Link
              href={`/${locale}/blog/category/customers`}
              className="transition-colors hover:text-neutral-900"
            >
              {dict.nav.customers}
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href={`/${locale}/blog/category/engineering`}
            className="flex h-8 items-center rounded-lg bg-neutral-900 px-3.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-neutral-800"
          >
            {dict.nav.explore}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100"
            aria-label={dict.nav.menu}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-grid-border bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-neutral-700">
            <Link
              href={`/${locale}/blog`}
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              {dict.nav.allArticles}
            </Link>
            <Link
              href={`/${locale}/blog/category/engineering`}
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              {dict.nav.engineering}
            </Link>
            <Link
              href={`/${locale}/blog/category/company`}
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              {dict.nav.company}
            </Link>
            <Link
              href={`/${locale}/blog/category/education`}
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              {dict.nav.education}
            </Link>
            <Link
              href={`/${locale}/blog/category/customers`}
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              {dict.nav.customers}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
