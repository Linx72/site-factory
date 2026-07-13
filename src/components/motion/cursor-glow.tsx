"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * Soft radial glow that follows the pointer — hero ambience only.
 * Disabled on touch devices and when prefers-reduced-motion.
 */
export function CursorGlow() {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const springX = useSpring(x, { stiffness: 120, damping: 24 });
  const springY = useSpring(y, { stiffness: 120, damping: 24 });

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function handleMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reducedMotion, x, y]);

  if (reducedMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0"
      style={{ x: springX, y: springY }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 size-[min(80vw,520px)] rounded-full opacity-40 blur-3xl dark:opacity-25"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 35%, transparent) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
