"use client";

import { motion, type Variants } from "framer-motion";

import { motionTokens } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(6px)" },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.out,
      delay: index * 0.04,
    },
  }),
};

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
};

/**
 * Word-by-word reveal with blur lift. Respects prefers-reduced-motion via Framer.
 */
export function TextReveal({ text, as: Tag = "h2", className }: TextRevealProps) {
  const words = text.split(" ");

  return (
    <Tag className={cn("flex flex-wrap gap-x-[0.28em] gap-y-1", className)}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          custom={index}
          variants={wordVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
