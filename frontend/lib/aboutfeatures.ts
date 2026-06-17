import { fetchApi } from "@/lib/api";
import type { AboutFeature } from "@/types/about-feature";

export async function getAboutFeatures(): Promise<AboutFeature[]> {
  const res = await fetchApi("/admin/about-features");
  return res.data as AboutFeature[];
}

export async function createAboutFeature(formData: FormData): Promise<AboutFeature> {
  const res = await fetchApi("/admin/about-features", {
    method: "POST",
    body: formData,
  });
  return res.data as AboutFeature;
}

export async function updateAboutFeature(id: number, formData: FormData): Promise<AboutFeature> {
  // Laravel/PHP does not reliably populate $_FILES (or parse the multipart
  // body at all) on a genuine PUT request. The standard workaround is to
  // POST and spoof the method via a `_method` field, which Laravel's router
  // reads to dispatch to the PUT route handler.
  formData.append("_method", "PUT");
  const res = await fetchApi(`/admin/about-features/${id}`, {
    method: "POST",
    body: formData,
  });
  return res.data as AboutFeature;
}

export async function deleteAboutFeature(id: number): Promise<void> {
  await fetchApi(`/admin/about-features/${id}`, {
    method: "DELETE",
  });
}