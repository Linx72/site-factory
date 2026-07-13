import type { Variants } from "framer-motion";

import { motionTokens } from "./tokens";

/** Fade + slight rise — default entrance for sections and cards. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.out,
    },
  },
};

/** Parent container: staggers direct motion children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: motionTokens.stagger,
      delayChildren: 0.05,
    },
  },
};
