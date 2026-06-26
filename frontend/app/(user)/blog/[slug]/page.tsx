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
    <div className="bg-white overflow-x-hidden min-h-screen">

      {/* Header Info */}
      <article className="max-w-4xl mx-auto pt-40 pb-32 px-6">
        <header className="space-y-10 text-center mb-16">
          
          <div className="space-y-4">
             <h1 className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tighter uppercase leading-[0.9]">
               {blog.title}
             </h1>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-neutral-400 font-sans border-t border-b border-neutral-100 py-8">
             <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Published on {new Date(blog.published_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
             </div>
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
        <div className="prose prose-xl prose-neutral max-w-none font-sans font-light leading-relaxed text-neutral-700 whitespace-pre-line space-y-8 text-justify">
          {blog.content}
        </div>
        <Link 
            href="/blog" 
            className="inline-flex items-center gap-3 text-neutral-400 py-2 hover:text-[#C59D5F] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 transition-all font-sans"
          >
            <ArrowLeft size={16} />
            <span>Journal Index</span>
          </Link>
      </article>
      
    </div>
  );
};

export default BlogPostPage;
