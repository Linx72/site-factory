import { LegalPageView } from "@/components/pages/legal-page-view";
import {
  getDefaultHomeSectionCopy,
} from "@/lib/i18n/build-home-copy";
import { getDefaultLegalDocument } from "@/lib/i18n/build-legal-copy";
import { routing } from "@/i18n/routing";
import { isPageEnabled } from "@/lib/site-pages";
import { siteFeatures } from "@/lib/site-config";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Условия — Site Factory",
  description: "Условия использования витрины Site Factory",
};

/** Terms — redirects to /en/terms when i18n is on. */
export default function TermsPage() {
  if (!isPageEnabled("terms")) notFound();
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/terms`);
  }

  const shell = getDefaultHomeSectionCopy();
  return (
    <LegalPageView
      copy={getDefaultLegalDocument("terms")}
      shell={{
        header: shell.header,
        nav: shell.nav,
        footer: shell.footer,
      }}
    />
  );
}
