import { fetchApi } from "@/lib/api";
import { AboutPageResponse, AboutPageData } from "@/types/about-page";

export async function getAboutPageData(): Promise<AboutPageData> {
  const res: AboutPageResponse = await fetchApi("/about-page");
  return res.data;
}
