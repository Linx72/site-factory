"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { staggerContainer } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type StaggerChildrenProps = HTMLMotionProps<"div">;

/** Staggers fade-up on each direct child that uses fadeUp variants. */
export function StaggerChildren({
  className,
  children,
  ...props
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
