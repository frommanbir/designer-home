import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getBlogs } from "@/lib/blogs";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const BlogListPage = async () => {
  const blogs = await getBlogs();

  return (
    <div className="bg-white overflow-x-hidden min-h-screen">

      {/* Hero Header */}
      <section className="pt-40 pb-20 px-6 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-[#C59D5F] font-bold tracking-[0.4em] uppercase text-[10px] mb-6">Insights & Aesthetics</h4>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8 text-neutral-900 leading-[0.85]">
            The <span className="italic font-light">Journal</span>
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg font-light leading-relaxed font-sans">
            Curated narratives on spatial design, material mastery, and the art of professional living.
          </p>
        </div>
      </section>

      {/* Featured/Latest Blog */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto py-24 px-6">
          <Link href={`/blog/${blogs[0].slug}`} className="group grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-neutral-100">
              <img 
                src={blogs[0].image_url || "/images/placeholder.jpg"} 
                alt={blogs[0].title}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
              />
              <div className="absolute top-8 left-8 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#C59D5F] shadow-sm">
                Featured Insight
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 font-sans">
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(blogs[0].published_date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> 5 MIN READ</span>
              </div>
              
              <h2 className="text-5xl font-black text-neutral-900 leading-tight group-hover:text-[#C59D5F] transition-colors">
                {blogs[0].title}
              </h2>
              
              <p className="text-neutral-500 text-xl font-light leading-relaxed font-sans">
                {blogs[0].short_description}
              </p>
              
              <div className="pt-4 inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-neutral-900 font-sans">
                <span>Read Article</span>
                <div className="w-12 h-[1px] bg-neutral-900 group-hover:w-20 transition-all"></div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Secondary Grid */}
      <section className="bg-neutral-50 py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {blogs.slice(1).map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block space-y-8">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white shadow-sm border border-neutral-100">
                  <img 
                    src={blog.image_url || "/images/placeholder.jpg"} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-[#C59D5F] font-sans">
                    <span>{new Date(blog.published_date).toLocaleDateString()}</span>
                    <div className="w-1 h-1 bg-neutral-200 rounded-full"></div>
                    <span>Design Insight</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-neutral-900 leading-snug group-hover:text-[#C59D5F] transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-neutral-500 text-sm font-light leading-relaxed font-sans line-clamp-3">
                    {blog.short_description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {blogs.length === 0 && (
            <div className="py-40 text-center border-2 border-dashed border-neutral-200 rounded-[3rem]">
              <h3 className="text-2xl font-light text-neutral-400 italic">Our editorial team is currently crafting new design stories.</h3>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter simple */}
      <section className="py-32 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-neutral-900">Weekly <span className="text-[#C59D5F]">Aesthetic</span></h2>
          <p className="text-neutral-500 font-light font-sans text-lg">Receive our curated design picks and professional insights directly in your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto font-sans pt-4">
            <input type="email" placeholder="Email Address" className="flex-1 px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black outline-none transition-all placeholder:text-neutral-400" />
            <button className="px-8 py-4 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#C59D5F] transition-all">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogListPage;
