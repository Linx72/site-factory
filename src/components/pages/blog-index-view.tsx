import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/motion/fade-in";
import type { BlogPostMeta } from "@/lib/blog";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import { localizedHomeHref, localizedPath } from "@/lib/i18n/paths";

export type BlogIndexCopy = {
  eyebrow: string;
  title: string;
  description: string;
  openPost: string;
  backHome: string;
};

type BlogIndexViewProps = {
  copy: BlogIndexCopy;
  posts: BlogPostMeta[];
  shell?: Pick<HomeSectionCopy, "header" | "nav" | "footer" | "a11y">;
  locale?: string;
};

/** Lists file-based posts from content/blog/*.md */
export function BlogIndexView({ copy, posts, shell, locale }: BlogIndexViewProps) {
  const homeHref = localizedHomeHref(locale);

  return (
    <PageShell copy={shell} locale={locale}>
      <div className="mx-auto max-w-3xl px-6 py-24 md:px-16">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{copy.description}</p>
        </FadeIn>
        <ul className="mt-12 space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={localizedPath(locale, `/blog/${post.slug}`)}
                className="block rounded-2xl border border-border px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {post.date}
                </p>
                <p className="mt-1 text-lg font-medium text-foreground">{post.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{post.summary}</p>
                <p className="mt-3 text-sm font-medium text-primary">{copy.openPost}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link
            href={homeHref}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {copy.backHome}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
