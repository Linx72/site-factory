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
  /** Static mailto fallback — optional brief field placeholder. */
  briefPlaceholder?: string;
  /** Shown after mailto handoff (static form). */
  mailtoHint?: string;
  /** Success when /api/lead accepts the submission. */
  successApi?: string;
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
  about?: string;
  aboutHref?: string;
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
    title: "Каталог секций",
    body: "Hero, features, pricing, FAQ, contact — комнаты завода. Варианты editorial / bento-lite / compare.",
  },
  {
    id: "gsap",
    title: "Живой motion",
    body: "Framer Motion для UI, GSAP ScrollTrigger для scroll-кино, Lenis для плавного скролла.",
  },
  {
    id: "lenis",
    title: "Brief → URL",
    body: "brief.json → scaffold → QA gates → Vercel. Предсказуемый конвейер, не импровизация.",
  },
  {
    id: "tokens",
    title: "Пресеты",
    body: "SaaS, Agency, Launch, Demo — готовые планировки с theme packs.",
  },
  {
    id: "figma",
    title: "Код ваш",
    body: "Next.js на Vercel. Не lock-in Framer: репозиторий и домен у вас.",
  },
  {
    id: "production",
    title: "Живые примеры",
    body: "site-ref-saas · site-ref-agency · site-ref-launch — смотрите до заказа.",
  },
];

export const defaultFeaturesCopy: FeaturesSectionCopy = {
  title: "Как устроена фабрика",
  subtitle: "Не рисуем сайт с нуля — собираем из каталога секций, тем и пресетов.",
  items: defaultFeatureItems,
};

export const defaultPricingCopy: PricingSectionCopy = {
  title: "Пакеты",
  subtitle: "Фиксированные сроки. Кнопка ведёт к форме брифа.",
  plans: {
    starter: {
      name: "Flash",
      priceLabel: "~15 мин–1 день",
      description: "Каркас + тема + variants + публичный URL. Без глубокой полировки текстов.",
      features: ["brief → scaffold", "preset + theme pack", "QA + Vercel preview"],
    },
    pro: {
      name: "Sprint",
      priceLabel: "~3 дня",
      description: "Flash + тексты, legal-страницы, форма заявок, домен.",
      features: [
        "Copy EN (и RU по запросу)",
        "privacy / terms",
        "contact + Convex",
        "custom domain",
      ],
    },
    team: {
      name: "Build",
      priceLabel: "~2 недели",
      description: "Sprint + Stripe, CMS-lite, analytics, Resend, мультистраницы.",
      features: ["Stripe checkout", "CMS / i18n по нужде", "analytics + Resend"],
    },
  },
  checkout: {
    choosePlan: "Оставить бриф — {plan}",
    redirecting: "Секунду…",
    unavailable: "Напишите в форме ниже",
    networkError: "Ошибка сети — попробуйте форму контакта",
  },
};

export const defaultFaqItems: FaqItemCopy[] = [
  {
    id: "stack",
    q: "Это как Framer или Lovable?",
    a: "Нет. Вы получаете свой Next.js-код с motion-стеком фабрики. Не аренда редактора и не vibe-app без каталога.",
  },
  {
    id: "figma",
    q: "Можно из Figma?",
    a: "Да — в Cursor через Figma MCP. Структура и motion подтягиваются в секции каталога.",
  },
  {
    id: "stripe",
    q: "Что входит в Flash?",
    a: "Пресет, theme, variants, базовые тексты, QA и live URL. Глубокий копирайт, домен и бэкенд — в Sprint/Build.",
  },
  {
    id: "a11y",
    q: "Анимации не сломают доступность?",
    a: "Lenis, pin и 3D отключаются при prefers-reduced-motion. UI на Base UI / shadcn.",
  },
  {
    id: "contact",
    q: "Как оставить заявку?",
    a: "Форма ниже (#contact). Email попадает в очередь leads; ответ обычно в течение рабочего дня.",
  },
  {
    id: "convex",
    q: "Где примеры?",
    a: "https://site-ref-saas.vercel.app · https://site-ref-agency.vercel.app · https://site-ref-launch.vercel.app · https://web-motion-starter.vercel.app",
  },
  {
    id: "deploy",
    q: "Кто владеет доменом и репо?",
    a: "Вы. Фабрика собирает и выкладывает; доступы Vercel/GitHub передаём при сдаче.",
  },
];

export const defaultContactCopy: ContactSectionCopy = {
  title: "Оставить бриф",
  description: "Коротко: бренд, ниша, пакет (Flash/Sprint/Build), ссылки на референсы. Ответим со следующим шагом.",
  placeholder: "email@company.ru",
  briefPlaceholder: "Бренд, ниша, пакет (Flash/Sprint/Build), ссылки на референсы…",
  subscribe: "Отправить",
  sending: "Отправляем…",
  success: "Откроется почта — отправьте письмо, мы ответим в рабочий день.",
  successApi: "Заявка принята — ответим в рабочий день.",
  exists: "Этот email уже в очереди.",
  emailUs: "Или напишите напрямую",
  emailLabel: "Email",
  leadCount: "{count} заявок в очереди",
  genericError: "Что-то пошло не так — попробуйте ещё раз",
  mailtoHint: "Без Convex форма открывает ваш почтовый клиент с черновиком брифа.",
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
  title: "Как устроена фабрика",
  subtitle:
    "Не студия «с нуля» — конвейер: brief.json → scaffold → copy → QA → ship. Motion и секции из каталога с live-референсами.",
  members: [
    {
      id: "alex",
      name: "Brief → scaffold",
      role: "Flash · ~15 мин",
      bio: "Пресет, theme pack, variants. Публичный Vercel URL без глубокой полировки текстов.",
      initials: "F",
    },
    {
      id: "jordan",
      name: "Copy + legal",
      role: "Sprint · ~3 дня",
      bio: "Тексты EN/RU, privacy/terms, форма заявок, домен, visual smoke.",
      initials: "S",
    },
    {
      id: "samira",
      name: "Backend + ops",
      role: "Build · ~2 недели",
      bio: "Convex leads, Stripe, CMS-lite, analytics, Resend — когда лендингу нужен бэкенд.",
      initials: "B",
    },
    {
      id: "chris",
      name: "Motion catalog",
      role: "Всегда в базе",
      bio: "Framer Motion, GSAP ScrollTrigger, Lenis — проверено на site-ref-saas/agency/launch.",
      initials: "M",
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
  tagline: "Site Factory · brief → preset → live URL · код ваш",
  status: "Статус",
  motionLab: "Motion lab",
  statusHref: "/status",
  motionLabHref: "/motion",
  about: "О фабрике",
  aboutHref: "/about",
  privacy: "Конфиденциальность",
  terms: "Условия",
  privacyHref: "/privacy",
  termsHref: "/terms",
};

export const defaultNavLabels: Record<(typeof NAV_LINK_KEYS)[number], string> = {
  features: "Как устроено",
  story: "История",
  testimonials: "Отзывы",
  pricing: "Пакеты",
  contact: "Бриф",
  faq: "FAQ",
  ui: "UI",
};

export const defaultCtaCopy: CtaSectionCopy = {
  title: "Готовы к живому URL?",
  description:
    "Выберите пакет, оставьте email — соберём сайт из каталога секций с motion, обкатанным на live-референсах.",
  primary: "К форме брифа",
  secondary: "Эталон завода",
};
