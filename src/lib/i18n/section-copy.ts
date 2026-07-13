/**
 * Section copy passed from server translations into HomePage.
 * Keeps client sections free of next-intl hooks where props suffice.
 */
import type { A11yCopy } from "@/lib/i18n/a11y-copy";

export type FaqItemCopy = {
  id: string;
  q: string;
  a: string;
};

export type ContactSectionCopy = {
  title: string;
  description: string;
  placeholder: string;
  subscribe: string;
  sending: string;
  success: string;
  exists: string;
  emailUs: string;
  /** Screen-reader label for email input. */
  emailLabel: string;
  /** Live counter — `{count}` replaced with lead total. */
  leadCount: string;
  /** Fallback when Convex mutation throws without message. */
  genericError: string;
};

export type CtaSectionCopy = {
  title: string;
  description: string;
  primary: string;
  secondary: string;
};

export type StatItemCopy = {
  id: string;
  value: number;
  suffix: string;
  label: string;
};

export type StatsSectionCopy = {
  title: string;
  items: StatItemCopy[];
};

export type TimelineItemCopy = {
  id: string;
  date: string;
  title: string;
  body: string;
};

export type TimelineSectionCopy = {
  title: string;
  subtitle: string;
  items: TimelineItemCopy[];
};

export type TestimonialItemCopy = {
  id: string;
  quote: string;
  author: string;
  role: string;
};

export type TestimonialsSectionCopy = {
  title: string;
  subtitle: string;
  items: TestimonialItemCopy[];
};

export type TeamMemberCopy = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
};

export type TeamSectionCopy = {
  title: string;
  subtitle: string;
  members: TeamMemberCopy[];
};

export type FeatureItemCopy = {
  id: string;
  title: string;
  body: string;
};

export type FeaturesSectionCopy = {
  title: string;
  subtitle: string;
  items: FeatureItemCopy[];
};

export type PricingPlanCopy = {
  name: string;
  priceLabel: string;
  /** Monthly suffix, e.g. "/mo" — omit for free tier. */
  period?: string;
  description: string;
  features: string[];
};

export type PricingCheckoutCopy = {
  choosePlan: string;
  redirecting: string;
  unavailable: string;
  networkError: string;
};

export type PricingSectionCopy = {
  title: string;
  subtitle: string;
  plans: Record<"starter" | "pro" | "team", PricingPlanCopy>;
  checkout: PricingCheckoutCopy;
};

export type NavLinkCopy = {
  href: string;
  label: string;
};

export type FooterCopy = {
  tagline: string;
  status: string;
  motionLab: string;
  statusHref: string;
  motionLabHref: string;
  privacy?: string;
  terms?: string;
  privacyHref?: string;
  termsHref?: string;
  blog?: string;
  blogHref?: string;
};

export type BentoCellCopy = {
  id: string;
  title: string;
  body: string;
};

export type BentoSectionCopy = {
  title: string;
  subtitle: string;
  tip: string;
  cells: BentoCellCopy[];
};

export type ScrollStoryStepCopy = {
  id: string;
  title: string;
  body: string;
};

export type ScrollStorySectionCopy = {
  title: string;
  subtitleActive: string;
  subtitleReduced: string;
  /** Template with `{n}` for step number — e.g. "Step {n}". */
  stepLabel: string;
  steps: ScrollStoryStepCopy[];
};

export type LogosSectionCopy = {
  title: string;
};

export type UiShowcaseTabCopy = {
  id: string;
  label: string;
  title: string;
  body: string;
};

export type UiShowcaseCopy = {
  title: string;
  subtitle: string;
  dialog: {
    trigger: string;
    title: string;
    description: string;
    close: string;
  };
  sheet: {
    trigger: string;
    title: string;
    description: string;
  };
  tabs: UiShowcaseTabCopy[];
};

