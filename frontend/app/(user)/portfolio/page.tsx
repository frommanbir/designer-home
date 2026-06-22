import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const PortfolioPage = () => {
  return (
    <div className="bg-[#111] font-sans overflow-x-hidden min-h-screen text-white">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center pt-24">
        <div className="text-center px-6 z-10">
          <h4 className="text-[#C59D5F] font-black tracking-[0.4em] uppercase text-sm mb-4">The Art of Living</h4>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6">Our <span className="text-[#C59D5F]">Portfolio</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light">
            Explore our curated selection of high-end interior designs that redefine luxury and comfort.
          </p>
        </div>
        {/* Subtle background texture/pattern could go here */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute inset-0 bg-[url('/images/pattern.png')] bg-repeat opacity-20"></div>
        </div>
      </section>

      {/* Masonry-style Grid */}
      <section className="max-w-[1600px] mx-auto py-24 px-6">
        <div className="flex flex-wrap justify-center gap-8 mb-20 font-bold tracking-widest text-xs uppercase border-b border-white/10 pb-8">
           {["All Work", "Residential Luxury", "Corporate HQ", "Boutique Retail", "Hospitality"].map((cat, i) => (
              <button key={i} className={`hover:text-[#C59D5F] transition-colors ${i === 0 ? 'text-[#C59D5F]' : 'text-gray-500'}`}>
                {cat}
              </button>
           ))}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {[
            { title: "The Golden Suite", cat: "Residential", size: "h-[400px]", img: "/images/p-1.jpg" },
            { title: "Glass & Steel Office", cat: "Office", size: "h-[600px]", img: "/images/p-2.jpg" },
            { title: "Urban Loft Concept", cat: "Residential", size: "h-[350px]", img: "/images/p-3.jpg" },
            { title: "Minimalist Lounge", cat: "Hospitality", size: "h-[500px]", img: "/images/p-4.jpg" },
            { title: "Neo-Classical Kitchen", cat: "Residential", size: "h-[450px]", img: "/images/p-5.jpg" },
            { title: "Regal Dining Hall", cat: "Hospitality", size: "h-[650px]", img: "/images/p-6.jpg" },
            { title: "Ethereal Bedroom", cat: "Residential", size: "h-[400px]", img: "/images/p-7.jpg" },
            { title: "Industrial Workshop", cat: "Commercial", size: "h-[550px]", img: "/images/p-8.jpg" },
          ].map((item, idx) => (
            <div key={idx} className={`relative group overflow-hidden rounded-xl bg-gray-900 ${item.size} break-inside-avoid shadow-2xl cursor-pointer`}>
               <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-[#C59D5F] text-xs font-black tracking-widest uppercase mb-2">{item.cat}</span>
                  <h3 className="text-2xl font-black text-white">{item.title}</h3>
                  <Link href="/projects/detail" className="mt-4 text-sm font-bold border-b border-[#C59D5F] inline-block w-max pb-1">VIEW PROJECT</Link>
               </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-24">
           <button className="px-12 py-5 border border-white/20 hover:border-[#C59D5F] hover:text-[#C59D5F] transition-all font-black tracking-[0.3em] uppercase text-xs">
              Load More Works
           </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PortfolioPage;
