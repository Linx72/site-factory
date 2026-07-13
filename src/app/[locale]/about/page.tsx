import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AboutPageView } from "@/components/pages/about-page-view";
import { buildHomeSectionCopy, buildShellCopy } from "@/lib/i18n/build-home-copy";
import { buildPageAlternates, buildOpenGraphLocales } from "@/lib/i18n/alternate-links";
import { isPageEnabled } from "@/lib/site-pages";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  const title = `${t("title")} — ${siteConfig.name}`;
  const description = t("description");

  return {
    title,
    description,
    alternates: buildPageAlternates(locale, "/about"),
    openGraph: { title, description, ...buildOpenGraphLocales(locale) },
  };
}

export default async function LocalizedAboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isPageEnabled("about")) notFound();
  setRequestLocale(locale);

  const homeT = await getTranslations({ locale, namespace: "Home" });
  const a11yT = await getTranslations({ locale, namespace: "A11y" });
  const aboutT = await getTranslations({ locale, namespace: "AboutPage" });
  const full = buildHomeSectionCopy((key) => homeT(key), locale, (key) => a11yT(key));

  return (
    <AboutPageView
      locale={locale}
      about={{
        eyebrow: aboutT("eyebrow"),
        title: aboutT("title"),
        description: aboutT("description"),
      }}
      shell={buildShellCopy((key) => homeT(key), locale, (key) => a11yT(key))}
      sections={{ team: full.team, cta: full.cta }}
    />
  );
}
