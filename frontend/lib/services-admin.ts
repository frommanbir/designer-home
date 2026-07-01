import { fetchApi } from "@/lib/api";
import type { ServiceCategory } from "@/lib/service-categories";

export interface ServiceImage {
  url: string;
}

export interface WhyChoose {
  title?: string | null;
  description?: string | null;
  points?: string[];
  image?: ServiceImage | null;
}

export interface Service {
  id: number;
  category?: ServiceCategory | null;
  title: string;
  slug: string;
  subtitle?: string | null;
  short_description?: string | null;
  description?: string | null;
  thumbnail_image?: ServiceImage;
  hero_image?: ServiceImage;
  gallery_images?: ServiceImage[];
  why_choose?: WhyChoose;
  sort_order: number;
  is_active: boolean;
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
  formData.append("_method", "PUT");
  const res = await fetchApi(`/admin/services/${id}`, {
    method: "POST",
    body: formData,
  });
  return res.data;
}

export async function deleteService(id: number): Promise<void> {
  await fetchApi(`/admin/services/${id}`, { method: "DELETE" });
}