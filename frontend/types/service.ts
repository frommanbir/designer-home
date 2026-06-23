import { ServiceCategory } from "./service-category";

export interface ServiceImage {
  url: string | null;
  thumbnail_url?: string | null;
}

export interface ServiceWhyChoose {
  title: string | null;
  description: string | null;
  image: ServiceImage | null;
  points: string[];
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  short_description: string | null;
  description: string | null;
  thumbnail_image: ServiceImage;
  hero_image: ServiceImage;
  gallery_images: ServiceImage[];
  why_choose: ServiceWhyChoose;
  sort_order: number;
  is_active: boolean;
  category: ServiceCategory | null;
  service_category_id?: number | null;
}

export interface ServiceFilters {
  category?: string;
}
