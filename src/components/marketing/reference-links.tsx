import type { FeatureLinkCopy } from "@/lib/i18n/section-copy";

type ReferenceLinksProps = {
  links: FeatureLinkCopy[];
  className?: string;
};

/** Outbound preset / template links — shared by features and about. */
export function ReferenceLinks({ links, className }: ReferenceLinksProps) {
  if (!links.length) return null;

  return (
    <div className={className ?? "flex flex-wrap gap-x-3 gap-y-1"}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
