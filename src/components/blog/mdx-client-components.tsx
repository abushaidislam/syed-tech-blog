"use client";

import React, { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";

/**
 * Interactive CodeBlock component with language badge and Copy-to-Clipboard.
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

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/80 px-4 py-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-neutral-700" />
            <span className="size-2.5 rounded-full bg-neutral-700" />
            <span className="size-2.5 rounded-full bg-neutral-700" />
          </div>
          <span className="ml-2 font-medium text-neutral-300">
            {filename || language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-green-400" aria-hidden="true" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-neutral-200 [&_code]:!border-0 [&_code]:!bg-transparent [&_code]:!p-0 [&_code]:!text-inherit">
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
