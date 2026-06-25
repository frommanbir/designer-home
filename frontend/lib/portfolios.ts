import { serverFetch } from "./server-api";
import { fetchApi } from "./api";
import { Portfolio, PortfolioFilters } from "@/types/portfolio";

/** Public storefront — SSR safe */
export async function getPortfolios(filters: PortfolioFilters = {}): Promise<Portfolio[]> {
  const query = new URLSearchParams();
  if (filters.category) query.append("category", filters.category);
  if (filters.search) query.append("search", filters.search);
  const qs = query.toString();
  const res = await serverFetch(`/portfolios${qs ? `?${qs}` : ""}`);
  return res.data ?? [];
}

export async function getPortfolioBySlug(slug: string): Promise<Portfolio> {
  const res = await serverFetch(`/portfolios/${slug}`);
  return res.data;
}

/** Admin — client-side auth needed */
export async function getAdminPortfolios(): Promise<Portfolio[]> {
  const res = await fetchApi("/admin/portfolios");
  return res.data;
}

export async function createPortfolio(formData: FormData): Promise<Portfolio> {
  const res = await fetchApi("/admin/portfolios", { method: "POST", body: formData });
  return res.data;
}

export async function updatePortfolio(id: number, formData: FormData): Promise<Portfolio> {
  if (formData instanceof FormData) formData.append("_method", "PUT");
  const res = await fetchApi(`/admin/portfolios/${id}`, { method: "POST", body: formData });
  return res.data;
}

export async function deletePortfolio(id: number): Promise<void> {
  await fetchApi(`/admin/portfolios/${id}`, { method: "DELETE" });
}
