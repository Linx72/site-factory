/**
 * Client-safe page gates — no node:fs imports (used by SiteFooter in error boundary).
 * Server sitemap uses `site-pages.ts` which may import blog-lite.
 */
import rawSite from "../../content/site.json";

const PAGE_IDS = [
  "home",
  "motion",
  "status",
  "privacy",
  "terms",
  "about",
  "case",
  "blog-index",
] as const;

type PageId = (typeof PAGE_IDS)[number];

const DEFAULT_ENABLED: PageId[] = [
  "home",
  "motion",
  "status",
  "privacy",
  "terms",
  "about",
  "case",
  "blog-index",
];

function isPageId(value: string): value is PageId {
  return (PAGE_IDS as readonly string[]).includes(value);
}

function getEnabledPages(): PageId[] {
  const fromContent = (rawSite as { pages?: string[] }).pages;
  if (Array.isArray(fromContent) && fromContent.length > 0) {
    return fromContent.filter(isPageId);
  }
  return [...DEFAULT_ENABLED];
}

/** Whether a catalog page is enabled for this project (client-safe). */
export function isPageEnabled(id: PageId): boolean {
  return getEnabledPages().includes(id);
}
