/**
 * Status dashboard (`/status`, `/[locale]/status`) panel copy.
 * Passed from server translations — panels stay free of next-intl hooks.
 */

export type StatusSeedAllCopy = {
  title: string;
  hint: string;
  button: string;
  seeding: string;
  done: string;
  seedFailed: string;
};

export type StatusSubscriptionsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  active: string;
  loading: string;
  empty: string;
  seedButton: string;
  addMore: string;
  seeding: string;
  seedFailed: string;
};

export type StatusLeadsCopy = {
  title: string;
  total: string;
  loading: string;
  empty: string;
  seedButton: string;
  addMore: string;
  seeding: string;
  seedFailed: string;
};

export type StatusCmsCopy = {
  title: string;
  descriptionOn: string;
  descriptionOff: string;
  loading: string;
  empty: string;
  seedButton: string;
  reseedButton: string;
  seeding: string;
  seedFailed: string;
  /** Shown when ALLOW_DEV_SEED is off — editor/seed hidden. */
  writeLocked: string;
  /** Link back to home to preview CMS overrides. */
  openHomePreview: string;
};

export type StatusCmsEditorCopy = {
  title: string;
  hint: string;
  keyLabel: string;
  valueLabel: string;
  placeholder: string;
  save: string;
  saving: string;
  saved: string;
  saveFailed: string;
  fields: {
    heroTitle: string;
    heroDescription: string;
    ctaTitle: string;
    ctaDescription: string;
  };
};

export type StatusPageCopy = {
  title: string;
  convexDisabled: string;
  seedAll: StatusSeedAllCopy;
  subscriptions: StatusSubscriptionsCopy;
  leads: StatusLeadsCopy;
  cms: StatusCmsCopy;
  cmsEditor: StatusCmsEditorCopy;
};

export const CMS_EDITOR_FIELD_IDS = [
  "heroTitle",
  "heroDescription",
  "ctaTitle",
  "ctaDescription",
] as const;

export const defaultStatusPageCopy: StatusPageCopy = {
  title: "Status",
  convexDisabled:
    "Convex is not configured for this build. Set NEXT_PUBLIC_CONVEX_URL and run npm run dev:convex to enable live panels.",
  seedAll: {
    title: "Dev tools",
    hint: "Populate all demo tables at once. Set ALLOW_DEV_SEED=true in Convex env first.",
    button: "Seed all demo data",
    seeding: "Seeding…",
    done: "Done — subscriptions: {subs}, leads: {leads}, cms: {cms}",
    seedFailed: "Seed all failed",
  },
  subscriptions: {
    eyebrow: "Live backend",
    title: "Subscription status",
    description: "Real-time data from Convex — updates when Stripe webhooks fire.",
    active: "active",
    loading: "Loading…",
    empty: "No subscriptions yet — complete a test checkout or seed demo data.",
    seedButton: "Seed demo rows",
    addMore: "Add more demo rows",
    seeding: "Seeding…",
    seedFailed: "Seed failed",
  },
  leads: {
    title: "Newsletter leads",
    total: "From the contact form — {count} total",
    loading: "Loading…",
    empty: "No signups yet — use the form on the home page or seed demo data.",
    seedButton: "Seed demo leads",
    addMore: "Add more demo leads",
    seeding: "Seeding…",
    seedFailed: "Seed failed",
  },
  cms: {
    title: "CMS content",
    descriptionOn:
      "Marketing strings in cmsContent — wired to hero when NEXT_PUBLIC_CMS=true (enabled)",
    descriptionOff:
      "Marketing strings in cmsContent — wired to hero when NEXT_PUBLIC_CMS=true (off — set env to apply on home)",
    loading: "Loading…",
    empty: "No CMS rows — seed demo hero copy or insert via Convex dashboard.",
    seedButton: "Seed demo CMS",
    reseedButton: "Re-seed demo CMS",
    seeding: "Seeding…",
    seedFailed: "Seed failed",
    writeLocked:
      "Writes locked — set ALLOW_DEV_SEED=true in Convex env to show the editor and seed controls (keep off on production).",
    openHomePreview: "Open home preview",
  },
  cmsEditor: {
    title: "Quick edit",
    hint: "Requires ALLOW_DEV_SEED=true in Convex env. Home page needs NEXT_PUBLIC_CMS=true to reflect changes.",
    keyLabel: "Key",
    valueLabel: "Value",
    placeholder: "New copy…",
    save: "Save to CMS",
    saving: "Saving…",
    saved: "Saved — refresh home to see update.",
    saveFailed: "Save failed",
    fields: {
      heroTitle: "Hero title",
      heroDescription: "Hero description",
      ctaTitle: "CTA title",
      ctaDescription: "CTA description",
    },
  },
};

/** Replace `{name}` placeholders in status dashboard templates. */
export function formatStatusTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ""),
  );
}
