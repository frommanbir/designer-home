import { fetchApi } from "./api";
import { ContactInquiry } from "@/types/contact-inquiry";

export async function getContactInquiries() {
  const res = await fetchApi("/admin/contact-inquiries");
  return res.data as ContactInquiry[];
}

export async function getContactInquiry(id: number) {
  const res = await fetchApi(`/admin/contact-inquiries/${id}`);
  return res.data as ContactInquiry;
}

export async function updateContactInquiry(id: number, data: Partial<ContactInquiry>) {
  const res = await fetchApi(`/admin/contact-inquiries/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data as ContactInquiry;
}

export async function deleteContactInquiry(id: number) {
  const res = await fetchApi(`/admin/contact-inquiries/${id}`, {
    method: "DELETE",
  });
  return res;
}
