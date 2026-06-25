/**
 * Server-side API fetcher for use in Next.js Server Components.
 * Does NOT touch localStorage. Safe to call during SSR / SSG.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function serverFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    },
    // By default, Next.js caches fetch() results.
    // Use `next: { revalidate: 60 }` to ISR-revalidate every 60 seconds.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    // Return empty/null gracefully so pages can show fallback UI
    throw new Error(`API error ${res.status} on ${endpoint}`);
  }

  return res.json() as Promise<T>;
}
