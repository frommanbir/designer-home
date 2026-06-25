import { serverFetch } from "./server-api";
import { fetchApi } from "./api";
import { PortfolioCategory } from "@/types/portfolio-category";

/** Public storefront — SSR safe */
export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  const res = await serverFetch("/portfolio-categories");
  return res.data ?? [];
}

/** Admin — client-side auth needed */
export async function createPortfolioCategory(data: any): Promise<PortfolioCategory> {
  const res = await fetchApi("/admin/portfolio-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updatePortfolioCategory(id: number, data: any): Promise<PortfolioCategory> {
  const res = await fetchApi(`/admin/portfolio-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deletePortfolioCategory(id: number): Promise<void> {
  await fetchApi(`/admin/portfolio-categories/${id}`, { method: "DELETE" });
}
