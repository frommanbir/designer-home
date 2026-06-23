export interface Blog {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  content: string | null;
  image_url: string | null;
  published_date: string;
  sort_order: number;
  is_active: boolean;
}

export interface BlogFormData {
  title: string;
  slug: string;
  short_description: string | null;
  content: string | null;
  image: File | null;
  published_date: string | null;
  sort_order: number;
  is_active: boolean;
}
