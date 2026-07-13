import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CaseIndexView } from "@/components/pages/case-index-view";
import { buildShellCopy } from "@/lib/i18n/build-home-copy";
import { buildPageAlternates, buildOpenGraphLocales } from "@/lib/i18n/alternate-links";
import { listCaseStudies } from "@/lib/cases";
import { isPageEnabled } from "@/lib/site-pages";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CasePage" });
  const title = `${t("indexTitle")} — ${siteConfig.name}`;
  const description = t("indexDescription");
  return {
    title,
    description,
    alternates: buildPageAlternates(locale, "/case"),
    openGraph: { title, description, ...buildOpenGraphLocales(locale) },
  };
}

export default async function LocalizedCaseIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!isPageEnabled("case")) notFound();
  setRequestLocale(locale);

  const homeT = await getTranslations({ locale, namespace: "Home" });
  const a11yT = await getTranslations({ locale, namespace: "A11y" });
  const caseT = await getTranslations({ locale, namespace: "CasePage" });

  return (
    <CaseIndexView
      locale={locale}
      cases={listCaseStudies()}
      copy={{
        eyebrow: caseT("indexEyebrow"),
        title: caseT("indexTitle"),
        description: caseT("indexDescription"),
        openCase: caseT("openCase"),
        backHome: caseT("backHome"),
      }}
      shell={buildShellCopy((key) => homeT(key), locale, (key) => a11yT(key))}
    />
  );
}