export type MotionLabIntroCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export type HomeSectionCopy = {
  ui?: UiShowcaseCopy;
  logos?: LogosSectionCopy;
  bento?: BentoSectionCopy;
  scrollStory?: ScrollStorySectionCopy;
  nav?: {
    links: NavLinkCopy[];
  };
  footer?: FooterCopy;
  stats?: StatsSectionCopy;
  timeline?: TimelineSectionCopy;
  testimonials?: TestimonialsSectionCopy;
  team?: TeamSectionCopy;
  features?: FeaturesSectionCopy;
  pricing?: PricingSectionCopy;
  faq?: {
    title: string;
    items: FaqItemCopy[];
  };
  contact?: ContactSectionCopy;
  cta?: CtaSectionCopy;
  header?: {
    cta: string;
    menu: string;
  };
  a11y?: A11yCopy;
};

/** FAQ item ids — must match keys in messages/{locale}.json */
export const FAQ_ITEM_IDS = [
  "stack",
  "figma",
  "stripe",
  "a11y",
  "contact",
  "convex",
  "deploy",
] as const;

/** Feature card ids — must match keys in messages/{locale}.json */
export const FEATURE_ITEM_IDS = [
  "framer",
  "gsap",
  "lenis",
  "tokens",
  "figma",
  "production",
] as const;

export const PRICING_PLAN_IDS = ["starter", "pro", "team"] as const;

export const STAT_ITEM_IDS = ["presets", "latency", "a11y", "gsap"] as const;

export const TIMELINE_ITEM_IDS = ["q1", "q2", "q3", "q4"] as const;

export const TESTIMONIAL_ITEM_IDS = ["elena", "marcus", "sofia"] as const;

export const TEAM_MEMBER_IDS = ["alex", "jordan", "samira", "chris"] as const;

export const BENTO_CELL_IDS = [
  "motion",
  "figma",
  "shadcn",
  "lenis",
  "dark",
  "ship",
] as const;

/** Grid spans stay in code — only titles/bodies come from messages. */
export const BENTO_CELL_LAYOUT: Record<
  (typeof BENTO_CELL_IDS)[number],
  { className: string; featured?: boolean }
> = {
  motion: { className: "md:col-span-2 md:row-span-2", featured: true },
  figma: { className: "md:col-span-1" },
  shadcn: { className: "md:col-span-1" },
  lenis: { className: "md:col-span-1" },
  dark: { className: "md:col-span-1" },
  ship: { className: "md:col-span-2" },
};

export const SCROLL_STORY_STEP_IDS = ["design", "export", "merge", "ship"] as const;

export const UI_TAB_IDS = ["motion", "figma", "stack"] as const;

/** Nav href keys — must match `nav.links.*` in messages (without `#`). */
export const NAV_LINK_KEYS = [
  "features",
  "story",
  "testimonials",
  "pricing",
  "contact",
  "faq",
  "ui",
] as const;

/** Numeric values for stats — labels come from messages. */
export const STAT_VALUES: Record<
  (typeof STAT_ITEM_IDS)[number],
  { value: number; suffix: string }
> = {
  presets: { value: 120, suffix: "+" },
  latency: { value: 48, suffix: "ms" },
  a11y: { value: 99, suffix: "%" },
  gsap: { value: 12, suffix: "k" },
};

/** Initials for team avatars — names may stay English in RU locale. */
export const TEAM_INITIALS: Record<(typeof TEAM_MEMBER_IDS)[number], string> = {
  alex: "AM",
  jordan: "JL",
  samira: "SO",
  chris: "CP",
};

export const defaultFeatureItems: FeatureItemCopy[] = [
  {
    id: "framer",
    title: "Framer Motion",
    body: "Declarative UI motion — stagger, layout, gestures, page transitions.",
  },
  {
    id: "gsap",
    title: "GSAP ScrollTrigger",
    body: "Pinned storytelling, scrub timelines, scroll-linked parallax.",
  },
  {
    id: "lenis",
    title: "Lenis + Base UI",
    body: "Smooth scroll synced with GSAP; accessible dialogs, sheets, tabs.",
  },
  {
    id: "tokens",
    title: "Design tokens",
    body: "Shared motion durations and easings in CSS + TypeScript.",
  },
  {
    id: "figma",
    title: "Figma pipeline",
    body: "get_design_context + get_motion_context merged by node id.",
  },
  {
    id: "production",
    title: "Production ready",
    body: "Strict TypeScript, eslint, static export friendly sections.",
  },
];

