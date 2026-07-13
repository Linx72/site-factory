import { BlogPostView } from "@/components/pages/blog-post-view";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import { getBlogPost, listBlogPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";
import { isPageEnabled } from "@/lib/site-pages";
import { siteFeatures } from "@/lib/site-config";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Web Motion Starter`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  if (!isPageEnabled("blog-index")) notFound();
  const { slug } = await params;
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/blog/${slug}`);
  }

  const post = getBlogPost(slug);
  if (!post) notFound();

  const shell = getDefaultHomeSectionCopy();
  return (
    <BlogPostView
      post={post}
      backLabel="← All posts"
      shell={{
        header: shell.header,
        nav: shell.nav,
        footer: shell.footer,
      }}
    />
  );
}
