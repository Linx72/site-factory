/**
 * hreflang / canonical helpers for localized public routes.
 * Used by sitemap.ts and page generateMetadata when NEXT_PUBLIC_I18N=true.
 */
import { routing, type AppLocale } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n/paths";
import { getPublicSitemapPaths } from "@/lib/site-pages";
import { siteConfig, siteFeatures } from "@/lib/site-config";

/** @deprecated Prefer getLocalizedPublicPaths() — kept for call-site clarity. */
export type LocalizedPublicPath = string;

/** Enabled implemented paths for sitemap / metadata ("" = home). */
export function getLocalizedPublicPaths(): string[] {
  return getPublicSitemapPaths();
}

/** @deprecated Use getLocalizedPublicPaths() */
export const LOCALIZED_PUBLIC_PATHS = [
  "",
  "/motion",
  "/status",
  "/privacy",
  "/terms",
  "/about",
  "/case",
  "/case/demo",
  "/blog",
] as const;

function siteBase(): string {
  return siteConfig.url.replace(/\/$/, "");
}

/** Path segment for a locale — `/en`, `/ru/motion`, or `/motion` when i18n off. */
export function publicPathForLocale(
  locale: string | undefined,
  path: LocalizedPublicPath,
): string {
  if (!siteFeatures.i18n) {
    return path || "/";
  }
  return localizedPath(locale, path || "/");
}

/** Absolute URL for a localized public path. */
export function absoluteUrlForLocale(
  locale: string | undefined,
  path: LocalizedPublicPath,
): string {
  return `${siteBase()}${publicPathForLocale(locale, path)}`;
}

/** hreflang map including x-default — undefined when i18n is off. */
export function buildLanguageAlternates(
  path: LocalizedPublicPath,
): Record<string, string> | undefined {
  if (!siteFeatures.i18n) {
    return undefined;
  }

  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = absoluteUrlForLocale(locale, path);
  }

  languages["x-default"] = absoluteUrlForLocale(routing.defaultLocale, path);
  return languages;
}

/** Next.js Metadata alternates block for a localized page. */
export function buildPageAlternates(locale: string, path: LocalizedPublicPath) {
  const languages = buildLanguageAlternates(path);

  if (!languages) {
    const canonical = path ? `${siteBase()}${path}` : siteBase();
    return { canonical };
  }

  return {
    canonical: absoluteUrlForLocale(locale, path),
    languages,
  };
}

const OPEN_GRAPH_LOCALES: Record<AppLocale, string> = {
  en: "en_US",
  ru: "ru_RU",
};

/** openGraph locale + alternates for localized pages. */
export function buildOpenGraphLocales(locale: string) {
  if (!siteFeatures.i18n || !isAppLocale(locale)) {
    return undefined;
  }

  const primary = OPEN_GRAPH_LOCALES[locale];
  const alternateLocale = routing.locales
    .filter((code) => code !== locale)
    .map((code) => OPEN_GRAPH_LOCALES[code]);

  return { locale: primary, alternateLocale };
}

/** Type guard for AppLocale. */
export function isAppLocale(value: string): value is AppLocale {
  return routing.locales.includes(value as AppLocale);
}
