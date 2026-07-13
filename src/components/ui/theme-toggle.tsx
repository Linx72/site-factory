"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { defaultA11yCopy, type A11yCopy } from "@/lib/i18n/a11y-copy";

function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type ThemeToggleProps = {
  labels?: Pick<A11yCopy, "themeToggle" | "themeLight" | "themeDark">;
};

/** Light / dark toggle for the site header. */
export function ThemeToggle({ labels = defaultA11yCopy }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={labels.themeToggle}
        disabled
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon-sm"
      aria-label={isDark ? labels.themeLight : labels.themeDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  );
}
