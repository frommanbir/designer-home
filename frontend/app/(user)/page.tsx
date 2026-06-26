import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getServices } from "@/lib/services";
import { getProjects } from "@/lib/projects";
import { getBlogs } from "@/lib/blogs";
import { getRatings } from "@/lib/ratings";
import { serverFetch } from "@/lib/server-api";
import { ArrowRight, Star, Clock, CheckCircle, Headphones, Award, MoveRight } from "lucide-react";

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
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src="/images/about-home.png"
            alt="Designer Home Hero"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── Section 2: Designing Spaces ────────────────── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <h2 className="text-neutral-800 text-4xl md:text-5xl lg:text-6xl font-bold font-inter leading-tight">
                Designing Spaces <br /> That inspire Living
              </h2>
              <div className="space-y-6">
                <p className="text-neutral-600 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                  Transform your vision into reality with innovative interior & architectural design solutions. From concept creation & 3D visualization.
                </p>
                <div className="pt-2">
                  <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-xl">
                    Established in 2016 A.D. <br /> Your trusted partner for customized residential, commercial, and hospitality design projects.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/about" className="px-10 py-4 bg-zinc-800 text-white font-semibold rounded-full hover:bg-neutral-700 transition-all transform hover:-translate-y-1 shadow-lg">
                  Learn More
                </Link>
                <Link href="/portfolio" className="px-10 py-4 border border-zinc-300 text-zinc-800 font-semibold rounded-full hover:bg-zinc-50 transition-all shadow-sm">
                  Our Portfolio
                </Link>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-100/50 blur-[80px] rounded-full -z-10" />
              <div className="rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-black/5">
                 <img
                   src="/images/designspace.png"
                   alt="Expert Design"
                   className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110"
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Value Proposition ───────────────── */}
      <section className="py-24 bg-zinc-50/50">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
             <div className="flex-1">
                <p className="text-neutral-600 text-lg md:text-xl font-medium leading-relaxed border-l-4 border-[#C59D5F] pl-8 py-4">
                  We bring dreams to life through thoughtful interior & architecture design, creating beautiful, functional spaces that reflect your vision and lifestyle.
                </p>
             </div>
             <div className="flex-1 grid grid-cols-3 gap-8 md:gap-16 w-full">
                <div className="text-center lg:text-left">
                  <h3 className="text-neutral-900 text-4xl md:text-5xl lg:text-6xl font-black mb-2">200+</h3>
                  <p className="text-neutral-500 text-xs md:text-sm font-bold uppercase tracking-widest">Projects</p>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-neutral-900 text-4xl md:text-5xl lg:text-6xl font-black mb-2">400+</h3>
                  <p className="text-neutral-500 text-xs md:text-sm font-bold uppercase tracking-widest">Clients</p>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-neutral-900 text-4xl md:text-5xl lg:text-6xl font-black mb-2">4.5</h3>
                  <p className="text-neutral-500 text-xs md:text-sm font-bold uppercase tracking-widest">Ratings</p>
                </div>
             </div>
          </div>
          <div className="mt-20 text-center lg:text-left lg:ml-[53%]">
             <Link href="/projects" className="px-12 py-3 bg-zinc-800 text-white text-xs font-bold rounded-lg hover:bg-[#C59D5F] transition-all uppercase tracking-[0.2em] shadow-md">
                Explore Projects
             </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: Solutions ───────────────────────── */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
             <div className="space-y-4">
               <h2 className="text-neutral-800 text-4xl md:text-5xl font-bold font-inter leading-tight max-w-xl italic">
                 Complete Design Solutions Under One Roof
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
      <section className="py-32 bg-zinc-50/50 overflow-hidden relative">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex justify-between items-center mb-24">
             <h2 className="text-neutral-800 text-4xl md:text-5xl font-black font-inter tracking-tighter uppercase italic opacity-90 group">
               Our Process
               <span className="block h-1.5 w-1/2 bg-[#C59D5F] mt-2 origin-left transition-transform duration-700 scale-x-0 group-hover:scale-x-100" />
             </h2>
             <Link href="/contact" className="hidden md:inline-flex px-10 py-4 bg-neutral-800 text-white text-[10px] font-bold rounded-lg hover:bg-[#C59D5F] transition-all uppercase tracking-[0.3em] items-center gap-2 shadow-lg">
                Learn More <ArrowRight size={14} />
             </Link>
          </div>

          <div className="relative flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-4">
            {/* Connection Line */}
            <div className="absolute top-[4.5rem] left-[10%] right-[10%] h-[1px] bg-neutral-200 hidden lg:block z-0" />

            {[
              { title: "Interior Design", icon: Headphones },
              { title: "Construction & Planning", icon: Award },
              { title: "Floor Planning", icon: CheckCircle },
              { title: "Site Visit & Supervision", icon: Clock },
              { title: "3D Modeling", icon: Star }
            ].map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-8 relative z-10 group cursor-default">
                <div className={`w-36 h-36 rounded-full border-2 flex items-center justify-center transition-all duration-700 shadow-sm
                  ${idx % 2 === 0 ? 'bg-white border-neutral-100 group-hover:border-[#C59D5F] text-neutral-600 group-hover:text-[#C59D5F]' : 'bg-neutral-800 border-neutral-800 text-white group-hover:bg-[#C59D5F] group-hover:border-[#C59D5F]'}
                  group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl`}>
                  <step.icon size={56} strokeWidth={1} />
                </div>
                <div className="space-y-2 text-center transform transition-transform group-hover:translate-y-2">
                   <p className="text-[#C59D5F] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Step 0{idx + 1}</p>
                   <p className="text-neutral-700 font-bold text-sm uppercase tracking-wider max-w-[150px] transition-colors group-hover:text-black">{step.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Our Projects ──────────────────────── */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <h2 className="text-neutral-800 text-4xl md:text-5xl font-extrabold font-inter uppercase tracking-tighter italic">Our Projects</h2>
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
            {/* Project Card 1 */}
            <div className="space-y-8 group cursor-pointer">
              <div className="h-[550px] rounded-[50px] overflow-hidden shadow-2xl relative ring-1 ring-black/5">
                <img
                  src="/images/bedroom.jpg"
                  alt="Residential"
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                />
                <div className="absolute top-10 right-10 w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-black border border-black/5 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0 shadow-2xl">
                   <ArrowRight size={28} className="-rotate-45" />
                </div>
              </div>
              <div className="space-y-4 px-4">
                <h3 className="text-neutral-800 text-3xl font-black font-inter group-hover:text-[#C59D5F] transition-colors">Residential Projects</h3>
                <p className="text-neutral-500 text-lg leading-relaxed max-w-md italic border-l-2 border-neutral-100 pl-4">
                   Bespoke living environments that blend intimacy with luxury. Every detail is curated to reflect the art of high-end living.
                </p>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="space-y-8 group cursor-pointer">
              <div className="h-[550px] rounded-[50px] overflow-hidden shadow-2xl relative ring-1 ring-black/5">
                <img
                  src="/images/dining.jpg"
                  alt="Commercial"
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                />
                <div className="absolute top-10 right-10 w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-black border border-black/5 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0 shadow-2xl">
                   <ArrowRight size={28} className="-rotate-45" />
                </div>
              </div>
              <div className="space-y-4 px-4">
                <h3 className="text-neutral-800 text-3xl font-black font-inter group-hover:text-[#C59D5F] transition-colors">Commercial Projects</h3>
                <p className="text-neutral-500 text-lg leading-relaxed max-w-md italic border-l-2 border-neutral-100 pl-4">
                   Elevate your business presence with sophisticated architectural designs that inspire productivity and define your brand.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-24">
            <Link href="/projects" className="inline-block px-14 py-4 border-2 border-neutral-200 text-neutral-800 text-[10px] font-black rounded-full hover:border-neutral-800 hover:bg-neutral-50 transition-all uppercase tracking-[0.4em] shadow-sm">
               Explore Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 7: What Our Customer Says ──────────────── */}
      <section className="py-32 bg-neutral-900 text-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#C59D5F]/20 blur-[120px] rounded-full" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-white/5 blur-[120px] rounded-full" />

        <div className="container mx-auto px-6 lg:px-24 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-12">
             <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold font-inter leading-tight">
                What Our <br />
                <span className="text-[#C59D5F] italic">
                  Customer
                </span> Says
             </h2>
             <div className="flex gap-4">
                <button className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white transition-all shadow-inner">
                  <MoveRight size={28} className="rotate-180" />
                </button>
                <button className="w-16 h-16 rounded-full border border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                  <MoveRight size={28} />
                </button>
             </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {ratings.length > 0 ? ratings.slice(0, 2).map((rating: any) => (
              <div key={rating.id} className="p-12 bg-white/5 backdrop-blur-xl rounded-[60px] border border-white/5 hover:bg-white/10 transition-all duration-700 group hover:-translate-y-2">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h4 className="text-3xl font-bold font-inter group-hover:text-[#C59D5F] transition-colors">{rating.customer_name}</h4>
                    <p className="text-white/20 text-[10px] mt-2 uppercase tracking-[0.3em] font-black">{rating.review_date || "VALUED CLIENT"}</p>
                  </div>
                  <div className="flex gap-1.5 p-4 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={20} fill={i < rating.rating ? "#C59D5F" : "none"} className={i < rating.rating ? "text-[#C59D5F]" : "text-white/5"} />
                    ))}
                  </div>
                </div>
                <p className="text-white/60 text-xl leading-relaxed italic line-clamp-5 font-baumans opacity-80 group-hover:opacity-100 transition-opacity">
                  "{rating.review_text}"
                </p>
              </div>
            )) : (
              // Enhanced Placeholder
              [1, 2].map((i) => (
                <div key={i} className="p-12 bg-white/5 backdrop-blur-md rounded-[60px] border border-white/5 opacity-40">
                  <div className="flex justify-between items-start mb-12">
                    <div className="h-10 w-56 bg-white/5 animate-pulse rounded-full" />
                    <div className="h-10 w-32 bg-white/5 animate-pulse rounded-full" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-white/5 animate-pulse rounded" />
                    <div className="h-4 w-full bg-white/5 animate-pulse rounded" />
                    <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center gap-4 mt-24">
             <div className="w-20 h-1 bg-[#C59D5F] rounded-full" />
             <div className="w-4 h-1 bg-white/10 rounded-full" />
             <div className="w-4 h-1 bg-white/10 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Section 8: Blogs ───────────────────────────── */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
            <h2 className="text-neutral-800 text-4xl md:text-5xl lg:text-6xl font-black font-inter uppercase tracking-tighter group cursor-default">
              Latest Blog Updates
              <span className="block h-1 w-24 bg-[#C59D5F] mt-3 group-hover:w-full transition-all duration-700" />
            </h2>
            <div className="hidden md:flex gap-4">
               <button className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-300 hover:border-black hover:text-black transition-all">
                 <MoveRight size={24} className="rotate-180" />
               </button>
               <button className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center text-white shadow-lg hover:bg-[#C59D5F] transition-all">
                 <MoveRight size={24} />
               </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 lg:gap-20">
            {blogs.length > 0 ? blogs.slice(0, 2).map((blog: any) => (
              <div key={blog.id} className="group flex flex-col space-y-10">
                <div className="h-[480px] rounded-[50px] overflow-hidden relative shadow-2xl ring-1 ring-black/5">
                  <img
                    src={blog.featured_image_url || "/images/blog-placeholder.jpg"}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110"
                  />
                  <div className="absolute top-10 right-10 w-14 h-14 bg-white/95 backdrop-blur rounded-full flex items-center justify-center text-black border border-black/5 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-0 group-hover:scale-100 hover:bg-[#C59D5F] hover:text-white">
                     <ArrowRight size={26} className="-rotate-45" />
                  </div>
                </div>
                <div className="space-y-6 px-4 group-hover:translate-x-2 transition-transform duration-500">
                   <div className="flex items-center gap-3">
                      <span className="text-[#C59D5F] text-[10px] font-black uppercase tracking-widest border border-[#C59D5F]/20 px-3 py-1 rounded-full">Article</span>
                      <span className="text-neutral-300 text-[10px] uppercase font-bold tracking-widest">5 min read</span>
                   </div>
                   <h3 className="text-neutral-900 text-3xl font-black font-inter group-hover:text-[#C59D5F] transition-colors line-clamp-2 leading-tight">
                     {blog.title}
                   </h3>
                   <p className="text-neutral-500 text-lg leading-relaxed line-clamp-3 italic opacity-80 group-hover:opacity-100 transition-opacity">
                     {blog.short_description || "Exploring the intersection of luxury, comfort, and state-of-the-art architectural design trends for current and future living."}
                   </p>
                </div>
              </div>
            )) : (
              // Realistic Blog Placeholders
              [1, 2].map((i) => (
                <div key={i} className="space-y-10">
                  <div className="h-[480px] rounded-[50px] bg-neutral-50 animate-pulse border border-neutral-100" />
                  <div className="space-y-6 px-4">
                    <div className="h-10 w-full bg-neutral-100 animate-pulse rounded-full" />
                    <div className="h-6 w-5/6 bg-neutral-50 animate-pulse rounded-full" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-32">
            <Link href="/blog" className="inline-block px-16 py-5 bg-[#111] text-white text-[10px] font-black rounded-full hover:bg-[#C59D5F] transition-all uppercase tracking-[0.5em] shadow-2xl transform hover:-translate-y-1">
               Read The Journal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
