"use client";

import type Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type RefObject,
} from "react";

type LenisContextValue = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; duration?: number },
  ) => void;
};

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
});

/** Programmatic smooth scroll — reads Lenis ref when available. */
export function useLenis(): LenisContextValue {
  return useContext(LenisContext);
}

type LenisContextProviderProps = {
  lenisRef: RefObject<Lenis | null>;
  children: React.ReactNode;
};

export function LenisContextProvider({ lenisRef, children }: LenisContextProviderProps) {
  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options?: { offset?: number; duration?: number }) => {
      const lenis = lenisRef.current;

      if (lenis) {
        lenis.scrollTo(target, options);
        return;
      }

      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }

      const element =
        typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;

      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [lenisRef],
  );

  return (
    <LenisContext.Provider value={{ scrollTo }}>{children}</LenisContext.Provider>
  );
}

/** Header offset when scrolling to hash anchors (sticky nav height). */
export const ANCHOR_SCROLL_OFFSET = -72;

/**
 * Intercepts in-page `#anchor` clicks and scrolls via Lenis when available.
 * Falls back to native smooth scroll when Lenis is disabled.
 */
export function useSmoothAnchorScroll(enabled: boolean) {
  const { scrollTo } = useLenis();

  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      const anchor = (event.target as Element).closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      scrollTo(target, { offset: ANCHOR_SCROLL_OFFSET, duration: 1.15 });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [enabled, scrollTo]);
}

/** Tracks which `#section` anchor is currently in view for nav highlight. */
export function useActiveSection(hrefs: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = hrefs
      .filter((href) => href.startsWith("#"))
      .map((href) => href.slice(1));

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [hrefs]);

  return active;
}
