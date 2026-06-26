import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getServiceBySlug } from "@/lib/services";
import { ArrowLeft, Maximize2 } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const ServiceDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  let service;
  try {
    service = await getServiceBySlug(slug);
  } catch (err) {
    return notFound();
  }

  if (!service) return notFound();

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen">

      {/* Hero Section */}
      {/* <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center"> */}
      <section className="relative h-[70vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10"></div>
          <img
            src={service.hero_image?.url || service.thumbnail_image?.url || "/images/placeholder.jpg"}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
          <Link
            href="/services"
            className="inline-flex items-center gap-3 text-white/80 hover:text-white font-black text-xs uppercase tracking-[0.3em] mb-12 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>All Services</span>
          </Link>

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
            {service.title.split(' ').slice(0, 2).join(' ')} <br />
            <span className="text-[#C59D5F]">{service.title.split(' ').slice(2).join(' ') || 'Design'}</span>
          </h2>
          {service.short_description && (
            <p className="text-xl text-[#C59D5F] font-bold italic">
              {service.short_description}
            </p>
          )}
          <div className="text-xl text-[#555] leading-relaxed font-light whitespace-pre-line">
            {service.description}
          </div>
          <div className="flex items-center gap-4 pt-4">
            <div className="w-16 h-16 bg-[#C59D5F]/10 rounded-full flex items-center justify-center text-[#C59D5F] font-black text-2xl italic">DH</div>
            <p className="text-lg font-bold text-[#222]">&quot;Design is not just what it looks like, <br />it&apos;s how it makes you feel.&quot;</p>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#C59D5F]/5 rounded-[2rem] transform rotate-3 scale-95 group-hover:scale-100 transition-all duration-700"></div>
          <img
            src={service.thumbnail_image?.url || service.hero_image?.url || "/images/placeholder.jpg"}
            alt={service.title}
            className="relative rounded-[1.5rem] shadow-2xl w-full h-[500px] object-cover"
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      {service.why_choose && (service.why_choose.title || (service.why_choose.points && service.why_choose.points.length > 0)) && (
        <section className="bg-[#F9F9F9] py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter uppercase">
                  {service.why_choose.title || "Why Choose"} <span className="text-[#C59D5F]">Us</span>
                </h2>
                <div className="w-24 h-2 bg-[#C59D5F]"></div>
                {service.why_choose.description && (
                  <p className="text-xl text-[#555] leading-relaxed font-light whitespace-pre-line">
                    {service.why_choose.description}
                  </p>
                )}
                {service.why_choose.points && service.why_choose.points.length > 0 && (
                  <div className="space-y-6 pt-4">
                    {service.why_choose.points.map((point, i) => (
                      <div key={i} className="flex items-center gap-4 group/item">
                        <div className="w-10 h-10 bg-[#C59D5F]/10 rounded-xl flex items-center justify-center text-[#C59D5F] font-black text-sm group-hover/item:bg-[#C59D5F] group-hover/item:text-white transition-colors">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <span className="font-bold text-[#222] text-lg tracking-tight">{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {service.why_choose.image?.url ? (
                <div className="relative group">
                  <div className="absolute -inset-4 bg-[#C59D5F]/10 rounded-[2rem] transform -rotate-3 scale-95 group-hover:scale-100 transition-all duration-700"></div>
                  <img
                    src={service.why_choose.image.url}
                    alt="Why Choose Us"
                    className="relative rounded-[1.5rem] shadow-2xl w-full h-[500px] object-cover"
                  />
                </div>
              ) : (
                <div className="bg-[#222] rounded-[2rem] p-12 md:p-16 text-center space-y-8">
                  <div className="w-24 h-24 bg-[#C59D5F]/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-[#C59D5F] text-5xl font-black">✦</span>
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">Excellence Guaranteed</h3>
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
      {service.gallery_images && service.gallery_images.length > 0 && (
        <section className="py-32 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-20">
              <h4 className="text-[#C59D5F] font-bold tracking-[0.4em] uppercase text-sm mb-4">Visual Showcase</h4>
              <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter uppercase">
                Project <span className="text-[#C59D5F]">Gallery</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {service.gallery_images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative group overflow-hidden rounded-3xl bg-neutral-200 aspect-[4/5] shadow-lg ${idx % 2 === 1 ? 'md:translate-y-12' : ''}`}
                >
                  <img
                    src={img.url || "/images/placeholder.jpg"}
                    alt={`${service.title} Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={32} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetailPage;
