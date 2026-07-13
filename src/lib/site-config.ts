/**
 * Public site + brand defaults. Generated from preset "launch".
 */
import type { AnalyticsProvider } from "@/lib/analytics";
import { getAnalyticsProvider } from "@/lib/analytics";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit;
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionHost) {
    return productionHost.startsWith("http")
      ? productionHost
      : `https://${productionHost.replace(/^https?:\/\//, "")}`;
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost.replace(/^https?:\/\//, "")}`;
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Site Factory",
  description: "Живой анимированный сайт по запросу — brief → preset → Vercel URL. Код ваш, motion из каталога.",
  url: resolveSiteUrl(),
  /** Static contact fallback + mailto target when Convex is off. */
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "brief@sitefactory.dev",
  links: {
    github: "https://github.com/Linx72/site-factory",
  },
} as const;

/** Brand OKLCH tokens — synced with brand-palette.css and presets. */
export const brandTokens = {
  hue: 235,
  chroma: 0.07,
} as const;

/** Toggle optional subsystems — enable only when env/backend is configured. */
export const siteFeatures = {
  stripe: Boolean(process.env.STRIPE_SECRET_KEY),
  convex: Boolean(process.env.NEXT_PUBLIC_CONVEX_URL),
  contactForm: true,
  i18n: process.env.NEXT_PUBLIC_I18N === "true",
  cms:
    process.env.NEXT_PUBLIC_CMS === "true" &&
    Boolean(process.env.NEXT_PUBLIC_CONVEX_URL),
  analytics: getAnalyticsProvider() as AnalyticsProvider,
} as const;
