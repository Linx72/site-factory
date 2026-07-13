/**
 * Opt-in public pages beyond the home landing.
 * Catalog: docs/PAGE-CATALOG.md · brief.pages / content/site.json pages[]
 */
import rawSite from "../../content/site.json";
import { listBlogPosts } from "@/lib/blog";

export const PAGE_IDS = [
  "home",
  "motion",
  "status",
  "privacy",
  "terms",
  "about",
  "case",
  "blog-index",
] as const;

export type PageId = (typeof PAGE_IDS)[number];

export type PageCatalogEntry = {
  id: PageId;
  /** App route when i18n off (locale prefix added when on). */
  path: string;
  /** Always available in template (not gated by site.json pages[]). */
  core?: boolean;
  /** Implemented in this template version. */
  implemented: boolean;
  summary: string;
};

/** Machine + human catalog of Site Factory pages. */
export const PAGE_CATALOG: readonly PageCatalogEntry[] = [
  {
    id: "home",
    path: "/",
    core: true,
    implemented: true,
    summary: "Marketing landing composed from SECTION-CATALOG",
  },
  {
    id: "motion",
    path: "/motion",
    core: true,
    implemented: true,
    summary: "Motion primitives lab",
  },
  {
    id: "status",
    path: "/status",
    core: true,
    implemented: true,
    summary: "Convex live dashboard (when configured)",
  },
  {
    id: "privacy",
    path: "/privacy",
    implemented: true,
    summary: "Privacy policy (legal document)",
  },
  {
    id: "terms",
    path: "/terms",
    implemented: true,
    summary: "Terms of service (legal document)",
  },
  {
    id: "about",
    path: "/about",
    implemented: true,
    summary: "About — team + CTA composition",
  },
  {
    id: "case",
    path: "/case",
    implemented: true,
    summary: "Case study index + /case/[slug]",
  },
  {
    id: "blog-index",
    path: "/blog",
    implemented: true,
    summary: "Blog-lite index + /blog/[slug] from content/blog/*.md",
  },
] as const;

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

/** Pages enabled for this project (site.json pages[] or defaults). */
export function getEnabledPages(): PageId[] {
  const fromContent = (rawSite as { pages?: string[] }).pages;
  if (Array.isArray(fromContent) && fromContent.length > 0) {
    return fromContent.filter(isPageId);
  }
  return [...DEFAULT_ENABLED];
}

export function isPageEnabled(id: PageId): boolean {
  return getEnabledPages().includes(id);
}

/** Sitemap / alternate-links paths for implemented + enabled pages. */
export function getPublicSitemapPaths(): string[] {
  const enabled = new Set(getEnabledPages());
  const paths = PAGE_CATALOG.filter(
    (entry) =>
      entry.implemented &&
      enabled.has(entry.id) &&
      entry.id !== "case" &&
      entry.id !== "blog-index",
  ).map((entry) => (entry.path === "/" ? "" : entry.path));

  if (enabled.has("case")) {
    paths.push("/case", "/case/demo");
  }
  if (enabled.has("blog-index")) {
    paths.push("/blog", ...listBlogPosts().map((post) => `/blog/${post.slug}`));
  }
  return paths;
}
