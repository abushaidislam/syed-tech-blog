import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
        404 error
      </div>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base text-neutral-500 sm:text-lg">
        Sorry, we couldn&apos;t find the page or blog article you&apos;re looking for.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/blog"
          className="flex h-10 items-center gap-2 rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800"
        >
          <ArrowLeft className="size-4" />
          Back to Blog
        </Link>
      </div>
    </main>
  );
}
