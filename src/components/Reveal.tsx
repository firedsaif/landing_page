"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** stagger index — multiplies the delay for sequenced groups */
  index?: number;
  delay?: number;
  as?: "div" | "li" | "section";
  className?: string;
  y?: number;
};

/**
 * Quiet scroll reveal: fade + short upward translate, once.
 * Honors prefers-reduced-motion by rendering content statically.
 */
export default function Reveal({
  children,
  index = 0,
  delay = 0,
  className,
  y = 18,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: delay + index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
