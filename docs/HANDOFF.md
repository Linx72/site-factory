# Site Factory — handoff

You have a **complete system** for building and shipping animated marketing sites with Cursor.

## What you have

| Layer | Location |
|-------|----------|
| Template | [Linx72/web-motion-starter](https://github.com/Linx72/web-motion-starter) |
| Scaffold CLI | `~/Projects/scripts/new-web-site.sh` |
| Agent skills | `~/.cursor/skills/site-builder`, `visual-qa`, `web-motion` |
| Cursor rules | `~/.cursor/rules/web-*.mdc` |

## Live sites (verify)

```bash
cd ~/Projects/web-motion-starter
npm run verify:live      # HTTP check all prod URLs
npm run factory:health   # QA all local clones + repos
```

| Site | URL |
|------|-----|
| Aurora showcase | https://demo-studio-orpin.vercel.app |
| SaaS reference | https://site-ref-saas.vercel.app |
| Agency reference | https://site-ref-agency.vercel.app |
| Launch reference | https://site-ref-launch.vercel.app |
| Client example | https://client-flowstack.vercel.app |

Map: [LIVE-SITES.md](./LIVE-SITES.md) · Sales: [SALES-KIT.md](./SALES-KIT.md)

## Common workflows

### New client site (~15 min)

**Prefer brief.json:**

```bash
cd ~/Projects/web-motion-starter
npm run scaffold:from-brief -- docs/examples/brief-saas.json
# move_agent_to_root → ~/Projects/<slug>
# QA gates → ship:client
```

**Or legacy:**

```bash
npm run scaffold:client -- client-name --preset saas
# edit content/site.json
cd ~/Projects/client-name && npm run ship:client
```

[CLIENT-SITE.md](./CLIENT-SITE.md) · [SITE-BRIEF.md](./SITE-BRIEF.md) · schema: [schemas/brief.schema.json](./schemas/brief.schema.json)

### Update template in existing clone

```bash
npm run sync:clone -- ~/Projects/client-name
npm run refresh:preset   # optional
```

### Enable backend features

| Feature | Command |
|---------|---------|
| Convex | `npx convex login` → `npm run convex:init` |
| Convex seed (dev) | `npm run convex:seed` |
| i18n | `npm run i18n:enable` |
| Stripe | `npm run stripe:setup` |
| Stripe live | `npm run stripe:setup -- --live` |
| Resend notify | Convex env — [RESEND.md](./features/RESEND.md) |
| Analytics | `NEXT_PUBLIC_ANALYTICS` — [ANALYTICS.md](./features/ANALYTICS.md) |
| Prod services | `npm run prod:services` |
| Custom domain | `npm run domain:custom -- example.com` |
| Domain verify | `npm run domain:verify -- https://example.com` |

## Next work (Roadmap v3)

Полный план: **[ROADMAP.md](./ROADMAP.md)** — **v3 фазы E–H ✅** (дни 1–20).

**Продажа / handoff клиенту:** [SALES-KIT.md](./SALES-KIT.md)

| Фаза | Дни | Суть | Статус |
|------|-----|------|--------|
| **E** Multi-page | 1–5 | privacy/terms/about/case/blog-lite | ✅ |
| **F** Variants + themes | 6–10 | hero/pricing variants, theme packs | ✅ |
| **G** Agent product | 11–15 | brief → scaffold → QA → v1.0.0 | ✅ |
| **H** Client ops | 16–20 | analytics, Resend, CMS policy, `launch`, sales kit | ✅ |

Опционально дальше: Convex/domain/Stripe live per-client (`npm run prod:services`).

## Agent prompt to start a new site

> Use site-builder skill. Scaffold a SaaS landing for "[Brand]" hue [N], sections hero, bento, pricing, faq, contact, cta. Prefer brief.json when present. QA gates then ship to Vercel. Do not invent layouts outside SECTION-CATALOG / PAGE-CATALOG.

## How to use this library in Cursor

**Сначала прочитайте простыми словами:** [HOW-IT-WORKS.md](./HOW-IT-WORKS.md)

1. **Template lab** — work in `web-motion-starter` for new sections/variants/docs.
2. **Client delivery** — `scaffold:from-brief` (prefer) or `scaffold:client` → `move_agent_to_root` to clone → edit `content/site.json` + brand → **QA gates** → `ship:client`.
3. Details: [HOW-TO-USE.md](./HOW-TO-USE.md), [ROADMAP.md](./ROADMAP.md) §1.

---

Phases 1–42 + Roadmap v3 **phase G** + **phase E days 1–3** (privacy/terms/about/case). Template **v1.0.0**. Next: E Day 4 blog-lite, or F variants.

**GitHub CI:** may fail instantly with billing hold — use Vercel deploy + `npm run verify:all` locally.
