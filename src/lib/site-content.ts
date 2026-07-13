/**
 * Typed access to `content/site.json` — nav, hero copy, and optional section order.
 * Scaffold / presets populate this file; components read via `siteContent`.
 */
import raw from "../../content/site.json";
import type { HeroSectionProps } from "@/components/sections/hero-section";
import type { SectionVariantsConfig } from "@/lib/section-variants";

export type SiteNavLink = {
  label: string;
  href: string;
};

/** Section ids for HomePage (hero is always rendered separately). */
export type HomeSectionId =
  | "logos"
  | "features"
  | "bento"
  | "stats"
  | "scroll-story"
  | "timeline"
  | "testimonials"
  | "team"
  | "ui"
  | "pricing"
  | "faq"
  | "contact"
  | "cta";

export type SiteContent = {
  name: string;
  tagline: string;
  preset?: string;
  nav: SiteNavLink[];
  /** Header primary button label (default: "Get started"). */
  headerCta?: string;
  hero?: HeroSectionProps & { variant?: string };
  /** Ordered section ids; omit for full landing composition. */
  sections?: HomeSectionId[];
  /** Opt-in public pages — see docs/PAGE-CATALOG.md */
  pages?: string[];
  /** Section layout variants — see docs/features/SECTION-VARIANTS.md */
  variants?: SectionVariantsConfig;
};

export const siteContent = raw as SiteContent;

export const defaultNavLinks: SiteNavLink[] = [
  { href: "#features", label: "Features" },
  { href: "#story", label: "Story" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
  { href: "#faq", label: "FAQ" },
  { href: "#ui", label: "UI" },
];

export function getNavLinks(): SiteNavLink[] {
  return siteContent.nav.length > 0 ? siteContent.nav : defaultNavLinks;
}