export const defaultFeaturesCopy: FeaturesSectionCopy = {
  title: "Everything for complex interfaces",
  subtitle: "Compose primitives instead of one-off animations in every file.",
  items: defaultFeatureItems,
};

export const defaultPricingCopy: PricingSectionCopy = {
  title: "Simple pricing",
  subtitle: "Free starter to fork. Paid tiers use Stripe Checkout when env is configured.",
  plans: {
    starter: {
      name: "Starter",
      priceLabel: "Free",
      description: "Motion primitives and demo sections to fork.",
      features: ["Framer + GSAP setup", "Lenis scroll", "6 section templates"],
    },
    pro: {
      name: "Pro",
      priceLabel: "$29",
      period: "/mo",
      description: "Figma MCP workflow and shadcn UI blocks.",
      features: [
        "Motion context import",
        "Dialog, sheet, tabs",
        "Scroll pin storytelling",
        "Priority patterns",
      ],
    },
    team: {
      name: "Team",
      priceLabel: "$99",
      period: "/mo",
      description: "Multi-page sites with ChatPRD alignment.",
      features: ["PRD → implementation", "Custom design tokens", "Team rules"],
    },
  },
  checkout: {
    choosePlan: "Choose {plan}",
    redirecting: "Redirecting…",
    unavailable: "Checkout unavailable",
    networkError: "Network error — try again",
  },
};

export const defaultFaqItems: FaqItemCopy[] = [
  {
    id: "stack",
    q: "Which animation library should I use?",
    a: "Framer Motion for UI and React layout; GSAP ScrollTrigger for scroll timelines and pin sections; Lenis for smooth scroll. The starter wires them together.",
  },
  {
    id: "figma",
    q: "How does Figma motion import work?",
    a: "Paste a Figma URL in Cursor. The agent calls get_design_context for structure and get_motion_context for keyframes, then merges animations by data-node-id into React components.",
  },
  {
    id: "stripe",
    q: "How do I enable Stripe checkout?",
    a: "Add STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, STRIPE_PRICE_TEAM, and STRIPE_WEBHOOK_SECRET to .env.local. Use stripe listen for local webhooks.",
  },
  {
    id: "a11y",
    q: "What about accessibility?",
    a: "Components use Base UI primitives. Lenis, GSAP pin, and 3D hero are disabled when prefers-reduced-motion is set.",
  },
  {
    id: "contact",
    q: "Does the newsletter form save data?",
    a: "Yes — emails go to the Convex leads table with a live counter on the contact section. View recent signups on /status.",
  },
  {
    id: "convex",
    q: "Where do subscriptions go after checkout?",
    a: "Stripe webhook forwards to Convex HTTP ingest. Open /status for a real-time feed.",
  },
  {
    id: "deploy",
    q: "Can I deploy to Vercel?",
    a: "Yes. npm run build produces a static-friendly app. Set env vars in the Vercel dashboard before enabling live checkout.",
  },
];

export const defaultContactCopy: ContactSectionCopy = {
  title: "Stay in the loop",
  description: "Motion patterns and Figma → code tips. Stored in Convex — updates live.",
  placeholder: "you@studio.com",
  subscribe: "Subscribe",
  sending: "Sending…",
  success: "You're on the list — thank you!",
  exists: "Already subscribed with this email.",
  emailUs: "Email us",
  emailLabel: "Email",
  leadCount: "{count} subscribers",
  genericError: "Something went wrong",
};

