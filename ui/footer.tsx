"use client";

import Link from "next/link";
import { useState } from "react";
import { SyedBlogWordmark } from "./brand";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ChevronDown,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react";

interface StatusBadgeProps {
  className?: string;
}

export function LiveStatusBadge({ className }: StatusBadgeProps) {
  return (
    <Link
      href="/blog"
      className={cn(
        "group flex max-w-fit items-center gap-2.5 rounded-lg border border-neutral-200 bg-white py-1.5 pl-2.5 pr-3 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98]",
        className,
      )}
    >
      <div className="relative flex size-2 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </div>
      <p className="text-xs font-medium leading-none text-neutral-700 transition-colors group-hover:text-neutral-900">
        All systems operational
      </p>
    </Link>
  );
}

const socials = [
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://twitter.com",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com",
  },
  {
    name: "YouTube",
    icon: Youtube,
    href: "https://youtube.com",
  },
];

const navigation = {
  product: [
    {
      name: "Engineering",
      href: "/blog/category/engineering",
      icon: Terminal,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      name: "Architecture",
      href: "/blog/category/engineering",
      icon: Cpu,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      name: "Cloud Edge",
      href: "/blog/category/engineering",
      icon: Layers,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      name: "AI & Automation",
      href: "/blog/category/company",
      icon: Sparkles,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
  ],
  categories: [
    { name: "Company News", href: "/blog/category/company" },
    { name: "Education", href: "/blog/category/education" },
    { name: "Engineering", href: "/blog/category/engineering" },
    { name: "Customer Stories", href: "/blog/category/customers" },
    { name: "All Articles", href: "/blog" },
  ],
  resources: [
    { name: "Tutorials & Guides", href: "/blog/category/education" },
    { name: "Changelog", href: "/blog" },
    { name: "Tech Stack", href: "/blog" },
    { name: "Documentation", href: "/blog" },
    {
      name: "Source Code",
      href: "https://github.com",
      external: true,
    },
  ],
  company: [
    { name: "About Syed Blog", href: "/blog" },
    { name: "Authors & Team", href: "/blog" },
    { name: "Careers", href: "/blog" },
    { name: "Contact", href: "/blog" },
    { name: "Privacy Policy", href: "/blog" },
    { name: "Terms of Service", href: "/blog" },
  ],
};

const linkHeaderClass = "text-sm font-semibold text-neutral-900 tracking-tight";
const linkListClass = "flex flex-col mt-3.5 gap-3";
const linkItemClass =
  "group flex items-center gap-2 text-sm text-neutral-500 transition-all duration-150 hover:text-neutral-900 hover:translate-x-0.5";

export function Footer() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-grid-width px-4 pt-10 sm:px-8">
      <div className="relative overflow-hidden rounded-t-3xl border border-b-0 border-grid-border bg-white/70 py-16 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
        {/* Subtle Ambient Grid Background Mask */}
        <div className="pointer-events-none absolute inset-0 border-x border-neutral-100/60 [mask-image:linear-gradient(black,transparent)]" />

        <footer className="relative mx-auto max-w-7xl px-6 sm:px-10">
          <div className="xl:grid xl:grid-cols-3 xl:gap-12">
            {/* Left Col: Brand Wordmark + Bio + Socials */}
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <Link href="/blog" className="block max-w-fit">
                  <SyedBlogWordmark />
                </Link>
                <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
                  Engineering insights, high-scale digital architecture, and modern software tutorials by Syed.
                </p>
              </div>

              {/* Social Icons matching Dub UX */}
              <div className="flex items-center gap-2">
                {socials.map(({ name, icon: Icon, href }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex size-9 items-center justify-center rounded-lg border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 hover:shadow"
                    aria-label={name}
                  >
                    <Icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right Cols: Navigation Links Grid */}
            <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4 xl:col-span-2 xl:mt-0">
              {/* Product / Topics */}
              <div>
                <h3 className={linkHeaderClass}>Topics</h3>
                <ul role="list" className={linkListClass}>
                  {navigation.product.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link href={item.href} className={linkItemClass}>
                          <span
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                              item.color,
                            )}
                          >
                            <Icon className="size-3" />
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h3 className={linkHeaderClass}>Categories</h3>
                <ul role="list" className={linkListClass}>
                  {navigation.categories.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className={linkItemClass}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className={linkHeaderClass}>Resources</h3>
                <ul role="list" className={linkListClass}>
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        className={linkItemClass}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className={linkHeaderClass}>Company</h3>
                <ul role="list" className={linkListClass}>
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className={linkItemClass}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row: Status Badge, SOC2 Badge, Copyright matching Dub 1:1 */}
          <div className="mt-14 grid grid-cols-1 items-center gap-6 border-t border-neutral-200/80 pt-8 sm:grid-cols-3">
            <div>
              <LiveStatusBadge />
            </div>

            {/* SOC 2 Type II Certified Badge */}
            <div className="flex sm:justify-center">
              <div
                title="AICPA SOC 2 Type II Certified"
                className="group flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50"
              >
                <svg
                  viewBox="0 0 63 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-auto text-neutral-800 transition-[filter] group-hover:brightness-75"
                >
                  <rect width="63" height="32" rx="4" fill="#0A0A0A" />
                  <path
                    d="M14 9C10.6863 9 8 11.6863 8 15C8 18.3137 10.6863 21 14 21C16.5 21 18 19.5 18.5 18H15V16H20.8C20.9 16.5 21 17 21 17.5C21 21.5 18 24 14 24C9 24 5 20 5 15C5 10 9 6 14 6C17.5 6 20 8 20.8 11H18.5C17.8 9.8 16 9 14 9Z"
                    fill="white"
                  />
                  <text
                    x="24"
                    y="16"
                    fill="white"
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="system-ui, sans-serif"
                    letterSpacing="0.5"
                  >
                    SOC 2
                  </text>
                  <text
                    x="24"
                    y="22"
                    fill="#A3A3A3"
                    fontSize="5"
                    fontFamily="system-ui, sans-serif"
                    letterSpacing="0.2"
                  >
                    TYPE II
                  </text>
                </svg>
                <span className="text-[11px] font-medium text-neutral-600">
                  Certified Security
                </span>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-xs text-neutral-400 sm:text-right">
              © {new Date().getFullYear()} Syed Blog. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
