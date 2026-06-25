import React from "react";
import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import { ArrowLeft } from "lucide-react";
import ServiceGallery from "@/components/ServiceGallery";
import { notFound } from "next/navigation";

interface WhyChoose {
  title: string | null;
  description: string | null;
  image: { path?: string | null; url?: string | null } | null;
  points: string[] | null;
}

interface Service {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  short_description: string | null;
  description: string | null;
  category: { id: number; name: string; slug: string } | null;
  thumbnail_image: { path: string | null; url: string | null } | null;
  hero_image: { path: string | null; url: string | null } | null;
  gallery_images: { path: string; url: string | null }[] | null;
  why_choose: WhyChoose | null;
  sort_order: number;
  is_active: boolean;
}

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let service: Service;
  try {
    const res = await serverFetch<{ success: boolean; data: Service }>(`/services/${slug}`);

    // Handle both { success, data } and raw object shapes
    const rawData = (res as any).data ?? res;

    if (!rawData || !(rawData as any).id) return notFound();
    service = rawData as Service;
  } catch (err) {
    console.error("[ServiceDetailPage] fetch error:", err);
    return notFound();
  }

  // Normalise potentially-null nested fields so JSX never crashes
  const galleryImages = service.gallery_images ?? [];
  const whyChoose = service.why_choose ?? null;
  const whyPoints: string[] = whyChoose?.points?.filter(Boolean) ?? [];
  const hasWhyChoose =
    whyChoose && (whyChoose.title || whyChoose.description || whyPoints.length > 0);

  const titleWords = service.title.split(" ");
  const titlePart1 = titleWords.slice(0, 2).join(" ");
  const titlePart2 = titleWords.slice(2).join(" ") || "Design";

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-[75vh] sm:min-h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10" />
          <img
            src={
              service.hero_image?.url ||
              service.thumbnail_image?.url ||
              "/images/placeholder.jpg"
            }
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-6 left-6 z-20 py-20">
          <Link
            href="/services"
            className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-white text-xs uppercase tracking-[0.3em] shadow-lg backdrop-blur-sm transition hover:bg-black/60"
          >
            <ArrowLeft size={16} />
            <span>All Services</span>
          </Link>
        </div>
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
          {service.category && (
            <h4 className="text-[#C59D5F] font-black tracking-[0.3em] uppercase text-sm mb-4">
              {service.category.name}
            </h4>
          )}
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8 shadow-sm">
            {service.title}
          </h1>
          {service.subtitle && (
            <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto drop-shadow-md italic">
              &quot;{service.subtitle}&quot;
            </p>
          )}
        </div>
      </section>

      {/* Description Section */}
      <section className="max-w-7xl mx-auto py-28 px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter leading-tight uppercase">
            {titlePart1}{" "}
            <br />
            <span className="text-[#C59D5F]">{titlePart2}</span>
          </h2>
          {service.short_description && (
            <p className="text-xl text-[#C59D5F] font-bold italic">
              {service.short_description}
            </p>
          )}
          {service.description && (
            <div className="text-xl text-[#555] leading-relaxed font-light whitespace-pre-line">
              {service.description}
            </div>
          )}
          <div className="flex items-center gap-4 pt-4">
            <div className="w-16 h-16 bg-[#C59D5F]/10 rounded-full flex items-center justify-center text-[#C59D5F] font-black text-2xl italic">
              DH
            </div>
            <p className="text-lg font-bold text-[#222]">
              &quot;Design is not just what it looks like,{" "}
              <br />
              it&apos;s how it makes you feel.&quot;
            </p>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#C59D5F]/5 rounded-[2rem] transform rotate-3 scale-95 group-hover:scale-100 transition-all duration-700" />
          <img
            src={
              service.thumbnail_image?.url ||
              service.hero_image?.url ||
              "/images/placeholder.jpg"
            }
            alt={service.title}
            className="relative rounded-[1.5rem] shadow-2xl w-full h-[320px] md:h-[500px] object-cover"
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      {hasWhyChoose && (
        <section className="bg-[#F9F9F9] py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter uppercase">
                  {whyChoose!.title || "Why Choose"}{" "}
                  <span className="text-[#C59D5F]">Us</span>
                </h2>
                <div className="w-24 h-2 bg-[#C59D5F]" />
                {whyChoose!.description && (
                  <p className="text-xl text-[#555] leading-relaxed font-light whitespace-pre-line">
                    {whyChoose!.description}
                  </p>
                )}
                {whyPoints.length > 0 && (
                  <div className="space-y-6 pt-4">
                    {whyPoints.map((point, i) => (
                      <div key={i} className="flex items-center gap-4 group/item">
                        <div className="w-10 h-10 bg-[#C59D5F]/10 rounded-xl flex items-center justify-center text-[#C59D5F] font-black text-sm group-hover/item:bg-[#C59D5F] group-hover/item:text-white transition-colors shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <span className="font-bold text-[#222] text-lg tracking-tight">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {whyChoose!.image?.url ? (
                <div className="relative group">
                  <div className="absolute -inset-4 bg-[#C59D5F]/10 rounded-[2rem] transform -rotate-3 scale-95 group-hover:scale-100 transition-all duration-700" />
                  <img
                    src={whyChoose!.image.url}
                    alt="Why Choose Us"
                    className="relative rounded-[1.5rem] shadow-2xl w-full h-[320px] md:h-[500px] object-cover"
                  />
                </div>
              ) : (
                <div className="bg-[#222] rounded-[2rem] p-12 md:p-16 text-center space-y-8">
                  <div className="w-24 h-24 bg-[#C59D5F]/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-[#C59D5F] text-5xl font-black">✦</span>
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                    Excellence Guaranteed
                  </h3>
                  <p className="text-gray-400 font-light text-lg leading-relaxed">
                    Every project receives our full dedication, craftsmanship, and attention to detail.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-32 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-20">
              <h4 className="text-[#C59D5F] font-bold tracking-[0.4em] uppercase text-sm mb-4">
                Visual Showcase
              </h4>
              <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter uppercase">
                Project <span className="text-[#C59D5F]">Gallery</span>
              </h2>
            </div>

            <ServiceGallery images={galleryImages} title={service.title} />
          </div>
        </section>
      )}
    </div>
  );
}