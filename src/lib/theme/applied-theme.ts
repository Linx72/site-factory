/**
 * Active theme pack metadata — rewritten by `npm run theme:apply -- <id>`.
 * ThemeProvider reads defaultColorScheme; do not edit by hand in clones
 * unless you know you are leaving the apply script.
 */
export const appliedTheme = {
  id: "editorial-ink",
  label: "Editorial ink",
  defaultColorScheme: "light" as "system" | "light" | "dark",
} as const;

export type AppliedThemeId = typeof appliedTheme.id;
