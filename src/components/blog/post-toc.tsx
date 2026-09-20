"use client";

import { useEffect, useState } from "react";
import { AlignLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPostHeading } from "@/types/blog";

interface PostTOCProps {
  headings: BlogPostHeading[];
}

function decodeEntities(text: string) {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

export function PostTOC({ headings }: PostTOCProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      },
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div>
      <div className="max-h-[42vh] overflow-y-auto pb-4 pr-2">
        <p className="-ml-0.5 flex items-center gap-1.5 text-sm font-medium text-neutral-500">
          <AlignLeft className="size-4 text-neutral-400" />
          On this page
        </p>
        <div className="mt-4 grid gap-3 border-l-2 border-neutral-200">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(heading.id);
                  if (target) {
                    const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement, options?: { offset?: number }) => void } }).lenis;
                    if (lenis) {
                      lenis.scrollTo(target, { offset: -80 });
                    } else {
                      target.scrollIntoView({ behavior: "smooth" });
                    }
                    window.history.pushState(null, "", `#${heading.id}`);
                  }
                }}
                className={cn(
                  "relative -ml-0.5 pl-4 text-sm transition-colors",
                  isActive
                    ? "border-l-2 border-black font-semibold text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900",
                )}
              >
                {decodeEntities(heading.title)}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
