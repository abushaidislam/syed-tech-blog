"use client";

import { motion, useReducedMotion } from "motion/react";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              filter: "blur(12px)",
              y: 6,
              scale: 0.995,
            }
      }
      animate={{
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.42,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        willChange: "transform, opacity, filter",
      }}
      className={`w-full flex-1 ${className}`}
    >
      {children}
    </motion.div>
  );
}
