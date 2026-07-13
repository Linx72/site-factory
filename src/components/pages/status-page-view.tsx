import { PageShell } from "@/components/layout/page-shell";
import Link from "next/link";
import { CmsPanel } from "@/components/status/cms-panel";
import { LeadsPanel } from "@/components/status/leads-panel";
import { SeedAllPanel } from "@/components/status/seed-all-panel";
import { SubscriptionStatusPanel } from "@/components/status/subscription-status-panel";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import {
  defaultStatusPageCopy,
  type StatusPageCopy,
} from "@/lib/i18n/status-dashboard-copy";
import { localizedHomeHref } from "@/lib/i18n/paths";
import { siteFeatures } from "@/lib/site-config";

type StatusPageViewProps = {
  copy?: StatusPageCopy;
  shell?: Pick<HomeSectionCopy, "header" | "nav" | "footer" | "a11y">;
  locale?: string;
};

/** Status dashboard — shared by `/status` and `/[locale]/status`. */
export function StatusPageView({
  copy = defaultStatusPageCopy,
  shell,
  locale,
}: StatusPageViewProps) {
  const homeHref = localizedHomeHref(locale);

  if (!siteFeatures.convex) {
    return (
      <PageShell copy={shell} locale={locale}>
        <div className="mx-auto max-w-xl space-y-4 px-6 py-16 md:px-16">
          <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
          <p className="text-muted-foreground">{copy.convexDisabled}</p>
          <p className="text-sm text-muted-foreground">
            <Link href="/#contact" className="underline underline-offset-4 hover:text-foreground">
              Форма брифа на главной
            </Link>
            {" · "}
            <a
              href="https://github.com/Linx72/site-factory"
              className="underline underline-offset-4 hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Репозиторий
            </a>
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell copy={shell} locale={locale}>
      <div className="space-y-4 px-6 py-16 md:px-16">
        <SeedAllPanel copy={copy.seedAll} />
        <SubscriptionStatusPanel copy={copy.subscriptions} />
        <LeadsPanel copy={copy.leads} locale={locale} />
        <CmsPanel
          copy={copy.cms}
          editorCopy={copy.cmsEditor}
          homeHref={homeHref}
        />
      </div>
    </PageShell>
  );
}
