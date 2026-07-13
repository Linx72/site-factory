---
title: Multi-page sites without a headless CMS
summary: How Site Factory ships privacy, about, cases, and blog-lite from files in the repo.
date: 2026-07-13
---

Marketing sites often need more than a single landing URL. Site Factory keeps that simple: enable page ids in `content/site.json`, then edit copy in files the agent already knows how to touch.

## What blog-lite is

Posts live in `content/blog/*.md` with YAML frontmatter (`title`, `summary`, `date`). Routes:

- `/blog` — index of published posts
- `/blog/[slug]` — rendered markdown body

No Sanity, no WordPress — git is the CMS.

## Enable it

```
"pages": ["home", "privacy", "blog-index"]
```

Scaffold from a brief that lists `blog-index`, or add the id after clone. Footer and sitemap pick up the route when the page is enabled.

## Tips for agents

1. Prefer short posts that explain a product decision, not changelog dumps.
2. Keep brand tokens from `brand-palette.css` — do not invent a second typography system in post CSS.
3. After adding posts, run `npm run verify:sitemap` so new slugs appear under locale prefixes when i18n is on.