export const defaultStatsCopy: StatsSectionCopy = {
  title: "Built for performance",
  items: STAT_ITEM_IDS.map((id) => ({
    id,
    ...STAT_VALUES[id],
    label:
      id === "presets"
        ? "Motion presets"
        : id === "latency"
          ? "Median scroll latency"
          : id === "a11y"
            ? "Lighthouse accessibility"
            : "Lines saved vs raw GSAP",
  })),
};

export const defaultTimelineCopy: TimelineSectionCopy = {
  title: "Roadmap timeline",
  subtitle: "Vertical milestones with a connecting rail. Each item reveals on scroll.",
  items: [
    {
      id: "q1",
      date: "Q1 2026",
      title: "Starter & motion primitives",
      body: "Framer + GSAP + Lenis providers, section catalog, site-builder skill.",
    },
    {
      id: "q2",
      date: "Q2 2026",
      title: "Figma token sync",
      body: "Variable defs flow into brand-palette.css and motion CSS tokens.",
    },
    {
      id: "q3",
      date: "Q3 2026",
      title: "Reference sites",
      body: "SaaS, agency, and minimal typography templates for agent copy-paste.",
    },
    {
      id: "q4",
      date: "Q4 2026",
      title: "Visual regression",
      body: "Playwright snapshots at 375 / 768 / 1440 before deploy.",
    },
  ],
};

export const defaultTestimonialsCopy: TestimonialsSectionCopy = {
  title: "What teams say",
  subtitle:
    "Patterns you can copy into client projects without rewriting motion from scratch.",
  items: [
    {
      id: "elena",
      quote:
        "We replaced three animation libraries with this stack. Scroll storytelling finally feels cohesive.",
      author: "Elena V.",
      role: "Design lead, Northline",
    },
    {
      id: "marcus",
      quote:
        "Figma motion context landed in React with matching easing — no more guessing keyframes in DevTools.",
      author: "Marcus T.",
      role: "Frontend, Forma Labs",
    },
    {
      id: "sofia",
      quote:
        "Lenis + ScrollTrigger sync was the missing piece. Pin sections work on the first try.",
      author: "Sofia R.",
      role: "Creative dev, Pixel & Co",
    },
  ],
};

export const defaultTeamCopy: TeamSectionCopy = {
  title: "People behind the work",
  subtitle:
    "Replace names and bios with your team — avatars use initials until photos are wired via next/image.",
  members: [
    {
      id: "alex",
      name: "Alex Morgan",
      role: "Creative direction",
      bio: "Leads visual language, Figma systems, and motion specs for client launches.",
      initials: "AM",
    },
    {
      id: "jordan",
      name: "Jordan Lee",
      role: "Frontend & motion",
      bio: "Ships Next.js landings — Framer for UI, GSAP for scroll, Lenis for feel.",
      initials: "JL",
    },
    {
      id: "samira",
      name: "Samira Okonkwo",
      role: "Design engineering",
      bio: "Bridges design tokens, shadcn UI, and accessibility reviews before deploy.",
      initials: "SO",
    },
    {
      id: "chris",
      name: "Chris Park",
      role: "Full stack",
      bio: "Convex, Stripe, and form flows when the landing needs more than static pages.",
      initials: "CP",
    },
  ],
};

export const defaultUiShowcaseCopy: UiShowcaseCopy = {
  title: "UI + motion",
  subtitle: "shadcn-style components (Base UI) with Framer Motion tab transitions.",
  dialog: {
    trigger: "Open dialog",
    title: "Modal with motion",
    description:
      "Base UI enter/exit via data-starting-style. Pair with Framer for in-content animations.",
    close: "Close",
  },
  sheet: {
    trigger: "Open sheet",
    title: "Side panel",
    description: "Slides from the edge — good for filters, nav, or detail views.",
  },
  tabs: [
    {
      id: "motion",
      label: "Motion",
      title: "Motion primitives",
      body: "FadeIn, StaggerChildren, and ScrollReveal live in src/components/motion/. Compose them with shadcn UI for polished sections.",
    },
    {
      id: "figma",
      label: "Figma",
      title: "Figma pipeline",
      body: "Paste a Figma URL — get_design_context for layout, get_motion_context for keyframes. Merge by data-node-id.",
    },
    {
      id: "stack",
      label: "Stack",
      title: "Stack",
      body: "Next.js 16, Framer Motion, GSAP ScrollTrigger, Lenis, Base UI + shadcn styling.",
    },
  ],
};

