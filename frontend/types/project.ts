import { ProjectCategory } from "./project-category";

export interface Project {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  short_description: string | null;
  description: string | null;
  thumbnail_image_url: string | null;
  hero_image_url: string | null;
  gallery_image_urls: string[];
  sort_order: number;
  is_active: boolean;
  category: ProjectCategory | null;
  project_category_id?: number | null;
}

export interface ProjectFormData {
  project_category_id: number | null;
  title: string;
  slug: string;
  subtitle: string | null;
  short_description: string | null;
  description: string | null;
  thumbnail_image: File | null;
  hero_image: File | null;
  sort_order: number;
  is_active: boolean;
  gallery_images: File[];
}

export interface ProjectFilters {
  category?: string;
  search?: string;
}
