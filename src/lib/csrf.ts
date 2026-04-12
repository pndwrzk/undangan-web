import { cookies } from "next/headers";
import crypto from "crypto";

const CSRF_TOKEN_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Set CSRF token in cookie
 */
export async function setCsrfToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

/**
 * Get CSRF token from cookie
 */
export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_TOKEN_NAME)?.value;
}

/**
 * Get CSRF token for client-side use
 */
export async function getClientCsrfToken(): Promise<string> {
  let token = await getCsrfToken();
  
  if (!token) {
    token = generateCsrfToken();
    await setCsrfToken(token);
  }
  
  return token;
}

/**
 * Verify CSRF token from request (for use in API routes)
 */
export async function verifyCsrfTokenInRoute(request: Request): Promise<boolean> {
  try {
    // Get token from header
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    
    // Get token from cookie
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;

    // Both must exist and match
    if (!headerToken || !cookieToken) {
      return false;
    }

    // Use timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(headerToken),
      Buffer.from(cookieToken)
    );
  } catch (error) {
    console.error("CSRF verification error:", error);
    return false;
  }
}