export const defaultLogosCopy: LogosSectionCopy = {
  title: "Trusted by teams shipping polished UI",
};

export const defaultBentoCopy: BentoSectionCopy = {
  title: "Built as a composable grid",
  subtitle:
    "Bento layouts highlight one primary story block without breaking the motion stack underneath.",
  tip: "Tip: duplicate this section and swap cells content — grid spans stay in className.",
  cells: [
    {
      id: "motion",
      title: "Motion system",
      body: "Shared Framer variants and GSAP scroll primitives — one vocabulary across pages.",
    },
    {
      id: "figma",
      title: "Figma merge",
      body: "Design context + motion context by node id.",
    },
    {
      id: "shadcn",
      title: "shadcn UI",
      body: "Dialogs, sheets, tabs with accessible defaults.",
    },
    {
      id: "lenis",
      title: "Lenis scroll",
      body: "Smooth wheel synced with ScrollTrigger pin sections.",
    },
    {
      id: "dark",
      title: "Dark mode",
      body: "Class-based theme with brand OKLCH tokens.",
    },
    {
      id: "ship",
      title: "Ship faster",
      body: "Scaffold from web-motion-starter, customize sections, run visual QA.",
    },
  ],
};

export const defaultScrollStoryCopy: ScrollStorySectionCopy = {
  title: "Scroll-driven storytelling",
  subtitleActive:
    "Section pins while you scroll; progress and steps scrub with Lenis + GSAP.",
  subtitleReduced: "Static layout — motion disabled for reduced-motion preference.",
  stepLabel: "Step {n}",
  steps: [
    {
      id: "design",
      title: "Design in Figma",
      body: "Layout, typography, and motion on the same artboard.",
    },
    {
      id: "export",
      title: "Export motion context",
      body: "Keyframes, easing, and snippets via Figma MCP.",
    },
    {
      id: "merge",
      title: "Merge into React",
      body: "Match data-node-id, wrap with motion.* or GSAP timelines.",
    },
    {
      id: "ship",
      title: "Ship",
      body: "Lenis scroll, reduced-motion fallbacks, shadcn UI polish.",
    },
  ],
};

export const defaultMotionLabIntro: MotionLabIntroCopy = {
  eyebrow: "Reference",
  title: "Motion lab",
  description:
    "Live previews of every primitive in src/components/motion/. Hover CTAs to feel magnetic pull; scroll down for GSAP reveals.",
};

export const defaultFooterCopy: FooterCopy = {
  tagline: "Web Motion Starter · Next.js + Framer Motion + GSAP",
  status: "Status",
  motionLab: "Motion lab",
  statusHref: "/status",
  motionLabHref: "/motion",
  privacy: "Privacy",
  terms: "Terms",
  privacyHref: "/privacy",
  termsHref: "/terms",
  blog: "Blog",
  blogHref: "/blog",
};

export const defaultNavLabels: Record<(typeof NAV_LINK_KEYS)[number], string> = {
  features: "Features",
  story: "Story",
  testimonials: "Reviews",
  pricing: "Pricing",
  contact: "Contact",
  faq: "FAQ",
  ui: "UI",
};

export const defaultCtaCopy: CtaSectionCopy = {
  title: "Ready for your Figma file",
  description:
    "Paste a design URL in chat — motion, layout, and components land in this stack with matching easing and timing.",
  primary: "Open in Cursor",
  secondary: "Figma MCP docs",
};
