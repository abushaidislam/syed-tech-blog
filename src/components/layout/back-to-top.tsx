"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    let frameId: number;

    const handleScroll = () => {
      if (!ticking) {
        // ⚡ Bolt Optimization: Throttle scroll event to RAF to prevent layout thrashing and excessive state updates on main thread.
        frameId = window.requestAnimationFrame(() => {
          const totalScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;

          if (totalScroll > 0) {
            setScrollProgress(Math.min(100, Math.round((currentScroll / totalScroll) * 100)));
          }

          setIsVisible(currentScroll > 320);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToTop = () => {
    // If Lenis is active on window, use it for silky momentum scroll
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-label="Scroll back to top"
          className={cn(
            "fixed bottom-6 right-6 z-40 group flex size-11 items-center justify-center rounded-full",
            "bg-white/90 backdrop-blur-md border border-neutral-200/90 shadow-md",
            "hover:shadow-lg hover:border-neutral-300 hover:scale-105 active:scale-95",
            "transition-all duration-200 text-neutral-700 hover:text-neutral-950",
          )}
        >
          {/* Circular Progress Ring */}
          <svg
            className="absolute inset-0 size-full -rotate-90 pointer-events-none p-0.5"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="text-neutral-200/60"
              strokeWidth="2"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="text-neutral-900 transition-all duration-150 ease-out"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Up Arrow Icon */}
          <ArrowUp className="size-4.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
