import { serverFetch } from "./server-api";
import { fetchApi } from "./api";

/** Public storefront — SSR safe */
export async function getAboutPageData() {
  const res = await serverFetch("/about-page");
  return res.data ?? {};
}

export async function getAboutFeatures() {
  const res = await serverFetch("/admin/about-features");
  return res.data ?? [];
}

/** Admin — client-side auth needed */
export async function updateAboutPage(formData: FormData) {
  const res = await fetchApi("/admin/about-page", { method: "POST", body: formData });
  return res.data;
}
