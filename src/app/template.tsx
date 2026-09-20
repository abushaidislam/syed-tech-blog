"use client";

import { motion, useReducedMotion } from "motion/react";

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, filter: "blur(10px)", y: 8 }
      }
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
