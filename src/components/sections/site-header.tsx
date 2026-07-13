"use client";

import Link from "next/link";
import { useState } from "react";

import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { A11yCopy } from "@/lib/i18n/a11y-copy";
import type { NavLinkCopy } from "@/lib/i18n/section-copy";
import { useActiveSection } from "@/lib/lenis/lenis-context";
import { getNavLinks, siteContent } from "@/lib/site-content";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const headerCtaDefault = siteContent.headerCta ?? "Get started";
const menuLabelDefault = "Menu";

type SiteHeaderProps = {
  /** Overrides content/site.json headerCta — e.g. from i18n messages. */
  ctaLabel?: string;
  /** Localized nav — hrefs from site.json, labels from messages. */
  navLinks?: NavLinkCopy[];
  menuLabel?: string;
  /** Theme toggle aria labels from A11y namespace. */
  a11y?: Pick<A11yCopy, "themeToggle" | "themeLight" | "themeDark">;
  /** Home link — `/` or `/en` when i18n is on. */
  homeHref?: string;
};

/** Sticky header with scroll blur, active nav highlight, and mobile menu. */
export function SiteHeader({
  ctaLabel = headerCtaDefault,
  navLinks,
  menuLabel = menuLabelDefault,
  a11y,
  homeHref = "/",
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const links = navLinks ?? getNavLinks();
  const hrefs = links.map((link) => link.href);
  const activeHref = useActiveSection(hrefs);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-border/60",
        "bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/55",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <Link href={homeHref} className="text-sm font-semibold tracking-tight">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                activeHref === link.href
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </a>
          ))}
          <LocaleSwitcher />
          <ThemeToggle labels={a11y} />
          <Button size="sm" render={<a href="#contact" />}>
            {ctaLabel}
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher />
          <ThemeToggle labels={a11y} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {menuLabel}
          </Button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-3 px-6 py-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm",
                activeHref === link.href
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
