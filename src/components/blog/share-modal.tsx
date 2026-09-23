"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Copy, Link2, Share2 } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  summary?: string;
  category?: string;
}

function decodeHtmlEntities(text: string) {
  if (!text) return "";
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

export function ShareModal({
  isOpen,
  onClose,
  url,
  title,
  summary = "",
  category = "Article",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid SSR hydration issues with createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  const cleanTitle = decodeHtmlEntities(title);
  const cleanSummary = decodeHtmlEntities(summary);

  // Handle body scroll, Lenis pause, and Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Pause Lenis smooth scrolling if active
    const globalLenis = (
      window as unknown as { lenis?: { stop: () => void; start: () => void } }
    ).lenis;
    globalLenis?.stop();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      globalLenis?.start();
    };
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareUrls = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      cleanTitle
    )}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${cleanTitle} ${url}`
    )}`,
  };

  const openShare = (shareUrl: string) => {
    if (typeof window !== "undefined") {
      const width = 640;
      const height = 540;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      window.open(
        shareUrl,
        "_blank",
        `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`
      );
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={onClose}
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.08 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg my-auto overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/95 p-6 sm:p-8 text-neutral-100 shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Header: Title + Close Button */}
            <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300">
                  <Share2 className="size-4" />
                </div>
                <h2 className="font-display text-lg font-semibold tracking-tight text-white">
                  Share this article
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="flex size-8 items-center justify-center rounded-full border border-neutral-700/80 bg-neutral-800/80 text-neutral-400 transition-all hover:border-neutral-600 hover:bg-neutral-700 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Article Snippet Card Preview */}
            <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase text-neutral-300">
                  {category}
                </span>
                <span className="text-[11px] text-neutral-500">
                  blog.flinkeo.online
                </span>
              </div>
              <p className="mt-2 line-clamp-2 font-display text-sm font-medium text-neutral-100">
                {cleanTitle}
              </p>
              {cleanSummary && (
                <p className="mt-1 line-clamp-1 text-xs text-neutral-400">
                  {cleanSummary}
                </p>
              )}
            </div>

            {/* Platform Circular Buttons Row (ChatGPT / Modern Style) */}
            <div className="mt-6 flex items-center justify-between gap-2 px-1">
              {/* 1. Copy Link */}
              <button
                onClick={handleCopyLink}
                className="group flex flex-col items-center gap-2 focus:outline-hidden cursor-pointer"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-full transition-all duration-200 shadow-md group-hover:scale-105 active:scale-95 ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-neutral-900 group-hover:bg-neutral-100"
                  }`}
                >
                  {copied ? (
                    <Check className="size-6 text-white stroke-[2.5]" />
                  ) : (
                    <Link2 className="size-6 stroke-[2.2]" />
                  )}
                </div>
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>

              {/* 2. X (Twitter) */}
              <button
                onClick={() => openShare(shareUrls.x)}
                className="group flex flex-col items-center gap-2 focus:outline-hidden cursor-pointer"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition-all duration-200 group-hover:scale-105 group-hover:bg-neutral-100 active:scale-95">
                  <svg className="size-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                  X
                </span>
              </button>

              {/* 3. LinkedIn */}
              <button
                onClick={() => openShare(shareUrls.linkedin)}
                className="group flex flex-col items-center gap-2 focus:outline-hidden cursor-pointer"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition-all duration-200 group-hover:scale-105 group-hover:bg-neutral-100 active:scale-95">
                  <svg className="size-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                  LinkedIn
                </span>
              </button>

              {/* 4. Facebook */}
              <button
                onClick={() => openShare(shareUrls.facebook)}
                className="group flex flex-col items-center gap-2 focus:outline-hidden cursor-pointer"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition-all duration-200 group-hover:scale-105 group-hover:bg-neutral-100 active:scale-95">
                  <svg className="size-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                  Facebook
                </span>
              </button>

              {/* 5. WhatsApp */}
              <button
                onClick={() => openShare(shareUrls.whatsapp)}
                className="group flex flex-col items-center gap-2 focus:outline-hidden cursor-pointer"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition-all duration-200 group-hover:scale-105 group-hover:bg-neutral-100 active:scale-95">
                  <svg className="size-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19.53-1.11 1.04-1.53 1.1-.41.07-.94.1-1.52-.09-.38-.12-.86-.28-1.5-.56-2.65-1.15-4.38-3.85-4.51-4.03-.13-.18-1.08-1.44-1.08-2.75 0-1.31.69-1.96.93-2.22.25-.26.54-.33.72-.33.18 0 .37 0 .53.01.17.01.4.06.61.56.22.52.75 1.83.82 1.97.07.13.11.29.02.48-.09.18-.14.3-.28.46-.14.16-.29.35-.42.47-.14.13-.28.28-.12.56.16.27.7 1.15 1.5 1.87 1.03.92 1.9 1.2 2.17 1.34.27.13.43.11.59-.07.16-.18.69-.8 1.04-.98.35-.18.7-.08.99.06.29.13 1.85.87 2.17 1.03.32.16.53.24.61.37.08.13.08.76-.11 1.29z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                  WhatsApp
                </span>
              </button>
            </div>

            {/* Direct URL Input Bar with Copy button */}
            <div className="mt-8 flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 p-1.5">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full bg-transparent px-3 text-xs text-neutral-300 select-all focus:outline-hidden font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white text-neutral-900 hover:bg-neutral-200 active:scale-95"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 stroke-[2.5]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
