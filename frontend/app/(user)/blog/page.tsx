import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getBlogs } from "@/lib/blogs";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const BlogListPage = async () => {
  const blogs = await getBlogs();

  const heroImage = "/images/about-home.png"; 
  const heroTitle = "The Journal";

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen">

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[700px] w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={heroTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 z-20">
          <div className="backdrop-blur-sm p-8 rounded">
            <h1 className="text-white text-5xl md:text-7xl leading-tight font-bold">
              Insights &
              <br />
              Aesthetics
            </h1>
            <div className="mt-6 h-[3px] w-[500px] bg-[#C59D5F]"></div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto py-24 px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="space-y-4">
          <h4 className="text-[#C59D5F] font-bold tracking-[0.4em] uppercase text-[10px]">The Designer Home Perspective</h4>
          <h2 className="text-6xl md:text-7xl font-black text-[#222] tracking-tighter uppercase leading-[0.85]">
            The <span className="italic font-light">Journal</span>
          </h2>
        </div>
        <p className="text-lg text-[#666] leading-relaxed max-w-7xl mx-auto font-light">
          Curated narratives on spatial design, material mastery, and the art of professional living. We share our vision of turning houses into dream homes.
        </p>
      </section>

      {/* Blogs Grid */}
      <section className="max-w-7xl mx-auto pb-32 px-6">
        {blogs.length === 0 ? (
          <div className="py-20 text-center bg-[#F9F9F9] rounded-[3rem]">
            <h3 className="text-2xl font-light text-neutral-400 italic">Our editorial team is currently crafting new design stories.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {blogs.map((blog, idx) => (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.slug}`} 
                className={`group block space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-${idx * 100}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-neutral-100 shadow-xl transition-transform duration-700 group-hover:scale-[1.02]">
                  <img 
                    src={blog.image_url || "/images/placeholder.jpg"} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute top-8 left-8 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-[#C59D5F] shadow-sm transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {new Date(blog.published_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                
                <div className="space-y-4 px-2 transform transition-transform group-hover:translate-x-2 duration-500">
                 
                  <h3 className="text-3xl font-black text-neutral-900 leading-tight group-hover:text-[#C59D5F] transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-[#666] text-base font-light leading-relaxed line-clamp-3 text-justify">
                    {blog.short_description || "Exploring the intersection of luxury, comfort, and state-of-the-art architectural design trends for current and future living."}
                  </p>

                  <div className="pt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-neutral-900">
                    <span>Read Article</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform text-[#C59D5F]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogListPage;
