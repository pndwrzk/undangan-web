/**
 * API Client with CSRF protection
 */

let csrfToken: string | null = null;

/**
 * Fetch CSRF token from server
 */
async function fetchCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch("/api/csrf");
    const data = await response.json();
    if (typeof data.token !== "string") {
      throw new Error("Invalid CSRF token response");
    }
    csrfToken = data.token;
    return data.token;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    throw new Error("Failed to fetch CSRF token");
  }
}

/**
 * Make API request with CSRF protection
 */
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = options.method?.toUpperCase() || "GET";

  // Add CSRF token for state-changing requests
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const token = await fetchCsrfToken();
    
    options.headers = {
      ...options.headers,
      "x-csrf-token": token,
    };
  }

  return fetch(url, options);
}

/**
 * Reset CSRF token (call this after logout or token expiry)
 */
export function resetCsrfToken() {
  csrfToken = null;
}
