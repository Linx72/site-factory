import { PageShell } from "@/components/layout/page-shell";
import { ReferenceSitesGrid } from "@/components/marketing/reference-sites-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { TeamSection } from "@/components/sections/team-section";
import { FadeIn } from "@/components/motion/fade-in";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";

export type AboutPageCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

type AboutPageViewProps = {
  about: AboutPageCopy;
  shell?: Pick<HomeSectionCopy, "header" | "nav" | "footer" | "a11y">;
  /** Team + CTA from Home section copy */
  sections?: Pick<HomeSectionCopy, "team" | "cta">;
  locale?: string;
};

/** About composition — intro + team + CTA (no new visual language). */
export function AboutPageView({
  about,
  shell,
  sections,
  locale,
}: AboutPageViewProps) {
  const defaults = getDefaultHomeSectionCopy();
  const team = sections?.team ?? defaults.team;
  const cta = sections?.cta ?? defaults.cta;

  return (
    <PageShell copy={shell} locale={locale}>
      <section className="border-b border-border px-6 py-24 md:px-16">
        <FadeIn className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {about.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            {about.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{about.description}</p>
          <ReferenceSitesGrid />
        </FadeIn>
      </section>
      {team ? <TeamSection copy={team} /> : null}
      {cta ? <CtaSection copy={cta} /> : null}
    </PageShell>
  );
}
