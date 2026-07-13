"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion/tokens";

type LineRevealProps = {
  /** One string per line — each line slides up from a clipped container. */
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  /** Stagger between lines (seconds). */
  stagger?: number;
};

/**
 * Multi-line headline reveal — overflow clip + translateY per line.
 * Common pattern for CTA blocks and section titles.
 */
export function LineReveal({
  lines,
  className,
  lineClassName,
  stagger = 0.1,
}: LineRevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={className}>
        {lines.map((line) => (
          <p key={line} className={lineClassName}>
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {lines.map((line, index) => (
        <div key={`${line}-${index}`} className="overflow-hidden">
          <motion.p
            className={cn(lineClassName)}
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              delay: index * stagger,
              duration: motionTokens.duration.slow,
              ease: motionTokens.ease.out,
            }}
          >
            {line}
          </motion.p>
        </div>
      ))}
    </div>
  );
}
