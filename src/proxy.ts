import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isSupportedLocale,
  type Locale,
} from "@/config/i18n";

// Static files and system routes that should never be rewritten or redirected
const PUBLIC_FILE = /\.(.*)$/;
const EXCLUDED_PATHS = [
  "/_next",
  "/api",
  "/feed.xml",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
  "/icon.png",
  "/apple-icon.png",
];

function detectLocaleFromRequest(request: NextRequest): Locale {
  // 1. Highest priority: User preference stored in cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Edge Geolocation (Vercel, Cloudflare, AWS CloudFront, etc.)
  // Vercel Edge: request.geo?.country or x-vercel-ip-country
  // Cloudflare: cf-ipcountry
  // Standard reverse proxies: x-country-code
  const geoObj = (request as unknown as { geo?: { country?: string } }).geo;
  const country = (
    geoObj?.country ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    ""
  ).toUpperCase();

  if (country === "BD") {
    return "bn";
  }

  // 3. Fallback: Browser Accept-Language header
  const acceptLang = request.headers.get("accept-language") || "";
  // Check if Bengali ('bn' or 'bn-BD') is preferred or present before English
  const bnIndex = acceptLang.indexOf("bn");
  const enIndex = acceptLang.indexOf("en");

  if (bnIndex !== -1 && (enIndex === -1 || bnIndex < enIndex)) {
    return "bn";
  }

  // 4. Default fallback
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip public assets, Next.js internal paths, and static files
  if (
    EXCLUDED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if pathname already begins with a supported locale (/en or /bn)
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    // Extract current locale from URL
    const currentLocale = pathname.split("/")[1] as Locale;

    // Attach locale and clean pathname headers for downstream components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", currentLocale);
    requestHeaders.set("x-pathname", pathname);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  }

  // Path does not have a locale prefix -> detect best locale and redirect
  const detectedLocale = detectLocaleFromRequest(request);
  const targetPath = pathname === "/" ? `/${detectedLocale}` : `/${detectedLocale}${pathname}`;
  const redirectUrl = new URL(`${targetPath}${search}`, request.url);

  const response = NextResponse.redirect(redirectUrl);

  // Set the cookie for 1 year if it wasn't already set, so subsequent visits are fast
  if (!request.cookies.has(LOCALE_COOKIE)) {
    response.cookies.set(LOCALE_COOKIE, detectedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
