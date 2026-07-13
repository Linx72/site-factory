import { AboutPageView } from "@/components/pages/about-page-view";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import { routing } from "@/i18n/routing";
import { isPageEnabled } from "@/lib/site-pages";
import { siteFeatures } from "@/lib/site-config";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "О фабрике — Site Factory",
  description: "Конвейер brief → preset → QA → Vercel. Пакеты Flash, Sprint, Build.",
};

export default function AboutPage() {
  if (!isPageEnabled("about")) notFound();
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/about`);
  }

  const shell = getDefaultHomeSectionCopy();
  return (
    <AboutPageView
      about={{
        eyebrow: "О фабрике",
        title: "Каталог секций, не случайный лендинг",
        description:
          "Site Factory собирает живые Next.js-сайты из пресетов и motion-каталога. Вы владеете кодом и доменом — мы ускоряем путь от брифа до URL.",
      }}
      shell={{
        header: shell.header,
        nav: shell.nav,
        footer: shell.footer,
      }}
      sections={{ team: shell.team, cta: shell.cta }}
    />
  );
}
