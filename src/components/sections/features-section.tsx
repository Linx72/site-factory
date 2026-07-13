"use client";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  defaultFeaturesCopy,
  type FeaturesSectionCopy,
  type FeatureItemCopy,
  type FeatureLinkCopy,
} from "@/lib/i18n/section-copy";
import type { FeaturesVariant } from "@/lib/section-variants";
import { resolveImplementedFeaturesVariant } from "@/lib/section-variants";
import { cn } from "@/lib/utils";

type FeaturesSectionProps = {
  copy?: FeaturesSectionCopy;
  /** Layout: `grid` (default cards) | `bento-lite` (featured + asymmetric). */
  variant?: FeaturesVariant;
};

function FeatureLinks({ links }: { links: FeatureLinkCopy[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function FeatureBody({ body, links }: Pick<FeatureItemCopy, "body" | "links">) {
  return (
    <>
      <p>{body}</p>
      {links?.length ? <FeatureLinks links={links} /> : null}
    </>
  );
}

function FeaturesHeader({ copy }: { copy: FeaturesSectionCopy }) {
  return (
    <>
      <TextReveal
        as="h2"
        text={copy.title}
        className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl"
      />
      <p className="mt-4 max-w-xl text-muted-foreground">{copy.subtitle}</p>
    </>
  );
}

function FeaturesGrid({ items }: { items: FeatureItemCopy[] }) {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((feature) => (
        <ScrollReveal key={feature.id}>
          <Card className="h-full transition-colors hover:bg-muted/30">
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                <FeatureBody body={feature.body} links={feature.links} />
              </div>
            </CardHeader>
            <CardContent />
          </Card>
        </ScrollReveal>
      ))}
    </div>
  );
}

/**
 * Asymmetric features layout — first item featured (2×2), rest fill the grid.
 * Same copy.keys as grid; no separate CMS fields.
 */
function FeaturesBentoLite({ items }: { items: FeatureItemCopy[] }) {
  if (items.length === 0) return null;

  const [featured, ...rest] = items;

  return (
    <div className="mt-12 grid auto-rows-[minmax(140px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ScrollReveal className="sm:col-span-2 sm:row-span-2">
        <article className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-primary/10 blur-2xl transition-transform duration-500 group-hover:scale-110"
          />
          <h3 className="relative text-xl font-semibold tracking-tight md:text-2xl">
            {featured.title}
          </h3>
          <div className="relative mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            <FeatureBody body={featured.body} links={featured.links} />
          </div>
        </article>
      </ScrollReveal>

      {rest.map((feature, index) => (
        <ScrollReveal key={feature.id}>
          <article
            className={cn(
              "flex h-full flex-col rounded-2xl border border-border bg-card/80 p-5 transition-colors hover:bg-muted/30",
              index === rest.length - 1 && rest.length % 2 === 1
                ? "sm:col-span-2 lg:col-span-1"
                : null,
            )}
          >
            <h3 className="text-base font-semibold tracking-tight">{feature.title}</h3>
            <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <FeatureBody body={feature.body} links={feature.links} />
            </div>
          </article>
        </ScrollReveal>
      ))}
    </div>
  );
}

/** Feature section — `grid` or `bento-lite` from site.json variants. */
export function FeaturesSection({
  copy = defaultFeaturesCopy,
  variant = "grid",
}: FeaturesSectionProps) {
  const layout = resolveImplementedFeaturesVariant(variant);

  return (
    <section id="features" className="border-t border-border px-6 py-24 md:px-16">
      <div className="mx-auto max-w-5xl">
        <FeaturesHeader copy={copy} />
        {layout === "bento-lite" ? (
          <FeaturesBentoLite items={copy.items} />
        ) : (
          <FeaturesGrid items={copy.items} />
        )}
      </div>
    </section>
  );
}
