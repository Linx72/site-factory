/**
 * Build MotionLab copy from next-intl translator (MotionLab namespace).
 */
import {
  defaultMotionLabCopy,
  type MotionLabCopy,
} from "@/lib/i18n/motion-lab-copy";
import type { MotionLabIntroCopy } from "@/lib/i18n/section-copy";

type Translator = (key: string) => string;

/** Intro only — kept for metadata and backward compatibility. */
export function buildMotionLabIntro(t: Translator): MotionLabIntroCopy {
  return {
    eyebrow: t("eyebrow"),
    title: t("title"),
    description: t("description"),
  };
}

/** Full motion lab page copy including interactive demo labels. */
export function buildMotionLabCopy(t: Translator): MotionLabCopy {
  return {
    ...buildMotionLabIntro(t),
    backHome: t("backHome"),
    blocks: {
      magneticButton: t("blocks.magneticButton"),
      textReveal: t("blocks.textReveal"),
      staggerChildren: t("blocks.staggerChildren"),
      fadeIn: t("blocks.fadeIn"),
      countUp: t("blocks.countUp"),
      logoMarquee: t("blocks.logoMarquee"),
      scrollReveal: t("blocks.scrollReveal"),
      lineReveal: t("blocks.lineReveal"),
      parallaxLayer: t("blocks.parallaxLayer"),
      scrollProgress: t("blocks.scrollProgress"),
      tiltCard: t("blocks.tiltCard"),
      cursorGlow: t("blocks.cursorGlow"),
      backToTop: t("blocks.backToTop"),
      hero3d: t("blocks.hero3d"),
    },
    demos: {
      magneticHover: t("demos.magneticHover"),
      textRevealSample: t("demos.textRevealSample"),
      staggerItems: [
        t("demos.staggerFirst"),
        t("demos.staggerSecond"),
        t("demos.staggerThird"),
      ],
      fadeInBody: t("demos.fadeInBody"),
      countProjects: t("demos.countProjects"),
      countSatisfaction: t("demos.countSatisfaction"),
      scrollRevealBlock: t("demos.scrollRevealBlock"),
      lineOne: t("demos.lineOne"),
      lineTwo: t("demos.lineTwo"),
      parallaxHint: t("demos.parallaxHint"),
      scrollProgressBefore: t("demos.scrollProgressBefore"),
      scrollProgressCode: t("demos.scrollProgressCode"),
      scrollProgressAfter: t("demos.scrollProgressAfter"),
      tiltTitle: t("demos.tiltTitle"),
      tiltBody: t("demos.tiltBody"),
      cursorGlowBefore: t("demos.cursorGlowBefore"),
      cursorGlowLink: t("demos.cursorGlowLink"),
      cursorGlowAfter: t("demos.cursorGlowAfter"),
      backToTopBefore: t("demos.backToTopBefore"),
      backToTopCode: t("demos.backToTopCode"),
      backToTopAfter: t("demos.backToTopAfter"),
      hero3dBefore: t("demos.hero3dBefore"),
      hero3dCode: t("demos.hero3dCode"),
      hero3dMiddle: t("demos.hero3dMiddle"),
      hero3dLink: t("demos.hero3dLink"),
      hero3dAfter: t("demos.hero3dAfter"),
    },
  };
}

export function getDefaultMotionLabCopy(): MotionLabCopy {
  return defaultMotionLabCopy;
}
