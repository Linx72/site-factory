import { StatusPageView } from "@/components/pages/status-page-view";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import { getDefaultStatusPageCopy } from "@/lib/i18n/build-status-copy";
import { routing } from "@/i18n/routing";
import { getSingleLocale, siteConfig, siteFeatures } from "@/lib/site-config";
import { redirect } from "next/navigation";

export const metadata = {
  title: `Статус — ${siteConfig.name}`,
  description:
    "Панель Convex: подписки, leads и CMS. Без Convex — подсказки по Resend и форме брифа.",
};

/** Demo dashboard — redirects to /en/status when i18n is on. */
export default function StatusPage() {
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/status`);
  }

  const shell = getDefaultHomeSectionCopy();
  const locale = getSingleLocale();

  return (
    <StatusPageView
      copy={getDefaultStatusPageCopy()}
      shell={shell}
      locale={locale}
    />
  );
}
