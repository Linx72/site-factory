"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { LineReveal } from "@/components/motion/line-reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { Button } from "@/components/ui/button";
import { cmsKeys } from "@/lib/cms/keys";
import { useCmsString } from "@/lib/cms/use-cms-string";
import { defaultCtaCopy, type CtaSectionCopy } from "@/lib/i18n/section-copy";
import { siteFeatures } from "@/lib/site-config";

type CtaViewProps = {
  title: string;
  description: string;
  buttons: Pick<CtaSectionCopy, "primary" | "secondary">;
};

type CtaSectionProps = {
  locale?: string;
  copy?: CtaSectionCopy;
};

function CtaSectionView({ title, description, buttons }: CtaViewProps) {
  return (
    <section className="relative px-6 pb-24 pt-8 md:px-16">
      <ParallaxLayer
        speed={0.5}
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto max-w-3xl"
      >
        <div
          aria-hidden
          className="mx-auto h-48 rounded-full bg-primary/10 blur-3xl"
        />
      </ParallaxLayer>

      <FadeIn className="relative mx-auto max-w-3xl rounded-3xl border border-border bg-card p-10 text-center md:p-14">
        <LineReveal
          lines={[title]}
          lineClassName="text-2xl font-semibold md:text-3xl"
        />
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="rounded-full px-6">
            {buttons.primary}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-6"
            render={
              <a
                href="https://github.com/figma/mcp-server-guide"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            {buttons.secondary}
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}

function CtaSectionWithCms({
  locale,
  copy,
}: {
  locale: string;
  copy: CtaSectionCopy;
}) {
  const title = useCmsString(cmsKeys.cta.title, copy.title, locale);
  const description = useCmsString(
    cmsKeys.cta.description,
    copy.description,
    locale,
  );

  return (
    <CtaSectionView
      title={title}
      description={description}
      buttons={{ primary: copy.primary, secondary: copy.secondary }}
    />
  );
}

/** Final CTA — LineReveal headline + optional CMS overrides. */
export function CtaSection({ locale = "en", copy = defaultCtaCopy }: CtaSectionProps) {
  if (siteFeatures.cms) {
    return <CtaSectionWithCms locale={locale} copy={copy} />;
  }

  return (
    <CtaSectionView
      title={copy.title}
      description={copy.description}
      buttons={{ primary: copy.primary, secondary: copy.secondary }}
    />
  );
}
