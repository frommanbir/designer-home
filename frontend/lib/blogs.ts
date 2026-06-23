import { fetchApi } from "./api";
import { Blog } from "@/types/blog";

export async function getBlogs(): Promise<Blog[]> {
  const res = await fetchApi("/blogs");
  return res.data;
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const res = await fetchApi(`/blogs/${slug}`);
  return res.data;
}

export async function getAdminBlogs(): Promise<Blog[]> {
  const res = await fetchApi("/admin/blogs");
  return res.data;
}

export async function createBlog(formData: FormData): Promise<Blog> {
  const res = await fetchApi("/admin/blogs", {
    method: "POST",
    body: formData,
  });
  return res.data;
}

export async function updateBlog(id: number, formData: FormData): Promise<Blog> {
  if (formData instanceof FormData) {
    formData.append("_method", "PUT");
  }
  const res = await fetchApi(`/admin/blogs/${id}`, {
    method: "POST",
    body: formData,
  });
  return res.data;
}

export async function deleteBlog(id: number): Promise<void> {
  await fetchApi(`/admin/blogs/${id}`, {
    method: "DELETE",
  });
}
