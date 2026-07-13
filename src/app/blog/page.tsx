import { BlogIndexView } from "@/components/pages/blog-index-view";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import { listBlogPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";
import { isPageEnabled } from "@/lib/site-pages";
import { siteFeatures } from "@/lib/site-config";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Blog — Web Motion Starter",
  description: "File-based posts from content/blog/",
};

/** Blog index — redirects to /en/blog when i18n is on. */
export default function BlogIndexPage() {
  if (!isPageEnabled("blog-index")) notFound();
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/blog`);
  }

  const shell = getDefaultHomeSectionCopy();
  return (
    <BlogIndexView
      posts={listBlogPosts()}
      copy={{
        eyebrow: "Journal",
        title: "Blog",
        description: "File-based posts under content/blog/. No headless CMS required.",
        openPost: "Read post",
        backHome: "← Back to home",
      }}
      shell={{
        header: shell.header,
        nav: shell.nav,
        footer: shell.footer,
      }}
    />
  );
}
