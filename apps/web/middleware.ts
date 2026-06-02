import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Protected route prefixes — require auth (demo or Clerk) */
const PROTECTED_ROUTES = ['/admin', '/operator', '/support'];
const AUTH_ROUTES = ['/bookings', '/refunds', '/notifications'];

/** Demo auth cookie name */
const DEMO_AUTH_COOKIE = 'moon_demo_role';

/** Role-based access rules */
const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ['/admin'],
  OPERATOR: ['/operator'],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if Clerk is configured (real auth)
  const clerkKey = process.env.CLERK_SECRET_KEY;
  const hasClerk = clerkKey && !clerkKey.includes('your_key_here') && !clerkKey.includes('sk_test_your');

  // For now, use demo auth (cookie-based)
  const demoRole = request.cookies.get(DEMO_AUTH_COOKIE)?.value;

  // Check protected admin/operator routes
  for (const prefix of PROTECTED_ROUTES) {
    if (pathname.startsWith(prefix)) {
      if (!demoRole) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check role-based access
      for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
        for (const route of routes) {
          if (pathname.startsWith(route) && demoRole !== role) {
            // Not authorized for this section
            return NextResponse.redirect(new URL('/', request.url));
          }
        }
      }
    }
  }

  // Check auth-required routes (any role)
  for (const prefix of AUTH_ROUTES) {
    if (pathname.startsWith(prefix) && !demoRole) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
