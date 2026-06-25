import { serverFetch } from "./server-api";
import { fetchApi } from "./api";

export async function getServicesPageData() {
  const res = await serverFetch("/site-settings");
  return (res as any).data ?? res;
}

export async function updateServicesPage(formData: FormData) {
  const res = await fetchApi("/admin/site-settings", {
    method: "POST",
    body: formData,
  });
  return res.data ?? res;
}
