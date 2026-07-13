import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import { localizedHomeHref } from "@/lib/i18n/paths";

type PageShellProps = {
  children: React.ReactNode;
  /** Nav/footer chrome — defaults to English copy from section-copy. */
  copy?: Pick<HomeSectionCopy, "header" | "nav" | "footer" | "a11y">;
  /** Locale for home link — e.g. `en`, `ru`. */
  locale?: string;
};

/** Shared chrome for secondary pages (status, motion, errors). */
export function PageShell({ children, copy, locale }: PageShellProps) {
  const shell = copy ?? getDefaultHomeSectionCopy();
  const homeHref = localizedHomeHref(locale);

  return (
    <>
      <SiteHeader
        ctaLabel={shell.header?.cta}
        menuLabel={shell.header?.menu}
        navLinks={shell.nav?.links}
        a11y={shell.a11y}
        homeHref={homeHref}
      />
      <div className="min-h-screen pt-16">{children}</div>
      <SiteFooter navLinks={shell.nav?.links} copy={shell.footer} />
    </>
  );
}
