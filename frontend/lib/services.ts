import { fetchApi } from "./api";
import { Service, ServiceFilters } from "@/types/service";

export async function getServices(filters: ServiceFilters = {}): Promise<Service[]> {
  const query = new URLSearchParams();
  if (filters.category) query.append("category", filters.category);

  const queryString = query.toString();
  const endpoint = `/services${queryString ? `?${queryString}` : ""}`;

  const res = await fetchApi(endpoint);
  return res.data;
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const res = await fetchApi(`/services/${slug}`);
  return res.data;
}

export async function getAdminServices(): Promise<Service[]> {
  const res = await fetchApi("/admin/services");
  return res.data;
}

export async function createService(formData: FormData): Promise<Service> {
  const res = await fetchApi("/admin/services", {
    method: "POST",
    body: formData,
  });
  return res.data;
}

export async function updateService(id: number, formData: FormData): Promise<Service> {
  // Use POST with _method=PUT because multipart/form-data doesn't work well with PUT in Laravel
  if (formData instanceof FormData) {
    formData.append("_method", "PUT");
  }
  const res = await fetchApi(`/admin/services/${id}`, {
    method: "POST",
    body: formData,
  });
  return res.data;
}

export async function deleteService(id: number): Promise<void> {
  await fetchApi(`/admin/services/${id}`, {
    method: "DELETE",
  });
}
