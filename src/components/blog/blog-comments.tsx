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
  theme = (process.env.NEXT_PUBLIC_GISCUS_THEME as Theme) || "light",
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
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg border border-neutral-200/80 bg-neutral-100 text-neutral-800 shadow-2xs">
              <MessageSquare className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
                Discussion & Comments
              </h3>
              <p className="text-xs text-neutral-500">
                Powered by GitHub Discussions • Markdown and emoji reactions supported
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400">
            <Sparkles className="size-3.5 text-neutral-400" />
            <span>Sign in with GitHub to comment</span>
          </div>
        </div>

        {/* Content Area: Configured vs Setup Helper */}
        {isConfigured ? (
          <div className="min-h-[280px]">
            {mounted ? (
              <Giscus
                id="blog-comments"
                repo={repo as Repo}
                repoId={repoId}
                category={category}
                categoryId={categoryId}
                mapping={mapping}
                strict="0"
                reactionsEnabled="1"
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
          /* Graceful Setup Guide / Fallback State */
          <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-6 sm:p-8 text-neutral-800 shadow-2xs">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wider text-neutral-600">
                  Giscus Integration
                </div>
                <h4 className="font-display text-base font-semibold text-neutral-900">
                  Connect GitHub Discussions Comments
                </h4>
                <p className="max-w-xl text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Comments are powered by GitHub Discussions for{" "}
                  <code className="rounded bg-neutral-200/70 px-1.5 py-0.5 text-neutral-900 font-mono text-2xs">
                    {repo}
                  </code>
                  . To activate live comments, configure your repository ID and category ID in{" "}
                  <code className="rounded bg-neutral-200/70 px-1.5 py-0.5 text-neutral-900 font-mono text-2xs">
                    .env.local
                  </code>
                  .
                </p>

                <ol className="mt-3 list-decimal list-inside space-y-1 text-xs text-neutral-500">
                  <li>
                    Enable <strong>Discussions</strong> in your GitHub repository settings.
                  </li>
                  <li>
                    Visit{" "}
                    <a
                      href="https://giscus.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-neutral-800 underline underline-offset-2 hover:text-neutral-950"
                    >
                      giscus.app
                    </a>{" "}
                    to generate your repository &amp; category IDs.
                  </li>
                  <li>
                    Add <code className="font-mono text-2xs text-neutral-700">NEXT_PUBLIC_GISCUS_REPO_ID</code> and{" "}
                    <code className="font-mono text-2xs text-neutral-700">NEXT_PUBLIC_GISCUS_CATEGORY_ID</code> to your environment.
                  </li>
                </ol>
              </div>

              <a
                href="https://giscus.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-2xs transition-all hover:bg-neutral-800 active:scale-95 shrink-0"
              >
                <span>Setup on Giscus</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
