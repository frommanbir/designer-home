/**
 * Server-side API fetcher for use in Next.js Server Components.
 * Does NOT touch localStorage. Safe to call during SSR / SSG.
 */
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const API_URL = rawApiUrl.replace(/^https?:\/\/localhost(?=[:\/]|$)/i, (match) => {
  return match.replace("localhost", "127.0.0.1");
});

export async function serverFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  cacheOptions: NextFetchRequestConfig = { revalidate: 0 }
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    },
    next: cacheOptions,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${endpoint}`);
  }

  return res.json() as Promise<T>;
}