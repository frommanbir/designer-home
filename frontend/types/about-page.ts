import { AboutFeature } from "./about-feature";

export interface AboutPageData {
  hero: {
    image_url: string;
  };
  welcome: {
    subtitle: string;
    title: string;
    description: string;
  };
  main_about: {
    title: string;
    description_1: string;
    description_2: string;
    description_3: string;
    image_url: string;
  };
  why_choose_us: {
    title: string;
    features: AboutFeature[];
  };
}

export interface AboutPageResponse {
  success: boolean;
  message: string;
  data: AboutPageData;
}
