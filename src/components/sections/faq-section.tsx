import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  defaultFaqItems,
  type FaqItemCopy,
} from "@/lib/i18n/section-copy";

type FaqSectionProps = {
  title?: string;
  items?: FaqItemCopy[];
};

/** FAQ accordion with animated panels. */
export function FaqSection({
  title = "Frequently asked questions",
  items = defaultFaqItems,
}: FaqSectionProps) {
  return (
    <section id="faq" className="border-t border-border px-6 py-24 md:px-16">
      <div className="mx-auto max-w-2xl">
        <TextReveal
          as="h2"
          text={title}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <FadeIn className="mt-10">
          <Accordion defaultValue={[items[0]?.id ?? "stack"]}>
            {items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
