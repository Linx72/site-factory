import { CaseIndexView } from "@/components/pages/case-index-view";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import { listCaseStudies } from "@/lib/cases";
import { routing } from "@/i18n/routing";
import { isPageEnabled } from "@/lib/site-pages";
import { siteFeatures } from "@/lib/site-config";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Case studies — Web Motion Starter",
  description: "File-based case studies from content/cases/",
};

export default function CaseIndexPage() {
  if (!isPageEnabled("case")) notFound();
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/case`);
  }

  const shell = getDefaultHomeSectionCopy();
  return (
    <CaseIndexView
      cases={listCaseStudies()}
      copy={{
        eyebrow: "Work",
        title: "Case studies",
        description: "File-based case pages under content/cases/. Start with the demo case.",
        openCase: "Open case",
        backHome: "← Back to home",
      }}
      shell={{
        header: shell.header,
        nav: shell.nav,
        footer: shell.footer,
      }}
    />
  );
}
