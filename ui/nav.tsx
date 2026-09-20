"use client";

import Link from "next/link";
import { useState } from "react";
import { SyedBlogWordmark } from "./brand";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-grid-border/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 max-w-grid-width items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/blog" className="flex items-center gap-2">
            <SyedBlogWordmark />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <Link
              href="/blog"
              className="text-neutral-900 transition-colors hover:text-black"
            >
              All Articles
            </Link>
            <Link
              href="/blog/category/engineering"
              className="transition-colors hover:text-neutral-900"
            >
              Engineering
            </Link>
            <Link
              href="/blog/category/company"
              className="transition-colors hover:text-neutral-900"
            >
              Company
            </Link>
            <Link
              href="/blog/category/education"
              className="transition-colors hover:text-neutral-900"
            >
              Education
            </Link>
            <Link
              href="/blog/category/customers"
              className="transition-colors hover:text-neutral-900"
            >
              Customer Stories
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/blog/category/engineering"
            className="flex h-8 items-center rounded-lg bg-neutral-900 px-3.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-neutral-800"
          >
            Explore
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100"
            aria-label="Toggle Menu"
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
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              All Articles
            </Link>
            <Link
              href="/blog/category/engineering"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              Engineering
            </Link>
            <Link
              href="/blog/category/company"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              Company News
            </Link>
            <Link
              href="/blog/category/education"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              Education
            </Link>
            <Link
              href="/blog/category/customers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-neutral-100"
            >
              Customer Stories
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
