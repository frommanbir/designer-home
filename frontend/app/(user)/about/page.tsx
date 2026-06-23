import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAboutPageData } from "@/lib/about-page";
import Link from "next/link";

const DEFAULT_FEATURES = [
  {
    title: "Quality Assurance",
    description: "Quality is at the center of everything we do. We maintain careful attention to detail, select suitable materials, and provide professional supervision throughout every stage to ensure exceptional results and lasting value.",
  },
  {
    title: "Cost Efficient Solutions",
    description: "We believe great design should be both beautiful and practical. Through efficient planning, in-house production, and optimized execution, we provide cost-effective solutions without compromising on quality or craftsmanship.",
  },
  {
    title: "Unlimited Custom Designs",
    description: "Every client has a unique vision, and we are committed to bringing it to life. Our team offers unlimited design possibilities and customized concepts tailored to your style, space requirements, and functional needs.",
  },
  {
    title: "Timely Delivery",
    description: "Time matters in every project. With a structured workflow, professional coordination, and dedicated supervision, we ensure projects are completed and delivered within the agreed timeline while maintaining excellent quality standards.",
  },
  {
    title: "Strong Team of Professionals",
    description: "Our experienced team of designers, project managers, and production specialists work collaboratively to deliver creative ideas, technical expertise, and seamless execution at every stage of the project.",
  },
  {
    title: "In-House Production Unit",
    description: "Having our own production unit allows us to maintain better quality assurance, faster production cycles, and greater flexibility in customization. This integrated process helps us deliver consistent results and a smoother experience from concept to completion.",
  },
];

const AboutPage = async () => {
  const data = await getAboutPageData();
  const { hero, welcome, main_about, why_choose_us } = data;

  const features = why_choose_us.features && why_choose_us.features.length > 0 
    ? why_choose_us.features 
    : DEFAULT_FEATURES;

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
          {hero.title && (
            <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-widest text-center px-4">
              {hero.title}
            </h1>
          )}
        </div>
        <img
          src={hero.image?.url || "/images/about-banner.jpg"}
          alt="Designer Home Inspiration"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Welcome Section */}
      <section className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#333] mb-10 tracking-tight leading-tight">
          <span className="font-extrabold text-[#222]">
            {welcome.title || "Designer Home"}
          </span>
        </h2>

        <p className="text-lg md:text-xl text-[#555] leading-relaxed max-w-3xl mx-auto font-normal whitespace-pre-line">
          {welcome.description}
        </p>
      </section>

      {/* Best Interior Design Company Section */}
      <section className="bg-[#F9F9F9] py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#C59D5F]/10 rounded-[2rem] transform group-hover:scale-105 transition-transform duration-500"></div>
            <img
              src={main_about.image?.url || "/images/about-company.jpg"}
              alt="Our Work"
              className="relative rounded-[1.5rem] w-full h-[500px] object-cover shadow-2xl z-0"
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-[#222] leading-[1.1] tracking-tight whitespace-pre-line">
              {main_about.title || "Best Interior Design \nCompany in Nepal"}
            </h2>

            <div className="space-y-6 text-[#444] text-lg leading-relaxed whitespace-pre-line">
              <p>{main_about.description}</p>
            </div>
            
            <div className="pt-4">
              <Link href="/projects" className="px-8 py-4 bg-[#222] text-white font-bold rounded-lg hover:bg-[#C59D5F] transition-all transform hover:-translate-y-1 inline-block">
                EXPLORE OUR PROJECTS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto py-32 px-6">
        <h2 className="text-5xl font-black text-[#222] mb-6 tracking-tight uppercase">
          {why_choose_us.title || "WHY CHOOSE US"}
        </h2>
        
        {why_choose_us.description && (
          <p className="text-xl text-[#666] mb-16 max-w-3xl leading-relaxed whitespace-pre-line">
            {why_choose_us.description}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F5F5F5] p-12 rounded-lg space-y-6 transition-all duration-300 hover:shadow-md"
            >
              <h3 className="text-3xl font-bold text-[#222] tracking-tight">
                {item.title}
              </h3>
              <p className="text-[#555] leading-relaxed text-lg font-light">
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