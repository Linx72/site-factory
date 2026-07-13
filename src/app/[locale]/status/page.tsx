import { getTranslations, setRequestLocale } from "next-intl/server";

import { StatusPageView } from "@/components/pages/status-page-view";
import {
  buildShellCopy,
} from "@/lib/i18n/build-home-copy";
import { buildStatusPageCopy } from "@/lib/i18n/build-status-copy";
import { buildPageAlternates, buildOpenGraphLocales } from "@/lib/i18n/alternate-links";
import { siteConfig } from "@/lib/site-config";

type LocalizedStatusProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocalizedStatusProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "StatusPage" });

  const title = `${t("title")} — ${siteConfig.name}`;
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: buildPageAlternates(locale, "/status"),
    openGraph: {
      title,
      description,
      ...buildOpenGraphLocales(locale),
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

/** Localized status dashboard at `/en/status`, `/ru/status`. */
export default async function LocalizedStatusPage({ params }: LocalizedStatusProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const homeT = await getTranslations({ locale, namespace: "Home" });
  const a11yT = await getTranslations({ locale, namespace: "A11y" });
  const statusT = await getTranslations({ locale, namespace: "StatusPage" });

  return (
    <StatusPageView
      locale={locale}
      shell={buildShellCopy((key) => homeT(key), locale, (key) => a11yT(key))}
      copy={buildStatusPageCopy((key) => statusT(key))}
    />
  );
}
