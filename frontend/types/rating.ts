export interface Rating {
  id: number;
  customer_name: string;
  review_date: string | null;
  rating: number;
  review_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
