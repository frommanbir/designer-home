import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const CommercialServicePage = () => {
  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/85 z-10"></div>
          <img
            src="/images/service-com-hero.jpg"
            alt="Commercial Interior Design"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
          <h4 className="text-[#C59D5F] font-black tracking-[0.4em] uppercase text-xs mb-4">Designing for Success</h4>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8 shadow-sm">
            Commercial <br/><span className="text-[#C59D5F]">Environments</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto drop-shadow-md">
            Strategic design solutions that elevate your brand, inspire your team, and captivate your customers.
          </p>
        </div>
      </section>

      {/* Business Goal Section */}
      <section className="max-w-[1400px] mx-auto py-28 px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
           <div className="lg:col-span-7 space-y-10">
              <h2 className="text-4xl md:text-7xl font-black text-[#222] tracking-tighter leading-[0.9] uppercase">Design as a <br/>Business <span className="text-[#C59D5F]">Growth Tool</span></h2>
              <p className="text-xl text-[#555] leading-relaxed font-light max-w-2xl">
                Commercial design is not just about aesthetics; it's about business strategy. Whether it's a high-performance office that boosts productivity or a retail store that maximizes sales, our designs are calculated to drive results. We bridge the gap between your brand identity and the physical space it occupies.
              </p>
              <div className="grid sm:grid-cols-2 gap-8 border-t border-gray-100 pt-10">
                 <div>
                    <h4 className="text-[#222] font-black uppercase text-sm tracking-widest mb-3">Brand Alignment</h4>
                    <p className="text-[#666]">We translate your company values and visual identity into every architectural detail.</p>
                 </div>
                 <div>
                    <h4 className="text-[#222] font-black uppercase text-sm tracking-widest mb-3">User Experience</h4>
                    <p className="text-[#666]">Focusing on customer journey and employee workflow for maximum efficiency.</p>
                 </div>
              </div>
           </div>
           <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <img src="/images/com-grid-1.jpg" alt="Office Detail" className="w-full h-80 object-cover rounded-2xl shadow-lg mt-12" />
              <img src="/images/com-grid-2.jpg" alt="Retail Display" className="w-full h-80 object-cover rounded-2xl shadow-lg" />
           </div>
        </div>
      </section>

      {/* Commercial Categories */}
      <section className="bg-black py-32 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b border-white/10 pb-12">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Market <span className="text-[#C59D5F]">Expertise</span></h2>
              <p className="text-gray-400 max-w-md font-light text-lg">Diverse industry solutions designed to meet the rigorous demands of public and private business spaces.</p>
           </div>

           <div className="grid lg:grid-cols-2 gap-16">
              {[
                { 
                  title: "Corporate Offices", 
                  desc: "Modern workspaces that foster collaboration, focus, and innovation. From grand receptions to ergonomic workstations.",
                  img: "/images/com-office.jpg",
                  items: ["Coworking Spaces", "Boardrooms", "Executive Suites", "Breakout Areas"]
                },
                { 
                  title: "Retail & Showrooms", 
                  desc: "Immersive shopping experiences that influence buyer behavior and showcase products in their best light.",
                  img: "/images/com-retail.jpg",
                  items: ["Boutique Stores", "Flagship Showrooms", "Pop-up Shops", "Window Displays"]
                },
                { 
                  title: "Hospitality & Dining", 
                  desc: "Cafes, restaurants, and hotels where ambiance and comfort are the primary focus for guest satisfaction.",
                  img: "/images/com-hospitality.jpg",
                  items: ["Fine Dining", "Urban Cafes", "Boutique Hotels", "Lounge Bars"]
                },
                { 
                  title: "Healthcare & Wellness", 
                  desc: "Clinics and wellness centers that balance medical functionality with a soothing, patient-centric environment.",
                  img: "/images/com-health.jpg",
                  items: ["Specialized Clinics", "Yoga Studios", "Dental Centers", "Spas"]
                },
              ].map((cat, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-8 group">
                   <div className="w-full md:w-1/2 h-[350px] overflow-hidden rounded-2xl shadow-2xl">
                      <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" />
                   </div>
                   <div className="w-full md:w-1/2 space-y-6 flex flex-col justify-center">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-[#C59D5F] transition-colors">{cat.title}</h3>
                      <p className="text-gray-400 font-light leading-relaxed">{cat.desc}</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {cat.items.map((item, i) => (
                          <li key={i} className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-[#C59D5F] rounded-full"></div>
                             {item}
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-white py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
           <h4 className="text-[#C59D5F] font-black tracking-widest uppercase text-sm">Elevate Your Business</h4>
           <h2 className="text-5xl md:text-7xl font-black text-[#222] tracking-tighter uppercase leading-[0.9]">Ready to <br/>Transform?</h2>
           <p className="text-xl font-light text-[#666] max-w-2xl mx-auto">
             Let our team of commercial design specialists help you create a space that delivers on your business goals and represents your brand at its best.
           </p>
           <div className="pt-8">
              <Link href="/contact" className="px-12 py-6 bg-[#222] text-white font-black tracking-widest uppercase rounded-xl hover:bg-[#C59D5F] transition-all transform hover:-translate-y-1 shadow-2xl inline-block">
                Start a Conversation
              </Link>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommercialServicePage;
