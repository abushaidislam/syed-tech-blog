import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[$$\\]/g, "")
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Security: Checks if a URL uses an unsafe scheme (javascript:, data:, vbscript:),
 * stripping invisible ASCII control characters (\x00-\x1F, \x7F-\x9F) that browsers ignore when executing links.
 */
export function isUnsafeUrlScheme(url: string): boolean {
  if (!url) return false;
  const normalized = url.replace(/[\x00-\x1F\x7F-\x9F\s]/g, "");
  return /^(javascript|data|vbscript):/i.test(normalized);
}

export function sanitizeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (isUnsafeUrlScheme(trimmed)) return undefined;
  return trimmed;
}
