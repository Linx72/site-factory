import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const i18nEnabled = process.env.NEXT_PUBLIC_I18N === "true";
const intlMiddleware = createMiddleware(routing);

/**
 * Locale routing when NEXT_PUBLIC_I18N=true; no-op otherwise (single-locale /).
 */
export function middleware(request: NextRequest) {
  if (!i18nEnabled) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(ru|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
