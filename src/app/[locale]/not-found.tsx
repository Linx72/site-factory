import { getTranslations, setRequestLocale } from "next-intl/server";

import { NotFoundView } from "@/components/pages/not-found-view";
import { buildShellCopy } from "@/lib/i18n/build-home-copy";
import { PageShell } from "@/components/layout/page-shell";
import { routing, type AppLocale } from "@/i18n/routing";

type LocaleNotFoundProps = {
  params: Promise<{ locale: string }>;
};

/** Localized 404 for `/en/*` and `/ru/*` unknown routes. */
export default async function LocaleNotFound({ params }: LocaleNotFoundProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as AppLocale)) {
    return (
      <NotFoundView
        copy={{
          code: "404",
          title: "Page not found",
          description: "This route does not exist.",
          home: "Home",
          motionLab: "Motion lab",
        }}
      />
    );
  }

  setRequestLocale(locale);
  const t = await getTranslations("NotFound");
  const shellT = await getTranslations("Home");
  const a11yT = await getTranslations("A11y");
  const shell = buildShellCopy((key) => shellT(key), locale, (key) => a11yT(key));

  return (
    <PageShell copy={shell} locale={locale}>
      <NotFoundView
        locale={locale}
        copy={{
          code: t("code"),
          title: t("title"),
          description: t("description"),
          home: t("home"),
          motionLab: t("motionLab"),
        }}
      />
    </PageShell>
  );
}
