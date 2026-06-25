import { serverFetch } from "./server-api";
import { fetchApi } from "./api";
import { Project, ProjectFilters } from "@/types/project";

/** Public storefront — SSR safe */
export async function getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  const query = new URLSearchParams();
  if (filters.category) query.append("category", filters.category);
  if (filters.search) query.append("search", filters.search);
  const qs = query.toString();
  const res = await serverFetch(`/projects${qs ? `?${qs}` : ""}`);
  return res.data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const res = await serverFetch(`/projects/${slug}`);
  return res.data;
}

/** Admin — client-side auth needed */
export async function getAdminProjects(): Promise<Project[]> {
  const res = await fetchApi("/admin/projects");
  return res.data;
}

export async function createProject(formData: FormData): Promise<Project> {
  const res = await fetchApi("/admin/projects", { method: "POST", body: formData });
  return res.data;
}

export async function updateProject(id: number, formData: FormData): Promise<Project> {
  if (formData instanceof FormData) formData.append("_method", "PUT");
  const res = await fetchApi(`/admin/projects/${id}`, { method: "POST", body: formData });
  return res.data;
}

export async function deleteProject(id: number): Promise<void> {
  await fetchApi(`/admin/projects/${id}`, { method: "DELETE" });
}
