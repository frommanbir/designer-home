import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const ResidentialServicePage = () => {
  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10"></div>
          <img
            src="/images/service-res-hero.jpg"
            alt="Residential Interior Design"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
          <h4 className="text-[#C59D5F] font-black tracking-[0.3em] uppercase text-sm mb-4">Elegance in Every Corner</h4>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8 shadow-sm">
            Residential <br/><span className="text-[#C59D5F]">Interiors</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto drop-shadow-md">
            Transforming houses into homes that reflect your personality, comfort, and aspirations.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto py-28 px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
           <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter leading-tight uppercase">Customized for <br/>Your <span className="text-[#C59D5F]">Lifestyle</span></h2>
           <p className="text-xl text-[#555] leading-relaxed font-light">
             We believe that residential design is deeply personal. Our approach focuses on creating spaces that are not only visually stunning but also highly functional for your day-to-day life. From cozy apartments to luxurious villas, we bring a level of detail and craftsmanship that is unmatched.
           </p>
           <div className="flex items-center gap-4 pt-4">
              <div className="w-16 h-16 bg-[#C59D5F]/10 rounded-full flex items-center justify-center text-[#C59D5F] font-black text-2xl italic">DH</div>
              <p className="text-lg font-bold text-[#222]">"Design is not just what it looks like, <br/>it's how it makes you feel."</p>
           </div>
        </div>
        <div className="relative group">
           <div className="absolute -inset-4 bg-[#C59D5F]/5 rounded-[2rem] transform rotate-3 scale-95 group-hover:scale-100 transition-all duration-700"></div>
           <img src="/images/res-philosoph.jpg" alt="Home Atmosphere" className="relative rounded-[1.5rem] shadow-2xl w-full h-[500px] object-cover" />
        </div>
      </section>

      {/* Specific Areas */}
      <section className="bg-[#F9F9F9] py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-[#222] tracking-tighter uppercase">Our <span className="text-[#C59D5F]">Specialties</span></h2>
            <div className="w-24 h-2 bg-[#C59D5F] mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "Living Spaces", desc: "The heart of the home. We create inviting living rooms that serve as perfect hubs for relaxation and socialization.", img: "/images/res-living.jpg" },
              { title: "Serene Bedrooms", desc: "Your personal sanctuary. Our bedroom designs prioritize comfort, lighting, and tranquility for ultimate rest.", img: "/images/res-bedroom.jpg" },
              { title: "Modern Kitchens", desc: "Where function meets style. We design culinary spaces that are a joy to cook in and beautiful to behold.", img: "/images/res-kitchen.jpg" },
              { title: "Luxury Bathrooms", desc: "Spa-like environments crafted with premium materials and sophisticated fittings for a daily retreat.", img: "/images/res-bath.jpg" },
              { title: "Home Offices", desc: "Distraction-free, ergonomic, and aesthetic workspaces tailored for the modern professional.", img: "/images/res-office.jpg" },
              { title: "Walk-in Closets", desc: "Organized luxury. Custom storage solutions that turn organization into an art form.", img: "/images/res-closet.jpg" },
            ].map((area, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-gray-100">
                <div className="h-72 overflow-hidden relative">
                   <img src={area.img} alt={area.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-10 space-y-4">
                  <h3 className="text-2xl font-black text-[#222] uppercase tracking-tight group-hover:text-[#C59D5F] transition-colors">{area.title}</h3>
                  <p className="text-[#666] leading-relaxed">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Project Link */}
      <section className="max-w-7xl mx-auto py-32 px-6">
        <div className="bg-[#222] rounded-[3rem] p-12 md:p-24 overflow-hidden relative group">
           <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
              <img src="/images/res-cta-bg.jpg" alt="Background" className="w-full h-full object-cover" />
           </div>
           <div className="relative z-10 max-w-2xl">
              <h4 className="text-[#C59D5F] font-bold tracking-widest uppercase text-sm mb-6">Experience Excellence</h4>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-10 leading-[0.9]">Transform Your Home <br/>With us</h2>
              <p className="text-gray-400 text-lg mb-12 font-light">Join hundreds of satisfied homeowners across Nepal who have entrusted their dream spaces to Designer Home.</p>
              <div className="flex flex-col sm:flex-row gap-6">
                 <Link href="/contact" className="px-10 py-5 bg-[#C59D5F] text-white font-black tracking-widest uppercase rounded-xl hover:bg-white hover:text-[#222] transition-all transform hover:-translate-y-1 text-center">
                    Book a Consultation
                 </Link>
                 <Link href="/projects" className="px-10 py-5 bg-transparent border-2 border-white/20 text-white font-black tracking-widest uppercase rounded-xl hover:border-white hover:bg-white/5 transition-all text-center">
                    View Portfolio
                 </Link>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResidentialServicePage;
