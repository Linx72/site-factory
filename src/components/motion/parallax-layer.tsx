"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

type ParallaxLayerProps = {
  children: React.ReactNode;
  className?: string;
  /** Scroll speed multiplier — higher = more vertical travel. */
  speed?: number;
};

/**
 * Subtle Y parallax tied to element scroll range.
 * Transform-only; disabled when prefers-reduced-motion.
 */
export function ParallaxLayer({
  children,
  className,
  speed = 0.35,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-60 * speed, 60 * speed]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
