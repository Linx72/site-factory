import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BlogPostView } from "@/components/pages/blog-post-view";
import { buildShellCopy } from "@/lib/i18n/build-home-copy";
import { buildPageAlternates, buildOpenGraphLocales } from "@/lib/i18n/alternate-links";
import { getBlogPost, listBlogPosts } from "@/lib/blog";
import { isPageEnabled } from "@/lib/site-pages";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const locales = ["en", "ru"];
  return locales.flatMap((locale) =>
    listBlogPosts().map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  const title = `${post.title} — ${siteConfig.name}`;
  return {
    title,
    description: post.summary,
    alternates: buildPageAlternates(locale, `/blog/${slug}`),
    openGraph: {
      title,
      description: post.summary,
      ...buildOpenGraphLocales(locale),
    },
  };
}

export default async function LocalizedBlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isPageEnabled("blog-index")) notFound();
  setRequestLocale(locale);

  const post = getBlogPost(slug);
  if (!post) notFound();

  const homeT = await getTranslations({ locale, namespace: "Home" });
  const a11yT = await getTranslations({ locale, namespace: "A11y" });
  const blogT = await getTranslations({ locale, namespace: "BlogPage" });

  return (
    <BlogPostView
      locale={locale}
      post={post}
      backLabel={blogT("backToBlog")}
      shell={buildShellCopy((key) => homeT(key), locale, (key) => a11yT(key))}
    />
  );
}
