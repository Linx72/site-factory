import { siteFeatures } from "@/lib/site-config";

/**
 * Prefix path with locale segment when i18n is enabled.
 * @param locale - e.g. `en`, `ru` — omit for default (non-prefixed) paths
 * @param path - must start with `/` (except `/` itself)
 */
export function localizedPath(locale: string | undefined, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  if (siteFeatures.i18n && locale) {
    return `/${locale}${normalized}`;
  }

  return normalized || "/";
}

/** Home URL for current locale context. */
export function localizedHomeHref(locale: string | undefined): string {
  return localizedPath(locale, "/");
}
