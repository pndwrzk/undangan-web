import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isLoginPage = req.nextUrl.pathname === "/admin/login";
    const token = req.nextauth.token;

    // If user is logged in and trying to access login page, redirect to dashboard
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
