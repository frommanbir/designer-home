import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getServices } from "@/lib/services";
import { getProjects } from "@/lib/projects";
import { getBlogs } from "@/lib/blogs";
import { getRatings } from "@/lib/ratings";
import { serverFetch } from "@/lib/server-api";
import { ArrowRight, Star, Clock, CheckCircle, Headphones, Award, MoveRight, Users, PencilRuler, Ruler, Building2, KeyRound } from "lucide-react";
import React from "react";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import BlogSlider from "@/components/BlogSlider";

async function getSiteSettings() {
  try {
    const res = await serverFetch("/site-settings");
    return res.data ?? {};
  } catch { return {}; }
}
export const revalidate = 0;

export default async function HomePage() {
  const [services, projects, blogs, settings, ratings] = await Promise.all([
    getServices().catch(() => []),
    getProjects().catch(() => []),
    getBlogs().catch(() => []),
    getSiteSettings(),
    getRatings().catch(() => []),
  ]);

  return (
    <div className="bg-white font-sans overflow-x-hidden relative">
      <Navbar transparent={true} settings={settings} />

      {/* ── Section 1: Hero ───────────────────────── */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src="/images/about-home.png"
            alt="Designer Home Hero"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── Section 2: Designing Spaces ────────────────── */}
      <section className="py-6 md:py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mt-6">
            
            {/* Left Content */}
            <div className="space-y-8 lg:space-y-10 text-left flex flex-col items-start order-2 lg:order-1">
              <h2 className="text-neutral-800 text-5xl md:text-5xl lg:text-6xl font-bold font-inter leading-tight">
                Designing Spaces <br className="hidden lg:block" /> That inspire Living
              </h2>
              <div className="space-y-6 flex flex-col items-start">
                <p className="text-neutral-600 text-lg md:text-xl font-medium leading-relaxed max-w-xl font-inter mx-0">
                  Transform your vision into reality with innovative interior & architectural design solutions. From concept creation & 3D visualization to project execution & supervision, Designer Home delivers exceptional
                  spaces tailored to your lifestyle and needs.
                </p>
                <div className="pt-2">
                  <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-xl font-inter mx-0">
                    Established in 2016 A.D.<br className="hidden lg:block" />Your trusted partner for customized residential, commercial, and hospitality <br className="hidden lg:block" /> design projects.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-start w-full pt-4">
                <Link href="/about" className="px-10 py-4 bg-zinc-600 text-white font-semibold rounded-full hover:bg-neutral-700 transition-all transform hover:-translate-y-1 shadow-lg text-sm sm:text-base">
                  Click for Inquiry
                </Link>
                <Link href="/portfolio" className="px-10 py-4 border border-zinc-300 text-zinc-800 font-semibold rounded-full hover:bg-zinc-50 transition-all shadow-sm text-sm sm:text-base">
                  Explore Our Projects
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative group w-full flex justify-start lg:justify-end order-1 lg:order-2">
              <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 w-full max-w-[600px]">
                <img
                  src="/images/designspace.png"
                  alt="Expert Design"
                  className="w-full h-[300px] sm:h-[400px] lg:h-[600px] object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 3: Value Proposition ───────────────── */}
      <section className="py-6 md:py-16 bg-zinc-100">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Image */}
            <div className="flex-1 w-full">
              <img
                src="/images/webring.png"
                alt="Interior Design"
                className="w-full h-[300px] sm:h-[450px] lg:h-[600px] object-cover rounded-lg"
              />
            </div>

            {/* Right Content */}
            <div className="flex-1">
              <p className="text-neutral-600 text-3xl md:text-xl font-medium leading-relaxed border-l-4 border-[#C59D5F] pl-8 py-4">
                We bring dreams to life through thoughtful interior & architecture
                design, creating beautiful, functional spaces that reflect your
                vision and lifestyle.
              </p>

              <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12">
                <div>
                  <h3 className="text-4xl sm:text-5xl font-black">200+</h3>
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500">
                    Our Expertise
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl sm:text-5xl font-black">400+</h3>
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500">
                    Projects
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl sm:text-5xl font-black">4.5</h3>
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500">
                    Out of 5.0
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <Link
                  href="/about"
                  className="px-12 py-3 bg-zinc-500 text-white text-xs font-bold rounded-full hover:bg-zinc-700 transition-all uppercase tracking-[0.2em]"
                >
                  Learn More
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 4: Complete Design Solutions ───────────────────────── */}
      <section className="py-24 md:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-24">
          
          {/* Header: Title Left, Description Right */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h2 className="text-neutral-900 text-3xl md:text-4xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl">
              Complete Design <br /> Solutions Under One Roof
            </h2>
            <p className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed max-w-sm lg:text-left">
              We transform your vision into functional, inspiring spaces
              with creativity, quality, and attention to detail.
            </p>
          </div>

          {/* Grid: 3 Column Layout */}
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.slice(0, 3).map((srv: any, idx: number) => (
              <Link
                key={srv.id}
                href={`/services/${srv.slug}`}
                className="group relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-2xl transition-all duration-700 bg-neutral-100 block"
              >
                {/* Background Image */}
                <img
                  src={srv.hero_image?.url || srv.thumbnail_image?.url || `/images/service-placeholder.jpg`}
                  alt={srv.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                {/* Arrow Icon Button (Top Right) */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-neutral-900 shadow-xl z-20 transform translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500">
                  <MoveRight size={20} className="-rotate-45" />
                </div>

                {/* Service Title (Bottom Left) */}
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-white text-[28px] font-normal font-baumans tracking-tight transform group-hover:translate-x-2 transition-transform duration-500">
                    {srv.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Link 
              href="/services" 
              className="inline-block px-14 py-4 border-2 border-neutral-200 text-neutral-800 font-black rounded-full hover:border-neutral-800 hover:bg-neutral-50 transition-all"> 
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: OUR PROCESS ─────────────────────── */}
      <section className="py-32 bg-white overflow-hidden relative">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex justify-between items-center mb-20">
            <h2 className="text-neutral-900 text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
              Our Process
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-2">
            {[
              { title: "Consultation and Planning", icon: Users, filled: true },
              { title: "Concept Design and Visualization", icon: PencilRuler },
              { title: "Design Finalization", icon: Ruler },
              { title: "Execution & Supervision", icon: Building2 },
              { title: "Project Handover", icon: KeyRound },
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-6 shrink-0">
                  <div
                    className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300
                ${step.filled
                        ? "bg-neutral-300 text-white"
                        : "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400"
                      }`}
                  >
                    <step.icon size={48} strokeWidth={1.25} />
                  </div>
                  <p className="text-center text-[15px] text-neutral-600 leading-snug max-w-[150px]">
                    {step.title}
                  </p>
                </div>

                {idx < arr.length - 1 && (
                  <div className="hidden lg:flex items-center h-36">
                    <ArrowRight
                      size={20}
                      strokeWidth={1.5}
                      className="text-neutral-400 shrink-0"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Our Projects ──────────────────────── */}
      <section className="py-6 md:py-16 bg-zinc-100">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <h2 className="text-neutral-800 text-4xl md:text-5xl font-extrabold font-inter uppercase tracking-tighter">Our Projects</h2>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-300 hover:border-black hover:text-black transition-all shadow-sm">
                <MoveRight size={24} className="rotate-180" />
              </button>
              <button className="w-12 h-12 rounded-full bg-[#C59D5F] flex items-center justify-center text-white shadow-lg hover:bg-neutral-800 transition-all">
                <MoveRight size={24} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {projects.length > 0 ? (
              projects.slice().sort((a: any, b: any) => b.id - a.id).slice(0, 2).map((project: any) => (
                <Link key={project.id} href={`/projects/${project.slug}`} className="space-y-8 group cursor-pointer">
                  <div className="h-[300px] sm:h-[450px] lg:h-[550px] rounded-[20px] overflow-hidden shadow-2xl relative ring-1 ring-black/5">
                    <img
                      src={project.thumbnail_image_url || project.gallery_image_urls?.[0] || "/images/project-placeholder.jpg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                    />
                    <div className="absolute top-10 right-10 w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-black border border-black/5 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0 shadow-2xl">
                      <ArrowRight size={28} className="-rotate-45" />
                    </div>
                  </div>
                  <div className="space-y-4 px-4">
                    <h3 className="text-neutral-800 text-3xl font-black font-inter group-hover:text-[#C59D5F] transition-colors">{project.title}</h3>
                    <p className="text-neutral-500 text-lg leading-relaxed max-w-md italic border-l-2 border-neutral-100 pl-4">
                      {project.short_description || project.subtitle || "Modern design solution tailored to specific client needs and space requirements."}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              // Realistic Project Placeholders
              [1, 2].map((i) => (
                <div key={i} className="space-y-8">
                  <div className="h-[300px] sm:h-[450px] lg:h-[550px] rounded-[50px] bg-neutral-50 animate-pulse border border-neutral-100" />
                  <div className="space-y-4 px-4">
                    <div className="h-10 w-3/4 bg-neutral-100 animate-pulse rounded-full" />
                    <div className="h-6 w-full bg-neutral-50 animate-pulse rounded-full" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-24">
            <Link href="/projects" className="inline-block px-14 py-4 border-2 border-neutral-200 text-neutral-800 font-black rounded-full hover:border-neutral-800 hover:bg-neutral-50 transition-all">
              View Our Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 7: What Our Customer Says ──────────────── */}
      <section className="py-32 relative overflow-hidden min-h-[800px]">
        {/* Background with Blur & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/living-room.jpg"
            alt="Testimonials Background"
            className="w-full h-full object-cover blur-md scale-110 brightness-[0.4]"
          />
        </div>

        <TestimonialsSlider ratings={ratings} />
      </section>
      {/* ── Section 8: Blogs ───────────────────────────── */}
      <section className="py-6 md:py-16 bg-white">
        <BlogSlider blogs={blogs} />
      </section>
    </div>
  );
}
