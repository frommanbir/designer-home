import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const ProjectDetailPage = () => {
  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />

      {/* Full Width Hero */}
      <section className="relative h-[80vh] w-full">
        <img
          src="/images/project-detail-hero.jpg"
          alt="Modern Luxury Residence"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 z-10"></div>
        <div className="absolute bottom-20 left-6 md:left-20 max-w-4xl">
          <span className="text-[#C59D5F] font-black tracking-widest uppercase text-sm mb-4 block">Residential Transformation</span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-8">Modern Luxury <br/>Residence</h1>
        </div>
      </section>

      {/* Project Specs */}
      <section className="bg-[#F9F9F9] py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Client", value: "Anonymous Homeowner" },
            { label: "Location", value: "Budhanilkantha, Kathmandu" },
            { label: "Service", value: "Full Interior Design" },
            { label: "Year", value: "2024" },
          ].map((spec, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">{spec.label}</h4>
              <p className="text-lg font-black text-[#222]">{spec.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Narrative */}
      <section className="max-w-7xl mx-auto py-24 px-6 md:px-20 grid lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-10">
          <h2 className="text-4xl font-black text-[#222] tracking-tight leading-tight">A Vision of Sophisticated <br/>Comfort and Timeless Elegance</h2>
          <div className="space-y-6 text-lg text-[#555] leading-relaxed">
            <p>
              In our recent residential project, "The Modern Luxury Residence," we aimed to create a seamless fusion of contemporary minimalism and opulent textures. The client sought a sanctuary that reflected their appreciation for clean lines while providing the warmth and comfort of a family home.
            </p>
            <p>
              Our design team focused on an open-plan layout that maximizes natural light through floor-to-ceiling windows. We used a palette of neutral tones—soft greys, creams, and charcoals—accentuated by warm wood finishes and brass hardware to add a touch of sophisticated luxury.
            </p>
            <p>
              The custom-built cabinetry and bespoke furniture pieces were all designed and manufactured in our in-house production unit, ensuring a level of craftsmanship and unique detailing that sets this home apart.
            </p>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8 h-full flex flex-col justify-center">
           <div className="bg-[#C59D5F] p-10 text-white rounded-2xl shadow-xl transform lg:translate-x-10">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Key Features</h3>
              <ul className="space-y-4 font-bold text-sm">
                <li className="flex items-center gap-3"><span className="text-black/30">●</span> Custom Built-in Wardrobes</li>
                <li className="flex items-center gap-3"><span className="text-black/30">●</span> Automated Lighting System</li>
                <li className="flex items-center gap-3"><span className="text-black/30">●</span> Italian Marble Flooring</li>
                <li className="flex items-center gap-3"><span className="text-black/30">●</span> Hand-crafted Furniture</li>
              </ul>
           </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-[1400px] mx-auto py-24 px-6 space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <img src="/images/detail-1.jpg" alt="Dining View" className="w-full h-[600px] object-cover rounded-3xl" />
            <img src="/images/detail-2.jpg" alt="Living View" className="w-full h-[600px] object-cover rounded-3xl" />
         </div>
         <div className="w-full h-[80vh] overflow-hidden rounded-3xl">
            <img src="/images/detail-full.jpg" alt="Bedroom View" className="w-full h-full object-cover" />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <img src="/images/detail-3.jpg" alt="Kitchen Detail" className="w-full h-[400px] object-cover rounded-3xl" />
            <img src="/images/detail-4.jpg" alt="Entryway" className="w-full h-[400px] object-cover rounded-3xl" />
            <img src="/images/detail-5.jpg" alt="Terrace" className="w-full h-[400px] object-cover rounded-3xl" />
         </div>
      </section>

      {/* Project Navigation */}
      <section className="border-t border-gray-100 mt-24">
        <div className="grid md:grid-cols-2">
           <Link href="/projects/prev" className="group p-20 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-start hover:bg-[#F9F9F9] transition-colors">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Previous Project</span>
              <h4 className="text-3xl font-black text-[#222] group-hover:text-[#C59D5F] transition-colors">Industrial Office Loft</h4>
           </Link>
           <Link href="/projects/next" className="group p-20 flex flex-col items-end text-right hover:bg-[#F9F9F9] transition-colors">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Next Project</span>
              <h4 className="text-3xl font-black text-[#222] group-hover:text-[#C59D5F] transition-colors">Neo-Classical Villa</h4>
           </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#111] py-28 px-6 text-center">
         <h2 className="text-5xl font-black text-white mb-8 tracking-tight uppercase">Love what you see?</h2>
         <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-xl font-light">Bring your vision to life today. Start your journey with our expert design team.</p>
         <Link href="/contact" className="px-12 py-5 bg-[#C59D5F] text-white font-black tracking-widest rounded-lg hover:bg-white hover:text-[#222] transition-colors inline-block transform hover:-translate-y-1">
            LET'S WORK TOGETHER
         </Link>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
