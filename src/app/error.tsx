"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full border border-rose-200 bg-rose-50 p-3 text-rose-600">
        <AlertTriangle className="size-6" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-neutral-500">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 flex h-10 items-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800"
      >
        <RefreshCw className="size-4" />
        Try again
      </button>
    </main>
  );
}
