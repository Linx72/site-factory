/**
 * Section layout variants — content model for site.json / brief.
 * Catalog: docs/SECTION-CATALOG.md · docs/features/SECTION-VARIANTS.md
 *
 * Omitted keys resolve to defaults (current UI). Unknown / not-yet-built
 * variants fall back to the default so clones never blank a section.
 */
import rawSite from "../../content/site.json";

/** Hero compositions. `editorial` = brand-first full-bleed (no stat cards). */
export const HERO_VARIANTS = ["default", "editorial"] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

/** Features compositions. */
export const FEATURES_VARIANTS = ["grid", "bento-lite"] as const;
export type FeaturesVariant = (typeof FEATURES_VARIANTS)[number];

/** Pricing compositions. */
export const PRICING_VARIANTS = ["cards", "compare"] as const;
export type PricingVariant = (typeof PRICING_VARIANTS)[number];

export type SectionVariantsConfig = {
  hero?: HeroVariant;
  features?: FeaturesVariant;
  pricing?: PricingVariant;
};

/** Defaults = layouts shipped before the variant system (zero regression). */
export const SECTION_VARIANT_DEFAULTS: Required<SectionVariantsConfig> = {
  hero: "default",
  features: "grid",
  pricing: "cards",
};

type SiteWithVariants = {
  variants?: SectionVariantsConfig;
  hero?: { variant?: string };
};

function isHeroVariant(value: string): value is HeroVariant {
  return (HERO_VARIANTS as readonly string[]).includes(value);
}

function isFeaturesVariant(value: string): value is FeaturesVariant {
  return (FEATURES_VARIANTS as readonly string[]).includes(value);
}

function isPricingVariant(value: string): value is PricingVariant {
  return (PRICING_VARIANTS as readonly string[]).includes(value);
}

/**
 * Resolved variants for this project.
 * Precedence: `variants.<id>` → `hero.variant` (hero only) → defaults.
 */
export function getSectionVariants(): Required<SectionVariantsConfig> {
  const site = rawSite as SiteWithVariants;
  const map = site.variants ?? {};

  const heroRaw = map.hero ?? site.hero?.variant;
  const hero =
    typeof heroRaw === "string" && isHeroVariant(heroRaw)
      ? heroRaw
      : SECTION_VARIANT_DEFAULTS.hero;

  const features =
    typeof map.features === "string" && isFeaturesVariant(map.features)
      ? map.features
      : SECTION_VARIANT_DEFAULTS.features;

  const pricing =
    typeof map.pricing === "string" && isPricingVariant(map.pricing)
      ? map.pricing
      : SECTION_VARIANT_DEFAULTS.pricing;

  return { hero, features, pricing };
}

export function getHeroVariant(): HeroVariant {
  return getSectionVariants().hero;
}

export function getFeaturesVariant(): FeaturesVariant {
  return getSectionVariants().features;
}

export function getPricingVariant(): PricingVariant {
  return getSectionVariants().pricing;
}

/**
 * Effective layout id — all declared variants are implemented as of v1.4.0.
 */
export function resolveImplementedHeroVariant(variant: HeroVariant): HeroVariant {
  return variant;
}

export function resolveImplementedFeaturesVariant(
  variant: FeaturesVariant,
): FeaturesVariant {
  return variant;
}

export function resolveImplementedPricingVariant(
  variant: PricingVariant,
): PricingVariant {
  return variant;
}
