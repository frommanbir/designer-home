import { serverFetch } from "./server-api";

export async function getSiteSettings() {
  try {
    const res = await serverFetch("/site-settings");
    return res.data ?? {};
  } catch (err) {
    console.error("Failed to fetch site settings:", err);
    return {};
  }
}
