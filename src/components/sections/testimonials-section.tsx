"use client";

import { motion } from "framer-motion";

import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  defaultTestimonialsCopy,
  type TestimonialsSectionCopy,
} from "@/lib/i18n/section-copy";
import { fadeUp } from "@/lib/motion/variants";

type TestimonialsSectionProps = {
  copy?: TestimonialsSectionCopy;
};

/** Testimonial cards with staggered entrance. */
export function TestimonialsSection({
  copy = defaultTestimonialsCopy,
}: TestimonialsSectionProps) {
  return (
    <section
      id="testimonials"
      className="border-t border-border px-6 py-24 md:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <TextReveal
          as="h2"
          text={copy.title}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mt-4 max-w-lg text-muted-foreground">{copy.subtitle}</p>

        <motion.div
          className="mt-12 hidden gap-6 md:grid md:grid-cols-3"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8% 0px" }}
        >
          {copy.items.map((item) => (
            <motion.div key={item.id} variants={fadeUp}>
              <Card className="h-full bg-card/80">
                <CardHeader>
                  <CardDescription className="text-base leading-relaxed text-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-sm font-medium">{item.author}</CardTitle>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <FadeIn className="mt-10 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:hidden">
          {copy.items.map((item) => (
            <Card
              key={`mobile-${item.id}`}
              className="min-w-[85%] shrink-0 snap-center bg-card/80"
            >
              <CardHeader>
                <CardDescription className="text-base leading-relaxed text-foreground">
                  &ldquo;{item.quote}&rdquo;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-sm">{item.author}</CardTitle>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </CardContent>
            </Card>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
