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
  title: "Privacy policy — Web Motion Starter",
  description: "Privacy policy for this Site Factory demo",
};

/** Privacy — redirects to /en/privacy when i18n is on. */
export default function PrivacyPage() {
  if (!isPageEnabled("privacy")) notFound();
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/privacy`);
  }

  const shell = getDefaultHomeSectionCopy();
  return (
    <LegalPageView
      copy={getDefaultLegalDocument("privacy")}
      shell={{
        header: shell.header,
        nav: shell.nav,
        footer: shell.footer,
      }}
    />
  );
}
