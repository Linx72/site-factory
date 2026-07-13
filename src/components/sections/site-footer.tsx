import Link from "next/link";

import {
  defaultFooterCopy,
  type FooterCopy,
  type NavLinkCopy,
} from "@/lib/i18n/section-copy";
import { getNavLinks } from "@/lib/site-content";

type SiteFooterProps = {
  navLinks?: NavLinkCopy[];
  copy?: FooterCopy;
};

/** Footer — nav from content/site.json plus utility routes. */
export function SiteFooter({
  navLinks,
  copy = defaultFooterCopy,
}: SiteFooterProps) {
  const links = navLinks ?? getNavLinks();

  return (
    <footer className="border-t border-border px-6 py-10 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>{copy.tagline}</p>
        <nav className="flex flex-wrap gap-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
          <Link href={copy.statusHref} className="hover:text-foreground">
            {copy.status}
          </Link>
          <Link href={copy.motionLabHref} className="hover:text-foreground">
            {copy.motionLab}
          </Link>
          {copy.blog && copy.blogHref ? (
            <Link href={copy.blogHref} className="hover:text-foreground">
              {copy.blog}
            </Link>
          ) : null}
          {copy.privacy && copy.privacyHref ? (
            <Link href={copy.privacyHref} className="hover:text-foreground">
              {copy.privacy}
            </Link>
          ) : null}
          {copy.terms && copy.termsHref ? (
            <Link href={copy.termsHref} className="hover:text-foreground">
              {copy.terms}
            </Link>
          ) : null}
        </nav>
      </div>
    </footer>
  );
}
