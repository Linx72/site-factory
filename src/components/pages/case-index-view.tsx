import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/motion/fade-in";
import type { CaseStudyMeta } from "@/lib/cases";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import { localizedHomeHref, localizedPath } from "@/lib/i18n/paths";

export type CaseIndexCopy = {
  eyebrow: string;
  title: string;
  description: string;
  openCase: string;
  backHome: string;
};

type CaseIndexViewProps = {
  copy: CaseIndexCopy;
  cases: CaseStudyMeta[];
  shell?: Pick<HomeSectionCopy, "header" | "nav" | "footer" | "a11y">;
  locale?: string;
};

/** Lists file-based cases from content/cases/. */
export function CaseIndexView({ copy, cases, shell, locale }: CaseIndexViewProps) {
  const homeHref = localizedHomeHref(locale);

  return (
    <PageShell copy={shell} locale={locale}>
      <div className="mx-auto max-w-3xl px-6 py-24 md:px-16">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{copy.description}</p>
        </FadeIn>
        <ul className="mt-12 space-y-4">
          {cases.map((item) => (
            <li key={item.slug}>
              <Link
                href={localizedPath(locale, `/case/${item.slug}`)}
                className="block rounded-2xl border border-border px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.client} · {item.year}
                </p>
                <p className="mt-1 text-lg font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                <p className="mt-3 text-sm font-medium text-primary">{copy.openCase}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link href={homeHref} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            {copy.backHome}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
