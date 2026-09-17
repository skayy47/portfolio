import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes the services.skay.dev subdomain to the /services page while the
 * portfolio root (skay.dev) keeps serving the recruiter-facing homepage.
 * Renamed from `middleware` to `proxy` in Next.js 16 — same mechanism.
 */
export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  const isServicesSubdomain = hostname.startsWith("services.");
  if (!isServicesSubdomain || pathname.startsWith("/services")) {
    return NextResponse.next();
  }

  const target = pathname === "/" ? "/services" : `/services${pathname}`;
  return NextResponse.rewrite(new URL(target, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
