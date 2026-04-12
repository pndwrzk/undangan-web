import { useEffect, useState } from "react";

export function useCsrf() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/csrf");
        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch CSRF token"));
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, []);

  return { token, loading, error };
}
