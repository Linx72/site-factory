import { expect, test } from "@playwright/test";

/**
 * Full-page visual snapshots of the marketing home route.
 * Brand-agnostic: waits for hydrated h1 (TextReveal uses whileInView).
 */
test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => {
        const h1 = document.querySelector("h1");
        const text = h1?.textContent?.trim() ?? "";
        return text.length >= 8;
      },
      undefined,
      { timeout: 60_000 },
    );
    await page.waitForTimeout(600);
  });

  test("full page snapshot", async ({ page }) => {
    await expect(page).toHaveScreenshot("home-full.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
      animations: "disabled",
      timeout: 30_000,
    });
  });
});
