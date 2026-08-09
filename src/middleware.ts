import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow password page, auth API, subscriber API, and Next internal/static files
  if (
    pathname.startsWith("/password") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/registerSubscriber") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/robots.txt")
  ) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get("site_auth");

  if (authCookie?.value === "true") {
    // already authenticated → let them in
    return NextResponse.next();
  }

  // Not authenticated → redirect to /password
  const url = request.nextUrl.clone();
  url.pathname = "/password";
  return NextResponse.redirect(url);
}

// Match all paths except the ones we explicitly ignore
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};