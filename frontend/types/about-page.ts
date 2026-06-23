import { AboutFeature } from "./about-feature";

export interface AboutPageData {
  hero: {
    title: string | null;
    image: {
      path: string | null;
      url: string | null;
    };
  };
  welcome: {
    title: string | null;
    description: string | null;
  };
  main_about: {
    title: string | null;
    description: string | null;
    image: {
      path: string | null;
      url: string | null;
    };
  };
  why_choose_us: {
    title: string | null;
    description: string | null;
    features: AboutFeature[];
  };
}

export interface AboutPageResponse {
  success: boolean;
  message: string;
  data: AboutPageData;
}
