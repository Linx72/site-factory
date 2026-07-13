"use client";

import dynamic from "next/dynamic";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const Hero3DBackground = dynamic(
  () =>
    import("@/components/motion/hero-3d-background").then(
      (mod) => mod.Hero3DBackground,
    ),
  { ssr: false },
);

/** Loads WebGL hero only when motion is allowed (no SSR). */
export function Hero3DLazy() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;
  return <Hero3DBackground />;
}
