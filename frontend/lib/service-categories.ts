import { fetchApi } from "@/lib/api";

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const res = await fetchApi("/service-categories");
  return res.data;
}

export async function getAdminServiceCategories(): Promise<ServiceCategory[]> {
  const res = await fetchApi("/admin/service-categories");
  return res.data;
}

export async function createServiceCategory(data: { name: string; slug?: string }): Promise<ServiceCategory> {
  const res = await fetchApi("/admin/service-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateServiceCategory(id: number, data: { name: string; slug?: string }): Promise<ServiceCategory> {
  const res = await fetchApi(`/admin/service-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteServiceCategory(id: number): Promise<void> {
  await fetchApi(`/admin/service-categories/${id}`, { method: "DELETE" });
}