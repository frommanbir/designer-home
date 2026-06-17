export interface AboutFeatureIcon {
  url: string;
  // NOTE: the API docs only specify `icon` as "object" without listing its
  // keys. This assumes a typical Laravel media response shape ({ url, path }).
  // If the real response differs (e.g. icon.original_url, icon.full_path),
  // adjust this interface and the `icon?.url` access points in
  // AboutFeaturesManager.tsx to match.
  path?: string;
}

export interface AboutFeature {
  id: number;
  title: string;
  description: string | null;
  icon: AboutFeatureIcon | null;
  sort_order: number;
  is_active: boolean;
}

export interface AboutFeatureFormState {
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}