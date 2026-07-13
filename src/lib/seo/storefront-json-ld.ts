import { siteConfig } from "@/lib/site-config";

type StorefrontOffer = {
  name: string;
  description: string;
};

const storefrontOffers: StorefrontOffer[] = [
  {
    name: "Flash",
    description: "Каркас + тема + variants + публичный URL (~15 мин–1 день).",
  },
  {
    name: "Sprint",
    description: "Flash + тексты, legal, форма заявок, домен (~3 дня).",
  },
  {
    name: "Build",
    description: "Sprint + Stripe, CMS-lite, analytics, Resend (~2 недели).",
  },
];

/** schema.org Organization + Offer catalog for the RU storefront. */
export function buildStorefrontOrganizationJsonLd(
  url: string = siteConfig.url,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url,
    description: siteConfig.description,
    makesOffer: storefrontOffers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      description: offer.description,
      url: `${url}#pricing`,
      seller: { "@type": "Organization", name: siteConfig.name },
    })),
  };
}
