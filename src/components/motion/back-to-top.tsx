"use client";

import { ArrowUpIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useLenis } from "@/lib/lenis/lenis-context";

/** Floating smooth-scroll to top — visible after ~600px scroll. */
export function BackToTop() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const { scrollTo } = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (value) => {
      setVisible(value > 600);
    });
  }, [scrollY]);

  if (reducedMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            size="icon"
            className="size-11 rounded-full shadow-lg"
            aria-label="Back to top"
            onClick={() => scrollTo(0, { duration: 1.1 })}
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
