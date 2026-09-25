"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { BlogPostMeta } from "@/types/blog";
import { SyedBlogLogo } from "@/components/layout/brand";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPostMeta;
  priority?: boolean;
}

function decodeEntities(text: string) {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

import { useLocale } from "@/components/layout/locale-provider";

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const { locale } = useLocale();
  const isFeatured = Boolean(post.featured);

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden transition-all duration-300",
        isFeatured
          ? "bg-gradient-to-br from-indigo-100/90 via-purple-50/70 to-sky-100/90 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.15)]"
          : "bg-white hover:bg-neutral-50/70",
      )}
    >
      <div>
        <div className="relative aspect-[1200/630] w-full overflow-hidden bg-neutral-100">
          {/* Featured badge pill - Dub style */}
          {isFeatured && (
            <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white/95 px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-md select-none">
              <Sparkles className="size-3 text-neutral-600 stroke-[1.75]" aria-hidden="true" />
              <span className="text-[11px] font-medium tracking-tight text-neutral-800">
                Featured
              </span>
            </div>
          )}
          {post.image ? (
            <Image
              src={post.image}
              alt={decodeEntities(post.title)}
              width={1200}
              height={630}
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
              className="aspect-[1200/630] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="relative aspect-[1200/630] flex size-full flex-col items-center justify-center overflow-hidden bg-neutral-900 select-none">
              <Image
                src="/renderx_background_VECTOR_DOTS_AND_LINES.svg"
                alt={decodeEntities(post.title)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white/95 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <SyedBlogLogo className="size-6 text-neutral-900" />
                </div>
                <span className="mt-2.5 rounded-full border border-neutral-200/90 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-800 shadow-sm backdrop-blur">
                  {post.category?.name || "Article"}
                </span>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.04]" />
        </div>

        <div className="relative p-6 pb-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 font-display text-lg font-bold tracking-tight text-neutral-900 transition-colors duration-150 group-hover:text-black">
              {decodeEntities(post.title)}
            </h2>
            <ArrowUpRight className="mt-1 size-4.5 shrink-0 text-neutral-400 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-neutral-900" />
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-neutral-500 leading-relaxed">
            {decodeEntities(post.summary)}
          </p>
        </div>
      </div>

      <div className="relative p-6 pt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {post.authors && post.authors.length > 0 && (
            <div className="flex items-center -space-x-2">
              {post.authors.map((author, i) => (
                <div
                  key={`${author.name}-${i}`}
                  className="relative size-8 rounded-full border-2 border-white bg-neutral-200 transition-all duration-200 group-hover:brightness-95 hover:!scale-125 hover:!z-20 hover:shadow-md"
                  title={author.name}
                >
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={32}
                    height={32}
                    className="size-full rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <time
            dateTime={post.dateIso}
            className="text-xs sm:text-sm text-neutral-500 transition-colors group-hover:text-neutral-600"
          >
            {post.dateFormatted}
          </time>
        </div>

        {post.category && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 transition-colors group-hover:text-neutral-600">
            {post.category.name}
          </span>
        )}
      </div>
    </Link>
  );
}
