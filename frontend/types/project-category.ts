export interface ProjectCategory {
  id: number;
  name: string;
  slug: string;
  hero_title?: string;
  hero_image?: {
    path: string;
    url: string;
  };
  subtitle?: string;
  description?: string;
}
