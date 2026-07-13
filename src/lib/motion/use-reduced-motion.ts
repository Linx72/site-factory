"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Returns true when the user prefers reduced motion.
 * Use to skip or simplify GSAP timelines and heavy scroll effects.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
