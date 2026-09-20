export default function Loading() {
  return (
    <div className="mx-auto min-h-[60vh] max-w-grid-width px-4 py-16 sm:px-12">
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-2/5 rounded-lg bg-neutral-200/80" />
        <div className="h-6 w-3/5 rounded-lg bg-neutral-100" />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[1200/630] rounded-xl border border-neutral-200/80 bg-neutral-100/60 p-4"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
