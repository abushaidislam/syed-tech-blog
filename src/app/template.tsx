"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
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
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
