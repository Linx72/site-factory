import { ImageResponse } from "next/og";

import { getOgStyles, truncateOgText } from "@/lib/og-theme";
import { brandTokens, siteConfig } from "@/lib/site-config";
import { siteContent } from "@/lib/site-content";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dynamic OG image — brand hue gradient + site name / tagline from site.json. */
export default function OpenGraphImage() {
  const og = getOgStyles(brandTokens.hue);
  const eyebrow = siteContent.hero?.eyebrow ?? siteContent.name;
  const subtitle = truncateOgText(siteContent.tagline || siteConfig.description, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: og.background,
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: og.mid,
            opacity: 0.45,
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            fontSize: 26,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: og.eyebrowColor,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 920,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: og.accentColor,
            maxWidth: 820,
            lineHeight: 1.35,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    { ...size },
  );
}
