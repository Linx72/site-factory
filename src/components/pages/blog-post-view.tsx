import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/motion/fade-in";
import type { BlogPost } from "@/lib/blog";
import { renderBlogMarkdown } from "@/lib/blog";
import type { HomeSectionCopy } from "@/lib/i18n/section-copy";
import { localizedPath } from "@/lib/i18n/paths";

type BlogPostViewProps = {
  post: BlogPost;
  backLabel: string;
  shell?: Pick<HomeSectionCopy, "header" | "nav" | "footer" | "a11y">;
  locale?: string;
};

/** Renders one markdown post with shared page shell. */
export function BlogPostView({ post, backLabel, shell, locale }: BlogPostViewProps) {
  const html = renderBlogMarkdown(post.body);

  return (
    <PageShell copy={shell} locale={locale}>
      <article className="mx-auto max-w-3xl px-6 py-24 md:px-16">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {post.date}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            {post.title}
          </h1>
          {post.summary ? (
            <p className="mt-4 text-lg text-muted-foreground">{post.summary}</p>
          ) : null}
        </FadeIn>
        <div
          className="prose-blog mt-10 space-y-4 text-base leading-relaxed text-foreground/90 [&_a]:text-primary [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre]:text-sm [&_ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <p className="mt-12">
          <Link
            href={localizedPath(locale, "/blog")}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {backLabel}
          </Link>
        </p>
      </article>
    </PageShell>
  );
}
