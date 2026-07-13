"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { TextReveal } from "@/components/motion/text-reveal";
import {
  defaultScrollStoryCopy,
  type ScrollStorySectionCopy,
} from "@/lib/i18n/section-copy";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScrollStorySectionProps = {
  copy?: ScrollStorySectionCopy;
};

/**
 * Pinned scroll section: progress bar and step cards scrub with scroll.
 * Requires LenisProvider (ScrollTrigger sync).
 */
export function ScrollStorySection({
  copy = defaultScrollStoryCopy,
}: ScrollStorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const progress = progressRef.current;
      const track = trackRef.current;
      if (!section || !progress || !track || reducedMotion) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-story-step]", track);

      gsap.to(progress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.6,
        },
      });

      gsap.fromTo(
        cards,
        { opacity: 0.35, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=220%",
            scrub: 0.6,
          },
        },
      );
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative border-t border-border bg-muted/20 px-6 py-24 md:px-16"
    >
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center">
        <TextReveal
          as="h2"
          text={copy.title}
          className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mt-4 max-w-lg text-muted-foreground">
          {reducedMotion ? copy.subtitleReduced : copy.subtitleActive}
        </p>

        <div className="mt-10 h-1 w-full overflow-hidden rounded-full bg-border">
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 rounded-full bg-foreground"
          />
        </div>

        <div ref={trackRef} className="mt-10 grid gap-4 md:grid-cols-2">
          {copy.steps.map((step, index) => (
            <article
              key={step.id}
              data-story-step
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {copy.stepLabel.replace("{n}", String(index + 1))}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
