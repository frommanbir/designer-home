import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/projects";
import { ArrowLeft, Target, Award, ShieldCheck, Maximize2 } from "lucide-react";
import { notFound } from "next/navigation";

const ProjectDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  
  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch (err) {
    return notFound();
  }

  if (!project) return notFound();

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src={project.hero_image_url || "/images/placeholder.jpg"} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 max-w-4xl">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-3 text-white/80 hover:text-white font-black text-xs uppercase tracking-[0.3em] mb-12 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </Link>
          
          <h4 className="text-[#C59D5F] font-black tracking-[0.4em] uppercase text-xs md:text-sm mb-6">
            {project.category?.name || "Professional Execution"}
          </h4>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-white/90 text-xl md:text-2xl font-light italic max-w-2xl mx-auto">
              "{project.subtitle}"
            </p>
          )}
        </div>
      </section>

      {/* Project Overview */}
      <section className="max-w-7xl mx-auto py-32 px-6">
        <div className="grid lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <div>
              <div className="w-12 h-1 bg-[#C59D5F] mb-8"></div>
              <h2 className="text-4xl font-black uppercase text-neutral-900 tracking-tight">
                Project <span className="text-[#C59D5F]">Manifesto</span>
              </h2>
            </div>
            
            <div className="text-neutral-600 text-lg md:text-xl font-light leading-relaxed space-y-8 whitespace-pre-line">
              {project.description}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="p-10 bg-neutral-50 rounded-3xl border border-neutral-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl transition-all duration-500">
              <Target className="text-[#C59D5F] mb-6" size={40} />
              <h4 className="font-black text-xs uppercase tracking-widest mb-4">Precision</h4>
              <p className="text-neutral-500 text-sm font-light">Millimeter-perfect execution across every fabrication phase.</p>
            </div>
            
            <div className="p-10 bg-neutral-50 rounded-3xl border border-neutral-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl transition-all duration-500">
              <Award className="text-[#C59D5F] mb-6" size={40} />
              <h4 className="font-black text-xs uppercase tracking-widest mb-4">Craft</h4>
              <p className="text-neutral-500 text-sm font-light">Custom artisans bringing specialized concepts to tangible life.</p>
            </div>

            <div className="col-span-full p-10 bg-[#111] text-white rounded-3xl shadow-xl flex items-center gap-8">
              <ShieldCheck className="text-[#C59D5F] flex-shrink-0" size={56} />
              <div>
                <h4 className="text-[#C59D5F] font-black text-xs uppercase tracking-widest mb-2">Quality Assurance</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  Every material is rigorously tested for durability and aesthetic longevity in high-end environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-neutral-50 py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-neutral-900">
              Visual <span className="text-[#C59D5F]">Catalogue</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {project.gallery_image_urls && project.gallery_image_urls.length > 0 ? (
              project.gallery_image_urls.map((url, idx) => (
                <div 
                  key={idx} 
                  className={`relative group overflow-hidden rounded-3xl bg-neutral-200 aspect-[4/5] shadow-lg ${idx % 2 === 1 ? 'md:translate-y-12' : ''}`}
                >
                  <img 
                    src={url} 
                    alt={`Project Gallery ${idx}`} 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={32} className="text-white" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-40 border-2 border-dashed border-neutral-200 rounded-[3rem] flex flex-col items-center justify-center text-neutral-300">
                <p className="text-xl font-light italic">Imagery for this catalogue is currently being curated.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-32 px-6 bg-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10 leading-tight">
            Inspired by this <span className="text-[#C59D5F]">Vision</span>?
          </h2>
          <Link 
            href="/contact" 
            className="inline-block px-12 py-6 bg-neutral-900 text-white font-bold tracking-[0.3em] uppercase text-xs rounded-full hover:bg-[#C59D5F] hover:text-black transition-all shadow-2xl"
          >
            Start Your Project
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
