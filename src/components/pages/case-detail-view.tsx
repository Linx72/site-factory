import Link from "next/link";

import { HomePage } from "@/components/pages/home-page";
import type { CaseStudyMeta } from "@/lib/cases";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import { localizedPath } from "@/lib/i18n/paths";

type CaseDetailViewProps = {
  meta: CaseStudyMeta;
  copy: HomeSectionCopy;
  locale?: string;
  backLabel: string;
};

/**
 * Case detail — HomePage composition with case-specific hero + section subset.
 * Keeps SECTION-CATALOG components; no new layout language.
 */
export function CaseDetailView({
  meta,
  copy,
  locale = "en",
  backLabel,
}: CaseDetailViewProps) {
  return (
    <div>
      <div className="border-b border-border bg-muted/20 px-6 py-3 md:px-16">
        <Link
          href={localizedPath(locale, "/case")}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {backLabel}
        </Link>
      </div>
      <HomePage
        locale={locale}
        sections={meta.sections}
        copy={copy}
        hero={{
          locale,
          eyebrow: `${meta.client} · ${meta.year}`,
          title: meta.title,
          description: meta.summary,
          primaryCta: copy.header?.cta,
          secondaryCta: undefined,
        }}
      />
    </div>
  );
}
