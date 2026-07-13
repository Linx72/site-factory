"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  LenisContextProvider,
  useSmoothAnchorScroll,
} from "@/lib/lenis/lenis-context";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

type LenisProviderProps = {
  children: React.ReactNode;
};

function LenisEffects({ enabled }: { enabled: boolean }) {
  useSmoothAnchorScroll(enabled);
  return null;
}

/**
 * Smooth scroll via Lenis, synced with GSAP ScrollTrigger.
 * Disabled when prefers-reduced-motion is set.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      lenisRef.current = null;
      return;
    }

    const instance = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = instance;

    instance.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <LenisContextProvider lenisRef={lenisRef}>
      <LenisEffects enabled={!reducedMotion} />
      {children}
    </LenisContextProvider>
  );
}
