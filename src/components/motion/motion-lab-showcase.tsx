"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { CountUp } from "@/components/motion/count-up";
import { LineReveal } from "@/components/motion/line-reveal";
import { LogoMarquee } from "@/components/motion/logo-marquee";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { StaggerChildren } from "@/components/motion/stagger-children";
import { TextReveal } from "@/components/motion/text-reveal";
import { Button } from "@/components/ui/button";
import {
  defaultMotionLabCopy,
  formatMotionLabTemplate,
  type MotionLabCopy,
} from "@/lib/i18n/motion-lab-copy";
import { fadeUp } from "@/lib/motion/variants";
import { motion } from "framer-motion";
import Link from "next/link";

function LabBlock({
  title,
  file,
  children,
}: {
  title: string;
  file: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{file}</p>
      </div>
      {children}
    </section>
  );
}

/** Interactive catalog of motion primitives for copy-paste reference. */
export function MotionLabShowcase({
  copy = defaultMotionLabCopy,
  homeHref = "/",
}: {
  copy?: MotionLabCopy;
  homeHref?: string;
}) {
  const { demos, blocks } = copy;
  const heroHref = `${homeHref.replace(/\/$/, "")}#hero`;

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 md:px-16">
      <FadeIn>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          {copy.eyebrow}
        </p>
        <TextReveal
          as="h1"
          text={copy.title}
          className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl"
        />
        <p className="mt-4 max-w-2xl text-muted-foreground">{copy.description}</p>
      </FadeIn>

      <LabBlock title={blocks.magneticButton} file="magnetic-button.tsx">
        <MagneticButton>
          <Button size="lg" className="rounded-full px-8">
            {demos.magneticHover}
          </Button>
        </MagneticButton>
      </LabBlock>

      <LabBlock title={blocks.textReveal} file="text-reveal.tsx">
        <TextReveal
          as="p"
          text={demos.textRevealSample}
          className="text-3xl font-semibold md:text-4xl"
        />
      </LabBlock>

      <LabBlock title={blocks.staggerChildren} file="stagger-children.tsx · variants.ts">
        <StaggerChildren className="grid gap-3 sm:grid-cols-3">
          {demos.staggerItems.map((label) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-card px-4 py-6 text-center font-medium"
            >
              {label}
            </motion.div>
          ))}
        </StaggerChildren>
      </LabBlock>

      <LabBlock title={blocks.fadeIn} file="fade-in.tsx">
        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
            {demos.fadeInBody}
          </div>
        </FadeIn>
      </LabBlock>

      <LabBlock title={blocks.countUp} file="count-up.tsx">
        <div className="flex flex-wrap gap-10">
          <div>
            <CountUp value={128} suffix="+" className="text-5xl font-semibold tabular-nums" />
            <p className="mt-1 text-sm text-muted-foreground">{demos.countProjects}</p>
          </div>
          <div>
            <CountUp value={98} suffix="%" className="text-5xl font-semibold tabular-nums" />
            <p className="mt-1 text-sm text-muted-foreground">{demos.countSatisfaction}</p>
          </div>
        </div>
      </LabBlock>

      <LabBlock title={blocks.logoMarquee} file="logo-marquee.tsx">
        <LogoMarquee
          items={["Framer", "GSAP", "Lenis", "R3F", "Convex", "Stripe"]}
          className="opacity-80"
        />
      </LabBlock>

      <LabBlock title={blocks.scrollReveal} file="scroll-reveal.tsx">
        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <ScrollReveal key={index}>
              <div className="rounded-2xl border border-border bg-muted/30 px-6 py-8">
                {formatMotionLabTemplate(demos.scrollRevealBlock, { index })}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </LabBlock>

      <LabBlock title={blocks.lineReveal} file="line-reveal.tsx">
        <LineReveal
          lines={[demos.lineOne, demos.lineTwo]}
          lineClassName="text-2xl font-semibold"
        />
      </LabBlock>

      <LabBlock title={blocks.parallaxLayer} file="parallax-layer.tsx">
        <div className="relative h-40 overflow-hidden rounded-2xl border border-border">
          <ParallaxLayer speed={0.6} className="absolute inset-0 flex items-center justify-center">
            <div className="size-32 rounded-full bg-primary/20 blur-xl" />
          </ParallaxLayer>
          <p className="relative z-10 flex h-full items-center justify-center text-sm text-muted-foreground">
            {demos.parallaxHint}
          </p>
        </div>
      </LabBlock>

      <LabBlock title={blocks.scrollProgress} file="scroll-progress.tsx">
        <p className="text-muted-foreground">
          {demos.scrollProgressBefore}{" "}
          <code className="rounded bg-muted px-1">{demos.scrollProgressCode}</code>
          {demos.scrollProgressAfter}
        </p>
      </LabBlock>

      <LabBlock title={blocks.tiltCard} file="tilt-card.tsx">
        <TiltCard className="max-w-xs">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-medium">{demos.tiltTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{demos.tiltBody}</p>
          </div>
        </TiltCard>
      </LabBlock>

      <LabBlock title={blocks.cursorGlow} file="cursor-glow.tsx">
        <p className="text-muted-foreground">
          {demos.cursorGlowBefore}{" "}
          <Link href={heroHref} className="text-primary underline-offset-4 hover:underline">
            {demos.cursorGlowLink}
          </Link>{" "}
          {demos.cursorGlowAfter}
        </p>
      </LabBlock>

      <LabBlock title={blocks.backToTop} file="back-to-top.tsx">
        <p className="text-muted-foreground">
          {demos.backToTopBefore}{" "}
          <code className="rounded bg-muted px-1">{demos.backToTopCode}</code>
          {demos.backToTopAfter}
        </p>
      </LabBlock>

      <LabBlock title={blocks.hero3d} file="hero-3d-lazy.tsx">
        <p className="text-muted-foreground">
          {demos.hero3dBefore}{" "}
          <code className="rounded bg-muted px-1">{demos.hero3dCode}</code>
          {demos.hero3dMiddle}{" "}
          <Link href={homeHref} className="text-primary underline-offset-4 hover:underline">
            {demos.hero3dLink}
          </Link>
          {demos.hero3dAfter}
        </p>
      </LabBlock>

      <div className="border-t border-border pt-10">
        <Link
          href={homeHref}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {copy.backHome}
        </Link>
      </div>
    </div>
  );
}
