import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = [
  "/library",
  "/write",
  "/account",
  "/onboarding",
  "/notifications",
  "/following",
  "/settings",
  "/admin",
  "/activity",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsSession = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (!needsSession) {
    return NextResponse.next();
  }
  const hasSession =
    request.cookies.has("pm_access") || request.cookies.has("pm_refresh");
  if (hasSession) {
    return NextResponse.next();
  }
  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/library",
    "/library/:path*",
    "/write",
    "/write/:path*",
    "/account",
    "/account/:path*",
    "/onboarding",
    "/notifications",
    "/following",
    "/settings",
    "/admin",
    "/admin/:path*",
    "/activity",
  ],
};
