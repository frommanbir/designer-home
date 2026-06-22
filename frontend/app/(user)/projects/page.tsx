import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProjectsPage = () => {
  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />

      {/* Page Header */}
      <section className="relative h-[45vh] min-h-[350px] w-full flex items-end justify-center pb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10"></div>
          <img
            src="/images/projects-banner.jpg"
            alt="Our Portfolio"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase shadow-sm">
            Our <span className="text-[#C59D5F]">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 mt-6 font-light max-w-2xl mx-auto">
            A curated selection of our finest interior design projects, showcasing our versatility and attention to detail.
          </p>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="max-w-[1400px] mx-auto py-24 px-6 md:px-10">
        {/* Simple Filter UI Note: In a real app this would use state */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {["All Projects", "Residential", "Commercial", "Hospitality", "Office"].map((cat, i) => (
             <button key={i} className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide uppercase transition-all ${i === 0 ? 'bg-[#222] text-white shadow-md' : 'bg-gray-100 text-[#555] hover:bg-[#C59D5F] hover:text-white hover:shadow-md'}`}>
                {cat}
             </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {[
             { title: "Luxe Modern Residence", category: "Residential", img: "/images/port-1.jpg" },
             { title: "Downtown Corporate HQ", category: "Office", img: "/images/port-2.jpg" },
             { title: "Boutique Hotel Lobby", category: "Hospitality", img: "/images/port-3.jpg" },
             { title: "Minimalist Apartment", category: "Residential", img: "/images/port-4.jpg" },
             { title: "High-End Retail Store", category: "Commercial", img: "/images/port-5.jpg" },
             { title: "Cozy Family Home", category: "Residential", img: "/images/port-6.jpg" },
             { title: "Industrial Loft Studio", category: "Residential", img: "/images/port-7.jpg" },
             { title: "Seaside Resort Suite", category: "Hospitality", img: "/images/port-8.jpg" },
             { title: "Modern Tech Office", category: "Office", img: "/images/port-9.jpg" },
           ].map((item, idx) => (
             <div key={idx} className="group relative overflow-hidden rounded-2xl h-[450px] shadow-sm hover:shadow-2xl transition-all cursor-pointer">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end text-center p-10">
                   <p className="text-[#C59D5F] font-black tracking-widest text-sm mb-3 uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.category}</p>
                   <h3 className="text-white text-3xl font-black mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.title}</h3>
                   <span className="w-12 h-1 bg-white mb-6 transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100"></span>
                   <span className="text-sm text-gray-200 font-bold hover:text-white transition-colors uppercase tracking-[0.2em] border border-white/40 px-6 py-3 rounded-md backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 duration-500 delay-150">View Project</span>
                </div>
             </div>
           ))}
        </div>
        
        <div className="text-center mt-20">
           <button className="px-10 py-5 bg-transparent border-2 border-[#222] text-[#222] font-black tracking-widest rounded-lg hover:bg-[#222] hover:text-white transition-all uppercase">
             Load More Projects
           </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
