import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getServices } from "@/lib/services";
import { getServiceCategories } from "@/lib/service-categories";
import { Service } from "@/types/service";

export const dynamic = "force-dynamic";

interface SearchParams {
  category?: string;
}

const ServicesPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const filters = await searchParams;

  let services: Service[] = [];
  let categories: { id: number; name: string; slug: string }[] = [];

  try {
    [services, categories] = await Promise.all([
      getServices(filters),
      getServiceCategories()
    ]);
  } catch (err) {
    // Fallback for when API is not available
  }

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />
      
      {/* Page Header */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 z-10"></div>
          {services.length > 0 && services[0].hero_image?.url ? (
            <img
              src={services[0].hero_image.url}
              alt="Designer Home Services"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/images/services-hero.jpg"
              alt="Designer Home Services"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-20">
          <h4 className="text-[#C59D5F] font-bold tracking-[0.3em] uppercase mb-4">Our Expertise</h4>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase leading-none mb-8">
            Our <span className="text-[#C59D5F]">Services</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
            From conceptualization to final execution, we provide end-to-end interior design solutions tailored to your unique lifestyle.
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-1 h-12 bg-gradient-to-b from-[#C59D5F] to-transparent rounded-full"></div>
        </div>
      </section>

      {/* Category Filters */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto pt-16 px-6">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-bold tracking-[0.15em] text-[10px] md:text-xs uppercase border-b border-neutral-200 pb-8">
            <Link 
              href="/services"
              className={`transition-all duration-300 hover:text-[#C59D5F] px-4 py-2 rounded-full border ${!filters.category ? 'text-white bg-[#C59D5F] border-[#C59D5F]' : 'text-gray-500 border-transparent hover:border-neutral-200'}`}
            >
              All Services
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/services?category=${cat.slug}`}
                className={`transition-all duration-300 hover:text-[#C59D5F] px-4 py-2 rounded-full border ${filters.category === cat.slug ? 'text-white bg-[#C59D5F] border-[#C59D5F]' : 'text-gray-500 border-transparent hover:border-neutral-200'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto py-24 px-6 text-center">
         <h2 className="text-3xl md:text-5xl font-black text-[#222] mb-8 tracking-tight uppercase">Excellence in <span className="text-[#C59D5F]">Every Detail</span></h2>
         <p className="text-lg md:text-xl text-[#666] leading-relaxed font-light">
           At Designer Home, we believe that great design is a dialogue between the space and its inhabitants. Our comprehensive suite of services ensures that every project we undertake is not only aesthetically stunning but also perfectly functional.
         </p>
      </section>

      {/* Services Detailed List */}
      {services.length > 0 ? (
        <section className="max-w-7xl mx-auto py-20 px-6 space-y-40">
          {services.map((service, idx) => (
            <div key={service.id} className={`flex flex-col lg:flex-row gap-16 lg:gap-24 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
               <div className="w-full lg:w-1/2 relative">
                  <div className="absolute -inset-4 md:-inset-8 bg-[#F9F9F9] rounded-[2rem] -z-10 transform scale-95 group-hover:scale-100 transition-transform duration-700"></div>
                  <div className="relative overflow-hidden rounded-[1.5rem] shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-[600px]">
                     <img 
                       src={service.thumbnail_image?.url || service.hero_image?.url || "/images/placeholder.jpg"} 
                       alt={service.title} 
                       className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000" 
                     />
                     <div className="absolute top-8 left-8 bg-[#C59D5F] text-white font-black text-2xl w-14 h-14 flex items-center justify-center rounded-xl shadow-lg">
                       {String(idx + 1).padStart(2, '0')}
                     </div>
                  </div>
               </div>
               <div className="w-full lg:w-1/2 space-y-8">
                  <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter leading-[1] uppercase">{service.title}</h2>
                  <div className="w-20 h-2 bg-[#C59D5F]"></div>
                  {service.subtitle && (
                    <p className="text-2xl text-[#C59D5F] font-bold italic">{service.subtitle}</p>
                  )}
                  <p className="text-xl text-[#555] leading-relaxed font-light">
                    {service.short_description || service.description}
                  </p>

                  {/* Why Choose Points */}
                  {service.why_choose?.points && service.why_choose.points.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {service.why_choose.points.map((point, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-[#C59D5F]"></div>
                           <span className="font-bold text-[#222] text-sm tracking-wide uppercase">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-8">
                     <Link href={`/services/${service.slug}`} className="inline-flex items-center group text-lg font-black text-[#222] tracking-widest uppercase hover:text-[#C59D5F] transition-colors">
                        Learn More
                        <span className="ml-4 w-10 h-[2px] bg-[#222] group-hover:bg-[#C59D5F] group-hover:w-16 transition-all duration-300"></span>
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

      {/* Our Process Section */}
      <section className="bg-[#111] py-32 px-6 mt-20">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
               <h4 className="text-[#C59D5F] font-bold tracking-[0.4em] uppercase text-sm mb-4">How We Work</h4>
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6">Our Design <span className="text-[#C59D5F]">Process</span></h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-12 relative">
               {/* Connector Line for Desktop */}
               <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[1px] bg-white/10 z-0"></div>
               
               {[
                 { title: "Discovery", desc: "Understanding your vision, budget, and project goals through initial consultations." },
                 { title: "Concept", desc: "Developing initial design directions and mood boards for your approval." },
                 { title: "Design", desc: "Finalizing 3D visuals, technical drawings, and material selection." },
                 { title: "Execution", desc: "Complete site supervision and delivery of your transformed space." },
               ].map((step, i) => (
                 <div key={i} className="relative z-10 text-center space-y-6 group">
                    <div className="w-[120px] h-[120px] bg-[#1a1a1a] border border-white/10 flex items-center justify-center rounded-full mx-auto group-hover:border-[#C59D5F] group-hover:bg-[#222] transition-all duration-500 shadow-2xl">
                       <span className="text-4xl font-black text-[#C59D5F]">{i + 1}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{step.title}</h3>
                    <p className="text-gray-400 font-light leading-relaxed px-4">{step.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6 overflow-hidden">
         <div className="absolute inset-x-0 top-0 h-4 bg-[#C59D5F]"></div>
         <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-4xl md:text-7xl font-black text-[#222] tracking-tighter uppercase leading-[0.9]">Start Your Interior <br/><span className="text-[#C59D5F]">Journey</span></h2>
            <p className="text-xl text-[#666] font-light max-w-2xl mx-auto">
               Ready to redefine your living experience? Let&apos;s discuss your project and create something extraordinary together.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="px-12 py-6 bg-[#222] text-white font-black tracking-[0.2em] uppercase rounded-xl hover:bg-[#C59D5F] transition-all transform hover:-translate-y-1 shadow-2xl inline-block">
                Get a Free Consultation
              </Link>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
