import { StatusPageView } from "@/components/pages/status-page-view";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import { getDefaultStatusPageCopy } from "@/lib/i18n/build-status-copy";
import { routing } from "@/i18n/routing";
import { siteConfig, siteFeatures } from "@/lib/site-config";
import { redirect } from "next/navigation";

export const metadata = {
  title: `Status — ${siteConfig.name}`,
  description:
    "Live Convex dashboard: subscriptions, leads, and CMS content preview",
};

/** Demo dashboard — redirects to /en/status when i18n is on. */
export default function StatusPage() {
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/status`);
  }

  const shell = getDefaultHomeSectionCopy();

  return (
    <StatusPageView
      copy={getDefaultStatusPageCopy()}
      shell={{
        header: shell.header,
        nav: shell.nav,
        footer: shell.footer,
      }}
    />
  );
}
