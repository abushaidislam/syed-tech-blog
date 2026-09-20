"use client";

import Link from "next/link";
import { List } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { cn } from "@/lib/utils";
import { BLOG_CATEGORIES } from "./blog-categories";

interface BlogHeaderProps {
  title?: string;
  description?: string;
  activeCategory?: string; // slug or undefined for overview
}

export function BlogHeader({
  title = "Syed Blog",
  description = "Latest news, architecture, and engineering updates from Syed Blog",
  activeCategory,
}: BlogHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabs = [
    { name: "Overview", href: "/blog", slug: "overview" },
    ...BLOG_CATEGORIES.map((cat) => ({
      name: cat.name,
      href: `/blog/category/${cat.slug}`,
      slug: cat.slug,
    })),
  ];

  const isCurrentActive = (slug: string) => {
    if (!activeCategory && slug === "overview") return true;
    return activeCategory === slug;
  };

  return (
    <div className="grid-section relative overflow-clip border-b border-grid-border px-4">
      <div className="relative z-0 mx-auto max-w-grid-width border-x border-grid-border px-4 py-16 sm:px-12">
        {/* Ambient grid background mask */}
        <div className="pointer-events-none absolute inset-0 border-x border-grid-border [mask-image:linear-gradient(transparent,black)]" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 [mask-composite:intersect] [mask-image:linear-gradient(transparent,black)]">
          <div className="absolute inset-x-[360px] inset-y-0">
            <svg
              className="pointer-events-none absolute bottom-0 right-full h-[600px] w-[360px] text-grid-border/60 [mask-image:linear-gradient(90deg,transparent,black)]"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern
                  id="grid-blog-header-l"
                  x="0"
                  y="0"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </pattern>
              </defs>
              <rect
                fill="url(#grid-blog-header-l)"
                width="100%"
                height="100%"
              />
            </svg>
            <svg
              className="pointer-events-none absolute bottom-0 left-full h-[600px] w-[360px] text-grid-border/60 [mask-image:linear-gradient(270deg,transparent,black)]"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern
                  id="grid-blog-header-r"
                  x="-1"
                  y="0"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </pattern>
              </defs>
              <rect
                fill="url(#grid-blog-header-r)"
                width="100%"
                height="100%"
              />
            </svg>
          </div>
        </div>

        <div className="relative">
          <h1 className="font-display text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl sm:leading-[1.15]">
            {title}
          </h1>
          <p className="mt-4 text-lg text-neutral-500 sm:text-xl">
            {description}
          </p>

          {/* Desktop Category Navigation */}
          <LayoutGroup id="blog-category-nav">
            <nav
              onMouseLeave={() => setHoveredTab(null)}
              className="mt-10 hidden w-fit items-center gap-x-1.5 gap-y-4 sm:flex sm:flex-wrap"
            >
              {tabs.map((tab) => {
                const active = isCurrentActive(tab.slug);
                const isHovered = hoveredTab === tab.slug;
                return (
                  <Link
                    key={tab.slug}
                    href={tab.href}
                    onMouseEnter={() => setHoveredTab(tab.slug)}
                    className="relative z-10 block rounded-lg outline-none"
                  >
                    <div
                      className={cn(
                        "relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-150",
                        active
                          ? "text-white"
                          : "text-neutral-700 hover:text-neutral-900",
                      )}
                    >
                      {tab.name}
                    </div>

                    {/* Active spring pill */}
                    {active && (
                      <motion.div
                        layoutId="active-blog-tab"
                        className="absolute inset-0 rounded-lg bg-neutral-900 shadow-sm"
                        style={{ zIndex: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Hover spring pill */}
                    {!active && isHovered && (
                      <motion.div
                        layoutId="hover-blog-tab"
                        className="absolute inset-0 rounded-lg bg-neutral-100"
                        style={{ zIndex: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </LayoutGroup>

          {/* Mobile Categories Toggle */}
          <div className="mt-8 sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-800 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.99]"
              type="button"
            >
              <span className="flex items-center gap-2">
                <List className="size-4 text-neutral-600" />
                <span>
                  {tabs.find((t) => isCurrentActive(t.slug))?.name || "Categories"}
                </span>
              </span>
              <span className="text-xs text-neutral-400">Tap to switch</span>
            </button>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="mt-2 grid divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg"
                >
                  {tabs.map((tab) => (
                    <Link
                      key={tab.slug}
                      href={tab.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                        isCurrentActive(tab.slug)
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-50",
                      )}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
