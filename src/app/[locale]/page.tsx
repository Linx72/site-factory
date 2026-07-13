import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomePage } from "@/components/pages/home-page";
import { buildHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import {
  absoluteUrlForLocale,
  buildPageAlternates,
  buildOpenGraphLocales,
} from "@/lib/i18n/alternate-links";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { siteContent } from "@/lib/site-content";

type LocalizedHomeProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalizedHomeProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  const title = `${siteConfig.name} — ${t("hero.title")}`;
  const description = t("hero.description");

  return {
    title,
    description,
    alternates: buildPageAlternates(locale, ""),
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

export default async function LocalizedHome({ params }: LocalizedHomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const a11yT = await getTranslations("A11y");
  const copy = buildHomeSectionCopy((key) => t(key), locale, (key) => a11yT(key));
  const heroStats = ["fps", "a11y", "figma"] as const;

  return (
    <HomePage
      locale={locale}
      sections={siteContent.sections}
      copy={copy}
      jsonLdDescription={t("hero.description")}
      jsonLdUrl={absoluteUrlForLocale(locale, "")}
      jsonLdInLanguage={locale === "ru" ? "ru-RU" : "en-US"}
      hero={{
        locale,
        eyebrow: t("hero.eyebrow"),
        title: t("hero.title"),
        description: t("hero.description"),
        primaryCta: t("hero.primaryCta"),
        secondaryCta: t("hero.secondaryCta"),
        stats: heroStats.map((id) => ({
          label: t(`hero.stats.${id}.label`),
          sub: t(`hero.stats.${id}.sub`),
        })),
      }}
    />
  );
}
