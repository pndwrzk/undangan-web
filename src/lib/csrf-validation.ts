import { NextResponse } from "next/server";
import { verifyCsrfTokenInRoute } from "./csrf";

/**
 * Validate CSRF token for API routes
 * Returns error response if invalid, null if valid
 */
export async function validateCsrfForRoute(request: Request): Promise<NextResponse | null> {
  const method = request.method;

  // Only validate for state-changing methods
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    return null;
  }

  // Skip CSRF for NextAuth endpoints
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/auth/")) {
    return null;
  }

  // Verify token
  const isValid = await verifyCsrfTokenInRoute(request);

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid CSRF token" },
      { status: 403 }
    );
  }

  return null;
}
