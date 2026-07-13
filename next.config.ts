import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /** Playwright visual QA uses 127.0.0.1:3099 — allow dev HMR from that host. */
  allowedDevOrigins: ["127.0.0.1"],
};

export default withNextIntl(nextConfig);
