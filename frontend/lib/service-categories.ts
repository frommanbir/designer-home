import { fetchApi } from "./api";
import { ServiceCategory } from "@/types/service-category";

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const res = await fetchApi("/service-categories");
  return res.data;
}

export async function createServiceCategory(data: { name: string; slug?: string | null }): Promise<ServiceCategory> {
  const res = await fetchApi("/admin/service-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateServiceCategory(id: number, data: { name: string; slug?: string | null }): Promise<ServiceCategory> {
  const res = await fetchApi(`/admin/service-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteServiceCategory(id: number): Promise<void> {
  await fetchApi(`/admin/service-categories/${id}`, {
    method: "DELETE",
  });
}
