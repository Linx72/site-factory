/**
 * Build Legal.* copy from next-intl translator.
 */
import type { LegalDocumentCopy } from "@/components/sections/legal-document-section";
import { siteConfig } from "@/lib/site-config";

type Translator = (key: string) => string;

const PRIVACY_SECTION_IDS = ["intro", "data", "cookies", "rights", "contact"] as const;
const TERMS_SECTION_IDS = ["intro", "use", "liability", "changes", "contact"] as const;

export function buildLegalDocument(
  t: Translator,
  kind: "privacy" | "terms",
): LegalDocumentCopy {
  const ids = kind === "privacy" ? PRIVACY_SECTION_IDS : TERMS_SECTION_IDS;
  return {
    title: t(`${kind}.title`),
    updatedLabel: t("updatedLabel"),
    updatedDate: t(`${kind}.updatedDate`),
    backHome: t("backHome"),
    sections: ids.map((id) => ({
      heading: t(`${kind}.sections.${id}.heading`),
      body: t(`${kind}.sections.${id}.body`),
    })),
  };
}

export function getDefaultLegalDocument(kind: "privacy" | "terms"): LegalDocumentCopy {
  if (kind === "privacy") {
    return {
      title: "Политика конфиденциальности",
      updatedLabel: "Обновлено",
      updatedDate: "2026-07-13",
      backHome: "← На главную",
      sections: [
        {
          heading: "Обзор",
          body: "Site Factory собирает сайты на Next.js. Эта страница описывает, какие данные может обрабатывать ваш лендинг на стеке фабрики. Перед продом замените текст на версию, согласованную с юристом.",
        },
        {
          heading: "Какие данные",
          body: "При включённом Convex email из формы контакта сохраняется в таблице leads. Платежи обрабатывает Stripe — номера карт мы не храним. Без Convex заявка уходит через mailto на адрес оператора сайта.",
        },
        {
          heading: "Cookies",
          body: "Используются технические cookies для темы и сессии. Аналитика — только при включённом флаге NEXT_PUBLIC_ANALYTICS.",
        },
        {
          heading: "Ваши права",
          body: "Вы можете запросить доступ или удаление записи в leads у оператора сайта. Дополните раздел правами по вашей юрисдикции.",
        },
        {
          heading: "Контакт",
          body: `По вопросам данных: ${siteConfig.contactEmail}`,
        },
      ],
    };
  }

  return {
    title: "Условия использования",
    updatedLabel: "Обновлено",
    updatedDate: "2026-07-13",
    backHome: "← На главную",
    sections: [
      {
        heading: "Соглашение",
        body: "Используя сайт Site Factory, вы соглашаетесь с этими условиями. Для коммерческих услуг замените текст на договор/оферту с юристом.",
      },
      {
        heading: "Допустимое использование",
        body: "Не злоупотребляйте формами, не пытайтесь нарушить работу сервиса и не используйте сайт в незаконных целях.",
      },
      {
        heading: "Ответственность",
        body: "Шаблон и витрина предоставляются как есть. Ограничение ответственности — по согласованию с вашим counsel.",
      },
      {
        heading: "Изменения",
        body: "Условия могут обновляться; дата выше отражает актуальную редакцию демо-копии.",
      },
      {
        heading: "Контакт",
        body: `Вопросы по условиям: ${siteConfig.contactEmail}`,
      },
    ],
  };
}
