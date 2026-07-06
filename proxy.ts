import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { findRedirect } from "./lib/cms/redirects";

const intl = createMiddleware(routing);

/**
 * Locale handling (this Next version's replacement for middleware.ts):
 * - "/" serves Arabic (primary), "/en/…" serves English.
 * - First visit is ALWAYS Arabic — no accept-language negotiation.
 * - A visitor who switched to English gets NEXT_LOCALE=en (set by the
 *   language switcher); unprefixed visits are then redirected to /en.
 * - next-intl's middleware does the /→/ar rewrite under the hood.
 *
 * CMS Redirect Manager is enforced HERE, before route resolution, because
 * Next.js always prefers a literal route segment (e.g. app/[locale]/blog/
 * [slug]) over the catch-all page — a redirect for "/blog/old-slug" would
 * never reach app/[locale]/[...rest]/page.tsx otherwise. Proxy runs on the
 * Node.js runtime by default in this Next version, so the fs-backed CMS
 * read in findRedirect() works here.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const preferred = request.cookies.get("NEXT_LOCALE")?.value;

  const logicalPath = isEnglish ? pathname.slice(3) || "/" : pathname;
  const hit = findRedirect(logicalPath);
  if (hit) {
    if (hit.to.startsWith("http")) {
      return NextResponse.redirect(hit.to, hit.statusCode);
    }
    const url = request.nextUrl.clone();
    url.pathname = isEnglish ? `/en${hit.to === "/" ? "" : hit.to}` : hit.to;
    return NextResponse.redirect(url, hit.statusCode);
  }

  if (!isEnglish && preferred === "en") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  return intl(request);
}

export const config = {
  // Skip API routes, Next internals, and any file with an extension.
  matcher: ["/((?!api|admin|uploads|_next|.*\\..*).*)"],
};
