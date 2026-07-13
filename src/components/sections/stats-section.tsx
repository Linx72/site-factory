"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { CountUp } from "@/components/motion/count-up";
import { TextReveal } from "@/components/motion/text-reveal";
import {
  defaultStatsCopy,
  type StatsSectionCopy,
} from "@/lib/i18n/section-copy";

type StatsSectionProps = {
  copy?: StatsSectionCopy;
};

/** Metrics row with CountUp on scroll. */
export function StatsSection({ copy = defaultStatsCopy }: StatsSectionProps) {
  return (
    <section className="border-t border-border px-6 py-20 md:px-16">
      <div className="mx-auto max-w-5xl">
        <TextReveal
          as="h2"
          text={copy.title}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {copy.items.map((stat) => (
            <FadeIn key={stat.id} className="text-center">
              <p className="text-3xl font-semibold tabular-nums md:text-4xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
