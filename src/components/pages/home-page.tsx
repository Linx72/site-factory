import { BentoGridSection } from "@/components/sections/bento-grid-section";
import { ContactSection } from "@/components/sections/contact-section";
import { CtaSection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FeaturesSection } from "@/components/sections/features-section";
import {
  HeroSection,
  type HeroSectionProps,
} from "@/components/sections/hero-section";
import { LogoMarqueeSection } from "@/components/sections/logo-marquee-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { ScrollStorySection } from "@/components/sections/scroll-story-section";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { StatsSection } from "@/components/sections/stats-section";
import { TeamSection } from "@/components/sections/team-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { UiShowcase } from "@/components/sections/ui-showcase";
import { JsonLd } from "@/components/seo/json-ld";
import { buildStorefrontOrganizationJsonLd } from "@/lib/seo/storefront-json-ld";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import { localizedHomeHref } from "@/lib/i18n/paths";
import type { HomeSectionId } from "@/lib/site-content";
import { siteConfig, getSingleLocale } from "@/lib/site-config";
import {
  getSectionVariants,
  type SectionVariantsConfig,
} from "@/lib/section-variants";

const defaultSectionOrder: HomeSectionId[] = [
  "logos",
  "features",
  "bento",
  "stats",
  "scroll-story",
  "timeline",
  "testimonials",
  "team",
  "ui",
  "pricing",
  "faq",
  "contact",
  "cta",
];

type HomePageProps = {
  hero?: HeroSectionProps;
  locale?: string;
  /** When set, only these sections render (hero always included). */
  sections?: readonly HomeSectionId[];
  /** Override variants from site.json (tests / previews). */
  variants?: Partial<SectionVariantsConfig>;
  /** Localized copy for FAQ, contact, CTA, header — from messages or defaults. */
  copy?: HomeSectionCopy;
  /** Localized WebSite schema description — defaults to siteConfig.description. */
  jsonLdDescription?: string;
  /** Canonical site URL for schema — defaults to siteConfig.url. */
  jsonLdUrl?: string;
  /** BCP 47 language tag for schema.org inLanguage. */
  jsonLdInLanguage?: string;
};

function renderSection(
  id: HomeSectionId,
  locale: string,
  copy: HomeSectionCopy,
  variants: Required<SectionVariantsConfig>,
) {
  switch (id) {
    case "logos":
      return <LogoMarqueeSection key={id} copy={copy.logos} />;
    case "features":
      return (
        <FeaturesSection key={id} copy={copy.features} variant={variants.features} />
      );
    case "bento":
      return <BentoGridSection key={id} copy={copy.bento} />;
    case "stats":
      return <StatsSection key={id} copy={copy.stats} />;
    case "scroll-story":
      return <ScrollStorySection key={id} copy={copy.scrollStory} />;
    case "timeline":
      return <TimelineSection key={id} copy={copy.timeline} />;
    case "testimonials":
      return <TestimonialsSection key={id} copy={copy.testimonials} />;
    case "team":
      return <TeamSection key={id} copy={copy.team} />;
    case "ui":
      return (
        <section key={id} id="ui" className="border-t border-border px-6 py-24 md:px-16">
          <UiShowcase copy={copy.ui} />
        </section>
      );
    case "pricing":
      return (
        <PricingSection
          key={id}
          copy={copy.pricing}
          locale={locale}
          variant={variants.pricing}
        />
      );
    case "faq":
      return (
        <FaqSection
          key={id}
          title={copy.faq?.title}
          items={copy.faq?.items}
        />
      );
    case "contact":
      return <ContactSection key={id} copy={copy.contact} />;
    case "cta":
      return (
        <CtaSection
          key={id}
          locale={locale}
          copy={copy.cta}
        />
      );
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

/** Composed marketing landing — shared by `/` and `/[locale]`. */
export function HomePage({
  hero,
  locale = getSingleLocale(),
  sections,
  variants: variantsProp,
  copy = getDefaultHomeSectionCopy(),
  jsonLdDescription,
  jsonLdUrl,
  jsonLdInLanguage,
}: HomePageProps) {
  const order = sections ?? defaultSectionOrder;
  const variants = { ...getSectionVariants(), ...variantsProp };
  const homeJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: jsonLdDescription ?? siteConfig.description,
    url: jsonLdUrl ?? siteConfig.url,
  };
  if (jsonLdInLanguage) {
    homeJsonLd.inLanguage = jsonLdInLanguage;
  }

  return (
    <>
      <JsonLd data={homeJsonLd} />
      <JsonLd data={buildStorefrontOrganizationJsonLd(jsonLdUrl ?? siteConfig.url)} />
      <SiteHeader
        ctaLabel={copy.header?.cta}
        menuLabel={copy.header?.menu}
        navLinks={copy.nav?.links}
        a11y={copy.a11y}
        homeHref={localizedHomeHref(locale)}
      />
      <main className="flex flex-col">
        <HeroSection {...hero} locale={locale} variant={hero?.variant ?? variants.hero} />
        {order.map((id) => renderSection(id, hero?.locale ?? locale, copy, variants))}
      </main>
      <SiteFooter navLinks={copy.nav?.links} copy={copy.footer} />
    </>
  );
}
