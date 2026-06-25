import { serverFetch } from "./server-api";
import { fetchApi } from "./api";

/** Public storefront — SSR safe */
export async function getRatings() {
  const res = await serverFetch("/ratings");
  return res.data ?? [];
}

/** Admin — client-side auth needed */
export async function getAdminRatings() {
  const res = await fetchApi("/admin/ratings");
  return res.data;
}

export async function createRating(data: any) {
  const res = await fetchApi("/admin/ratings", { method: "POST", body: JSON.stringify(data) });
  return res.data;
}

export async function updateRating(id: number, data: any) {
  const res = await fetchApi(`/admin/ratings/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return res.data;
}

export async function deleteRating(id: number) {
  await fetchApi(`/admin/ratings/${id}`, { method: "DELETE" });
}
