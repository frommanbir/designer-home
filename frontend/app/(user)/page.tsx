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
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <h2 className="text-neutral-800 text-4xl md:text-5xl lg:text-6xl font-bold font-inter leading-tight">
                Designing Spaces <br /> That inspire Living
              </h2>
              <div className="space-y-6">
                <p className="text-neutral-600 text-lg md:text-xl font-medium leading-relaxed max-w-xl font-inter">
                  Transform your vision into reality with innovative interior & architectural design solutions. From concept creation & 3D visualization to project execution & supervision, Designer Home delivers exceptional
                  spaces tailored to your lifestyle and needs.
                </p>
                <div className="pt-2">
                  <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-xl font-inter">
                    Established in 2016 A.D.<br></br>Your trusted partner for customized residential, commercial, and hospitality <br></br> design projects.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/about" className="px-10 py-4 bg-zinc-600 text-white font-semibold rounded-full hover:bg-neutral-700 transition-all transform hover:-translate-y-1 shadow-lg">
                  Click for Inquiry
                </Link>
                <Link href="/portfolio" className="px-10 py-4 border border-zinc-300 text-zinc-800 font-semibold rounded-full hover:bg-zinc-50 transition-all shadow-sm">
                  Explore Our Projects
                </Link>
              </div>
            </div>
            <div className="relative group ">
              <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                <img
                  src="/images/designspace.png"
                  alt="Expert Design"
                  className="w-full h-[500px] object-cover  transition-transform duration-1000 group-hover:scale-110"
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
            <div className="flex-1">
              <img
                src="/images/webring.png"
                alt="Interior Design"
                className="w-full h-[600px] object-cover rounded-lg"
              />
            </div>

            {/* Right Content */}
            <div className="flex-1">
              <p className="text-neutral-600 text-3xl md:text-xl font-medium leading-relaxed border-l-4 border-[#C59D5F] pl-8 py-4">
                We bring dreams to life through thoughtful interior & architecture
                design, creating beautiful, functional spaces that reflect your
                vision and lifestyle.
              </p>

              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <h3 className="text-5xl font-black">200+</h3>
                  <p className="text-xs uppercase tracking-widest text-neutral-500">
                    Our Expertise
                  </p>
                </div>

                <div>
                  <h3 className="text-5xl font-black">400+</h3>
                  <p className="text-xs uppercase tracking-widest text-neutral-500">
                    Projects
                  </p>
                </div>

                <div>
                  <h3 className="text-5xl font-black">4.5</h3>
                  <p className="text-xs uppercase tracking-widest text-neutral-500">
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

      {/* ── Section 4: Solutions ───────────────────────── */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-neutral-800 text-7xl md:text-5xl font-bold font-inter leading-tight max-w-xl italic">
                Complete Design<br></br> Solutions Under One Roof
              </h2>
            </div>
            <p className="text-neutral-500 max-w-xs text-sm font-medium leading-relaxed italic border-b border-neutral-200 pb-2">
              Providing specialized design and construction services tailored to your unique aesthetic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((srv: any, idx: number) => (
              <div key={srv.id} className="group relative h-[500px] rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ring-1 ring-black/5">
                <img
                  src={srv.thumbnail_image?.url || `/images/service-${idx + 1}.jpg`}
                  alt={srv.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                <div className="absolute bottom-10 left-10 right-10 z-20 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <div className="max-w-[70%]">
                    <h3 className="text-white text-2xl md:text-3xl font-bold font-inter mb-2 leading-tight drop-shadow-md">{srv.title}</h3>
                    <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all delay-200">View Services</p>
                  </div>
                  <Link href={`/services/${srv.slug}`} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-[#C59D5F] hover:border-[#C59D5F] transition-all group-hover:scale-110 shadow-xl">
                    <ArrowRight size={22} className="-rotate-45 transition-transform group-hover:scale-110" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/services" className="inline-block px-12 py-4 border-2 border-neutral-800 text-neutral-800 text-[10px] font-black rounded-full hover:bg-neutral-800 hover:text-white transition-all uppercase tracking-[0.4em] shadow-sm">
              View All Services
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
            {/* <Link
              href="/contact"
              className="hidden md:inline-flex px-6 py-3 bg-neutral-700 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors items-center gap-2"
            >
              View in detail
            </Link> */}
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
                  <div className="h-[550px] rounded-[20px] overflow-hidden shadow-2xl relative ring-1 ring-black/5">
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
                  <div className="h-[550px] rounded-[50px] bg-neutral-50 animate-pulse border border-neutral-100" />
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
