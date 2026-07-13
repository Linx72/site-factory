<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Site factory

- **Scaffold clones:** `~/Projects/scripts/new-web-site.sh <kebab-name> --title "..." --sections hero,features,cta`
- **Brief template:** `docs/SITE-BRIEF.md`
- **Section ids:** `docs/SECTION-CATALOG.md`
- **Playbook:** `docs/PLAYBOOK-NEW-SITE.md`
- **Design tokens:** `docs/DESIGN-TOKENS.md` — `npm run sync:tokens`
- **Reference presets:** `docs/REFERENCE-SITES.md` — `--preset saas|agency`
- **Visual QA:** `npm run qa:visual` (Playwright)
- `i18n` — `docs/features/I18N.md` — `NEXT_PUBLIC_I18N=true`; full home via `messages/*.json` (nav, bento, scroll-story, all sections)
- **CMS-lite:** `docs/features/CMS.md` — `NEXT_PUBLIC_CMS=true`
- **CI:** `.github/workflows/ci.yml` — lint, visual, build
- **Deploy:** `docs/DEPLOY.md` — `npm run deploy`, `.github/workflows/deploy.yml`
- **Agent skill (global):** `~/.cursor/skills-cursor/site-builder/SKILL.md`
- **Agent skill (project):** `.cursor/skills/site-builder/SKILL.md`
- **Master guide:** `docs/SITE-FACTORY.md`
- **How to use (RU):** `docs/HOW-TO-USE.md` — scaffold → Cursor → ship

## Web motion stack

- **Framer Motion** — UI animations (`src/components/motion/`, `src/lib/motion/variants.ts`)
- **GSAP + ScrollTrigger** — scroll reveals (`scroll-reveal.tsx`)
- **Lenis** — smooth scroll (`LenisProvider` in root layout)
- **next-themes** — class-based dark mode (`ThemeProvider`, `ThemeToggle`)
- **R3F** — lazy `Hero3DLazy` wireframe (skipped when reduced-motion)
- **Stripe** — `POST /api/checkout`, `POST /api/stripe/webhook`, `CheckoutButton`
- **Convex** — subscriptions table, `/status` live feed, HTTP `/stripe-ingest`
- **Brand theme** — edit `src/lib/theme/brand-palette.css` (`--brand-hue`, `--brand-chroma`)
- **FAQ** — accordion section at `#faq`

### Sections (demo landing)

- `site-header` — sticky nav + mobile menu
- `hero-section` — TextReveal headline, stagger, stat cards
- `features-section` — 6 cards + ScrollReveal
- `bento-grid-section` — asymmetric 2×2 featured grid
- `logo-marquee-section` — infinite CSS marquee (trusted-by)
- `stats-section` — CountUp metrics on scroll
- `scroll-story-section` — GSAP pin + scrub
- `timeline-section` — vertical roadmap milestones
- `testimonials-section` — stagger grid / mobile horizontal snap
- `team-section` — team cards with hover lift
- `pricing-section` — 3 tiers with hover lift
- `ui-showcase` — dialog, sheet, animated tabs
- `contact-section` — Convex newsletter signup + live count
- `faq-section`, `cta-section`, `site-footer`

### Backend tables (Convex)

| Table | Purpose |
|-------|---------|
| `subscriptions` | Stripe checkout → webhook → `/stripe-ingest` |
| `leads` | Contact form emails (`subscribe`, `count`, `listRecent`) |

Dev seed (subscriptions, leads, CMS on `/status`): set `ALLOW_DEV_SEED=true` in Convex env, then use **Seed demo** buttons on http://localhost:3000/status

Optional lead email (Resend): `RESEND_API_KEY`, `LEADS_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL` in **Convex** env — scheduled from `leads.subscribe`.

### Motion lab

- Route: `/motion` — live catalog of all primitives (`motion-lab-showcase.tsx`)
- `MagneticButton` — cursor-attract CTA wrapper (hero + lab)
- `ScrollProgress` — fixed top bar, global in `MotionProvider`
- `BackToTop` — Lenis scroll-to-top after 600px
- `TiltCard` — 3D pointer tilt (team section)
- `CursorGlow` — hero pointer ambience (desktop)
- `SkipToContent` — keyboard skip link in root layout
- `app/loading.tsx` — route loading spinner
- `LineReveal`, `ParallaxLayer` — CTA section patterns
- `JsonLd` — schema.org on homepage

- `fade-in`, `stagger-children`, `scroll-reveal`, `text-reveal`, `count-up`, `logo-marquee`, `hero-3d-lazy`, `magnetic-button`, `scroll-progress`, `line-reveal`, `parallax-layer`, `tilt-card`, `back-to-top`, `cursor-glow`

### Stripe (optional)

```bash
cp .env.example .env.local
# Set STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, STRIPE_PRICE_TEAM, NEXT_PUBLIC_SITE_URL
```

Without env: paid buttons show a hint; Starter scrolls to `#ui`.

### Convex

```bash
npm run dev:convex   # terminal 1 — http://127.0.0.1:3210
npm run dev          # terminal 2 — Next.js
```

Stripe webhook → Next.js → Convex `/stripe-ingest` → `subscriptions` table.  
Live feed: http://localhost:3000/status (or :3001 if 3000 is busy)  
Same `STRIPE_INGEST_SECRET` in `.env.local` and `npx convex env set STRIPE_INGEST_SECRET ...`

Contact form → `leads.subscribe` mutation → live counter on `#contact` + `/status` leads panel.

### Verify

```bash
npm run dev:convex   # terminal 1
npm run dev          # terminal 2 — http://localhost:3000 (or :3001)
# Scroll to "Scroll-driven storytelling" — pinned section scrubs with wheel
# Hero: word-by-word blur reveal; Features: 6 cards; UI: dialog/sheet/tabs
# Contact (#contact): submit email → counter updates; check /status for leads
# Motion lab: http://localhost:3000/motion — or /en/motion, /ru/motion when i18n on
# Status: http://localhost:3000/status — or /en/status, /ru/status when i18n on
# Scroll: thin primary bar at top tracks progress
# Nav: click header links — Lenis smooth scroll + active section highlight
# Team (#team): TiltCard hover; scroll down for BackToTop button
# i18n full stack: NEXT_PUBLIC_I18N=true → /ru full home including UI showcase (#ui)
# Errors: app/error.tsx (route), app/global-error.tsx (root layout)
# Hero: subtle CursorGlow on desktop; Tab → skip link focuses #hero
npm run build
npm run lint
npm run verify:sitemap   # NEXT_PUBLIC_I18N=true — sitemap /en /ru URLs
```
