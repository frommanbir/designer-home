import { fetchApi } from "./api";
import { Portfolio, PortfolioFilters } from "@/types/portfolio";

export async function getAdminPortfolios(): Promise<Portfolio[]> {
  const res = await fetchApi("/admin/portfolios");
  return res.data;
}

export async function createPortfolio(formData: FormData): Promise<Portfolio> {
  const res = await fetchApi("/admin/portfolios", {
    method: "POST",
    body: formData,
  });
  return res.data;
}

export async function updatePortfolio(id: number, formData: FormData): Promise<Portfolio> {
  // Use POST with _method=PUT because multipart/form-data doesn't work well with PUT in Laravel
  if (formData instanceof FormData) {
    formData.append("_method", "PUT");
  }
  
  const res = await fetchApi(`/admin/portfolios/${id}`, {
    method: "POST",
    body: formData,
  });
  return res.data;
}

export async function deletePortfolio(id: number): Promise<void> {
  await fetchApi(`/admin/portfolios/${id}`, {
    method: "DELETE",
  });
}

export async function getPortfolios(filters: PortfolioFilters = {}): Promise<Portfolio[]> {
  const query = new URLSearchParams();
  if (filters.category) query.append("category", filters.category);
  if (filters.search) query.append("search", filters.search);
  
  const queryString = query.toString();
  const endpoint = `/portfolios${queryString ? `?${queryString}` : ""}`;
  
  const res = await fetchApi(endpoint);
  return res.data;
}

export async function getPortfolioBySlug(slug: string): Promise<Portfolio> {
  const res = await fetchApi(`/portfolios/${slug}`);
  return res.data;
}
