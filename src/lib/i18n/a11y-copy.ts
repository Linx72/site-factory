/** Accessibility labels — skip link, theme toggle (i18n via A11y namespace). */
export type A11yCopy = {
  skipToContent: string;
  themeToggle: string;
  themeLight: string;
  themeDark: string;
};

export const defaultA11yCopy: A11yCopy = {
  skipToContent: "Skip to content",
  themeToggle: "Toggle theme",
  themeLight: "Switch to light mode",
  themeDark: "Switch to dark mode",
};

/** Russian a11y labels for single-locale storefronts (`NEXT_PUBLIC_DEFAULT_LOCALE=ru`). */
export const defaultRuA11yCopy: A11yCopy = {
  skipToContent: "Перейти к содержимому",
  themeToggle: "Переключить тему",
  themeLight: "Светлая тема",
  themeDark: "Тёмная тема",
};
