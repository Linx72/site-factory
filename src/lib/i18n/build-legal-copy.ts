/**
 * Build Legal.* copy from next-intl translator.
 */
import type { LegalDocumentCopy } from "@/components/sections/legal-document-section";

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
      title: "Privacy policy",
      updatedLabel: "Last updated",
      updatedDate: "2026-07-13",
      backHome: "← Back to home",
      sections: [
        {
          heading: "Overview",
          body: "This demo template explains how a Site Factory project may handle information. Replace with your counsel-approved policy before production use.",
        },
        {
          heading: "Data we collect",
          body: "If Convex contact is enabled, we store email addresses submitted on the contact form in the leads table. Payment data is processed by Stripe when checkout is configured — we do not store card numbers on our servers.",
        },
        {
          heading: "Cookies",
          body: "We may use essential cookies for theme preference and session. Analytics cookies only run when an analytics feature flag is enabled.",
        },
        {
          heading: "Your rights",
          body: "You may request access or deletion of lead records by contacting the site operator. Replace this section with jurisdiction-specific rights.",
        },
        {
          heading: "Contact",
          body: "Update this section with your privacy contact email.",
        },
      ],
    };
  }

  return {
    title: "Terms of service",
    updatedLabel: "Last updated",
    updatedDate: "2026-07-13",
    backHome: "← Back to home",
    sections: [
      {
        heading: "Agreement",
        body: "By using this demo site you agree to these placeholder terms. Replace with your legal terms before offering paid services.",
      },
      {
        heading: "Acceptable use",
        body: "Do not misuse forms, attempt to disrupt the service, or use the site for unlawful purposes.",
      },
      {
        heading: "Liability",
        body: "The template is provided as-is for demonstration. Limit liability according to your counsel’s advice.",
      },
      {
        heading: "Changes",
        body: "We may update these terms; the date above reflects the latest revision of this demo copy.",
      },
      {
        heading: "Contact",
        body: "Questions about these terms: replace with your support email.",
      },
    ],
  };
}
