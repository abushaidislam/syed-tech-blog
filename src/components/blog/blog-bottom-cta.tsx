import Link from "next/link";
import { Star, StarHalf } from "lucide-react";

interface BlogBottomCTAProps {
  title?: string;
  subtitle?: string;
}

export function BlogBottomCTA({
  title = "Supercharge your digital knowledge",
  subtitle = "See why Syed Blog is the destination of choice for forward-thinking software engineers and tech leaders.",
}: BlogBottomCTAProps) {
  return (
    <>
      {/* Spacer Grid Section */}
      <div className="grid-section relative overflow-clip border-y border-b-0 border-grid-border px-4 [.grid-section_~_&]:border-t-0">
        <div className="relative z-0 mx-auto h-12 max-w-grid-width border-x border-grid-border sm:h-20" />
      </div>

      {/* Signature Dub Curved Dark Glow Banner */}
      <div className="relative bg-neutral-900 px-4">
        {/* Ambient Conic Gradient Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 mix-blend-overlay">
          <div className="absolute -inset-[40px] bg-[conic-gradient(from_-81deg,#3A8BFD_-72deg,#855AFC_33deg,#F00_70deg,#EAB308_136deg,#5CFF80_214deg,#00FFF9_259deg,#3A8BFD_288deg,#855AFC_393deg)] blur-[30px]" />
        </div>

        <div className="relative mx-auto max-w-grid-width">
          {/* Grid lines overlay */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 border-x border-white/5 [mask-image:linear-gradient(black,transparent)]" />
            <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2">
              <svg
                className="pointer-events-none absolute inset-0 text-white/15 [mask-composite:intersect] [mask-image:linear-gradient(black,transparent),radial-gradient(black,transparent)]"
                width="100%"
                height="100%"
              >
                <defs>
                  <pattern
                    id="grid-blog-bottom-cta"
                    x="-1"
                    y="-1"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 60 0 L 0 0 0 60"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect
                  fill="url(#grid-blog-bottom-cta)"
                  width="100%"
                  height="100%"
                />
              </svg>
            </div>
          </div>

          {/* Curved Cutout Tab */}
          <div className="relative top-0 z-0 mx-auto mt-0 flex h-16 max-w-[min(700px,calc(100vw-2rem))] -translate-y-px items-start justify-center text-white">
            <svg
              viewBox="0 0 85 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-auto shrink-0 translate-x-px translate-y-px overflow-visible"
            >
              <rect
                x="0"
                y="0"
                width="85"
                height="1"
                fill="currentColor"
                transform="translate(0, -1)"
              />
              <path
                d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
                fill="currentColor"
              />
            </svg>
            <div className="border-t-1 relative z-10 h-[calc(100%+1px)] min-w-0 grow border-current bg-current" />
            <svg
              viewBox="0 0 85 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-auto shrink-0 -translate-x-px translate-y-px -scale-x-100 overflow-visible"
            >
              <rect
                x="0"
                y="0"
                width="85"
                height="1"
                fill="currentColor"
                transform="translate(0, -1)"
              />
              <path
                d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Main CTA Content */}
          <div className="relative flex flex-col items-center px-4 pb-32 pt-24 text-center">
            <h2 className="max-w-lg text-balance font-display text-4xl font-medium text-neutral-50 sm:text-5xl">
              {title}
            </h2>
            <p className="mt-6 max-w-[560px] text-pretty text-lg font-medium text-neutral-400 sm:text-xl">
              {subtitle}
            </p>

            <div className="mt-10 flex items-center justify-center gap-3">
              <Link
                className="flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-center text-sm font-medium text-neutral-900 ring-white/20 transition-all hover:ring"
                href="/blog"
              >
                Read Articles
              </Link>
              <Link
                className="flex h-10 items-center justify-center rounded-lg border border-transparent bg-white/20 px-5 text-center text-sm font-medium text-white backdrop-blur-sm ring-white/10 transition-all hover:ring"
                href="/blog/category/engineering"
              >
                Engineering Insights
              </Link>
            </div>

            {/* Social Proof Review Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
              {/* G2 */}
              <div className="flex items-center gap-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <span className="text-xs font-bold text-white">G2</span>
                </div>
                <div className="flex items-center text-white/85">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 shrink-0 fill-current text-white"
                    />
                  ))}
                </div>
              </div>

              {/* Product Hunt */}
              <div className="flex items-center gap-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <span className="text-xs font-bold text-white">P</span>
                </div>
                <div className="flex items-center text-white/85">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 shrink-0 fill-current text-white"
                    />
                  ))}
                </div>
              </div>

              {/* Trustpilot */}
              <div className="flex items-center gap-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <span className="text-xs font-bold text-white">★</span>
                </div>
                <div className="flex items-center text-white/85">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 shrink-0 fill-current text-white"
                    />
                  ))}
                  <StarHalf className="size-4 shrink-0 fill-current text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
