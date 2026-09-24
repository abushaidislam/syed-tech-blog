"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  X,
  BookOpen,
  Info,
  Sparkles,
  Smartphone,
  MousePointer,
  Keyboard,
  Hand,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Speed configurations: Base speed is 48 pixels per second (~1 line of reading per 0.6s)
const BASE_SPEED = 48;
const SPEEDS = [0.5, 1.0, 1.5, 2.0] as const;
type SpeedMultiplier = (typeof SPEEDS)[number];

function isInteractiveElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  return !!target.closest(
    'a, button, input, textarea, select, details, summary, pre, code, [role="button"], [role="dialog"], [data-no-autoscroll], .no-autoscroll'
  );
}

export function AutoScrollReader() {
  const pathname = usePathname();

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<SpeedMultiplier>(1.0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [canShowLauncher, setCanShowLauncher] = useState(false);

  // References for requestAnimationFrame loop
  const isActiveRef = useRef(false);
  const isPausedRef = useRef(false);
  const speedRef = useRef<SpeedMultiplier>(1.0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // References for tooltip interaction
  const helpContainerRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // References for Double Right-Click tracking
  const lastRightClickTimeRef = useRef(0);
  const lastRightClickPosRef = useRef({ x: 0, y: 0 });
  const suppressContextMenuRef = useRef(false);

  // References for Double Tap tracking (mobile/touch)
  const lastTapTimeRef = useRef(0);
  const lastTapPosRef = useRef({ x: 0, y: 0 });
  const touchStartTimeRef = useRef(0);
  const touchMovedRef = useRef(false);

  // Keep ref values in sync with state
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (!isPaused) {
      lastTimeRef.current = null; // reset timestamp on unpause to avoid jump
    }
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = speed;
    try {
      localStorage.setItem("syed_blog_autoscroll_speed", speed.toString());
    } catch {
      // LocalStorage access may fail in private mode
    }
  }, [speed]);

  // Load saved speed preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("syed_blog_autoscroll_speed");
      if (saved) {
        const parsed = parseFloat(saved) as SpeedMultiplier;
        if (SPEEDS.includes(parsed)) {
          setSpeed(parsed);
          speedRef.current = parsed;
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Update launcher visibility on scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;

          if (totalScroll > 0) {
            setScrollProgress(
              Math.min(100, Math.round((currentScroll / totalScroll) * 100))
            );
          }

          // Show floating launcher button when page has content and is scrolled a bit
          setCanShowLauncher(currentScroll > 200 && totalScroll > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close help tooltip on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        helpContainerRef.current &&
        !helpContainerRef.current.contains(e.target as Node)
      ) {
        setShowHelp(false);
      }
    };

    if (showHelp) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showHelp]);

  // Stop auto-scroll when route/pathname changes
  useEffect(() => {
    stopAutoScroll();
  }, [pathname]);

  // Stop auto-scroll function
  const stopAutoScroll = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setShowHelp(false);
    isActiveRef.current = false;
    isPausedRef.current = false;
    lastTimeRef.current = null;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // Pause auto-scroll function
  const pauseAutoScroll = useCallback(() => {
    if (isActiveRef.current && !isPausedRef.current) {
      setIsPaused(true);
      isPausedRef.current = true;
    }
  }, []);

  // Resume auto-scroll function
  const resumeAutoScroll = useCallback(() => {
    if (isActiveRef.current && isPausedRef.current) {
      setIsPaused(false);
      isPausedRef.current = false;
      lastTimeRef.current = null;
    }
  }, []);

  // Toggle pause/play
  const togglePause = useCallback(() => {
    if (isPausedRef.current) {
      resumeAutoScroll();
    } else {
      pauseAutoScroll();
    }
  }, [resumeAutoScroll, pauseAutoScroll]);

  // Start auto-scroll function
  const startAutoScroll = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    isActiveRef.current = true;
    isPausedRef.current = false;
    lastTimeRef.current = null;

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3200);

    // Haptic feedback on mobile if supported
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // Ignore
      }
    }
  }, []);

  // Toggle auto-scroll function (for double-click / double-tap)
  const toggleAutoScroll = useCallback(() => {
    if (isActiveRef.current) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  }, [startAutoScroll, stopAutoScroll]);

  // Handle tooltip hover with debounce
  const handleMouseEnterHelp = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowHelp(true);
  };

  const handleMouseLeaveHelp = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowHelp(false);
    }, 220);
  };

  // Main Animation Loop using requestAnimationFrame
  useEffect(() => {
    if (!isActive) return;

    const scrollLoop = (timestamp: number) => {
      if (!isActiveRef.current) return;

      if (!isPausedRef.current) {
        if (!lastTimeRef.current) {
          lastTimeRef.current = timestamp;
        }

        const delta = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        // Clamp delta to 50ms to prevent huge jumps on tab switch/lag
        const clampedDelta = Math.min(delta, 0.05);
        const distance = BASE_SPEED * speedRef.current * clampedDelta;

        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        // Check if reached bottom of the document
        if (currentScroll >= maxScroll - 4) {
          stopAutoScroll();
          return;
        }

        // Support Lenis smooth scroll if active on window
        const lenis = (
          window as unknown as {
            lenis?: {
              scroll: number;
              scrollTo: (target: number, opts?: { immediate?: boolean }) => void;
            };
          }
        ).lenis;

        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(lenis.scroll + distance, { immediate: true });
        } else {
          window.scrollBy({ top: distance, behavior: "instant" });
        }
      }

      rafIdRef.current = requestAnimationFrame(scrollLoop);
    };

    rafIdRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isActive, stopAutoScroll]);

  // Gesture Listeners: Double Tap (Touch/Mobile) & Double Right-Click (Desktop)
  useEffect(() => {
    // -------------------------------------------------------------
    // 1. Double Right-Click Listener (Laptop / Desktop)
    // -------------------------------------------------------------
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 2) return; // Right-click only (button === 2)
      if (isInteractiveElement(e.target)) return;

      // Don't trigger if user is actively selecting text
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) return;

      const now = performance.now();
      const timeDiff = now - lastRightClickTimeRef.current;
      const dist = Math.hypot(
        e.clientX - lastRightClickPosRef.current.x,
        e.clientY - lastRightClickPosRef.current.y
      );

      // If clicked right mouse button twice within 50ms - 420ms at roughly the same position
      if (timeDiff > 50 && timeDiff < 420 && dist < 35) {
        suppressContextMenuRef.current = true;
        toggleAutoScroll();
        lastRightClickTimeRef.current = 0;
      } else {
        suppressContextMenuRef.current = false;
        lastRightClickTimeRef.current = now;
        lastRightClickPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (isInteractiveElement(e.target)) return;

      if (suppressContextMenuRef.current) {
        e.preventDefault();
        e.stopPropagation();
        suppressContextMenuRef.current = false;
        return false;
      }

      // Fallback check directly in contextmenu event
      const now = performance.now();
      const timeDiff = now - lastRightClickTimeRef.current;
      const dist = Math.hypot(
        e.clientX - lastRightClickPosRef.current.x,
        e.clientY - lastRightClickPosRef.current.y
      );

      if (timeDiff > 50 && timeDiff < 420 && dist < 35) {
        e.preventDefault();
        e.stopPropagation();
        toggleAutoScroll();
        lastRightClickTimeRef.current = 0;
        return false;
      }
    };

    // -------------------------------------------------------------
    // 2. Double Tap Listener (Mobile / Touch Devices)
    // -------------------------------------------------------------
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchMovedRef.current = false;
      touchStartTimeRef.current = performance.now();
    };

    const handleTouchMove = () => {
      touchMovedRef.current = true;
      // If user starts dragging/swiping manually while auto-scrolling, pause gracefully
      if (isActiveRef.current && !isPausedRef.current) {
        pauseAutoScroll();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchMovedRef.current) return;
      if (e.changedTouches.length !== 1) return;
      if (isInteractiveElement(e.target)) return;

      // Don't trigger if user is selecting text
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) return;

      const touch = e.changedTouches[0];
      const now = performance.now();
      const tapDuration = now - touchStartTimeRef.current;

      // Ignore long-presses (context menu/magnifier)
      if (tapDuration > 320) return;

      const timeDiff = now - lastTapTimeRef.current;
      const dist = Math.hypot(
        touch.clientX - lastTapPosRef.current.x,
        touch.clientY - lastTapPosRef.current.y
      );

      // If tapped twice within 70ms - 360ms within 32px
      if (timeDiff > 70 && timeDiff < 360 && dist < 32) {
        toggleAutoScroll();
        lastTapTimeRef.current = 0;
      } else {
        lastTapTimeRef.current = now;
        lastTapPosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    // -------------------------------------------------------------
    // 3. Manual User Interruption Listeners (Wheel & Keyboard)
    // -------------------------------------------------------------
    const handleWheel = () => {
      if (isActiveRef.current && !isPausedRef.current) {
        // Pausing on manual wheel scroll lets reader adjust position without fighting
        pauseAutoScroll();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInteractiveElement(document.activeElement)) return;

      if (isActiveRef.current) {
        if (e.key === "Escape") {
          e.preventDefault();
          stopAutoScroll();
        } else if (e.key === " ") {
          e.preventDefault();
          togglePause();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSpeed((prev) => {
            const idx = SPEEDS.indexOf(prev);
            return idx > 0 ? SPEEDS[idx - 1] : prev;
          });
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setSpeed((prev) => {
            const idx = SPEEDS.indexOf(prev);
            return idx < SPEEDS.length - 1 ? SPEEDS[idx + 1] : prev;
          });
        }
      }
    };

    // Attach all event listeners
    window.addEventListener("mousedown", handleMouseDown, { capture: true });
    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown, { capture: true });
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleAutoScroll, pauseAutoScroll, stopAutoScroll, togglePause]);

  return (
    <>
      {/* 1. Floating Launcher Button (visible alongside BackToTop when reading) */}
      <AnimatePresence>
        {!isActive && canShowLauncher && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-40 group"
          >
            <button
              type="button"
              onClick={startAutoScroll}
              aria-label="Start Auto-Scroll Reading Mode"
              className={cn(
                "relative flex size-11 items-center justify-center rounded-full",
                "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md",
                "border border-neutral-200/90 dark:border-neutral-800 shadow-md",
                "hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 hover:scale-105 active:scale-95",
                "transition-all duration-200 text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
              )}
            >
              <BookOpen className="size-4.5 transition-transform duration-200 group-hover:scale-110 text-neutral-800 dark:text-neutral-200" />

              {/* Ping notification dot */}
              <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 border border-white dark:border-neutral-900"></span>
              </span>
            </button>

            {/* Hover Tooltip in Day Theme */}
            <div className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3 hidden whitespace-nowrap rounded-xl bg-white/98 dark:bg-neutral-900/95 border border-neutral-200/90 dark:border-neutral-800 px-3.5 py-2 text-xs shadow-xl shadow-neutral-900/5 backdrop-blur-md group-hover:block transition-all duration-150">
              <div className="font-semibold flex items-center gap-1.5 text-neutral-900 dark:text-white">
                <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Auto-Scroll Reading</span>
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                Double-tap on mobile • Double right-click on laptop
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Sleek Activation Toast (Day Theme Matched) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 px-4 py-2 text-xs font-medium text-neutral-900 dark:text-white shadow-xl shadow-neutral-900/5 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Smooth Reading Active</span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="text-neutral-600 dark:text-neutral-300 hidden sm:inline">
                Double-tap or 2x Right-click to stop
              </span>
              <span className="text-neutral-600 dark:text-neutral-300 sm:hidden">
                Double-tap to stop
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Floating Reader Control Pill (HUD) - Day Theme Perfected */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-32px)]"
          >
            <div
              className={cn(
                "relative overflow-hidden flex items-center gap-1.5 sm:gap-2.5 rounded-full",
                // Day Theme: Crisp white glassmorphism with subtle border and layered shadows
                "bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-white",
                "px-3 sm:px-4 py-2",
                "shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12),0_4px_16px_-2px_rgba(0,0,0,0.06)] dark:shadow-2xl",
                "border border-neutral-200/90 dark:border-neutral-800 backdrop-blur-xl"
              )}
            >
              {/* Reading Progress Line along bottom edge */}
              <div
                className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-200"
                style={{ width: `${scrollProgress}%` }}
              />

              {/* Status Indicator */}
              <div className="flex items-center gap-2 pr-1.5 border-r border-neutral-200/90 dark:border-neutral-800 shrink-0">
                <span className="relative flex size-2.5">
                  {isPaused ? (
                    <span className="size-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  ) : (
                    <>
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                    </>
                  )}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-800 dark:text-neutral-200 hidden xs:inline">
                  {isPaused ? "Paused" : "Reading"}
                </span>
              </div>

              {/* Play / Pause Button */}
              <button
                type="button"
                onClick={togglePause}
                aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                title={isPaused ? "Resume (Space)" : "Pause (Space/Scroll)"}
                className={cn(
                  "flex size-7.5 items-center justify-center rounded-full transition-all duration-200 shadow-xs",
                  isPaused
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold scale-105"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 hover:text-neutral-950 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
                )}
              >
                {isPaused ? (
                  <Play className="size-3.5 fill-current ml-0.5" />
                ) : (
                  <Pause className="size-3.5 fill-current" />
                )}
              </button>

              {/* Speed Preset Selector (Day Theme Pills) */}
              <div className="flex items-center rounded-full bg-neutral-100/90 dark:bg-neutral-800/80 p-0.5 border border-neutral-200/80 dark:border-neutral-700/60">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={cn(
                      "px-2 py-0.5 text-[11px] rounded-full transition-all duration-150",
                      speed === s
                        ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 font-medium"
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* 'i' (Information) Button with Rich Floating Tooltip */}
              <div
                className="relative"
                ref={helpContainerRef}
                onMouseEnter={handleMouseEnterHelp}
                onMouseLeave={handleMouseLeaveHelp}
              >
                <button
                  type="button"
                  onClick={() => setShowHelp((prev) => !prev)}
                  title="Gesture shortcuts & tips"
                  aria-label="Gesture shortcuts & tips"
                  aria-expanded={showHelp}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full transition-all duration-150",
                    showHelp
                      ? "bg-neutral-200/90 text-neutral-950 dark:bg-neutral-700 dark:text-white"
                      : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800"
                  )}
                >
                  <Info className="size-3.5 stroke-[2.2]" />
                </button>

                {/* Enhanced Tooltip Card in Day Theme */}
                <AnimatePresence>
                  {showHelp && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[300px] sm:w-[330px] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/98 dark:bg-neutral-900/98 p-4 shadow-[0_16px_40px_-6px_rgba(0,0,0,0.16)] backdrop-blur-2xl text-neutral-900 dark:text-white z-50 select-none"
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-neutral-900 dark:text-white">
                          <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Reading Controls & Gestures</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 text-[10px] font-mono font-semibold">
                          {scrollProgress}% read
                        </span>
                      </div>

                      {/* Gesture Shortcuts List */}
                      <ul className="space-y-2 text-xs">
                        {/* Mobile */}
                        <li className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                            <Smartphone className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Mobile Screen</span>
                          </div>
                          <kbd className="px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100/90 dark:bg-neutral-800 text-[10.5px] font-semibold text-neutral-800 dark:text-neutral-200 shadow-2xs">
                            Double Tap
                          </kbd>
                        </li>

                        {/* Laptop */}
                        <li className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                            <MousePointer className="size-4 text-sky-600 dark:text-sky-400 shrink-0" />
                            <span>Laptop / Mouse</span>
                          </div>
                          <kbd className="px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100/90 dark:bg-neutral-800 text-[10.5px] font-semibold text-neutral-800 dark:text-neutral-200 shadow-2xs">
                            2x Right Click
                          </kbd>
                        </li>

                        {/* Pause by scroll */}
                        <li className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                            <Hand className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>Wheel scroll or swipe</span>
                          </div>
                          <span className="text-[10.5px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-800/60">
                            Auto Pause
                          </span>
                        </li>

                        {/* Keyboard */}
                        <li className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                            <Keyboard className="size-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                            <span>Pause / Exit</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100/90 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 shadow-2xs">
                              Space
                            </kbd>
                            <kbd className="px-1.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100/90 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 shadow-2xs">
                              Esc
                            </kbd>
                          </div>
                        </li>
                      </ul>

                      {/* Footer Info */}
                      <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                        <span>Speed preference is saved</span>
                        <span className="text-neutral-500">Tap outside to close</span>
                      </div>

                      {/* Little Arrow pointing down to the 'i' button */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-3 rotate-45 border-b border-r border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 pointer-events-none" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stop / Close Button */}
              <button
                type="button"
                onClick={stopAutoScroll}
                aria-label="Exit Auto-scroll"
                title="Exit (Esc)"
                className="flex size-7 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="size-3.5 stroke-[2.2]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
