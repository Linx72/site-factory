"use client";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import {
  defaultTimelineCopy,
  type TimelineSectionCopy,
} from "@/lib/i18n/section-copy";
import { cn } from "@/lib/utils";

type TimelineSectionProps = {
  copy?: TimelineSectionCopy;
};

/** Vertical roadmap timeline with scroll reveals — not pinned (see scroll-story for pin). */
export function TimelineSection({ copy = defaultTimelineCopy }: TimelineSectionProps) {
  return (
    <section id="timeline" className="border-t border-border px-6 py-24 md:px-16">
      <div className="mx-auto max-w-3xl">
        <TextReveal
          as="h2"
          text={copy.title}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mt-4 max-w-lg text-muted-foreground">{copy.subtitle}</p>

        <ol className="relative mt-12 space-y-0">
          <div
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-px bg-border md:left-[9px]"
          />
          {copy.items.map((item, index) => (
            <ScrollReveal key={item.id} y={32}>
              <li className="relative grid grid-cols-[auto_1fr] gap-x-6 pb-12 last:pb-0">
                <div className="relative z-10 mt-1.5 flex flex-col items-center">
                  <span
                    className={cn(
                      "size-4 rounded-full border-2 border-background bg-primary shadow-sm ring-2 ring-primary/20",
                      index === 0 && "bg-primary",
                    )}
                  />
                </div>
                <article>
                  <time className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {item.date}
                  </time>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
