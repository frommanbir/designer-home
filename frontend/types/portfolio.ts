import { PortfolioCategory } from "./portfolio-category";

export interface Portfolio {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  main_image_url: string | null;
  gallery_image_urls: string[];
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  category: PortfolioCategory | null;
  portfolio_category_id?: number | null;
}

export interface PortfolioFormData {
  portfolio_category_id: number | null;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  main_image: File | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  gallery_images: File[];
}

export interface PortfolioFilters {
  category?: string;
  search?: string;
}

