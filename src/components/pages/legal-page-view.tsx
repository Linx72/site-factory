import { PageShell } from "@/components/layout/page-shell";
import { LegalDocumentSection } from "@/components/sections/legal-document-section";
import type { LegalDocumentCopy } from "@/components/sections/legal-document-section";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import { localizedHomeHref } from "@/lib/i18n/paths";

type LegalPageViewProps = {
  copy: LegalDocumentCopy;
  shell?: Pick<HomeSectionCopy, "header" | "nav" | "footer" | "a11y">;
  locale?: string;
};

/** Shared privacy / terms page body. */
export function LegalPageView({ copy, shell, locale }: LegalPageViewProps) {
  return (
    <PageShell copy={shell} locale={locale}>
      <LegalDocumentSection copy={copy} homeHref={localizedHomeHref(locale)} />
    </PageShell>
  );
}
