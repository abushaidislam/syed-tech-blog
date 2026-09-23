"use client";

import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { ShareModal } from "./share-modal";

interface SocialShareProps {
  url: string;
  title: string;
  summary?: string;
  category?: string;
  layout?: "button" | "card" | "sidebar";
  className?: string;
}

export function SocialShare({
  url,
  title,
  summary = "",
  category = "Article",
  layout = "button",
  className = "",
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. Card Variant (at the bottom of the article) */}
      {layout === "card" && (
        <div
          className={`my-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-5 sm:p-6 ${className}`}
        >
          <div>
            <h3 className="font-display text-base font-semibold text-neutral-900">
              Enjoyed this article?
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Share it with your teammates, friends, or social network.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-xs font-medium text-white shadow-xs transition-all hover:bg-neutral-800 active:scale-95 shrink-0 cursor-pointer"
          >
            <Share2 className="size-3.5" />
            <span>Share article</span>
          </button>
        </div>
      )}

      {/* 2. Sidebar Variant (inside the sticky sidebar) */}
      {layout === "sidebar" && (
        <div className={`rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs ${className}`}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Share
          </p>
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50/50 py-2 px-3 text-xs font-medium text-neutral-700 shadow-2xs transition-all hover:border-neutral-300 hover:bg-white active:scale-95 cursor-pointer"
          >
            <Share2 className="size-3.5 text-neutral-500" />
            <span>Share this article</span>
          </button>
        </div>
      )}

      {/* 3. Compact Button Variant (in Hero or Header) */}
      {layout === "button" && (
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          aria-label="Share this article"
          className={`inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:scale-95 cursor-pointer ${className}`}
        >
          <Share2 className="size-3.5 text-neutral-500" />
          <span>Share</span>
        </button>
      )}

      {/* The Popup Modal */}
      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        url={url}
        title={title}
        summary={summary}
        category={category}
      />
    </>
  );
}
