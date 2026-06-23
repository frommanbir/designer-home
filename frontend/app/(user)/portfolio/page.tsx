import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getPortfolios } from "@/lib/portfolios";
import { getPortfolioCategories } from "@/lib/portfolio-categories";

interface SearchParams {
  category?: string;
  search?: string;
}

const PortfolioPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const filters = await searchParams;
  
  const [portfolios, categories] = await Promise.all([
    getPortfolios(filters),
    getPortfolioCategories()
  ]);

  return (
    <div className="bg-[#0A0A0A] font-sans overflow-x-hidden min-h-screen text-white">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          {portfolios[0]?.main_image_url && (
            <img 
              src={portfolios[0].main_image_url} 
              alt="Hero Background" 
              className="w-full h-full object-cover blur-sm scale-105"
            />
          )}
        </div>
        
        <div className="text-center px-6 z-20">
          <h4 className="text-[#C59D5F] font-black tracking-[0.4em] uppercase text-xs md:text-sm mb-6 animate-in slide-in-from-bottom duration-700">The Art of Living</h4>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase mb-8 leading-[0.9] animate-in slide-in-from-bottom duration-1000">
            Our <span className="text-[#C59D5F]">Portfolio</span>
          </h1>
          <div className="w-24 h-1.5 bg-[#C59D5F] mx-auto mb-8"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in fade-in duration-1000 delay-500">
            Explore our curated selection of high-end interior designs that redefine luxury, comfort, and sophisticated living.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-[1600px] mx-auto py-32 px-6">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-24 font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase border-b border-white/5 pb-10">
          <Link 
            href="/portfolio"
            className={`transition-all duration-300 hover:text-[#C59D5F] ${!filters.category ? 'text-[#C59D5F] scale-110' : 'text-gray-500'}`}
          >
            All Work
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/portfolio?category=${cat.slug}`}
              className={`transition-all duration-300 hover:text-[#C59D5F] ${filters.category === cat.slug ? 'text-[#C59D5F] scale-110' : 'text-gray-500'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {portfolios.length === 0 ? (
          <div className="py-40 text-center">
            <h3 className="text-3xl font-light text-gray-500 italic">No projects found in this collection.</h3>
            <Link href="/portfolio" className="mt-8 inline-block text-[#C59D5F] border-b border-[#C59D5F] pb-1 uppercase tracking-widest text-xs font-bold">Clear Filters</Link>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
            {portfolios.map((item, idx) => (
              <div 
                key={item.id} 
                className={`relative group overflow-hidden rounded-2xl bg-[#111] break-inside-avoid shadow-2xl transition-all duration-500 hover:shadow-[#C59D5F]/10 ${idx % 3 === 1 ? 'lg:mt-16' : ''}`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.main_image_url || "/images/placeholder.jpg"} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 md:opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10">
                  <span className="text-[#C59D5F] text-[10px] font-black tracking-[0.3em] uppercase mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.category?.name || "Bespoke Design"}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {item.title}
                  </h3>
                  <div className="w-12 h-1 bg-[#C59D5F] my-6 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 delay-150"></div>
                  <Link 
                    href={`/portfolio/${item.slug}`} 
                    className="text-xs font-bold tracking-widest uppercase border-b border-[#C59D5F]/30 hover:border-[#C59D5F] inline-block w-max pb-1 transform translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-200"
                  >
                    Explore Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Mockup (can be implemented with pagination if API supports it later) */}
        {portfolios.length > 8 && (
          <div className="flex justify-center mt-32">
             <button className="group flex items-center gap-6 px-16 py-6 border border-white/10 hover:border-[#C59D5F] hover:bg-[#C59D5F] hover:text-black transition-all duration-500 font-black tracking-[0.3em] uppercase text-xs rounded-full">
                <span>Discover More</span>
                <div className="w-8 h-[1px] bg-white group-hover:bg-black transition-colors"></div>
             </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default PortfolioPage;
