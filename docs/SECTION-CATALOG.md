# Section catalog

Reusable landing blocks in `src/components/sections/`. Compose `src/app/page.tsx` from these — do not rewrite from scratch unless the brief requires a net-new layout.

**Variants:** same id, different layout — [SECTION-VARIANTS.md](./features/SECTION-VARIANTS.md).

## Scaffold IDs

Use with `new-web-site.sh --sections`:

```bash
~/Projects/scripts/new-web-site.sh my-site \
  --sections hero,features,pricing,faq,contact,cta
```

| ID | Component | File | Anchor | Motion | Variants |
|----|-----------|------|--------|--------|----------|
| `hero` | HeroSection | `hero-section.tsx` | `#hero` | TextReveal, stagger | `default`, `editorial` |
| `logos` | LogoMarqueeSection | `logo-marquee-section.tsx` | — | CSS infinite marquee | — |
| `features` | FeaturesSection | `features-section.tsx` | `#features` | ScrollReveal cards | `grid`, `bento-lite` |
| `stats` | StatsSection | `stats-section.tsx` | — | CountUp on scroll | — |
| `scroll-story` | ScrollStorySection | `scroll-story-section.tsx` | — | GSAP pin + scrub | — |
| `testimonials` | TestimonialsSection | `testimonials-section.tsx` | — | Stagger grid / mobile snap | — |
| `ui` | UiShowcase | `ui-showcase.tsx` | `#ui` | Dialog, sheet, tabs | — |
| `pricing` | PricingSection | `pricing-section.tsx` | `#pricing` | Card hover lift / compare table | `cards`, `compare` |
| `faq` | FaqSection | `faq-section.tsx` | `#faq` | Accordion | — |
| `contact` | ContactSection | `contact-section.tsx` | `#contact` | Form layout | — |
| `cta` | CtaSection | `cta-section.tsx` | — | FadeIn | — |
| `bento` | BentoGridSection | `bento-grid-section.tsx` | `#bento` | Stagger bento grid, featured 2×2 cell | — |
| `timeline` | TimelineSection | `timeline-section.tsx` | `#timeline` | Vertical rail + ScrollReveal | — |
| `team` | TeamSection | `team-section.tsx` | `#team` | Stagger cards, hover lift | — |

Shell (always present): `SiteHeader`, `SiteFooter`.

### Choosing a variant

```json
"variants": {
  "hero": "editorial",
  "features": "grid",
  "pricing": "cards"
}
```

Omit → current UI. See [SECTION-VARIANTS.md](./features/SECTION-VARIANTS.md).

## Motion primitives

Import from `@/components/motion/`:

| Primitive | Use when |
|-----------|----------|
| `FadeIn` | Simple enter |
| `StaggerChildren` | Lists, grids |
| `ScrollReveal` | GSAP scroll-triggered block |
| `TextReveal` | Word/line hero headlines |
| `CountUp` | Metrics |
| `LogoMarquee` | Standalone marquee |
| `MagneticButton` | Cursor-attract CTA hover |
| `ScrollProgress` | Global scroll bar (MotionProvider) |
| `LineReveal` | Multi-line clip reveal |
| `ParallaxLayer` | Scroll-linked Y parallax |
| `TiltCard` | 3D pointer tilt on cards |
| `BackToTop` | Lenis scroll-to-top button |

## Pages

Opt-in routes: [PAGE-CATALOG.md](./PAGE-CATALOG.md) (`/privacy`, `/about`, `/case`, `/blog`, …).

| Route | Purpose |
|-------|---------|
| `/` | Demo landing (composed sections) |
| `/motion` | Motion lab — primitive reference |
| `/status` | Convex live dashboard |

## Customizing a section

1. Prefer a **variant** before forking a new section file
2. Copy nearest catalog section to a new file only if layout diverges strongly
3. Keep spacing rhythm: `px-6 py-24 md:px-16`, `max-w-*`, `border-t border-border`
4. Pull copy from `content/site.json` / `messages/*` or props
5. Brand colors via CSS variables — edit `src/lib/theme/brand-palette.css`

## Adding a new catalog section

1. Create `src/components/sections/<name>-section.tsx`
2. Export default section component with semantic `<section id="...">`
3. Register id in `scripts/generate-page.mjs` catalog
4. Add row to this document

## Feature-dependent sections

| Section | Requires |
|---------|----------|
| Pricing checkout buttons | `siteFeatures.stripe` + Stripe env |
| Contact submit | `siteFeatures.contactForm` + backend or action |
| `/status` live feed | `siteFeatures.convex` + `npm run dev:convex` |
