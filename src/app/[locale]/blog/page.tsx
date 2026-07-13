import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BlogIndexView } from "@/components/pages/blog-index-view";
import { buildShellCopy } from "@/lib/i18n/build-home-copy";
import { buildPageAlternates, buildOpenGraphLocales } from "@/lib/i18n/alternate-links";
import { listBlogPosts } from "@/lib/blog";
import { isPageEnabled } from "@/lib/site-pages";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const title = `${t("indexTitle")} — ${siteConfig.name}`;
  const description = t("indexDescription");
  return {
    title,
    description,
    alternates: buildPageAlternates(locale, "/blog"),
    openGraph: { title, description, ...buildOpenGraphLocales(locale) },
  };
}

export default async function LocalizedBlogIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!isPageEnabled("blog-index")) notFound();
  setRequestLocale(locale);

  const homeT = await getTranslations({ locale, namespace: "Home" });
  const a11yT = await getTranslations({ locale, namespace: "A11y" });
  const blogT = await getTranslations({ locale, namespace: "BlogPage" });

  return (
    <BlogIndexView
      locale={locale}
      posts={listBlogPosts()}
      copy={{
        eyebrow: blogT("indexEyebrow"),
        title: blogT("indexTitle"),
        description: blogT("indexDescription"),
        openPost: blogT("openPost"),
        backHome: blogT("backHome"),
      }}
      shell={buildShellCopy((key) => homeT(key), locale, (key) => a11yT(key))}
    />
  );
}
