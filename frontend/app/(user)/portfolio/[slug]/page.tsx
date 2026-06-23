import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getPortfolioBySlug } from "@/lib/portfolios";
import { ArrowLeft, Maximize2, Share2 } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { notFound } from "next/navigation";

const PortfolioDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  
  let portfolio;
  try {
    portfolio = await getPortfolioBySlug(slug);
  } catch (err) {
    return notFound();
  }

  if (!portfolio) return notFound();

  return (
    <div className="bg-[#0A0A0A] font-sans overflow-x-hidden min-h-screen text-white">
      <Navbar transparent={true} />

      {/* Hero Section - Full Screen Header */}
      <section className="relative h-[85vh] w-full flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0A0A0A] z-10"></div>
          <img 
            src={portfolio.main_image_url || "/images/placeholder.jpg"} 
            alt={portfolio.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 max-w-[1600px] mx-auto w-full px-6 pb-20">
          <Link 
            href="/portfolio" 
            className="group flex items-center gap-3 text-[#C59D5F] font-bold text-xs uppercase tracking-widest mb-10 w-max"
          >
            <div className="w-8 h-[1px] bg-[#C59D5F] group-hover:w-12 transition-all"></div>
            <span>Back to Collection</span>
          </Link>
          
          <div className="max-w-4xl">
            <span className="text-[#C59D5F] font-black tracking-[0.4em] uppercase text-xs md:text-sm mb-6 block">
              {portfolio.category?.name || "Bespoke Design"}
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-8">
              {portfolio.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Project details & description */}
      <section className="max-w-[1600px] mx-auto py-32 px-6">
        <div className="grid lg:grid-cols-12 gap-20">
          {/* Left Column: Project Info */}
          <div className="lg:col-span-4 space-y-12">
            <div className="border-l-4 border-[#C59D5F] pl-8 py-2">
              <h4 className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-2">Location</h4>
              <p className="text-xl font-bold">Kathmandu, Nepal</p>
            </div>
            
            <div className="border-l-4 border-white/10 pl-8 py-2">
              <h4 className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-2">Completion</h4>
              <p className="text-xl font-bold">2026</p>
            </div>

            <div className="pt-10 flex gap-6">
              <button className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#C59D5F] transition-all group">
                <Share2 size={20} className="group-hover:text-black" />
              </button>
              <button className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#C59D5F] transition-all group">
                <FaInstagram size={20} className="group-hover:text-black" />
              </button>
            </div>
          </div>

          {/* Right Column: Description */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-10 text-[#C59D5F] tracking-wide">
              The Vision
            </h2>
            <div className="text-gray-300 text-lg md:text-xl font-light leading-relaxed space-y-8 whitespace-pre-line">
              {portfolio.description}
            </div>
            
            {portfolio.short_description && (
              <div className="mt-16 bg-[#111] p-10 rounded-2xl border border-white/5 italic text-gray-400 text-xl font-light border-l-[6px] border-l-[#C59D5F]">
                "{portfolio.short_description}"
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery - Large showcase */}
      <section className="py-20 lg:pb-40">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Gallery <span className="text-[#C59D5F]">Vignettes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {portfolio.gallery_image_urls && portfolio.gallery_image_urls.length > 0 ? (
              portfolio.gallery_image_urls.map((url, idx) => (
                <div 
                  key={idx} 
                  className={`relative group overflow-hidden rounded-3xl bg-[#111] ${idx % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-square'}`}
                >
                  <img 
                    src={url} 
                    alt={`Gallery ${idx}`} 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700"></div>
                  <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    <Maximize2 size={20} />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-40 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-600">
                <h4 className="text-xl font-light italic">Detailed gallery images coming soon.</h4>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Next Project Mockup */}
      <section className="h-[50vh] bg-neutral-900 border-t border-white/5 relative group cursor-pointer overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <p className="text-[#C59D5F] font-bold text-xs uppercase tracking-[0.5em] mb-4">Up Next</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter group-hover:scale-110 transition-transform duration-700">View Another Project</h2>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/80 group-hover:bg-black/60 transition-all duration-700 z-10"></div>
      </section>

      <Footer />
    </div>
  );
};

export default PortfolioDetailPage;
