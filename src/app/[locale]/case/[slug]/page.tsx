import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CaseDetailView } from "@/components/pages/case-detail-view";
import { buildHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import { buildPageAlternates, buildOpenGraphLocales } from "@/lib/i18n/alternate-links";
import { getCaseStudy, listCaseStudies } from "@/lib/cases";
import { isPageEnabled } from "@/lib/site-pages";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const locales = ["en", "ru"];
  return locales.flatMap((locale) =>
    listCaseStudies().map((item) => ({ locale, slug: item.slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const meta = getCaseStudy(slug);
  if (!meta) return { title: "Case not found" };
  const title = `${meta.title} — ${siteConfig.name}`;
  return {
    title,
    description: meta.summary,
    alternates: buildPageAlternates(locale, `/case/${slug}`),
    openGraph: {
      title,
      description: meta.summary,
      ...buildOpenGraphLocales(locale),
    },
  };
}

export default async function LocalizedCaseDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isPageEnabled("case")) notFound();
  setRequestLocale(locale);

  const meta = getCaseStudy(slug);
  if (!meta) notFound();

  const homeT = await getTranslations({ locale, namespace: "Home" });
  const a11yT = await getTranslations({ locale, namespace: "A11y" });
  const caseT = await getTranslations({ locale, namespace: "CasePage" });
  const copy = buildHomeSectionCopy((key) => homeT(key), locale, (key) => a11yT(key));

  return (
    <CaseDetailView
      locale={locale}
      meta={meta}
      copy={copy}
      backLabel={caseT("backToCases")}
    />
  );
}
