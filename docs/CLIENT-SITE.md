# Client site — 15-minute delivery

Fast path from brief to deployed client landing using Site Factory.

## 1. Intake (2 min)

Fill `docs/SITE-BRIEF.md` or ask client:

- Brand name, tagline, hue (or competitor reference)
- Sections needed (pricing? contact? team?)
- Figma URL (optional)
- Domain (existing or Vercel subdomain first)

## 2. Scaffold (1 min)

```bash
~/Projects/scripts/new-web-site.sh client-acme \
  --title "Acme Analytics" \
  --brand-hue 250 \
  --sections hero,bento,features,pricing,faq,contact,cta

# Or preset:
~/Projects/scripts/new-web-site.sh client-acme --preset saas
```

```text
move_agent_to_root → ~/Projects/client-acme
```

## 3. Brand + copy (5 min)

**Preferred:** edit `content/site.json` — nav, hero, sections order.

```bash
npm run refresh:preset   # if using preset as base
```

**Brand hue:** `src/lib/theme/brand-palette.css` or Figma → `npm run sync:tokens`

## 4. Figma merge (optional, 10–30 min)

If Figma provided — agent uses `web-figma-workflow` rule:

- Hero + 1–2 key sections first
- Motion from `get_motion_context`
- Do not rewrite unrelated sections

## 5. Features (optional)

| Need | Command |
|------|---------|
| Contact form | `npm run convex:init` |
| EN + RU | `npm run i18n:enable` + edit `messages/` |
| Stripe pricing | Add Stripe env (see `docs/features/`) |

## 6. QA (3 min)

```bash
npm run quick-start
npm run qa:all
```

Skill: `~/.cursor/skills/visual-qa/SKILL.md`

## 7. Ship (4 min)

```bash
npm run qa:all
npm run vercel:setup          # first time only
npm run ship:client           # QA + prebuilt Vercel prod (auto SITE_URL)

# Or Git auto-deploy:
npm run vercel:git && git push
```

Custom domain later: `docs/CUSTOM-DOMAIN.md`

## 8. Handoff checklist

- [ ] Live URL opens, hero copy correct
- [ ] `/opengraph-image` shows client brand
- [ ] Mobile 375px — no overflow
- [ ] Contact works (or static fallback documented)
- [ ] Client has Vercel + GitHub access (or you retain)

## Maintenance

Template updates without losing client brand:

```bash
cd ~/Projects/web-motion-starter
npm run sync:clone -- ~/Projects/client-acme
cd ~/Projects/client-acme && npm install && npm run qa:all
```

Preserves: `site-config.ts`, `content/site.json`, `brand-palette.css`, `vercel.json`.

## Agent prompt example

> Scaffold SaaS landing for "Acme Analytics" hue 250, sections hero, bento, pricing, faq, contact, cta. Use site-builder skill. Ship to Vercel when QA passes.
