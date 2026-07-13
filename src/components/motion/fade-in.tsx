"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { fadeUp } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type FadeInProps = HTMLMotionProps<"div"> & {
  /** Delay before animation starts (seconds). */
  delay?: number;
};

/**
 * Entrance animation: opacity + translateY.
 * Respects prefers-reduced-motion via Framer Motion defaults.
 */
export function FadeIn({ className, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay }}
      {...props}
    />
  );
}
