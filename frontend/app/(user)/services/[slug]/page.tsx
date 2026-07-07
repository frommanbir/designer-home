import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getServiceBySlug, getServicesPageData } from "@/lib/services";
import { serverFetch } from "@/lib/server-api";
import { Check } from "lucide-react";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { ServiceWhyChoose } from "@/types/service";

export const dynamic = "force-dynamic";

async function getSiteSettings() {
  try {
    const res = await serverFetch("/site-settings");
    return res.data ?? {};
  } catch {
    return {};
  }
}

function normalizeWhyChoose(wc: any): ServiceWhyChoose[] {
  if (!wc) return [];
  if (Array.isArray(wc)) return wc.filter(Boolean);
  if (wc.title || wc.description || wc.points?.length) return [wc];
  return [];
}

const ServiceDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // Parallel fetch: Current service, site settings, and services page hero
  const [service, settings, servicesPage] = await Promise.all([
    getServiceBySlug(slug).catch(() => null),
    getSiteSettings(),
    getServicesPageData().catch(() => ({})),
  ]);

  if (!service) return notFound();

  const whyChooseSections = normalizeWhyChoose(service.why_choose);
  const primaryImage = service.hero_image?.url || "/images/placeholder.jpg";

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen">
      <Navbar transparent={true} settings={settings} />

      {/* ── 1. Page Hero (Top) ── */}
      <section className="relative h-[70vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <Image
            src={
              (servicesPage as any)?.hero?.image?.url ||
              "/images/about-home.png"
            }
            alt="Designer Home Services Hero"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute bottom-0 z-20 left-0 w-full px-6">
          <h1 className="text-white text-5xl md:text-7xl font-light tracking-tight leading-[0.95] max-w-5xl">
            {(servicesPage as any)?.hero?.title ||
              "Creating Spaces Without Compromise"}
          </h1>
          <div className="mt-6 h-[3px] w-full max-w-[500px] bg-white"></div>
        </div>
      </section>

      {/* ── 2. Main Content (Single Column, Centered) ── */}
      <main className="bg-white py-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-16 lg:space-y-24">
          {/* Header Section (Centered) */}
          <div className="text-center space-y-4">
            <h1 className="text-gray-700 text-4xl md:text-6xl font-black uppercase tracking-wider">
              {service.title}
            </h1>
            {service.subtitle && (
              <h2 className="text-neutral-500 text-xl font-baumans md:text-2xl font-bold tracking-tight">
                {service.subtitle}
              </h2>
            )}
          </div>

          {/* Description Paragraph (Centered) */}
          {(service.description || service.short_description) && (
            <div className="max-w-5xl mx-auto text-justify px-4">
              <p className="text-neutral-600 font-baumans text-sm md:text-lg leading-relaxed font-normal whitespace-pre-line text-justify md:text-justify">
                {service.description || service.short_description}
              </p>
            </div>
          )}

          {/* Service Primary Image (Big & Centered) */}
          <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-neutral-100">
            <Image
              src={primaryImage}
              alt={service.title}
              width={1200}
              height={675}
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>

          {/* Why Choose Us Sections (Alternating Layout) */}
          {whyChooseSections.map((wc, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <section
                key={idx}
                className="bg-neutral-50/50 rounded-[3rem] p-10 lg:p-20 group"
              >
                <div
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${!isEven ? "lg:direction-rtl" : ""}`}
                >
                  {/* Section Image */}
                  <div
                    className={`relative ${!isEven ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <div className="absolute -inset-4 bg-[#C59D5F]/5 rounded-[2.5rem] rotate-1 group-hover:rotate-0 transition-transform duration-700" />
                    {wc.image?.url ? (
                      <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/3] lg:aspect-square">
                        <Image
                          src={wc.image.url}
                          alt="Why Choose"
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="relative h-[400px] bg-white rounded-2xl border border-neutral-100 flex items-center justify-center">
                        <span className="text-[#C59D5F] text-6xl font-black opacity-10">
                          ✦
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Section Content & Checklist */}
                  <div
                    className={`space-y-10 ${!isEven ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <div className="space-y-4">
                      <h3 className="text-gray-900 text-3xl font-black tracking-tight leading-tight uppercase">
                        {wc.title || `Why Choose Our ${service.title}?`}
                      </h3>
                      {wc.description && (
                        <p className="text-neutral-600 text-lg font-light leading-relaxed">
                          {wc.description}
                        </p>
                      )}
                    </div>

                    {wc.points && wc.points.length > 0 && (
                      <div className="space-y-4">
                        {wc.points.map((point, pi) => (
                          <div key={pi} className="flex items-start gap-4">
                            <div className="mt-1.5 w-4 h-4 shrink-0 bg-neutral-900 rounded-full flex items-center justify-center text-white">
                              <Check size={8} strokeWidth={4} />
                            </div>
                            <span className="text-neutral-700 font-baumans text-sm md:text-base font-medium leading-tight">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}

          {/* GALLERY REMOVED PER USER REQUEST */}
        </div>
      </main>
    </div>
  );
};

export default ServiceDetailPage;
