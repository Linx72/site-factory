/**
 * Motion lab page copy — intro + interactive demo labels.
 * Wired from MotionLab namespace in messages/*.json when i18n is on.
 */
import type { MotionLabIntroCopy } from "@/lib/i18n/section-copy";

export type MotionLabDemosCopy = {
  magneticHover: string;
  textRevealSample: string;
  staggerItems: readonly [string, string, string];
  fadeInBody: string;
  countProjects: string;
  countSatisfaction: string;
  /** Template with `{index}` placeholder. */
  scrollRevealBlock: string;
  lineOne: string;
  lineTwo: string;
  parallaxHint: string;
  scrollProgressBefore: string;
  scrollProgressCode: string;
  scrollProgressAfter: string;
  tiltTitle: string;
  tiltBody: string;
  cursorGlowBefore: string;
  cursorGlowLink: string;
  cursorGlowAfter: string;
  backToTopBefore: string;
  backToTopCode: string;
  backToTopAfter: string;
  hero3dBefore: string;
  hero3dCode: string;
  hero3dMiddle: string;
  hero3dLink: string;
  hero3dAfter: string;
};

export type MotionLabBlocksCopy = {
  magneticButton: string;
  textReveal: string;
  staggerChildren: string;
  fadeIn: string;
  countUp: string;
  logoMarquee: string;
  scrollReveal: string;
  lineReveal: string;
  parallaxLayer: string;
  scrollProgress: string;
  tiltCard: string;
  cursorGlow: string;
  backToTop: string;
  hero3d: string;
};

export type MotionLabCopy = MotionLabIntroCopy & {
  /** Footer link back to localized home. */
  backHome: string;
  /** Localized section headings — file paths stay English in the showcase. */
  blocks: MotionLabBlocksCopy;
  demos: MotionLabDemosCopy;
};

export const defaultMotionLabDemos: MotionLabDemosCopy = {
  magneticHover: "Hover me — cursor pull",
  textRevealSample: "Words blur in one by one for hero headlines",
  staggerItems: ["First", "Second", "Third"],
  fadeInBody: "Simple opacity + rise on mount",
  countProjects: "Projects",
  countSatisfaction: "Satisfaction",
  scrollRevealBlock:
    "Scroll-triggered block {index} — scrubbed with Lenis + ScrollTrigger",
  lineOne: "Line one slides up",
  lineTwo: "Line two follows",
  parallaxHint: "Scroll this page — blob moves on Y",
  scrollProgressBefore:
    "Thin primary bar at the very top of every page — mounted in",
  scrollProgressCode: "MotionProvider",
  scrollProgressAfter: ". Scroll this page to see it fill.",
  tiltTitle: "3D hover tilt",
  tiltBody: "Move pointer — used on team cards",
  cursorGlowBefore: "Pointer-following radial glow on the",
  cursorGlowLink: "homepage hero",
  cursorGlowAfter: "— desktop only, off when prefers-reduced-motion.",
  backToTopBefore: "Floating button bottom-right after ~600px scroll — uses Lenis",
  backToTopCode: "scrollTo(0)",
  backToTopAfter: ".",
  hero3dBefore: "WebGL wireframe loads lazily on the home hero (desktop only, skipped when",
  hero3dCode: "prefers-reduced-motion",
  hero3dMiddle: "). See",
  hero3dLink: "homepage hero",
  hero3dAfter: ".",
};

export const defaultMotionLabBlocks: MotionLabBlocksCopy = {
  magneticButton: "MagneticButton",
  textReveal: "TextReveal",
  staggerChildren: "StaggerChildren + fadeUp",
  fadeIn: "FadeIn",
  countUp: "CountUp",
  logoMarquee: "LogoMarquee",
  scrollReveal: "ScrollReveal (GSAP)",
  lineReveal: "LineReveal",
  parallaxLayer: "ParallaxLayer",
  scrollProgress: "ScrollProgress",
  tiltCard: "TiltCard",
  cursorGlow: "CursorGlow",
  backToTop: "BackToTop",
  hero3d: "Hero3DLazy",
};

export const defaultMotionLabCopy: MotionLabCopy = {
  eyebrow: "Reference",
  title: "Motion lab",
  description:
    "Live previews of every primitive in src/components/motion/. Hover CTAs to feel magnetic pull; scroll down for GSAP reveals.",
  backHome: "← Back to home",
  blocks: defaultMotionLabBlocks,
  demos: defaultMotionLabDemos,
};

/** Replace `{name}` placeholders in motion lab demo templates. */
export function formatMotionLabTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ""),
  );
}
