import Link from "next/link";
import { getServicesPageData } from "@/lib/services-page";
import { getServices } from "@/lib/services";
import { getServiceCategories } from "@/lib/service-categories";
import type { Service } from "@/types/service";
import type { ServiceCategory } from "@/types/service-category";

interface SearchParams {
  category?: string;
}

export const dynamic = "force-dynamic";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await searchParams (required in Next.js 15)
  const { category } = await searchParams;
  console.log("[ServicesPage] Received searchParams category:", category);

  const pageData = await getServicesPageData().catch(() => ({} as any));
  const heroData = {
    title:
      (pageData as any).service_hero_title ??
      (pageData as any).hero_title ??
      "Our Services",
    subtitle:
      (pageData as any).service_hero_subtitle ??
      (pageData as any).hero_subtitle ??
      "Our Expertise",
    description:
      (pageData as any).service_hero_description ??
      (pageData as any).hero_description ??
      "From conceptualization to final execution, we provide end-to-end interior design solutions.",
    image:
      (pageData as any).service_hero_image?.url ??
      (pageData as any).service_hero_image ??
      (pageData as any).hero_image?.url ??
      (pageData as any).hero_image ??
      "/images/about-home.png",
  } as {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: { url?: string | null } | string;
  };

  let allServices: Service[] = [];
  let categories: ServiceCategory[] = [];

  try {
    allServices = await getServices({ category });
    categories = await getServiceCategories();

    // Filter out inactive services in case the backend returns them
    allServices = allServices.filter((service) => service.is_active);
  } catch (err) {
    console.error("[ServicesPage] fetch error:", err);
  }

  const services = allServices;

  return (
    <div className="bg-white font-sans overflow-x-hidden">

      {/* Hero */}
      <section className="relative h-screen min-h-175 w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src={
              typeof heroData.image === "string"
                ? heroData.image
                : heroData.image?.url || "/images/about-home.png"
            }
            alt="Services Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 flex flex-col items-center text-center px-6 animate-in fade-in slide-in-from-bottom-10 duration-1500">
          <h4 className="text-[#C59D5F] font-bold tracking-[0.3em] uppercase mb-4">
            {heroData.subtitle || "Our Expertise"}
          </h4>
          <h1 className="text-white text-5xl md:text-8xl font-black tracking-tight uppercase leading-tight mb-8">
            {heroData.title || "Our Services"}
          </h1>
          <div className="w-20 h-1 bg-[#C59D5F] mb-8" />
          <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            {heroData.description ||
              "From conceptualization to final execution, we provide end-to-end interior design solutions."}
          </p>
        </div>
      </section>

      {/* Category Filters — always render the bar even if only "All" exists */}
      <section className="max-w-7xl mx-auto pt-16 px-6">
        <div className="flex flex-wrap justify-center gap-4 font-bold tracking-[0.15em] text-xs uppercase border-b border-neutral-200 pb-8">
          <Link
            href="/services"
            aria-current={!category ? "page" : undefined}
            className={`px-4 py-2 rounded-full border transition-all ${
              !category
                ? "text-white bg-[#C59D5F] border-[#C59D5F]"
                : "text-gray-500 border-neutral-200 hover:border-[#C59D5F] hover:text-[#C59D5F]"
            }`}
          >
            All Services
          </Link>
          {categories.map((cat) => {
            const isActive = category === cat.slug;
            console.log("[ServicesPage] Category button:", { name: cat.name, slug: cat.slug, active: isActive, paramCategory: category });
            return (
              <Link
                key={cat.id}
                href={`/services?category=${cat.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`px-4 py-2 rounded-full border transition-all ${
                  isActive
                    ? "text-white bg-[#C59D5F] border-[#C59D5F]"
                    : "text-gray-500 border-neutral-200 hover:border-[#C59D5F] hover:text-[#C59D5F]"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Services List */}
      {services.length > 0 ? (
        <section className="max-w-7xl mx-auto py-20 px-6 space-y-40">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`flex flex-col lg:flex-row gap-16 items-center ${
                idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full lg:w-1/2 relative">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-4/5 lg:h-150">
                  <img
                    src={
                      service.thumbnail_image?.url ||
                      service.hero_image?.url ||
                      "/images/placeholder.jpg"
                    }
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-8 left-8 bg-[#C59D5F] text-white font-black text-2xl w-14 h-14 flex items-center justify-center rounded-xl shadow-lg">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-8">
                {service.category && (
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C59D5F]">
                    {service.category.name}
                  </span>
                )}
                <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter uppercase leading-none">
                  {service.title}
                </h2>
                <div className="w-20 h-2 bg-[#C59D5F]" />
                {service.subtitle && (
                  <p className="text-2xl text-[#C59D5F] font-bold italic">
                    {service.subtitle}
                  </p>
                )}
                {(service.short_description || service.description) && (
                  <p className="text-xl text-[#555] leading-relaxed font-light">
                    {service.short_description || service.description}
                  </p>
                )}
                <div className="pt-8">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center group text-lg font-black text-[#222] tracking-widest uppercase hover:text-[#C59D5F] transition-colors"
                  >
                    Learn More
                    <span className="ml-4 w-10 h-0.5 bg-[#222] group-hover:bg-[#C59D5F] group-hover:w-16 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="max-w-7xl mx-auto py-20 px-6">
          <div className="py-40 text-center border-2 border-dashed border-neutral-200 rounded-[3rem]">
            {allServices.length > 0 ? (
              // We have services but none match this category
              <h3 className="text-2xl font-light text-neutral-400 italic">
                No services found in this category.
              </h3>
            ) : (
              // No services at all
              <h3 className="text-2xl font-light text-neutral-400 italic">
                Services are currently being curated.
              </h3>
            )}
          </div>
        </section>
      )}
    </div>
  );
}