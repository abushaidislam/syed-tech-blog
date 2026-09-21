import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function PostSidebarCTA() {
  return (
    <Link
      href="/blog"
      className="group/cta relative block rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
    >
      <div className="absolute right-3 top-3 z-10 rounded-full border border-neutral-200 bg-white/80 p-2 backdrop-blur transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5">
        <ArrowUpRight className="size-4 text-neutral-600" />
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src="https://assets.dub.co/og/partners.jpg"
          alt="Syed Blog"
          width={600}
          height={315}
          sizes="(max-width: 768px) 100vw, 350px"
          className="size-full object-cover"
        />
      </div>
      <p className="mt-4 font-display text-base font-bold text-neutral-900">
        Explore Syed Blog
      </p>
      <p className="mt-1 text-sm text-neutral-500">
        Empower your knowledge with high-scale architecture, engineering deep dives, and modern web insights.
      </p>
    </Link>
  );
}
