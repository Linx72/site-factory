"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { appliedTheme } from "@/lib/theme/applied-theme";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Class-based dark mode on `<html>`.
 * defaultTheme comes from the active theme pack (`npm run theme:apply`).
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={appliedTheme.defaultColorScheme}
      enableSystem={appliedTheme.defaultColorScheme === "system"}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
