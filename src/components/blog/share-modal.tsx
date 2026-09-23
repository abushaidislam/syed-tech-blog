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
  image?: string;
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
  image,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cleanTitle = decodeHtmlEntities(title);
  const cleanSummary = decodeHtmlEntities(summary);

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
          {/* Subtle Translucent Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-neutral-950/45 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Light Theme Modal Container matching Blog Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.05 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-[460px] my-auto overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 text-neutral-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)]"
            role="dialog"
            aria-modal="true"
          >
            {/* Header: Title + Close Button */}
            <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                  <Share2 className="size-3.5 text-neutral-800" />
                </div>
                <h2 className="font-display text-base font-semibold tracking-tight text-neutral-900">
                  Share this article
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="flex size-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Article Snippet Card Preview with Thumbnail / OG Image */}
            <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-50/50 shadow-2xs">
              {image && (
                <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-neutral-100 border-b border-neutral-200/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={cleanTitle}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-neutral-600 shadow-2xs">
                    {category}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    blog.flinkeo.online
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 font-display text-sm font-semibold text-neutral-900 leading-snug">
                  {cleanTitle}
                </p>
                {cleanSummary && (
                  <p className="mt-1 line-clamp-1 text-xs text-neutral-500">
                    {cleanSummary}
                  </p>
                )}
              </div>
            </div>

            {/* Platform Circular Buttons Row (Clean light theme) */}
            <div className="mt-5 flex items-center justify-between gap-1.5 px-1">
              {/* 1. Copy Link */}
              <button
                onClick={handleCopyLink}
                className="group flex flex-col items-center gap-1.5 focus:outline-hidden cursor-pointer"
              >
                <div
                  className={`flex size-12 sm:size-13 items-center justify-center rounded-full border transition-all duration-150 shadow-2xs group-hover:scale-105 active:scale-95 ${
                    copied
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                      : "border-neutral-200 bg-white text-neutral-700 group-hover:border-neutral-300 group-hover:bg-neutral-50 group-hover:text-neutral-900"
                  }`}
                >
                  {copied ? (
                    <Check className="size-5 stroke-[2.5]" />
                  ) : (
                    <Link2 className="size-5 stroke-[2]" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    copied
                      ? "text-emerald-600 font-semibold"
                      : "text-neutral-600 group-hover:text-neutral-900"
                  }`}
                >
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>

              {/* 2. X (Twitter) */}
              <button
                onClick={() => openShare(shareUrls.x)}
                className="group flex flex-col items-center gap-1.5 focus:outline-hidden cursor-pointer"
              >
                <div className="flex size-12 sm:size-13 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-2xs transition-all duration-150 group-hover:scale-105 group-hover:border-neutral-300 group-hover:bg-neutral-50 group-hover:text-black active:scale-95">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-neutral-600 group-hover:text-neutral-900">
                  X
                </span>
              </button>

              {/* 3. LinkedIn */}
              <button
                onClick={() => openShare(shareUrls.linkedin)}
                className="group flex flex-col items-center gap-1.5 focus:outline-hidden cursor-pointer"
              >
                <div className="flex size-12 sm:size-13 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-2xs transition-all duration-150 group-hover:scale-105 group-hover:border-blue-300 group-hover:bg-blue-50/50 group-hover:text-[#0A66C2] active:scale-95">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-neutral-600 group-hover:text-neutral-900">
                  LinkedIn
                </span>
              </button>

              {/* 4. Facebook */}
              <button
                onClick={() => openShare(shareUrls.facebook)}
                className="group flex flex-col items-center gap-1.5 focus:outline-hidden cursor-pointer"
              >
                <div className="flex size-12 sm:size-13 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-2xs transition-all duration-150 group-hover:scale-105 group-hover:border-blue-300 group-hover:bg-blue-50/50 group-hover:text-[#1877F2] active:scale-95">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-neutral-600 group-hover:text-neutral-900">
                  Facebook
                </span>
              </button>

              {/* 5. WhatsApp */}
              <button
                onClick={() => openShare(shareUrls.whatsapp)}
                className="group flex flex-col items-center gap-1.5 focus:outline-hidden cursor-pointer"
              >
                <div className="flex size-12 sm:size-13 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-2xs transition-all duration-150 group-hover:scale-105 group-hover:border-emerald-300 group-hover:bg-emerald-50/50 group-hover:text-[#25D366] active:scale-95">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19.53-1.11 1.04-1.53 1.1-.41.07-.94.1-1.52-.09-.38-.12-.86-.28-1.5-.56-2.65-1.15-4.38-3.85-4.51-4.03-.13-.18-1.08-1.44-1.08-2.75 0-1.31.69-1.96.93-2.22.25-.26.54-.33.72-.33.18 0 .37 0 .53.01.17.01.4.06.61.56.22.52.75 1.83.82 1.97.07.13.11.29.02.48-.09.18-.14.3-.28.46-.14.16-.29.35-.42.47-.14.13-.28.28-.12.56.16.27.7 1.15 1.5 1.87 1.03.92 1.9 1.2 2.17 1.34.27.13.43.11.59-.07.16-.18.69-.8 1.04-.98.35-.18.7-.08.99.06.29.13 1.85.87 2.17 1.03.32.16.53.24.61.37.08.13.08.76-.11 1.29z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-neutral-600 group-hover:text-neutral-900">
                  WhatsApp
                </span>
              </button>
            </div>

            {/* Seamless Link Box: NO extra borders, smooth neutral-100 background */}
            <div className="mt-5 flex items-center justify-between rounded-xl bg-neutral-100/80 p-1.5 pl-3.5">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full bg-transparent text-xs text-neutral-600 truncate focus:outline-hidden select-all font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 shadow-2xs"
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
