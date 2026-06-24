import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require the user to be logged in
const PROTECTED_PREFIXES = ["/admin"];

// Routes that logged-in users should not see (e.g. login page)
const AUTH_ONLY_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the token from cookies (set at login) OR check a cookie flag.
  // Since localStorage is not available in middleware (server-side),
  // we rely on a cookie called `auth_token` that we set at login.
  const token = request.cookies.get("auth_token")?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthOnly  = AUTH_ONLY_ROUTES.some((p) => pathname.startsWith(p));

  // Unauthenticated user trying to access a protected route → redirect to /login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // remember where they were going
    return NextResponse.redirect(loginUrl);
  }

  // Already-authenticated user trying to visit /login → redirect to /admin
  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)).*)",
  ],
};
