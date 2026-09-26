"use client";

import React, { useState, useEffect } from "react";
import Giscus from "@giscus/react";
import { GitBranch, MessageSquare, Sparkles } from "lucide-react";
import type { Repo } from "@giscus/react";
import { useLocale } from "@/components/layout/locale-provider";

interface BlogCommentsProps {
  postSlug?: string;
  postTitle?: string;
  className?: string;
}

export function BlogComments({
  postSlug = "general",
  postTitle = "Article",
  className = "",
}: BlogCommentsProps) {
  const [mounted, setMounted] = useState(false);
  const { locale, dict } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Giscus renders in a remote iframe, so it cannot fetch a stylesheet from localhost.
  const isLocalDevelopment =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  const themeUrl =
    isLocalDevelopment
      ? "light"
      : process.env.NEXT_PUBLIC_GISCUS_THEME ||
        (typeof window !== "undefined"
          ? `${window.location.origin}/styles/giscus.css`
          : "light");

  const repo = (process.env.NEXT_PUBLIC_GISCUS_REPO || "abushaidislam/syed-tech-blog") as Repo;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDOUip-3Q";
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General";
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "DIC_kwDOUip-3c4DGP4M";

  return (
    <section
      aria-label={dict.comments.ariaLabel}
      className={`giscus-section border-t border-grid-border px-5 py-12 sm:px-12 ${className}`}
    >
      <div className="mx-auto max-w-3xl">
        <div className="giscus-section-header mb-6 flex flex-col gap-4 border-y border-neutral-200/80 bg-transparent px-0 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="giscus-icon flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200/90 bg-neutral-50 text-neutral-900 shadow-2xs">
              <MessageSquare className="size-4 text-neutral-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
                  {dict.comments.title}
                </h3>
                <span className="giscus-live-badge inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-2xs font-medium text-emerald-700">
                  <span className="giscus-live-dot size-1.5 rounded-full bg-emerald-500" />
                  {dict.comments.realtime}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                {dict.comments.description}
              </p>
            </div>
          </div>

          <div className="giscus-markdown-note flex items-center gap-1.5 text-xs text-neutral-400 sm:justify-end">
            <Sparkles className="size-3.5 text-neutral-400" />
            <span>{dict.comments.markdown}</span>
          </div>
        </div>

        <div className="giscus-frame-shell min-h-[280px]">
          {mounted ? (
            <Giscus
              id="blog-comments"
              key={postSlug}
              repo={repo}
              repoId={repoId}
              category={category}
              categoryId={categoryId}
              mapping="specific"
              term={`blog/${postSlug}`}
              strict="0"
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme={themeUrl}
              lang="en"
              loading="lazy"
            />
          ) : (
            <div className="giscus-loading flex h-36 items-center justify-center gap-3 text-xs text-neutral-400">
              <span className="giscus-loading-mark flex size-8 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-2xs">
                <GitBranch className="size-4" />
              </span>
              <span>{dict.comments.loading}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
