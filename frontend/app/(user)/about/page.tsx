import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAboutPageData } from "@/lib/about-page";

const AboutPage = async () => {
  const data = await getAboutPageData();
  const { hero, welcome, main_about, why_choose_us } = data;

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img
          src={hero.image_url || "/images/about-banner.jpg"}
          alt="Designer Home Inspiration"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Welcome Section */}
      <section className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#333] mb-10 tracking-tight leading-tight">
          <span className="font-light uppercase block text-2xl md:text-3xl mb-2 text-[#666]">
            {welcome.subtitle || "Welcome TO"}
          </span>
          <span className="font-extrabold text-[#222]">
            {welcome.title || "Designer Home"}
          </span>
        </h2>

        <p className="text-lg md:text-xl text-[#555] leading-relaxed max-w-3xl mx-auto font-normal">
          {welcome.description}
        </p>
      </section>

      {/* Best Interior Design Company Section */}
      <section className="bg-[#F9F9F9] py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#C59D5F]/10 rounded-[2rem] transform group-hover:scale-105 transition-transform duration-500"></div>
            <img
              src={main_about.image_url || "/images/about-company.jpg"}
              alt="Our Work"
              className="relative rounded-[1.5rem] w-full h-[500px] object-cover shadow-2xl z-0"
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-[#222] leading-[1.1] tracking-tight whitespace-pre-line">
              {main_about.title || "Best Interior Design \nCompany in Nepal"}
            </h2>

            <div className="space-y-6 text-[#444] text-lg leading-relaxed">
              <p>{main_about.description_1}</p>
              <p>{main_about.description_2}</p>
              <p className="font-medium text-[#C59D5F] italic">
                {main_about.description_3}
              </p>
            </div>
            
            <div className="pt-4">
              <button className="px-8 py-4 bg-[#222] text-white font-bold rounded-lg hover:bg-[#C59D5F] transition-all transform hover:-translate-y-1">
                EXPLORE OUR PROJECTS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto py-28 px-6">
        <h2 className="text-4xl md:text-5xl font-black text-[#222] mb-16 text-center md:text-left tracking-tight uppercase">
          {why_choose_us.title || "WHY "} 
          <span className="text-[#C59D5F]">CHOOSE US</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {why_choose_us.features.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#FBFBFB] border border-gray-100 p-10 rounded-2xl hover:shadow-xl hover:bg-white transition-all duration-300 group"
            >
              <div className="text-4xl font-black text-[#C59D5F]/20 mb-6 group-hover:text-[#C59D5F]/40 transition-colors">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <h3 className="text-2xl font-bold text-[#222] mb-4 group-hover:text-[#C59D5F] transition-colors uppercase">
                {item.title}
              </h3>
              <p className="text-[#666] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;