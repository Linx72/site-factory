# Page catalog

Opt-in routes beyond the home landing. Section blocks stay in [SECTION-CATALOG.md](./SECTION-CATALOG.md).

## How pages are enabled

In `content/site.json` or `brief.json`:

```json
"pages": ["home", "motion", "status", "privacy", "terms", "about", "case", "blog-index"]
```

If `pages` is omitted, the template defaults to: home, motion, status, privacy, terms, about, case, blog-index.

Code: `src/lib/site-pages.ts` → `getEnabledPages()`, `isPageEnabled()`.

## Page ids

| ID | Path | Status | Composition |
|----|------|--------|-------------|
| `home` | `/` | Core | Sections from catalog |
| `motion` | `/motion` | Core | Motion lab |
| `status` | `/status` | Core | Convex dashboard |
| `privacy` | `/privacy` | ✅ | Legal document |
| `terms` | `/terms` | ✅ | Legal document |
| `about` | `/about` | ✅ | Intro + team + CTA |
| `case` | `/case`, `/case/[slug]` | ✅ | Case index + demo case |
| `blog-index` | `/blog`, `/blog/[slug]` | ✅ | Markdown posts in `content/blog/*.md` |

With i18n: same paths under `/en/…`, `/ru/…`.

## Blog-lite

1. Add a `.md` file under `content/blog/` with frontmatter:

```md
---
title: Post title
summary: One-line description
date: 2026-07-13
---

## Heading

Body with **bold**, lists, and [links](/blog).
```

2. Ensure `"blog-index"` is in `pages[]`.
3. Sitemap includes `/blog` and each slug automatically.

## Scaffold / brief

```bash
~/Projects/scripts/new-web-site.sh my-site --pages home,privacy,blog-index
# or via brief.json pages[]:
npm run scaffold:from-brief -- docs/examples/brief-saas.json
# Writes pages into content/site.json via --pages / merge
```

## Adding a page

1. Add id to `PAGE_IDS` / `PAGE_CATALOG` in `src/lib/site-pages.ts`
2. Add row here
3. Implement `src/app/<path>/page.tsx` + `src/app/[locale]/<path>/page.tsx`
4. Messages namespace if needed
5. Extend sitemap helpers (`getPublicSitemapPaths`)
6. Footer / nav links when appropriate
