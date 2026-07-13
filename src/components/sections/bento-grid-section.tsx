"use client";

import { motion } from "framer-motion";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import {
  BENTO_CELL_LAYOUT,
  defaultBentoCopy,
  type BentoSectionCopy,
} from "@/lib/i18n/section-copy";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";

type BentoGridSectionProps = {
  copy?: BentoSectionCopy;
};

/** Asymmetric bento grid — featured cell spans 2×2 on desktop. */
export function BentoGridSection({ copy = defaultBentoCopy }: BentoGridSectionProps) {
  return (
    <section id="bento" className="border-t border-border px-6 py-24 md:px-16">
      <div className="mx-auto max-w-5xl">
        <TextReveal
          as="h2"
          text={copy.title}
          className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mt-4 max-w-xl text-muted-foreground">{copy.subtitle}</p>

        <motion.div
          className="mt-12 grid auto-rows-[minmax(140px,auto)] gap-4 md:grid-cols-3"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8% 0px" }}
        >
          {copy.cells.map((cell) => {
            const layout = BENTO_CELL_LAYOUT[cell.id as keyof typeof BENTO_CELL_LAYOUT];

            return (
              <motion.article
                key={cell.id}
                variants={fadeUp}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/30",
                  layout?.className,
                )}
              >
                {layout?.featured ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-primary/10 blur-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                ) : null}
                <h3
                  className={cn(
                    "font-semibold tracking-tight",
                    layout?.featured ? "text-xl md:text-2xl" : "text-base",
                  )}
                >
                  {cell.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cell.body}
                </p>
              </motion.article>
            );
          })}
        </motion.div>

        <ScrollReveal className="mt-8">
          <p className="text-sm text-muted-foreground">{copy.tip}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
