"use client";

import { BackToTop } from "@/components/motion/back-to-top";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { LenisProvider } from "@/components/providers/lenis-provider";

type MotionProviderProps = {
  children: React.ReactNode;
};

/** Root client wrapper: smooth scroll + scroll progress bar. */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LenisProvider>
      <ScrollProgress />
      <BackToTop />
      {children}
    </LenisProvider>
  );
}
