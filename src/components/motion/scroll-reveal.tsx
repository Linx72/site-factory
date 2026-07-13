"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Vertical offset in px before reveal. */
  y?: number;
};

/**
 * GSAP scroll-triggered reveal. Skipped when prefers-reduced-motion.
 * Requires LenisProvider for smoothest scrub on long pages.
 */
export function ScrollReveal({
  children,
  className,
  y = 48,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion) return;

      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { dependencies: [reducedMotion, y], scope: ref },
  );

  return (
    <div
      ref={ref}
      className={cn(className, reducedMotion ? undefined : "will-change-transform")}
    >
      {children}
    </div>
  );
}
