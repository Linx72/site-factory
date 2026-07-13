import { CaseDetailView } from "@/components/pages/case-detail-view";
import { getDefaultHomeSectionCopy } from "@/lib/i18n/build-home-copy";
import { getCaseStudy, listCaseStudies } from "@/lib/cases";
import { routing } from "@/i18n/routing";
import { isPageEnabled } from "@/lib/site-pages";
import { siteFeatures } from "@/lib/site-config";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listCaseStudies().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const meta = getCaseStudy(slug);
  if (!meta) return { title: "Case not found" };
  return {
    title: `${meta.title} — Web Motion Starter`,
    description: meta.summary,
  };
}

export default async function CaseDetailPage({ params }: Props) {
  if (!isPageEnabled("case")) notFound();
  const { slug } = await params;
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}/case/${slug}`);
  }

  const meta = getCaseStudy(slug);
  if (!meta) notFound();

  const copy = getDefaultHomeSectionCopy();
  return (
    <CaseDetailView meta={meta} copy={copy} backLabel="← All cases" />
  );
}
