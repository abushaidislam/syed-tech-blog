export default function PostLoading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Top Hero Section Skeleton */}
      <div className="grid-section relative overflow-clip border-b border-grid-border px-4">
        <div className="relative z-0 mx-auto flex max-w-grid-width flex-col justify-between gap-8 border-x border-grid-border px-4 pb-12 pt-16 sm:px-12 lg:flex-row lg:items-center">
          <div className="pointer-events-none absolute inset-0 border-x border-grid-border [mask-image:linear-gradient(transparent,black)]" />

          <div className="relative z-10 max-w-screen-sm animate-pulse">
            {/* Category & Date */}
            <div className="flex items-center space-x-4">
              <div className="h-7 w-24 rounded-lg bg-neutral-100" />
              <div className="h-4 w-32 rounded bg-neutral-100" />
            </div>

            {/* Title */}
            <div className="mt-5 space-y-3">
              <div className="h-8 sm:h-10 w-full rounded-lg bg-neutral-200/90" />
              <div className="h-8 sm:h-10 w-3/4 rounded-lg bg-neutral-200/80" />
            </div>

            {/* Summary */}
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-neutral-100" />
              <div className="h-4 w-4/5 rounded bg-neutral-100" />
            </div>

            {/* Author */}
            <div className="mt-8 flex items-center space-x-3">
              <div className="size-10 rounded-full bg-neutral-200" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 rounded bg-neutral-200/80" />
                <div className="h-3 w-36 rounded bg-neutral-100" />
              </div>
            </div>
          </div>

          {/* Right Side Sky Animation Skeleton Placeholder */}
          <div className="relative z-0 hidden lg:flex items-center justify-center lg:w-[460px] xl:w-[520px] shrink-0 animate-pulse">
            <div className="h-64 w-full rounded-2xl bg-neutral-100/60" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid-section relative overflow-clip border-y border-grid-border px-4 [.grid-section_~_&]:border-t-0">
        <div className="relative mx-auto max-w-grid-width border-x border-grid-border">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left 2 columns: Article body */}
            <div className="relative col-span-1 border-grid-border md:col-span-2">
              <div className="bg-white">
                {/* Hero Image Skeleton */}
                <div className="relative aspect-[1200/630] w-full overflow-hidden bg-neutral-100 animate-pulse">
                  <div className="size-full bg-neutral-200/50" />
                </div>

                {/* Article Prose Skeleton */}
                <div className="space-y-4 px-5 py-10 sm:px-12 animate-pulse">
                  <div className="h-4 w-full rounded bg-neutral-100" />
                  <div className="h-4 w-11/12 rounded bg-neutral-100" />
                  <div className="h-4 w-4/5 rounded bg-neutral-100" />
                  <div className="h-4 w-full rounded bg-neutral-100" />
                  <div className="h-4 w-3/4 rounded bg-neutral-100" />
                  <div className="my-6 h-6 w-1/2 rounded bg-neutral-200/80" />
                  <div className="h-4 w-full rounded bg-neutral-100" />
                  <div className="h-4 w-5/6 rounded bg-neutral-100" />
                  <div className="h-4 w-4/5 rounded bg-neutral-100" />
                </div>
              </div>
            </div>

            {/* Right column: Sidebar Skeleton */}
            <div className="relative col-span-1 hidden border-t border-grid-border p-6 md:block md:border-l md:border-t-0 animate-pulse">
              <div className="sticky top-20 space-y-6">
                <div className="h-4 w-28 rounded bg-neutral-200/80" />
                <div className="space-y-2.5">
                  <div className="h-3.5 w-40 rounded bg-neutral-100" />
                  <div className="h-3.5 w-32 rounded bg-neutral-100" />
                  <div className="h-3.5 w-36 rounded bg-neutral-100" />
                  <div className="h-3.5 w-28 rounded bg-neutral-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
