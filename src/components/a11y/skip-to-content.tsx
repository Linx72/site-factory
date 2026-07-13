/** Skip link for keyboard users — visible on focus. */
export function SkipToContent({ label = "Skip to content" }: { label?: string }) {
  return (
    <a
      href="#hero"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {label}
    </a>
  );
}
