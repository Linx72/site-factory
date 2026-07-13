---
title: Motion stack in one sitting
summary: Framer Motion for UI, GSAP for scroll, Lenis for feel — what belongs where.
date: 2026-07-10
---

The template ships three motion layers on purpose. Mixing them randomly makes pages noisy; assigning jobs keeps scroll storytelling crisp.

## Framer Motion

Use for UI presence: fades, staggers, magnetic CTAs, and lab demos under `/motion`. Prefer shared variants in `src/lib/motion/variants.ts`.

## GSAP + ScrollTrigger

Pin and scrub longer narratives (`scroll-story-section`). Keep one pinned story per page unless the brief demands more.

## Lenis

Smooth scroll sits in the root provider. Anchor links and `BackToTop` should go through Lenis so reduced-motion users still get predictable jumps.

## Checklist

- Respect `prefers-reduced-motion`
- Do not stack hero parallax on top of a pinned GSAP section
- Verify the motion lab still lists every primitive you touch
