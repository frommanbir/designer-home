import { fetchApi } from "./api";
import { ProjectCategory } from "@/types/project-category";

export async function getProjectCategories(): Promise<ProjectCategory[]> {
  const res = await fetchApi("/project-categories");
  return res.data;
}

export async function getAdminProjectCategories(): Promise<ProjectCategory[]> {
  const res = await fetchApi("/admin/project-categories");
  return res.data;
}

export async function createProjectCategory(data: any): Promise<ProjectCategory> {
  const res = await fetchApi("/admin/project-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateProjectCategory(id: number, data: any): Promise<ProjectCategory> {
  const res = await fetchApi(`/admin/project-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteProjectCategory(id: number): Promise<void> {
  await fetchApi(`/admin/project-categories/${id}`, {
    method: "DELETE",
  });
}
