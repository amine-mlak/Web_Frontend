import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  stripLocalePrefix,
  type Locale,
} from "@/lib/i18n";

function withLocaleHeaders(request: NextRequest, locale: Locale) {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  return headers;
}

function rememberLocale(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/").filter(Boolean)[0];

  if (first === "de") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/de" ? "/" : pathname.replace(/^\/de/, "");
    return NextResponse.redirect(url);
  }

  if (first === "en") {
    const url = request.nextUrl.clone();
    url.pathname = stripLocalePrefix(pathname);
    const response = NextResponse.rewrite(url, {
      request: { headers: withLocaleHeaders(request, "en") },
    });
    return rememberLocale(response, "en");
  }

  const response = NextResponse.next({
    request: { headers: withLocaleHeaders(request, DEFAULT_LOCALE) },
  });
  return rememberLocale(response, DEFAULT_LOCALE);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|robots.txt|cms-uploads|cms-opt|kitchens|instagram|health|llms.txt|.*\\..*).*)",
  ],
};
