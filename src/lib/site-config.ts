/**
 * Public site + brand defaults. Generated from preset "launch".
 */
import type { AnalyticsProvider } from "@/lib/analytics";
import { getAnalyticsProvider } from "@/lib/analytics";

export const siteConfig = {
  name: "Site Factory",
  description: "Живой анимированный сайт по запросу — brief → preset → Vercel URL. Код ваш, motion из каталога.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
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
