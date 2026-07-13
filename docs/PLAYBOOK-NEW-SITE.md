# Playbook: new marketing site

Step-by-step for humans and Cursor agents. Global orchestration: `~/.cursor/skills/site-builder/SKILL.md`.

## 1. Brief

Copy `docs/SITE-BRIEF.md` → fill name, audience, sections, brand hue, Figma URL.

## 2. Scaffold

```bash
~/Projects/scripts/new-web-site.sh <kebab-name> \
  --title "Site Title" \
  --description "Meta description" \
  --brand-hue 220 \
  --sections hero,bento,features,scroll-story,pricing,faq,team,contact,cta
```

Agent: `move_agent_to_root` → `~/Projects/<kebab-name>` before edits.

## 3. Brand

| Task | Where |
|------|-------|
| Hue/chroma | `src/lib/theme/brand-palette.css` or `npm run sync:tokens` |
| Site name, URL | `src/lib/site-config.ts` |
| Nav labels | `content/site.json` |
| Fonts | `src/app/layout.tsx` |

## 4. Sections

Pick from `docs/SECTION-CATALOG.md`. Regenerate landing:

```bash
npm run scaffold:page -- "hero,features,bento,pricing,cta" src/app/page.tsx
```

Customize copy inside section files or extract to `content/` later.

## 5. Figma (optional)

1. Rule `web-figma-workflow.mdc`
2. `get_design_context` + `get_motion_context`
3. Merge motion into existing sections
4. `get_variable_defs` → `tokens/figma-variables.json` → `npm run sync:tokens`

## 6. Features (optional)

Enable in `site-config.ts` → `siteFeatures` when env ready:

| Feature | Env |
|---------|-----|
| Stripe | `STRIPE_SECRET_KEY`, price ids |
| Convex | `NEXT_PUBLIC_CONVEX_URL`, `npm run dev:convex` |
| i18n | `NEXT_PUBLIC_I18N=true` → `/en`, `/ru` |
| CMS | `NEXT_PUBLIC_CMS=true` + Convex URL |

See `docs/features/I18N.md` and `docs/features/CMS.md`.

## 7. QA

```bash
npm run qa
npm run build
npm run qa:visual        # Playwright — mobile / tablet / desktop
npm run qa:visual:update # refresh baselines after intentional UI change
```

Skill `visual-qa`: browser snapshots 375 / 768 / 1440, or `npm run qa:visual`.

## 8. Deploy

See `docs/DEPLOY.md`:

```bash
npm run deploy          # qa:all + vercel --prod (after vercel login)
```

Or GitHub Actions → **Deploy** workflow (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).

Set `NEXT_PUBLIC_SITE_URL` to production domain in Vercel env.

## Section cheat sheet

| Need | Section id |
|------|------------|
| Hero + stats | `hero`, `stats` |
| Product grid | `features`, `bento` |
| Scroll pin story | `scroll-story` |
| Roadmap | `timeline` |
| Social proof | `testimonials`, `logos` |
| People | `team` |
| Monetization | `pricing` |
| Support | `faq`, `contact` |
| Final push | `cta` |

## Verify checklist

- [ ] Brief filled
- [ ] Scaffold + install
- [ ] Brand hue visible in primary buttons
- [ ] All nav anchors resolve
- [ ] Reduced motion path tested
- [ ] `npm run build` clean
- [ ] Deploy URL recorded in brief
