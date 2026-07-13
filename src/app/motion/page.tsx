import { MotionLabPageView } from "@/components/pages/motion-lab-page-view";
import {
  getDefaultHomeSectionCopy,
  getDefaultMotionLabCopy,
} from "@/lib/i18n/build-home-copy";
import { routing } from "@/i18n/routing";
import { siteFeatures } from "@/lib/site-config";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Motion lab — Web Motion Starter",
  description: "Live catalog of Framer Motion and GSAP primitives",
};

/** Reference page for all motion components — redirects to /en/motion when i18n is on. */
export default function MotionLabPage() {
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/motion`);
  }

  const shell = getDefaultHomeSectionCopy();

  return (
    <MotionLabPageView
      copy={getDefaultMotionLabCopy()}
      shell={{
        header: shell.header,
        nav: shell.nav,
        footer: shell.footer,
      }}
    />
  );
}
