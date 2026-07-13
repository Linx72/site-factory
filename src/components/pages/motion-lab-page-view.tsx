import { PageShell } from "@/components/layout/page-shell";
import { MotionLabShowcase } from "@/components/motion/motion-lab-showcase";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import type { MotionLabCopy } from "@/lib/i18n/motion-lab-copy";
import { localizedHomeHref } from "@/lib/i18n/paths";

type MotionLabPageViewProps = {
  copy: MotionLabCopy;
  shell?: Pick<HomeSectionCopy, "header" | "nav" | "footer" | "a11y">;
  locale?: string;
};

/** Motion lab route body — shared by `/motion` and `/[locale]/motion`. */
export function MotionLabPageView({ copy, shell, locale }: MotionLabPageViewProps) {
  return (
    <PageShell copy={shell} locale={locale}>
      <MotionLabShowcase copy={copy} homeHref={localizedHomeHref(locale)} />
    </PageShell>
  );
}
