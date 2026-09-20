import { cn } from "@/lib/utils";
import { SVGProps } from "react";

/**
 * Syed Blog Official Logomark Glyph
 * Clean, modern geometric 'S' mark
 */
export function SyedBlogLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6 text-current", className)}
      {...props}
    >
      <rect width="36" height="36" rx="8" fill="currentColor" className="text-neutral-900" />
      <path
        d="M24 12.5C24 10.567 22.433 9 20.5 9H14C12.3431 9 11 10.3431 11 12C11 13.6569 12.3431 15 14 15H21.5C23.433 15 25 16.567 25 18.5C25 20.433 23.433 22 21.5 22H13.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 23.5C12 25.433 13.567 27 15.5 27H22C23.6569 27 25 25.6569 25 24"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Syed Blog Official Master Wordmark Lockup
 */
export function SyedBlogWordmark({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <div className="flex size-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm transition-transform group-hover:scale-105">
        <span className="font-display text-base font-bold tracking-tighter">S</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-lg font-bold tracking-tight text-neutral-900">
          Syed
        </span>
        <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-display text-xs font-semibold uppercase tracking-wider text-neutral-600">
          Blog
        </span>
      </div>
    </div>
  );
}

// Aliases for compatibility
export const RenderXLogo = SyedBlogLogo;
export const RenderXWordmark = SyedBlogWordmark;
export const RenderXFullLogo = SyedBlogWordmark;
