#!/usr/bin/env node
/**
 * Generates src/app/page.tsx from comma-separated section ids.
 * Used by ~/Projects/scripts/new-web-site.sh
 *
 * Usage:
 *   node scripts/generate-page.mjs <sections> <page.tsx path>
 *   node scripts/generate-page.mjs --home-page <sections> <page.tsx path>
 *
 * --home-page emits HomePage + siteContent (hero/sections from content/site.json).
 */
import fs from "node:fs";

const args = process.argv.slice(2);
const homePageMode = args[0] === "--home-page";
const [sectionsCsv, pageFile] = homePageMode ? args.slice(1) : args;

if (!sectionsCsv || !pageFile) {
  console.error(
    "Usage: generate-page.mjs [--home-page] <sections> <page.tsx path>",
  );
  process.exit(1);
}

/** @type {Record<string, { import: string; from: string; jsx: string }>} */
const catalog = {
  hero: {
    import: "HeroSection",
    from: "@/components/sections/hero-section",
    jsx: "<HeroSection />",
  },
  logos: {
    import: "LogoMarqueeSection",
    from: "@/components/sections/logo-marquee-section",
    jsx: "<LogoMarqueeSection />",
  },
  features: {
    import: "FeaturesSection",
    from: "@/components/sections/features-section",
    jsx: "<FeaturesSection />",
  },
  bento: {
    import: "BentoGridSection",
    from: "@/components/sections/bento-grid-section",
    jsx: "<BentoGridSection />",
  },
  stats: {
    import: "StatsSection",
    from: "@/components/sections/stats-section",
    jsx: "<StatsSection />",
  },
  "scroll-story": {
    import: "ScrollStorySection",
    from: "@/components/sections/scroll-story-section",
    jsx: "<ScrollStorySection />",
  },
  testimonials: {
    import: "TestimonialsSection",
    from: "@/components/sections/testimonials-section",
    jsx: "<TestimonialsSection />",
  },
  ui: {
    import: "UiShowcase",
    from: "@/components/sections/ui-showcase",
    jsx: '<section id="ui" className="border-t border-border px-6 py-24 md:px-16"><UiShowcase /></section>',
  },
  pricing: {
    import: "PricingSection",
    from: "@/components/sections/pricing-section",
    jsx: "<PricingSection />",
  },
  faq: {
    import: "FaqSection",
    from: "@/components/sections/faq-section",
    jsx: "<FaqSection />",
  },
  contact: {
    import: "ContactSection",
    from: "@/components/sections/contact-section",
    jsx: "<ContactSection />",
  },
  cta: {
    import: "CtaSection",
    from: "@/components/sections/cta-section",
    jsx: "<CtaSection />",
  },
  timeline: {
    import: "TimelineSection",
    from: "@/components/sections/timeline-section",
    jsx: "<TimelineSection />",
  },
  team: {
    import: "TeamSection",
    from: "@/components/sections/team-section",
    jsx: "<TeamSection />",
  },
};

const ids = sectionsCsv
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const unknown = ids.filter((id) => !catalog[id]);
if (unknown.length) {
  console.error("Unknown sections:", unknown.join(", "));
  console.error("Valid:", Object.keys(catalog).join(", "));
  process.exit(1);
}

if (homePageMode) {
  const sectionIds = ids.filter((id) => id !== "hero");
  const sectionsJson = JSON.stringify(sectionIds);

  const content = `import { HomePage } from "@/components/pages/home-page";
import { siteFeatures } from "@/lib/site-config";
import { siteContent } from "@/lib/site-content";
import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";

/** Generated from sections: ${sectionsCsv} */
export default function Home() {
  if (siteFeatures.i18n) {
    redirect(\`/\${routing.defaultLocale}\`);
  }

  const sections = siteContent.sections ?? ${sectionsJson};

  return (
    <HomePage hero={siteContent.hero} sections={sections} />
  );
}
`;

  fs.writeFileSync(pageFile, content);
  process.exit(0);
}

const used = ids.map((id) => catalog[id]);
const shell = [
  {
    import: "SiteHeader",
    from: "@/components/sections/site-header",
    jsx: "<SiteHeader />",
  },
  {
    import: "SiteFooter",
    from: "@/components/sections/site-footer",
    jsx: "<SiteFooter />",
  },
];

const allImports = [...shell, ...used];
const uniqueImports = [...new Map(allImports.map((i) => [i.import, i])).values()];
const importLines = uniqueImports
  .map((i) => `import { ${i.import} } from "${i.from}";`)
  .join("\n");

const body = used.map((i) => `        ${i.jsx}`).join("\n");

const content = `${importLines}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
${body}
      </main>
      <SiteFooter />
    </>
  );
}
`;

fs.writeFileSync(pageFile, content);
