import { getNavLinks } from "@/lib/site-content";
import { defaultA11yCopy, defaultRuA11yCopy, type A11yCopy } from "@/lib/i18n/a11y-copy";
import { localizedPath } from "@/lib/i18n/paths";
import { getSingleLocale } from "@/lib/site-config";
import {
  defaultBentoCopy,
  defaultContactCopy,
  defaultCtaCopy,
  defaultFaqItems,
  defaultFeaturesCopy,
  defaultFooterCopy,
  defaultLogosCopy,
  defaultNavLabels,
  defaultPricingCopy,
  defaultScrollStoryCopy,
  defaultStatsCopy,
  defaultTeamCopy,
  defaultTestimonialsCopy,
  defaultTimelineCopy,
  defaultUiShowcaseCopy,
  BENTO_CELL_IDS,
  FAQ_ITEM_IDS,
  FEATURE_ITEM_IDS,
  PRICING_PLAN_IDS,
  SCROLL_STORY_STEP_IDS,
  STAT_ITEM_IDS,
  STAT_VALUES,
  TEAM_INITIALS,
  TEAM_MEMBER_IDS,
  TESTIMONIAL_ITEM_IDS,
  TIMELINE_ITEM_IDS,
  UI_TAB_IDS,
  type HomeSectionCopy,
  type NavLinkCopy,
  type PricingPlanCopy,
} from "@/lib/i18n/section-copy";
import { siteContent } from "@/lib/site-content";

type Translator = (key: string) => string;

function buildPricingPlan(t: Translator, id: (typeof PRICING_PLAN_IDS)[number]): PricingPlanCopy {
  const featureCount = id === "pro" ? 4 : 3;
  const features: string[] = [];

  for (let index = 0; index < featureCount; index += 1) {
    features.push(t(`pricing.plans.${id}.features.${index}`));
  }

  const period = id === "starter" ? undefined : t(`pricing.plans.${id}.period`);

  return {
    name: t(`pricing.plans.${id}.name`),
    priceLabel: t(`pricing.plans.${id}.priceLabel`),
    period,
    description: t(`pricing.plans.${id}.description`),
    features,
  };
}

function buildNavLinks(t: Translator): NavLinkCopy[] {
  return getNavLinks().map((link) => ({
    href: link.href,
    label: t(`nav.links.${link.href.slice(1)}`),
  }));
}

function buildDefaultNavLinks(): NavLinkCopy[] {
  return getNavLinks().map((link) => {
    const key = link.href.slice(1) as keyof typeof defaultNavLabels;
    return {
      href: link.href,
      label: link.label ?? defaultNavLabels[key] ?? link.href,
    };
  });
}

function buildA11yCopy(t: Translator): A11yCopy {
  return {
    skipToContent: t("skipToContent"),
    themeToggle: t("themeToggle"),
    themeLight: t("themeLight"),
    themeDark: t("themeDark"),
  };
}

