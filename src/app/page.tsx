import { HomePage } from "@/components/pages/home-page";
import { getSingleLocale, siteFeatures } from "@/lib/site-config";
import { siteContent } from "@/lib/site-content";
import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";

/** Generated from sections: hero,features,pricing,faq,contact,cta */
export default function Home() {
  if (siteFeatures.i18n) {
    redirect(`/${routing.defaultLocale}`);
  }

  const sections = siteContent.sections ?? ["features","pricing","faq","contact","cta"];
  const locale = getSingleLocale();

  return (
    <HomePage
      hero={siteContent.hero}
      sections={sections}
      locale={locale}
      jsonLdInLanguage={locale}
    />
  );
}
