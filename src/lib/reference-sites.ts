/**
 * Live preset demos — single source for storefront links, about page, and FAQ copy.
 */
export type ReferenceSite = {
  id: "saas" | "agency" | "launch" | "template";
  label: string;
  href: string;
  blurb: string;
};

export const presetReferenceSites: ReferenceSite[] = [
  {
    id: "saas",
    label: "SaaS",
    href: "https://site-ref-saas.vercel.app",
    blurb: "PLG, pricing, FAQ — B2B пресет.",
  },
  {
    id: "agency",
    label: "Agency",
    href: "https://site-ref-agency.vercel.app",
    blurb: "Студия, scroll-story, testimonials.",
  },
  {
    id: "launch",
    label: "Launch",
    href: "https://site-ref-launch.vercel.app",
    blurb: "Product drop — editorial hero + compare pricing.",
  },
];

export const templateReferenceSite: ReferenceSite = {
  id: "template",
  label: "Эталон завода",
  href: "https://web-motion-starter.vercel.app",
  blurb: "Полный motion-стек и каталог секций.",
};

/** Map preset refs to feature card link chips. */
export function presetReferenceLinks() {
  return presetReferenceSites.map(({ label, href }) => ({ label, href }));
}
