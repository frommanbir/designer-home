import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getServices } from "@/lib/services";
import { getServiceCategories } from "@/lib/service-categories";

interface SearchParams { category?: string; }

export const dynamic = "force-dynamic";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;

  const [services, categories] = await Promise.all([
    getServices(filters).catch(() => []),
    getServiceCategories().catch(() => []),
  ]);

  return (
    <div className="bg-white font-sans overflow-x-hidden">

      {/* Hero */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src="/images/about-home.png"
            alt="Services Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 flex flex-col items-center text-center px-6 animate-in fade-in slide-in-from-bottom-10 duration-[1500ms]">
          <h4 className="text-[#C59D5F] font-bold tracking-[0.3em] uppercase mb-4">Our Expertise</h4>
          <h1 className="text-white text-5xl md:text-8xl font-black tracking-tight uppercase leading-tight mb-8">
            Our <span className="text-[#C59D5F]">Services</span>
          </h1>
          <div className="w-20 h-1 bg-[#C59D5F] mb-8" />
          <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            From conceptualization to final execution, we provide end-to-end interior design solutions.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto pt-16 px-6">
          <div className="flex flex-wrap justify-center gap-4 font-bold tracking-[0.15em] text-xs uppercase border-b border-neutral-200 pb-8">
            <Link
              href="/services"
              className={`px-4 py-2 rounded-full border transition-all ${!filters.category ? "text-white bg-[#C59D5F] border-[#C59D5F]" : "text-gray-500 border-transparent hover:border-neutral-200"}`}
            >
              All Services
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/services?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full border transition-all ${filters.category === cat.slug ? "text-white bg-[#C59D5F] border-[#C59D5F]" : "text-gray-500 border-transparent hover:border-neutral-200"}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Services List */}
      {services.length > 0 ? (
        // <section className="max-w-7xl mx-auto py-20 px-6 space-y-40">
        <section className="relative h-[70vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden">
          {services.map((service: any, idx: number) => (
            <div key={service.id} className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}>
              <div className="w-full lg:w-1/2 relative">
                <div className="relative overflow-hidden rounded-[1.5rem] shadow-2xl aspect-[4/5] lg:h-[600px]">
                  <img
                    src={service.thumbnail_image?.url || service.hero_image?.url || "/images/placeholder.jpg"}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-8 left-8 bg-[#C59D5F] text-white font-black text-2xl w-14 h-14 flex items-center justify-center rounded-xl shadow-lg">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter uppercase leading-[1]">{service.title}</h2>
                <div className="w-20 h-2 bg-[#C59D5F]" />
                {service.subtitle && <p className="text-2xl text-[#C59D5F] font-bold italic">{service.subtitle}</p>}
                <p className="text-xl text-[#555] leading-relaxed font-light">{service.short_description || service.description}</p>
                <div className="pt-8">
                  <Link href={`/services/${service.slug}`} className="inline-flex items-center group text-lg font-black text-[#222] tracking-widest uppercase hover:text-[#C59D5F] transition-colors">
                    Learn More
                    <span className="ml-4 w-10 h-[2px] bg-[#222] group-hover:bg-[#C59D5F] group-hover:w-16 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="max-w-7xl mx-auto py-20 px-6">
          <div className="py-40 text-center border-2 border-dashed border-neutral-200 rounded-[3rem]">
            <h3 className="text-2xl font-light text-neutral-400 italic">Services are currently being curated.</h3>
          </div>
        </section>
      )}

      {/* CTA */}
      {/* <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-4 bg-[#C59D5F]" />
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-7xl font-black text-[#222] tracking-tighter uppercase leading-[0.9]">
            Start Your Interior <br /><span className="text-[#C59D5F]">Journey</span>
          </h2>
          <Link href="/contact" className="px-12 py-6 bg-[#222] text-white font-black tracking-[0.2em] uppercase rounded-xl hover:bg-[#C59D5F] transition-all transform hover:-translate-y-1 shadow-2xl inline-block">
            Get a Free Consultation
          </Link>
        </div>
      </section> */}
    </div>
  );
}