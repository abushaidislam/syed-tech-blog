export function BlogListSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      {/* Blog Header Skeleton with Grid Pattern */}
      <div className="grid-section relative overflow-clip border-b border-grid-border px-4">
        <div className="relative z-0 mx-auto max-w-grid-width border-x border-grid-border px-4 py-16 sm:px-12">
          {/* Ambient grid background mask */}
          <div className="pointer-events-none absolute inset-0 border-x border-grid-border [mask-image:linear-gradient(transparent,black)]" />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 [mask-composite:intersect] [mask-image:linear-gradient(transparent,black)]">
            <div className="absolute inset-x-[360px] inset-y-0">
              <svg
                className="pointer-events-none absolute bottom-0 right-full h-[600px] w-[360px] text-grid-border/60 [mask-image:linear-gradient(90deg,transparent,black)]"
                width="100%"
                height="100%"
              >
                <defs>
                  <pattern
                    id="grid-blog-header-l-loading"
                    x="0"
                    y="0"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 60 0 L 0 0 0 60"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </pattern>
                </defs>
                <rect
                  fill="url(#grid-blog-header-l-loading)"
                  width="100%"
                  height="100%"
                />
              </svg>
              <svg
                className="pointer-events-none absolute bottom-0 left-full h-[600px] w-[360px] text-grid-border/60 [mask-image:linear-gradient(270deg,transparent,black)]"
                width="100%"
                height="100%"
              >
                <defs>
                  <pattern
                    id="grid-blog-header-r-loading"
                    x="-1"
                    y="0"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 60 0 L 0 0 0 60"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </pattern>
                </defs>
                <rect
                  fill="url(#grid-blog-header-r-loading)"
                  width="100%"
                  height="100%"
                />
              </svg>
            </div>
          </div>

          <div className="relative animate-pulse">
            {/* Title Skeleton */}
            <div className="h-10 sm:h-12 w-56 sm:w-72 rounded-xl bg-neutral-200/80" />
            {/* Description Skeleton */}
            <div className="mt-4 h-6 w-full max-w-lg rounded-lg bg-neutral-100" />

            {/* Desktop Category Navigation Tabs Skeleton */}
            <div className="mt-10 hidden w-fit items-center gap-2 sm:flex sm:flex-wrap">
              <div className="h-8 w-20 rounded-lg bg-neutral-900/10" />
              <div className="h-8 w-24 rounded-lg bg-neutral-100" />
              <div className="h-8 w-24 rounded-lg bg-neutral-100" />
              <div className="h-8 w-28 rounded-lg bg-neutral-100" />
              <div className="h-8 w-20 rounded-lg bg-neutral-100" />
            </div>

            {/* Mobile Categories Toggle Skeleton */}
            <div className="mt-8 sm:hidden">
              <div className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid Skeleton - Exact 1:1 Dub Grid Layout */}
      <div className="grid-section relative overflow-clip border-y border-grid-border px-4 [.grid-section_~_&]:border-t-0">
        <div className="relative z-0 mx-auto max-w-grid-width border-x border-grid-border">
          <div className="grid grid-cols-1 md:grid-cols-3 md:[&>*:not(:nth-child(3n))]:border-r md:[&>*:nth-child(n+4)]:border-t [&>*]:border-grid-border max-md:[&>*]:border-t">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="group relative flex h-full flex-col justify-between animate-pulse"
              >
                {/* Image & Main Info */}
                <div>
                  {/* Card Image Skeleton */}
                  <div className="relative aspect-[1200/630] w-full overflow-hidden bg-neutral-100">
                    <div className="size-full bg-neutral-200/50" />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.04]" />
                  </div>

                  {/* Card Content Skeleton */}
                  <div className="p-6 pb-2">
                    <div className="space-y-2">
                      <div className="h-5 w-4/5 rounded bg-neutral-200/90" />
                      <div className="h-5 w-3/5 rounded bg-neutral-200/70" />
                    </div>
                    <div className="mt-3.5 space-y-2">
                      <div className="h-3.5 w-full rounded bg-neutral-100" />
                      <div className="h-3.5 w-4/5 rounded bg-neutral-100" />
                    </div>
                  </div>
                </div>

                {/* Card Footer: Authors & Category */}
                <div className="flex items-center justify-between p-6 pt-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="size-8 rounded-full bg-neutral-200/80 ring-2 ring-white" />
                    <div className="h-3.5 w-20 rounded bg-neutral-100" />
                  </div>
                  <div className="h-3.5 w-16 rounded bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer Grid Section matching BlogBottomCTA spacer */}
      <div className="grid-section relative overflow-clip border-y border-b-0 border-grid-border px-4 [.grid-section_~_&]:border-t-0">
        <div className="relative z-0 mx-auto h-12 max-w-grid-width border-x border-grid-border sm:h-20" />
      </div>
    </main>
  );
}
