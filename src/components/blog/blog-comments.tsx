"use client";

import React, { useState, useEffect } from "react";
import Giscus from "@giscus/react";
import { MessageSquare, ExternalLink, Sparkles } from "lucide-react";
import type { Mapping, Theme, Repo } from "@giscus/react";

interface BlogCommentsProps {
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
  mapping?: Mapping;
  theme?: Theme;
  className?: string;
}

export function BlogComments({
  repo = process.env.NEXT_PUBLIC_GISCUS_REPO || "abushaidislam/syed-tech-blog",
  repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDOUip-3Q",
  category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General",
  categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "DIC_kwDOUip-3c4DGP4M",
  mapping = "pathname",
  theme = (process.env.NEXT_PUBLIC_GISCUS_THEME as Theme) || "noborder_light",
  className = "",
}: BlogCommentsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isConfigured = Boolean(repo && repoId && category && categoryId);

  return (
    <section
      aria-label="Discussion and Comments"
      className={`border-t border-grid-border px-5 py-10 sm:px-12 ${className}`}
    >
      <div className="mx-auto max-w-3xl">
        {/* Dub-style Outer Card Container */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-8 shadow-2xs">
          {/* Header Inside Card */}
          <div className="mb-6 flex flex-col gap-3 border-b border-neutral-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/90 bg-neutral-50 text-neutral-900 shadow-2xs">
                <MessageSquare className="size-4" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
                  Discussion & Comments
                </h3>
                <p className="text-xs text-neutral-500">
                  Powered by GitHub Discussions • Markdown supported
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-400 sm:justify-end">
              <Sparkles className="size-3.5 text-neutral-400" />
              <span>Sign in with GitHub to participate</span>
            </div>
          </div>

          {/* Giscus Widget */}
          {isConfigured ? (
            <div className="min-h-[260px]">
              {mounted ? (
                <Giscus
                  id="blog-comments"
                  repo={repo as Repo}
                  repoId={repoId}
                  category={category}
                  categoryId={categoryId}
                  mapping={mapping}
                  strict="0"
                  reactionsEnabled="0"
                  emitMetadata="0"
                  inputPosition="top"
                  theme={theme}
                  lang="en"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-32 items-center justify-center text-sm text-neutral-400">
                  Loading comments...
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-neutral-800">
              <p className="text-sm font-medium">Giscus is not fully configured.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
