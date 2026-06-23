import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getBlogBySlug } from "@/lib/blogs";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";

export const dynamic = "force-dynamic";

const BlogPostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  
  let blog;
  try {
    blog = await getBlogBySlug(slug);
  } catch (err) {
    return notFound();
  }

  if (!blog) return notFound();

  return (
    <div className="bg-white font-serif overflow-x-hidden min-h-screen">
      <Navbar transparent={false} />

      {/* Header Info */}
      <article className="max-w-4xl mx-auto pt-40 pb-32 px-6">
        <header className="space-y-10 text-center mb-16">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-3 text-neutral-400 hover:text-[#C59D5F] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 transition-all font-sans"
          >
            <ArrowLeft size={16} />
            <span>Journal Index</span>
          </Link>
          
          <div className="space-y-4">
             <div className="text-[#C59D5F] font-black tracking-[0.2em] uppercase text-xs font-sans">
               Design Philosophy
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tighter uppercase leading-[0.9]">
               {blog.title}
             </h1>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-neutral-400 font-sans border-t border-b border-neutral-100 py-8">
             <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Published on {new Date(blog.published_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
             </div>
             <div className="hidden md:block w-1.5 h-1.5 bg-neutral-100 rounded-full"></div>
             <div className="italic">Written by Editorial Team</div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="aspect-video w-full rounded-[3rem] overflow-hidden mb-20 shadow-2xl">
          <img 
            src={blog.image_url || "/images/placeholder.jpg"} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content */}
        <div className="prose prose-xl prose-neutral max-w-none font-sans font-light leading-relaxed text-neutral-700 whitespace-pre-line space-y-8">
          {blog.content}
        </div>

        {/* Bottom Metadata */}
        <footer className="mt-24 pt-12 border-t border-neutral-100 flex flex-col items-center gap-10">
           <div className="flex items-center gap-8">
              <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
                <Share2 size={16} />
                <span>Direct Link</span>
              </button>
           </div>
           
           <div className="w-24 h-1 bg-[#C59D5F]/20"></div>
           
           <div className="text-center space-y-6">
              <h4 className="text-3xl font-black uppercase tracking-tight text-neutral-900 leading-tight">Ready to transform Your <br/>Own space?</h4>
              <Link 
                href="/contact" 
                className="inline-block px-10 py-5 bg-[#C59D5F] text-white font-black tracking-widest text-xs uppercase rounded-full hover:bg-black transition-all shadow-xl"
              >
                Inquire Professionally
              </Link>
           </div>
        </footer>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
