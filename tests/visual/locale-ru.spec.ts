import { expect, test } from "@playwright/test";

/**
 * Smoke test for localized home — /ru renders Russian FAQ heading.
 * Route exists even when NEXT_PUBLIC_I18N is off (static [locale] pages).
 */
test.describe("localized home", () => {
  test("ru FAQ title is Russian", async ({ page }) => {
    await page.goto("/ru", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => (document.body.innerText || "").includes("Частые вопросы"),
      undefined,
      { timeout: 60_000 },
    );
    await expect(page.getByRole("heading", { name: "Частые вопросы" })).toBeVisible();
  });

  test("ru features section is Russian", async ({ page }) => {
    await page.goto("/ru#features", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "Всё для сложных интерфейсов" }),
    ).toBeVisible({ timeout: 60_000 });
  });

  test("ru features production card is Russian", async ({ page }) => {
    await page.goto("/ru#features", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Готов к production", level: 3 })).toBeVisible({
      timeout: 60_000,
    });
  });

  test("ru timeline section is Russian", async ({ page }) => {
    await page.goto("/ru#timeline", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Дорожная карта" })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText("Эталонные сайты")).toBeVisible();
  });

  test("ru team section is Russian", async ({ page }) => {
    await page.goto("/ru#team", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Люди за проектом" })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText("Фулстек-разработчик")).toBeVisible();
  });

  test("ru testimonials section is Russian", async ({ page }) => {
    await page.goto("/ru#testimonials", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Что говорят команды" })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText("Елена В.")).toBeVisible();
    await expect(page.getByText("История по скроллу наконец стала цельной.")).toBeVisible();
  });

  test("ru scroll story section is Russian", async ({ page }) => {
    await page.goto("/ru#story", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "История по скроллу" }),
    ).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText("Шаг 1")).toBeVisible();
  });

  test("ru ui section is Russian", async ({ page }) => {
    await page.goto("/ru#ui", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "UI и motion", exact: true })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("button", { name: "Открыть dialog" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Стек" })).toBeVisible();
  });

  test("ru bento section is Russian", async ({ page }) => {
    await page.goto("/ru#bento", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Motion-система", level: 3 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("heading", { name: "Быстрый запуск", level: 3 })).toBeVisible();
  });

  test("ru nav labels are Russian", async ({ page }) => {
    await page.goto("/ru", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("navigation").getByRole("link", { name: "Тарифы" })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("navigation").getByRole("link", { name: "Вопросы" })).toBeVisible();
  });

  test("ru motion lab has localized shell and demos", async ({ page }) => {
    await page.goto("/ru/motion", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Лаборатория motion", level: 1 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText("Справочник")).toBeVisible();
    await expect(page.getByRole("button", { name: "Наведите — magnetic pull" })).toBeVisible();
    await expect(page.getByText("Первый")).toBeVisible();
    await expect(page.getByRole("link", { name: "← На главную" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Магнитная кнопка", level: 2 })).toBeVisible();
  });

  test("ru home has hreflang alternates", async ({ page }) => {
    await page.goto("/ru", { waitUntil: "domcontentloaded" });
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    const hreflangRu = page.locator('link[rel="alternate"][hreflang="ru"]');
    await expect(hreflangEn).toHaveAttribute("href", /\/en$/);
    await expect(hreflangRu).toHaveAttribute("href", /\/ru$/);
  });

  test("ru locale switcher has language group label", async ({ page }) => {
    await page.goto("/ru", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("group", { name: "Язык" })).toBeVisible({
      timeout: 60_000,
    });
  });

  test("ru contact section is Russian", async ({ page }) => {
    await page.goto("/ru#contact", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Будьте в курсе" })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByPlaceholder("hello@studio.ru")).toBeVisible();
  });

  test("ru skip link label is Russian", async ({ page }) => {
    await page.goto("/ru", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: "Перейти к содержимому" })).toBeAttached({
      timeout: 60_000,
    });
  });

  test("ru page title includes localized hero", async ({ page }) => {
    await page.goto("/ru", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/Красивый motion/, { timeout: 60_000 });
  });

  test("ru hero stat cards are Russian", async ({ page }) => {
    await page.goto("/ru", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("анимации только transform")).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText("Доступность")).toBeVisible();
  });

  test("ru not-found page is Russian", async ({ page }) => {
    await page.goto("/ru/does-not-exist", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Страница не найдена" })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("link", { name: "Главная" })).toBeVisible();
  });

  test("ru pricing plans are Russian", async ({ page }) => {
    await page.goto("/ru#pricing", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Старт", level: 3 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("heading", { name: "Про", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Команда", level: 3 })).toBeVisible();
    await expect(page.getByText("Бесплатно")).toBeVisible();
    await expect(page.getByText("/мес").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Выбрать Старт" })).toBeVisible();
  });

  test("ru status dashboard is Russian", async ({ page }) => {
    await page.goto("/ru/status", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Статус подписок", level: 1 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText("Бэкенд в реальном времени")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Инструменты разработки", level: 2 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Заполнить все demo-данные" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Подписчики рассылки", level: 2 })).toBeVisible();
  });

  test("ru privacy page is Russian", async ({ page }) => {
    await page.goto("/ru/privacy", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Политика конфиденциальности" })).toBeVisible({
      timeout: 60_000,
    });
  });

  test("ru about page is Russian", async ({ page }) => {
    await page.goto("/ru/about", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Люди и ремесло за стеком" })).toBeVisible({
      timeout: 60_000,
    });
  });

  test("ru case index lists demo", async ({ page }) => {
    await page.goto("/ru/case", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Кейсы" })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText("Scroll-led product launch")).toBeVisible();
  });

  test("ru blog index lists posts", async ({ page }) => {
    await page.goto("/ru/blog", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Блог" })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText("Multi-page sites without a headless CMS")).toBeVisible();
  });
});
