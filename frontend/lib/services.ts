import { serverFetch } from "./server-api";
import { fetchApi } from "./api";
import { Service, ServiceFilters } from "@/types/service";

/** Public storefront — SSR safe */
export async function getServices(filters: ServiceFilters = {}): Promise<Service[]> {
  const query = new URLSearchParams();
  if (filters.category) query.append("category", filters.category);
  const qs = query.toString();
  const res = await serverFetch(`/services${qs ? `?${qs}` : ""}`);
  return res.data ?? [];
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const res = await serverFetch(`/services/${slug}`);
  return res.data;
}

/** Admin — client-side auth needed */
export async function getAdminServices(): Promise<Service[]> {
  const res = await fetchApi("/admin/services");
  return res.data;
}

export async function createService(formData: FormData): Promise<Service> {
  const res = await fetchApi("/admin/services", { method: "POST", body: formData });
  return res.data;
}

export async function updateService(id: number, formData: FormData): Promise<Service> {
  const res = await fetchApi(`/admin/services/${id}`, { method: "PUT", body: formData });
  return res.data;
}

export async function deleteService(id: number): Promise<void> {
  await fetchApi(`/admin/services/${id}`, { method: "DELETE" });
}
