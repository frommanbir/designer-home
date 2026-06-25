import { serverFetch } from "./server-api";
import { fetchApi } from "./api";
import { ProjectCategory } from "@/types/project-category";

/** Public storefront — SSR safe */
export async function getProjectCategories(): Promise<ProjectCategory[]> {
  const res = await serverFetch("/project-categories");
  return res.data ?? [];
}

/** Admin — client-side auth needed */
export async function getAdminProjectCategories(): Promise<ProjectCategory[]> {
  const res = await fetchApi("/admin/project-categories");
  return res.data;
}

export async function createProjectCategory(data: any): Promise<ProjectCategory> {
  const res = await fetchApi("/admin/project-categories", {
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
  return res.data;
}

export async function updateProjectCategory(id: number, data: any): Promise<ProjectCategory> {
  // If editing with files, we must use POST + _method: "PUT"
  const isFormData = data instanceof FormData;
  if (isFormData && !data.has("_method")) {
    data.append("_method", "PUT");
  }
  const res = await fetchApi(`/admin/project-categories/${id}`, {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
  });
  return res.data;
}

export async function deleteProjectCategory(id: number): Promise<void> {
  await fetchApi(`/admin/project-categories/${id}`, { method: "DELETE" });
}
