"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Copy, Link2, FileCode2 } from "lucide-react";
import { CodeTabsContext } from "./code-context";

/**
 * Interactive CodeBlock component with language badge and Copy-to-Clipboard.
 * Supports context-awareness to avoid duplicate headers/copy buttons when nested in CodeTabs.
 */
export function CodeBlock({
  children,
  className,
  filename,
}: {
  children: React.ReactNode;
  className?: string;
  filename?: string;
}) {
  const isInCodeTabs = React.useContext(CodeTabsContext);
  const [copied, setCopied] = useState(false);

  // Extract raw text for clipboard
  const getText = (node: React.ReactNode): string => {
    if (!node) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(getText).join("");
    if (React.isValidElement(node) && node.props) {
      return getText((node.props as { children?: React.ReactNode }).children);
    }
    return "";
  };

  const rawCode = getText(children);

  let innerContent: React.ReactNode = children;
  let codeClassName = className;
  if (React.isValidElement(children)) {
    const p = children.props as { className?: string; children?: React.ReactNode };
    if (p.className) codeClassName = p.className;
    if (p.children !== undefined) innerContent = p.children;
  }

  const langMatch = codeClassName?.match(/language-([a-z0-9_-]+)/i);
  const language = langMatch ? langMatch[1] : filename ? filename.split(".").pop() : "code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy code", e);
    }
  };

  // If rendered inside a CodeTabs container, bypass outer container & header to prevent duplicate header/copy button
  if (isInCodeTabs) {
    return (
      <pre className="overflow-x-auto p-4 sm:p-5 font-mono text-sm leading-relaxed text-neutral-200 selection:bg-neutral-800 [&_code]:!border-0 [&_code]:!bg-transparent [&_code]:!p-0 [&_code]:!text-inherit">
        <code className={codeClassName}>{innerContent}</code>
      </pre>
    );
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d0d0e] text-neutral-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all">
      {/* Dub Style Mac Terminal Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/70 px-4 py-2.5 backdrop-blur-md text-xs text-neutral-400">
        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-neutral-700/80" />
            <span className="size-2.5 rounded-full bg-neutral-700/80" />
            <span className="size-2.5 rounded-full bg-neutral-700/80" />
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-800 text-neutral-300">
            {filename ? (
              <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-neutral-300">
                <FileCode2 className="size-3.5 text-neutral-400" />
                {filename}
              </span>
            ) : (
              <span className="rounded-md bg-neutral-800/80 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                {language}
              </span>
            )}
          </div>
        </div>

        {/* Micro-animated Dub-style Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
          className="flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-850 px-2.5 py-1 text-xs font-medium text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1 text-emerald-400 font-medium"
              >
                <Check className="size-3.5" />
                <span>Copied</span>
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Copy className="size-3.5 text-neutral-400" />
                <span>Copy</span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code Body */}
      <pre className="overflow-x-auto p-4 sm:p-5 font-mono text-sm leading-relaxed text-neutral-200 selection:bg-neutral-800 [&_code]:!border-0 [&_code]:!bg-transparent [&_code]:!p-0 [&_code]:!text-inherit">
        <code className={codeClassName}>{innerContent}</code>
      </pre>
    </div>
  );
}

/**
 * Interactive Heading Anchor component with smooth scroll & clipboard copy.
 */
export function HeadingAnchor({
  id,
  children,
  as = "h2",
}: {
  id: string;
  children: React.ReactNode;
  as?: "h2" | "h3";
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const isH2 = as === "h2";

  const sectionTitle = typeof children === "string" ? children : "section";

  return (
    <div
      id={id}
      className={`group relative scroll-mt-24 ${
        isH2
          ? "mt-12 mb-4 font-display text-2xl font-medium tracking-tight text-neutral-900"
          : "mt-8 mb-3 font-display text-xl font-medium tracking-tight text-neutral-900"
      }`}
    >
      <a
        href={`#${id}`}
        onClick={handleClick}
        aria-label={
          copied
            ? `Direct link to section ${sectionTitle} copied to clipboard`
            : `Copy direct link to section: ${sectionTitle}`
        }
        className="group flex items-start gap-x-2 !font-medium !text-neutral-800 no-underline hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:outline-none rounded-md p-1 -m-1"
      >
        <span>{children}</span>
        <div className="rounded-lg border border-neutral-200 bg-white p-1.5 opacity-0 transition-all hover:border-neutral-300 hover:shadow group-hover:opacity-100 group-focus-visible:opacity-100">
          {copied ? (
            <Check className="size-4 text-green-600" aria-hidden="true" />
          ) : (
            <Link2 className="size-4 text-neutral-600" aria-hidden="true" />
          )}
        </div>
      </a>
    </div>
  );
}
