import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/**
 * Locale handling (this Next version's replacement for middleware.ts):
 * - "/" serves Arabic (primary), "/en/…" serves English.
 * - First visit is ALWAYS Arabic — no accept-language negotiation.
 * - A visitor who switched to English gets NEXT_LOCALE=en (set by the
 *   language switcher); unprefixed visits are then redirected to /en.
 * - next-intl's middleware does the /→/ar rewrite under the hood.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const preferred = request.cookies.get("NEXT_LOCALE")?.value;

  if (!isEnglish && preferred === "en") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  return intl(request);
}

export const config = {
  // Skip API routes, Next internals, and any file with an extension.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
