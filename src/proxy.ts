import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function proxy(req) {
    const isLoginPage = req.nextUrl.pathname === "/admin/login";
    const token = req.nextauth.token;

    // If user is logged in and trying to access login page, redirect to dashboard
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    const response = NextResponse.next();
    
    // Add cache headers for static assets
    const pathname = req.nextUrl.pathname;
    
    // Cache audio files for 1 year
    if (
      pathname.startsWith('/uploads/') ||
      pathname.startsWith('/api/music/serve/') ||
      pathname.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)
    ) {
      response.headers.set(
        'Cache-Control',
        'public, max-age=31536000, immutable'
      );
      response.headers.set('Accept-Ranges', 'bytes'); // Enable range requests for audio
    }
    
    // Cache images for 1 year
    if (
      pathname.startsWith('/images/') ||
      pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i)
    ) {
      response.headers.set(
        'Cache-Control',
        'public, max-age=31536000, immutable'
      );
    }
    
    // Cache fonts for 1 year
    if (pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
      response.headers.set(
        'Cache-Control',
        'public, max-age=31536000, immutable'
      );
    }
    
    // Cache other static assets for 1 week
    if (pathname.match(/\.(css|js|json)$/i)) {
      response.headers.set(
        'Cache-Control',
        'public, max-age=604800, stale-while-revalidate=86400'
      );
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login";
        const isPublicApi = req.nextUrl.pathname.startsWith("/api/guestbook") || 
                           req.nextUrl.pathname.startsWith("/api/wishes"); // Example public APIs

        // Allow access to login page and public APIs regardless of token
        if (isLoginPage || isPublicApi) return true;

        // Otherwise, require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*", 
    "/api/admin/:path*",
  ],
};
