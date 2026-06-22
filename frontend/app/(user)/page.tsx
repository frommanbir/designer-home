import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src="/images/home-banner.jpg" 
            alt="Designer Home"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 shadow-sm uppercase">
            Elevate Your <br/><span className="text-[#C59D5F]">Living Space</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 font-light mb-10 max-w-2xl mx-auto drop-shadow-md">
            Award-winning interior design solutions that bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/projects" className="px-8 py-4 bg-[#C59D5F] text-white font-bold rounded-lg hover:bg-[#b08951] transition-all transform hover:-translate-y-1 w-full sm:w-auto text-center">
              VIEW OUR PORTFOLIO
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#222] transition-all transform hover:-translate-y-1 w-full sm:w-auto text-center bg-black/20 backdrop-blur-sm">
              CONTACT US
            </Link>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="max-w-7xl mx-auto py-24 px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-[#222] mb-8 tracking-tight leading-tight">
            <span className="font-light uppercase block text-xl md:text-2xl mb-2 text-[#666]">About Us</span>
            Transforming Spaces, <br/>Inspiring Lives
          </h2>
          <p className="text-lg text-[#555] leading-relaxed mb-8">
            Designer Home Pvt. Ltd. is a premier interior design firm dedicated to creating exceptional living and working environments. With an unwavering commitment to quality and aesthetics, we blend functionality with stunning design to make your dream space a reality.
          </p>
          <Link href="/about" className="inline-flex items-center text-[#C59D5F] font-bold text-lg hover:text-[#222] transition-colors group">
            LEARN MORE ABOUT US
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform text-2xl leading-none">&rarr;</span>
          </Link>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-[#C59D5F]/10 rounded-2xl transform rotate-3"></div>
          <img src="/images/home-about.jpg" alt="Interior Design" className="relative rounded-2xl shadow-xl w-full h-[500px] object-cover" />
        </div>
      </section>

      {/* Services Snippet */}
      <section className="bg-[#F9F9F9] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#222] tracking-tight uppercase">
              Our <span className="text-[#C59D5F]">Services</span>
            </h2>
            <p className="mt-4 text-[#666] text-lg max-w-2xl mx-auto">Comprehensive design and execution solutions tailored to your unique needs.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Residential Design", desc: "Crafting beautiful, personalized home interiors that reflect your lifestyle.", img: "/images/service-res.jpg" },
              { title: "Commercial Spaces", desc: "Innovative workspaces and retail environments designed for success.", img: "/images/service-com.jpg" },
              { title: "Custom Furniture", desc: "Bespoke furniture pieces designed and crafted in our in-house production unit.", img: "/images/service-fur.jpg" },
            ].map((srv, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100">
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={srv.img} alt={srv.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#222] mb-3">{srv.title}</h3>
                  <p className="text-[#666] mb-6">{srv.desc}</p>
                  <Link href="/services" className="text-[#C59D5F] font-bold hover:text-[#222] transition-colors flex items-center">
                    READ MORE <span className="ml-2 text-xl">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto py-24 px-6">
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-4xl md:text-5xl font-black text-[#222] tracking-tight uppercase">
              Featured <span className="text-[#C59D5F]">Projects</span>
            </h2>
            <Link href="/projects" className="px-6 py-3 border-2 border-[#222] text-[#222] font-bold rounded-lg hover:bg-[#222] hover:text-white transition-all">
              VIEW ALL PORTFOLIO
            </Link>
         </div>
         <div className="grid md:grid-cols-2 gap-6">
            <div className="relative group overflow-hidden rounded-2xl h-[450px]">
              <img src="/images/project-1.jpg" alt="Modern Villa" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[#C59D5F] font-bold tracking-widest uppercase mb-2">Residential</p>
                <h3 className="text-white text-3xl font-black">Modern Luxury Villa</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl h-[450px]">
              <img src="/images/project-2.jpg" alt="Corporate Office" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[#C59D5F] font-bold tracking-widest uppercase mb-2">Commercial</p>
                <h3 className="text-white text-3xl font-black">Luxe Corporate Office</h3>
              </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
