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

export const BRIEF_PACKAGE_EVENT = "site-factory-brief-package";

/** Shareable contact URL with package query (home + hash). */
export function buildPackageContactHref(planName: string, basePath = "/"): string {
  const params = new URLSearchParams({ package: planName });
  return `${basePath}?${params.toString()}#contact`;
}

/**
 * Storefront pricing CTA — persist package, update URL, notify contact form, scroll.
 */
export function navigateToBriefWithPackage(planName: string): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(BRIEF_PACKAGE_STORAGE_KEY, planName);
  } catch {
    /* private mode */
  }

  const url = new URL(window.location.href);
  url.searchParams.set("package", planName);
  if (!url.hash) {
    url.hash = "contact";
  }
  window.history.replaceState(null, "", url);

  window.dispatchEvent(
    new CustomEvent(BRIEF_PACKAGE_EVENT, { detail: planName }),
  );

  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  window.setTimeout(() => {
    const field = document.getElementById("contact-brief-static");
    if (field instanceof HTMLTextAreaElement) {
      field.focus();
    }
  }, 400);
}
