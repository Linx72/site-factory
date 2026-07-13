"use client";

import { motion } from "framer-motion";

import { Hero3DLazy } from "@/components/motion/hero-3d-lazy";
import { CursorGlow } from "@/components/motion/cursor-glow";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { TextReveal } from "@/components/motion/text-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";
import { cmsKeys } from "@/lib/cms/keys";
import { useCmsString } from "@/lib/cms/use-cms-string";
import { fadeUp } from "@/lib/motion/variants";
import type { HeroVariant } from "@/lib/section-variants";
import { Button } from "@/components/ui/button";
import { siteConfig, siteFeatures, getSingleLocale } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export type HeroSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
  stats?: readonly { label: string; sub: string }[];
  /** Locale for CMS lookups (defaults to en). */
  locale?: string;
  /** Layout variant — default keeps current stacked hero + stats. */
  variant?: HeroVariant;
};

type HeroCopy = Required<
  Pick<
    HeroSectionProps,
    "eyebrow" | "title" | "description" | "primaryCta" | "secondaryCta"
  >
>;

const defaults = {
  eyebrow: siteConfig.name,
  title: "Beautiful motion ready to ship",
  description: siteConfig.description,
  primaryCta: "Start building",
  secondaryCta: "View components",
} as const;

function resolveCopy(props: HeroSectionProps): HeroCopy {
  return {
    eyebrow: props.eyebrow ?? defaults.eyebrow,
    title: props.title ?? defaults.title,
    description: props.description ?? defaults.description,
    primaryCta: props.primaryCta ?? defaults.primaryCta,
    secondaryCta: props.secondaryCta ?? defaults.secondaryCta,
  };
}

function HeroActions({
  primaryCta,
  secondaryCta,
}: Pick<HeroCopy, "primaryCta" | "secondaryCta">) {
  return (
    <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
      <MagneticButton>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button size="lg" className="rounded-full px-6" render={<a href="#contact" />}>
            {primaryCta}
          </Button>
        </motion.div>
      </MagneticButton>
      <Button
        variant="outline"
        size="lg"
        className="rounded-full px-6"
        render={<a href="#features" />}
      >
        {secondaryCta}
      </Button>
    </motion.div>
  );
}

const defaultStats = [
  { label: "60fps", sub: "transform-only animations" },
  { label: "a11y", sub: "prefers-reduced-motion" },
  { label: "Figma", sub: "motion context MCP" },
] as const;

function HeroDefaultView(copy: HeroCopy & { stats: readonly { label: string; sub: string }[] }) {
  return (
    <section id="hero" className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden px-6 pb-16 pt-28 md:px-16">
      <CursorGlow />
      <Hero3DLazy />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 size-72 rounded-full bg-muted/60 blur-3xl"
      />

      <StaggerChildren className="relative mx-auto flex w-full max-w-5xl flex-col gap-5">
        <motion.p
          variants={fadeUp}
          className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground"
        >
          {copy.eyebrow}
        </motion.p>

        <TextReveal
          as="h1"
          text={copy.title}
          className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
        />

        <motion.p
          variants={fadeUp}
          className="max-w-xl text-lg leading-relaxed text-muted-foreground"
        >
          {copy.description}
        </motion.p>

        <HeroActions primaryCta={copy.primaryCta} secondaryCta={copy.secondaryCta} />
      </StaggerChildren>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn(
          "relative mx-auto mt-20 grid w-full max-w-5xl gap-4 md:grid-cols-3",
        )}
      >
        {copy.stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-card/60 px-5 py-4 backdrop-blur-sm"
          >
            <p className="text-2xl font-semibold">{item.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.sub}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/**
 * Brand-first full-bleed hero — no stat cards, no inset media.
 * Eyebrow (brand) is the dominant signal; title is supporting copy.
 */
function HeroEditorialView(copy: HeroCopy) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-6 pb-20 pt-32 md:px-16 md:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_55%),linear-gradient(to_bottom,transparent_40%,var(--background)_95%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--foreground)_6%,transparent),transparent_50%)]"
      />

      <StaggerChildren className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6">
        <TextReveal
          as="h1"
          text={copy.eyebrow}
          className="max-w-5xl font-semibold leading-[0.95] tracking-tight text-foreground text-[clamp(2.75rem,12vw,7.5rem)]"
        />

        <motion.p
          variants={fadeUp}
          className="max-w-2xl text-xl font-medium leading-snug tracking-tight text-muted-foreground md:text-2xl"
        >
          {copy.title}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="max-w-md text-base leading-relaxed text-muted-foreground"
        >
          {copy.description}
        </motion.p>

        <HeroActions primaryCta={copy.primaryCta} secondaryCta={copy.secondaryCta} />
      </StaggerChildren>
    </section>
  );
}

type HeroViewProps = HeroCopy & {
  stats: readonly { label: string; sub: string }[];
  variant: HeroVariant;
};

function HeroSectionView({ variant, stats, ...copy }: HeroViewProps) {
  if (variant === "editorial") {
    return <HeroEditorialView {...copy} />;
  }
  return <HeroDefaultView {...copy} stats={stats} />;
}

/** CMS branch — only mounted when siteFeatures.cms is true (requires ConvexProvider). */
function HeroSectionWithCms(props: HeroSectionProps) {
  const locale = props.locale ?? getSingleLocale();
  const fallback = resolveCopy(props);
  const stats = props.stats ?? defaultStats;
  const variant = props.variant ?? "default";

  const copy: HeroCopy = {
    eyebrow: useCmsString(cmsKeys.hero.eyebrow, fallback.eyebrow, locale),
    title: useCmsString(cmsKeys.hero.title, fallback.title, locale),
    description: useCmsString(
      cmsKeys.hero.description,
      fallback.description,
      locale,
    ),
    primaryCta: fallback.primaryCta,
    secondaryCta: fallback.secondaryCta,
  };

  return <HeroSectionView {...copy} stats={stats} variant={variant} />;
}

/**
 * Full-viewport hero with stagger and word reveal headline.
 * Props override defaults; CMS keys override when siteFeatures.cms is on.
 * Variants: `default` (stats + 3D) | `editorial` (brand-first, no cards).
 */
export function HeroSection(props: HeroSectionProps = {}) {
  const stats = props.stats ?? defaultStats;
  const variant = props.variant ?? "default";

  if (siteFeatures.cms) {
    return <HeroSectionWithCms {...props} stats={stats} variant={variant} />;
  }

  return (
    <HeroSectionView {...resolveCopy(props)} stats={stats} variant={variant} />
  );
}
