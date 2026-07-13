import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LegalPageView } from "@/components/pages/legal-page-view";
import { buildShellCopy } from "@/lib/i18n/build-home-copy";
import { buildLegalDocument } from "@/lib/i18n/build-legal-copy";
import { buildPageAlternates, buildOpenGraphLocales } from "@/lib/i18n/alternate-links";
import { isPageEnabled } from "@/lib/site-pages";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  const title = `${t("terms.title")} — ${siteConfig.name}`;
  const description = t("terms.sections.intro.body").slice(0, 160);

  return {
    title,
    description,
    alternates: buildPageAlternates(locale, "/terms"),
    openGraph: {
      title,
      description,
      ...buildOpenGraphLocales(locale),
    },
  };
}

export default async function LocalizedTermsPage({ params }: Props) {
  const { locale } = await params;
  if (!isPageEnabled("terms")) notFound();
  setRequestLocale(locale);

  const homeT = await getTranslations({ locale, namespace: "Home" });
  const a11yT = await getTranslations({ locale, namespace: "A11y" });
  const legalT = await getTranslations({ locale, namespace: "Legal" });

  return (
    <LegalPageView
      locale={locale}
      shell={buildShellCopy((key) => homeT(key), locale, (key) => a11yT(key))}
      copy={buildLegalDocument((key) => legalT(key), "terms")}
    />
  );
}
