"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  maxTilt?: number;
};

/**
 * 3D hover tilt for cards — rotateX/Y from pointer position.
 * Transform-only; disabled when prefers-reduced-motion.
 */
export function TiltCard({ children, className, maxTilt = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], [maxTilt, -maxTilt]),
    { stiffness: 220, damping: 22 },
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], [-maxTilt, maxTilt]),
    { stiffness: 220, damping: 22 },
  );

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  function handleMouseMove(event: React.MouseEvent) {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
