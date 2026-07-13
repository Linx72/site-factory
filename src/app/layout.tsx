import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale, getTranslations } from "next-intl/server";

import { CheckoutSuccessBannerWrapper } from "@/components/pricing/checkout-success-banner-wrapper";
import { SkipToContent } from "@/components/a11y/skip-to-content";
import { AnalyticsScripts } from "@/components/providers/analytics-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const a11yT = await getTranslations("A11y");

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <SkipToContent label={a11yT("skipToContent")} />
        <ThemeProvider>
          <ConvexClientProvider>
            <MotionProvider>
              <CheckoutSuccessBannerWrapper />
              {children}
              <AnalyticsScripts />
            </MotionProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
