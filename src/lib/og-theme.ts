/**
 * OG / social preview styling from brand hue.
 * Satori (next/og) does not read CSS variables — map OKLCH hue to gradient hex/hsl here.
 *
 * @param hue — OKLCH hue 0–360 (from brandTokens or preset)
 * @returns Inline styles for ImageResponse root + accent text
 */
export function getOgStyles(hue: number) {
  const dark = `hsl(${hue}, 32%, 8%)`;
  const mid = `hsl(${hue}, 42%, 16%)`;
  const glow = `hsl(${hue}, 55%, 28%)`;
  const accent = `hsl(${hue}, 65%, 72%)`;

  return {
    background: `linear-gradient(135deg, #08080a 0%, ${dark} 42%, ${glow} 100%)`,
    accentColor: accent,
    eyebrowColor: `hsl(${hue}, 25%, 65%)`,
    mid,
  };
}

/** Truncate long strings for OG layout (Satori overflow). */
export function truncateOgText(text: string, maxLen: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen - 1).trim()}…`;
}
