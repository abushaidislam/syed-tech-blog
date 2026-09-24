"use client";

import React, { useState, useEffect } from "react";
import Giscus from "@giscus/react";
import { MessageSquare, Sparkles } from "lucide-react";
import type { Repo } from "@giscus/react";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme URL served via jsDelivr CDN directly from this GitHub branch
  const themeUrl =
    process.env.NEXT_PUBLIC_GISCUS_THEME ||
    "https://cdn.jsdelivr.net/gh/abushaidislam/syed-tech-blog@feat/giscus-comments/public/styles/giscus.css";

  const repo = (process.env.NEXT_PUBLIC_GISCUS_REPO || "abushaidislam/syed-tech-blog") as Repo;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDOUip-3Q";
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General";
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "DIC_kwDOUip-3c4DGP4M";

  return (
    <section
      aria-label="Discussion and Comments"
      className={`border-t border-grid-border px-5 py-12 sm:px-12 ${className}`}
    >
      <div className="mx-auto max-w-3xl">
        {/* Dub Section Header */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/90 bg-neutral-50 text-neutral-900 shadow-2xs">
              <MessageSquare className="size-4 text-neutral-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
                  Discussion &amp; Comments
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-2xs font-medium text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  GitHub Realtime
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                Comments and replies sync live with your GitHub Discussions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400 sm:justify-end">
            <Sparkles className="size-3.5 text-neutral-400" />
            <span>Markdown supported</span>
          </div>
        </div>

        {/* Real-time Live Giscus Engine */}
        <div className="min-h-[280px]">
          {mounted ? (
            <Giscus
              id="blog-comments"
              repo={repo}
              repoId={repoId}
              category={category}
              categoryId={categoryId}
              mapping="pathname"
              strict="0"
              reactionsEnabled="0"
              emitMetadata="0"
              inputPosition="top"
              theme={themeUrl}
              lang="en"
              loading="lazy"
            />
          ) : (
            <div className="flex h-36 items-center justify-center text-xs text-neutral-400">
              Loading discussion from GitHub...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
