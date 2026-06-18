export interface ContactInquiry {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactInquiryResponse {
  success: boolean;
  message: string;
  data: ContactInquiry[] | ContactInquiry;
}
