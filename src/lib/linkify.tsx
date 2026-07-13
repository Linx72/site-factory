import type { ReactNode } from "react";

const URL_PATTERN = /(https?:\/\/[^\s·]+)/g;

/** Splits plain text and wraps http(s) URLs in external links. */
export function linkifyText(text: string): ReactNode[] {
  const parts = text.split(URL_PATTERN);

  return parts.map((part, index) => {
    if (!part) return null;
    if (/^https?:\/\//i.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {part.replace(/^https?:\/\//, "")}
        </a>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}
