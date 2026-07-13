import { getLocale, getTranslations } from "next-intl/server";

import { PageShell } from "@/components/layout/page-shell";
import { NotFoundView } from "@/components/pages/not-found-view";
import { buildShellCopy } from "@/lib/i18n/build-home-copy";
import { siteFeatures } from "@/lib/site-config";

/** Root 404 fallback — localized when i18n is on. */
export default async function NotFound() {
  const t = await getTranslations("NotFound");
  const locale = siteFeatures.i18n ? await getLocale() : undefined;

  const copy = {
    code: t("code"),
    title: t("title"),
    description: t("description"),
    home: t("home"),
    motionLab: t("motionLab"),
  };

  if (siteFeatures.i18n && locale) {
    const homeT = await getTranslations("Home");
    const a11yT = await getTranslations("A11y");
    const localizedShell = buildShellCopy((key) => homeT(key), locale, (key) => a11yT(key));

    return (
      <PageShell copy={localizedShell} locale={locale}>
        <NotFoundView locale={locale} copy={copy} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <NotFoundView copy={copy} />
    </PageShell>
  );
}
