import { AboutPageView } from "@/components/pages/about-page-view";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import { routing } from "@/i18n/routing";
import { isPageEnabled } from "@/lib/site-pages";
import { siteFeatures } from "@/lib/site-config";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "About — Web Motion Starter",
  description: "Team and craft behind the Site Factory stack",
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
        eyebrow: "About",
        title: "People and craft behind the stack",
        description:
          "A short studio page composed from the team and CTA sections — swap copy for your brand.",
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
