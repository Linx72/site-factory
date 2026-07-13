import { getTranslations, setRequestLocale } from "next-intl/server";

import { MotionLabPageView } from "@/components/pages/motion-lab-page-view";
import {
  buildMotionLabCopy,
  buildShellCopy,
} from "@/lib/i18n/build-home-copy";
import { buildPageAlternates, buildOpenGraphLocales } from "@/lib/i18n/alternate-links";

type LocalizedMotionProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocalizedMotionProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MotionLab" });

  const title = `${t("title")} — Web Motion Starter`;
  const description = t("description");

  return {
    title,
    description,
    alternates: buildPageAlternates(locale, "/motion"),
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

/** Localized motion lab at `/en/motion`, `/ru/motion`. */
export default async function LocalizedMotionPage({ params }: LocalizedMotionProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const homeT = await getTranslations({ locale, namespace: "Home" });
  const a11yT = await getTranslations({ locale, namespace: "A11y" });
  const motionT = await getTranslations({ locale, namespace: "MotionLab" });

  return (
    <MotionLabPageView
      locale={locale}
      shell={buildShellCopy((key) => homeT(key), locale, (key) => a11yT(key))}
      copy={buildMotionLabCopy((key) => motionT(key))}
    />
  );
}
