"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface SkyAnimationProps {
  className?: string;
  duration?: string;
}

export function SkyAnimation({
  className,
  duration = "60s",
}: SkyAnimationProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative h-48 w-full max-w-lg select-none overflow-hidden sm:h-56 lg:h-64",
        "opacity-70 saturate-[1.25] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex w-[200vw] lg:w-[200%] will-change-transform">
        <Image
          alt=""
          src="/images/clouds-pattern.png"
          width={887}
          height={267}
          priority
          className="relative block h-full w-auto animate-infinite-scroll [--scroll:-100%]"
          style={{ animationDuration: duration }}
        />
        <Image
          alt=""
          src="/images/clouds-pattern.png"
          width={887}
          height={267}
          priority
          className="-ml-px relative block h-full w-auto animate-infinite-scroll [--scroll:-100%]"
          style={{ animationDuration: duration }}
        />
      </div>
    </div>
  );
}
