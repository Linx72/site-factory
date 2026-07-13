import {
  CMS_EDITOR_FIELD_IDS,
  defaultStatusPageCopy,
  type StatusPageCopy,
} from "@/lib/i18n/status-dashboard-copy";

type Translator = (key: string) => string;

/** Builds full status dashboard copy from StatusPage namespace (server-only). */
export function buildStatusPageCopy(t: Translator): StatusPageCopy {
  return {
    title: t("title"),
    convexDisabled: t("convexDisabled"),
    seedAll: {
      title: t("seedAll.title"),
      hint: t("seedAll.hint"),
      button: t("seedAll.button"),
      seeding: t("seedAll.seeding"),
      done: t("seedAll.done"),
      seedFailed: t("seedAll.seedFailed"),
    },
    subscriptions: {
      eyebrow: t("subscriptions.eyebrow"),
      title: t("subscriptions.title"),
      description: t("subscriptions.description"),
      active: t("subscriptions.active"),
      loading: t("subscriptions.loading"),
      empty: t("subscriptions.empty"),
      seedButton: t("subscriptions.seedButton"),
      addMore: t("subscriptions.addMore"),
      seeding: t("subscriptions.seeding"),
      seedFailed: t("subscriptions.seedFailed"),
    },
    leads: {
      title: t("leads.title"),
      total: t("leads.total"),
      loading: t("leads.loading"),
      empty: t("leads.empty"),
      seedButton: t("leads.seedButton"),
      addMore: t("leads.addMore"),
      seeding: t("leads.seeding"),
      seedFailed: t("leads.seedFailed"),
    },
    cms: {
      title: t("cms.title"),
      descriptionOn: t("cms.descriptionOn"),
      descriptionOff: t("cms.descriptionOff"),
      loading: t("cms.loading"),
      empty: t("cms.empty"),
      seedButton: t("cms.seedButton"),
      reseedButton: t("cms.reseedButton"),
      seeding: t("cms.seeding"),
      seedFailed: t("cms.seedFailed"),
      writeLocked: t("cms.writeLocked"),
      openHomePreview: t("cms.openHomePreview"),
    },
    cmsEditor: {
      title: t("cmsEditor.title"),
      hint: t("cmsEditor.hint"),
      keyLabel: t("cmsEditor.keyLabel"),
      valueLabel: t("cmsEditor.valueLabel"),
      placeholder: t("cmsEditor.placeholder"),
      save: t("cmsEditor.save"),
      saving: t("cmsEditor.saving"),
      saved: t("cmsEditor.saved"),
      saveFailed: t("cmsEditor.saveFailed"),
      fields: Object.fromEntries(
        CMS_EDITOR_FIELD_IDS.map((id) => [id, t(`cmsEditor.fields.${id}`)]),
      ) as StatusPageCopy["cmsEditor"]["fields"],
    },
  };
}

export function getDefaultStatusPageCopy(): StatusPageCopy {
  return defaultStatusPageCopy;
}
