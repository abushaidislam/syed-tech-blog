import Link from "next/link";
import { SyedBlogWordmark } from "./brand";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  ArrowUpRight,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

interface StatusBadgeProps {
  className?: string;
}

export function LiveStatusBadge({ className }: StatusBadgeProps) {
  return (
    <Link
      href="/blog"
      className={cn(
        "group flex max-w-fit items-center gap-2.5 rounded-lg border border-neutral-200 bg-white py-1.5 pl-2.5 pr-3 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="relative flex size-2 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </div>
      <p className="text-xs font-medium leading-none text-neutral-700 transition-colors group-hover:text-neutral-900">
        Fresh writing, thoughtfully published
      </p>
    </Link>
  );
}

const socials = [
  {
    name: "Twitter",
    icon: TwitterIcon,
    href: siteConfig.links.twitter,
  },
  {
    name: "LinkedIn",
    icon: LinkedInIcon,
    href: siteConfig.links.linkedin,
  },
  {
    name: "GitHub",
    icon: GitHubIcon,
    href: siteConfig.links.github,
  },
  {
    name: "YouTube",
    icon: YouTubeIcon,
    href: siteConfig.links.youtube,
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
      href: siteConfig.links.github,
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
  "group flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

export function Footer() {
  return (
    <>
      {/* Spacer Grid Section */}
      <div className="grid-section relative overflow-clip border-y border-b-0 border-grid-border px-4 [.grid-section_~_&]:border-t-0">
        <div className="relative z-0 mx-auto h-12 max-w-grid-width border-x border-grid-border sm:h-16" />
      </div>

      {/* Footer Main Section — Grid-line style */}
      <div className="grid-section relative overflow-clip border-y border-grid-border px-4 [.grid-section_~_&]:border-t-0">
        <div className="relative z-0 mx-auto max-w-grid-width border-x border-grid-border">
          {/* Ambient grid background mask */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2">
              <svg
                className="pointer-events-none absolute inset-0 text-grid-border/40 [mask-composite:intersect] [mask-image:linear-gradient(transparent,black),radial-gradient(black,transparent)]"
                width="100%"
                height="100%"
              >
                <defs>
                  <pattern
                    id="grid-footer-bg"
                    x="-1"
                    y="-1"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 60 0 L 0 0 0 60"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect
                  fill="url(#grid-footer-bg)"
                  width="100%"
                  height="100%"
                />
              </svg>
            </div>
          </div>

          <footer className="relative">
            {/* Top Row: Brand + Navigation Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Col: Brand Wordmark + Bio + Socials */}
              <div className="flex flex-col justify-between gap-8 border-b border-grid-border bg-white/70 p-6 sm:p-10 lg:col-span-4 lg:border-b-0 lg:border-r">
                <div className="space-y-5">
                  <Link
                    href="/blog"
                    className="group block max-w-fit rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    <SyedBlogWordmark />
                  </Link>
                  <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
                    Engineering insights, high-scale digital architecture, and
                    modern software tutorials by Syed.
                  </p>
                  <Link
                    href="/blog"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    Browse all articles
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-2">
                  {socials.map(({ name, icon: Icon, href }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex size-9 items-center justify-center rounded-lg border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                      aria-label={name}
                    >
                      <Icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Cols: Navigation Links Grid — 4 columns with grid-line borders */}
              <div className="grid grid-cols-2 lg:col-span-8 sm:grid-cols-4">
                {/* Topics */}
                <div className="border-b border-r border-grid-border bg-white/35 p-6 sm:border-b sm:p-8">
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
                <div className="border-b border-grid-border bg-white/35 p-6 sm:border-r sm:p-8">
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
                <div className="border-b border-r border-grid-border bg-white/35 p-6 sm:border-b-0 sm:p-8">
                  <h3 className={linkHeaderClass}>Resources</h3>
                  <ul role="list" className={linkListClass}>
                    {navigation.resources.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
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
                <div className="border-b border-grid-border bg-white/35 p-6 sm:border-b-0 sm:p-8">
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

            {/* Bottom Row */}
            <div className="grid grid-cols-1 items-center sm:grid-cols-3">
              <div className="border-b border-grid-border p-5 sm:border-b-0 sm:border-r sm:px-8">
                <LiveStatusBadge />
              </div>

              {/* A concise, honest quality signal for a personal publication. */}
              <div className="flex border-b border-grid-border p-5 sm:justify-center sm:border-b-0 sm:border-r sm:px-8">
                <div
                  title="A publication for people who build"
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
                      BUILD
                    </text>
                    <text
                      x="24"
                      y="22"
                      fill="#A3A3A3"
                      fontSize="5"
                      fontFamily="system-ui, sans-serif"
                      letterSpacing="0.2"
                    >
                      IN PUBLIC
                    </text>
                  </svg>
                  <span className="text-[11px] font-medium text-neutral-600">
                    Made for builders
                  </span>
                </div>
              </div>

              {/* Copyright */}
              <div className="p-5 sm:px-8">
                <p className="text-xs text-neutral-400 sm:text-right">
                  © {new Date().getFullYear()} Syed Blog. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
