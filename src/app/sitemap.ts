import type { MetadataRoute } from "next";

import {
  absoluteUrlForLocale,
  buildLanguageAlternates,
  getLocalizedPublicPaths,
  type LocalizedPublicPath,
} from "@/lib/i18n/alternate-links";
import { routing } from "@/i18n/routing";
import { siteFeatures } from "@/lib/site-config";

function sitemapEntry(
  locale: string | undefined,
  path: LocalizedPublicPath,
  now: Date,
): MetadataRoute.Sitemap[number] {
  const url = absoluteUrlForLocale(locale, path);
  const languages = buildLanguageAlternates(path);

  return {
    url,
    lastModified: now,
    changeFrequency: path.includes("status") ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/motion" ? 0.7 : 0.6,
    ...(languages ? { alternates: { languages } } : {}),
  };
}

/** Sitemap with hreflang alternates when i18n is enabled. */
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = getLocalizedPublicPaths();

  if (siteFeatures.i18n) {
    return paths.flatMap((path) =>
      routing.locales.map((locale) => sitemapEntry(locale, path, now)),
    );
  }

  return paths.map((path) => sitemapEntry(undefined, path, now));
}
