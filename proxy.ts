import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { localizePath, toInternalSegments } from "@/lib/routes";

/**
 * Every page lives under app/[locale]/ with German folder names.
 *
 *   /kuechen/farben/weiss          → rewrite /de/kuechen/farben/weiss
 *   /en/kitchens/colours/weiss     → rewrite /en/kuechen/farben/weiss
 *   /en/kuechen/farben/weiss       → 301 /en/kitchens/colours/weiss
 *   /de/kuechen/...                → 301 /kuechen/...
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = `/${segments.slice(1).join("/")}`;
    return NextResponse.redirect(url, 301);
  }

  if (first === "en") {
    const rest = segments.slice(1);
    const canonical = localizePath(`/${rest.join("/")}`, "en");
    if (canonical !== pathname.replace(/\/$/, "")) {
      const url = request.nextUrl.clone();
      url.pathname = canonical;
      return NextResponse.redirect(url, 301);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/en/${toInternalSegments(rest).join("/")}`;
    return NextResponse.rewrite(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|cms-uploads|cms-opt|kitchens/|instagram|health|llms.txt|.*\\..*).*)",
  ],
};
