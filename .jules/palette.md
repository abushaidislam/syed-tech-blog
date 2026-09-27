## 2026-09-27 - Small-Text Typography Standardization
**Learning:** Arbitrary pixel declarations (e.g. `text-[10px]`, `text-[11px]`) across UI badges, metadata labels, and share controls cause typography drift and make visual scaling brittle.
**Action:** Consistently use the shared `text-2xs` utility (defined as `0.625rem` / `10px` in `tailwind.config.ts`) across compact UI components (badges, tags, labels, metadata, share modal options) to ensure global design system consistency and single-point maintenance.
