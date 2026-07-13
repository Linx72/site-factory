/**
 * Shared motion timing tokens.
 * CSS variables in globals.css mirror these values for non-JS animations.
 */
export const motionTokens = {
  duration: {
    fast: 0.15,
    normal: 0.35,
    slow: 0.6,
  },
  ease: {
    out: [0.16, 1, 0.3, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
  },
  stagger: 0.08,
} as const;
