/** sessionStorage key — pricing CTA writes plan name before scroll to #contact. */
export const BRIEF_PACKAGE_STORAGE_KEY = "site-factory-brief-package";

/** Prefill line for the brief textarea when a pricing tier was selected. */
export function formatBriefPackageLine(planName: string): string {
  return `Пакет: ${planName}\n\n`;
}

/** Read ?package= from URL (shareable deep links). */
export function readPackageFromSearch(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("package")?.trim();
  return value || null;
}
