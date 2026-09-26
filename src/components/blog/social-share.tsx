"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Share2 } from "lucide-react";
import { ShareModal } from "./share-modal";

interface SocialShareProps {
  url: string;
  title: string;
  summary?: string;
  category?: string;
  image?: string;
  layout?: "button" | "card" | "sidebar" | "floating";
  className?: string;
}

export function SocialShare({
  url,
  title,
  summary = "",
  category = "Article",
  image,
  layout = "button",
  className = "",
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);

  useEffect(() => {
    if (layout !== "floating") return;

    const handleScroll = () => setIsFloatingVisible(window.scrollY > 320);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [layout]);

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
        <div
          className={`group relative border-y border-neutral-200/80 py-4 ${className}`}
        >
          <div className="relative flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Share this article
              </p>
              <p className="mt-1 text-xs text-neutral-500">Send it to your team</p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              aria-label="Share this article"
              className="group/button flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white active:scale-95 cursor-pointer"
            >
              <Share2 className="size-4 transition-transform duration-200 group-hover/button:rotate-12" />
            </button>
          </div>
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

      {layout === "floating" &&
        isFloatingVisible &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="group/share fixed bottom-36 right-4 z-50 sm:right-6">
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              aria-label="Share this article"
              title="Share this article"
              className="flex size-11 items-center justify-center rounded-full border border-neutral-200/90 bg-white/95 text-neutral-600 shadow-md ring-1 ring-black/5 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-900 hover:text-neutral-950 hover:shadow-lg active:scale-95"
            >
              <Share2 className="size-4.5 transition-transform duration-200 group-hover/share:rotate-12" />
            </button>
            <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-neutral-200/90 bg-white/95 px-3 py-1.5 text-xs font-medium text-neutral-700 opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-150 group-hover/share:opacity-100">
              Share this article
            </span>
          </div>,
          document.body
        )}

      {/* The Popup Modal */}
      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        url={url}
        title={title}
        summary={summary}
        category={category}
        image={image}
      />
    </>
  );
}
