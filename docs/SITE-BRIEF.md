# Site brief

Fill this before or during the first agent session. Keeps scope explicit.

## Preferred path (machine-readable)

For Cursor + `scaffold:from-brief`, use a **JSON brief** validated by the schema:

| File | Role |
|------|------|
| [schemas/brief.schema.json](./schemas/brief.schema.json) | **Source of truth** for fields |
| [examples/brief-saas.json](./examples/brief-saas.json) | SaaS example |
| [examples/brief-agency.json](./examples/brief-agency.json) | Agency + i18n example |

```bash
# Validate
npm run verify:brief -- docs/examples/brief-saas.json

# Scaffold clone into ~/Projects/<slug>
npm run scaffold:from-brief -- docs/examples/brief-saas.json
```

This Markdown table below is the **human** form — copy values into `brief.json` when ready to scaffold.

## Project

| Field | Value | brief.json key |
|-------|-------|----------------|
| **Name** | | `name` |
| **Slug** | kebab-case folder name | `slug` |
| **Audience** | Who visits, job to be done | `audience` |
| **Tone** | minimal / bold / corporate / playful / editorial | `tone` |
| **Reference sites** | URLs or Figma links | `figmaUrl` |

## Brand

| Field | Value | brief.json key |
|-------|-------|----------------|
| **Brand hue** | 0–360 (OKLCH), default 264 | `hue` |
| **Brand chroma** | e.g. 0.18 | `chroma` |
| **Theme pack** | default / product-dark / studio-soft / editorial-ink | `theme` |
| **Fonts** | display + body (or keep Geist from starter) | — |
| **Logo** | path or Figma asset | — |

## Pages & sections

Landing (`/`):

- [ ] hero
- [ ] logos (marquee)
- [ ] features
- [ ] bento
- [ ] stats
- [ ] scroll-story
- [ ] timeline
- [ ] testimonials
- [ ] team
- [ ] ui (dialog/sheet/tabs demo)
- [ ] pricing
- [ ] faq
- [ ] contact
- [ ] cta

Or set `"preset": "saas" | "agency" | "demo-studio"` and skip the checklist.

Additional pages (opt-in, recorded in brief; full routes in Roadmap E):

| Route id | Purpose |
|----------|---------|
| privacy | Privacy policy |
| terms | Terms |
| about | About |
| case | Case study |
| blog-index | Blog index |

## Features

| Feature | Needed | brief.json |
|---------|--------|------------|
| Stripe checkout | | `features.stripe` |
| Convex / live data | | `features.convex` |
| Contact form | | `features.contactForm` |
| i18n (en + ru) | | `features.i18n` + `locales` |
| CMS | | `features.cms` |
| Dark mode | yes (built-in) | — |

## Content

- Hero headline → `hero.title`
- Hero subline → `hero.description`
- Primary CTA → `hero.primaryCta`
- Pricing tiers (if any):
- FAQ themes:

## Figma

| Field | Value |
|-------|-------|
| File URL | `figmaUrl` |
| Root node id | |
| Motion nodes | list or "recursive from root" |

## Acceptance (agent QA gates)

Before claiming the site is done, the agent **must** run:

- [ ] `npm run qa` (lint + typecheck)
- [ ] `npm run verify:messages` when i18n is on
- [ ] `npm run qa:visual` or documented visual smoke
- [ ] `npm run ship:client` (or deploy:prebuilt)
- [ ] Live URL reported + how to edit `content/site.json`

See site-builder skill **QA gates** — failure of any gate = not done.
