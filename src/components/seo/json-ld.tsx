type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Injects schema.org JSON-LD for crawlers and rich previews. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
