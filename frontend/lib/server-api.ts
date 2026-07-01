const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const API_URL = rawApiUrl.replace(/^https?:\/\/localhost(?=[:\/]|$)/i, (match) => {
  return match.replace("localhost", "127.0.0.1");
});

export async function serverFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Server request failed");
  }

  return data;
}