/** Builds section copy from next-intl Home namespace (server-only). */
export function buildHomeSectionCopy(
  t: Translator,
  locale?: string,
  a11yT?: Translator,
): HomeSectionCopy {
  return {
    header: { cta: t("header.cta"), menu: t("header.menu") },
    a11y: a11yT ? buildA11yCopy(a11yT) : defaultA11yCopy,
    nav: { links: buildNavLinks(t) },
    footer: {
      tagline: t("footer.tagline"),
      status: t("footer.status"),
      motionLab: t("footer.motionLab"),
      statusHref: localizedPath(locale, "/status"),
      motionLabHref: localizedPath(locale, "/motion"),
      privacy: t("footer.privacy"),
      terms: t("footer.terms"),
      privacyHref: localizedPath(locale, "/privacy"),
      termsHref: localizedPath(locale, "/terms"),
      blog: t("footer.blog"),
      blogHref: localizedPath(locale, "/blog"),
    },
    logos: { title: t("logos.title") },
    bento: {
      title: t("bento.title"),
      subtitle: t("bento.subtitle"),
      tip: t("bento.tip"),
      cells: BENTO_CELL_IDS.map((id) => ({
        id,
        title: t(`bento.cells.${id}.title`),
        body: t(`bento.cells.${id}.body`),
      })),
    },
    scrollStory: {
      title: t("scrollStory.title"),
      subtitleActive: t("scrollStory.subtitleActive"),
      subtitleReduced: t("scrollStory.subtitleReduced"),
      stepLabel: t("scrollStory.stepLabel"),
      steps: SCROLL_STORY_STEP_IDS.map((id) => ({
        id,
        title: t(`scrollStory.steps.${id}.title`),
        body: t(`scrollStory.steps.${id}.body`),
      })),
    },
    ui: {
      title: t("ui.title"),
      subtitle: t("ui.subtitle"),
      dialog: {
        trigger: t("ui.dialog.trigger"),
        title: t("ui.dialog.title"),
        description: t("ui.dialog.description"),
        close: t("ui.dialog.close"),
      },
      sheet: {
        trigger: t("ui.sheet.trigger"),
        title: t("ui.sheet.title"),
        description: t("ui.sheet.description"),
      },
      tabs: UI_TAB_IDS.map((id) => ({
        id,
        label: t(`ui.tabs.${id}.label`),
        title: t(`ui.tabs.${id}.title`),
        body: t(`ui.tabs.${id}.body`),
      })),
    },
    stats: {
      title: t("stats.title"),
      items: STAT_ITEM_IDS.map((id) => ({
        id,
        ...STAT_VALUES[id],
        label: t(`stats.items.${id}.label`),
      })),
    },
    timeline: {
      title: t("timeline.title"),
      subtitle: t("timeline.subtitle"),
      items: TIMELINE_ITEM_IDS.map((id) => ({
        id,
        date: t(`timeline.items.${id}.date`),
        title: t(`timeline.items.${id}.title`),
        body: t(`timeline.items.${id}.body`),
      })),
    },
    testimonials: {
      title: t("testimonials.title"),
      subtitle: t("testimonials.subtitle"),
      items: TESTIMONIAL_ITEM_IDS.map((id) => ({
        id,
        quote: t(`testimonials.items.${id}.quote`),
        author: t(`testimonials.items.${id}.author`),
        role: t(`testimonials.items.${id}.role`),
      })),
    },
    team: {
      title: t("team.title"),
      subtitle: t("team.subtitle"),
      members: TEAM_MEMBER_IDS.map((id) => ({
        id,
        name: t(`team.members.${id}.name`),
        role: t(`team.members.${id}.role`),
        bio: t(`team.members.${id}.bio`),
        initials: TEAM_INITIALS[id],
      })),
    },
    features: {
      title: t("features.title"),
      subtitle: t("features.subtitle"),
      items: FEATURE_ITEM_IDS.map((id) => ({
        id,
        title: t(`features.items.${id}.title`),
        body: t(`features.items.${id}.body`),
      })),
    },
    pricing: {
      title: t("pricing.title"),
      subtitle: t("pricing.subtitle"),
      plans: {
        starter: buildPricingPlan(t, "starter"),
        pro: buildPricingPlan(t, "pro"),
        team: buildPricingPlan(t, "team"),
      },
      checkout: {
        choosePlan: t("pricing.checkout.choosePlan"),
        redirecting: t("pricing.checkout.redirecting"),
        unavailable: t("pricing.checkout.unavailable"),
        networkError: t("pricing.checkout.networkError"),
      },
    },
    faq: {
      title: t("faq.title"),
      items: FAQ_ITEM_IDS.map((id) => ({
        id,
        q: t(`faq.items.${id}.q`),
        a: t(`faq.items.${id}.a`),
      })),
    },
    contact: {
      title: t("contact.title"),
      description: t("contact.description"),
      placeholder: t("contact.placeholder"),
      subscribe: t("contact.subscribe"),
      sending: t("contact.sending"),
      success: t("contact.success"),
      exists: t("contact.exists"),
      emailUs: t("contact.emailUs"),
      emailLabel: t("contact.emailLabel"),
      leadCount: t("contact.leadCount"),
      genericError: t("contact.genericError"),
    },
    cta: {
      title: t("cta.title"),
      description: t("cta.description"),
      primary: t("cta.primary"),
      secondary: t("cta.secondary"),
    },
  };
}

/** Shell-only copy for secondary pages under /[locale]/*. */
export function buildShellCopy(
  t: Translator,
  locale?: string,
  a11yT?: Translator,
): Pick<HomeSectionCopy, "header" | "nav" | "footer" | "a11y"> {
  const full = buildHomeSectionCopy(t, locale, a11yT);
  return {
    header: full.header,
    nav: full.nav,
    footer: full.footer,
    a11y: full.a11y,
  };
}

export {
  buildMotionLabCopy,
  buildMotionLabIntro,
  getDefaultMotionLabCopy,
} from "@/lib/i18n/build-motion-lab-copy";

export { buildStatusPageCopy, getDefaultStatusPageCopy } from "@/lib/i18n/build-status-copy";

/** Defaults when i18n is off — single-locale `/` route. */
export function getDefaultHomeSectionCopy(): HomeSectionCopy {
  const locale = getSingleLocale();
  const isRu = locale === "ru";

  return {
    header: {
      cta: siteContent.headerCta ?? (isRu ? "Оставить бриф" : "Get started"),
      menu: isRu ? "Меню" : "Menu",
    },
    nav: { links: buildDefaultNavLinks() },
    footer: defaultFooterCopy,
    logos: defaultLogosCopy,
    bento: defaultBentoCopy,
    scrollStory: defaultScrollStoryCopy,
    ui: defaultUiShowcaseCopy,
    stats: defaultStatsCopy,
    timeline: defaultTimelineCopy,
    testimonials: defaultTestimonialsCopy,
    team: defaultTeamCopy,
    features: defaultFeaturesCopy,
    pricing: defaultPricingCopy,
    faq: {
      title: "Частые вопросы",
      items: defaultFaqItems,
    },
    contact: defaultContactCopy,
    cta: defaultCtaCopy,
    a11y: isRu ? defaultRuA11yCopy : defaultA11yCopy,
  };
}
