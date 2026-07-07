"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  slug: string;
  featured_image_url?: string | null;
  short_description?: string | null;
}

interface BlogSliderProps {
  blogs: Blog[];
}

export default function BlogSlider({ blogs }: BlogSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    if (blogs.length <= 2) return;
    setCurrentIndex((prev) => (prev + 1) % (blogs.length - 1));
  };

  const prev = () => {
    if (blogs.length <= 2) return;
    setCurrentIndex((prev) => (prev - 1 + (blogs.length - 1)) % (blogs.length - 1));
  };

  const visibleBlogs = blogs.length > 2 
    ? blogs.slice(currentIndex, currentIndex + 2) 
    : blogs;

  return (
    <div className="container mx-auto px-6 lg:px-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-20 gap-8">
        <h2 className="text-gray-800 text-5xl md:text-5xl lg:text-6xl font-bold font-inter leading-tight whitespace-pre-line">
          Latest Blog Updates
        </h2>
        <div className="hidden md:flex gap-4">
          <button 
            onClick={prev}
            className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-300 hover:border-black hover:text-black transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={next}
            className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white shadow-lg hover:bg-gray-900 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-16 lg:gap-20">
        {visibleBlogs.length > 0 ? visibleBlogs.map((blog: any) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`} className="group flex flex-col space-y-10 animate-in fade-in slide-in-from-right-5 transition-all duration-500 cursor-pointer">
            <div className="h-[480px] rounded-[30px] overflow-hidden relative shadow-2xl ring-1 ring-black/5">
              <Image
                src={blog.featured_image_url || "/images/trunky.png"}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[2.5s] group-hover:scale-110"
              />
              <div className="absolute top-10 right-10 w-14 h-14 bg-white/95 backdrop-blur rounded-full flex items-center justify-center text-black border border-black/5 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-0 group-hover:scale-100 hover:bg-[#C59D5F] hover:text-white">
                <ArrowRight size={26} className="-rotate-45" />
              </div>
            </div>
            <div className="space-y-6 px-4 group-hover:translate-x-2 transition-transform duration-500">
              <h3 className="text-gray-600 text-3xl font-black font-inter group-hover:text-gray-900 transition-colors line-clamp-1 leading-tight">
                {blog.title}
              </h3>
              <p className="text-neutral-500 text-lg leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity text-justify">
                {blog.short_description || "Exploring the intersection of luxury, comfort, and state-of-the-art architectural design trends for current and future living."}
              </p>
            </div>
          </Link>
        )) : (
          // Realistic Blog Placeholders
          [1, 2].map((i) => (
            <div key={i} className="space-y-10">
              <div className="h-[480px] rounded-[30px] bg-neutral-50 animate-pulse border border-neutral-100" />
              <div className="space-y-6 px-4">
                <div className="h-10 w-full bg-neutral-100 animate-pulse rounded-full" />
                <div className="h-6 w-5/6 bg-neutral-50 animate-pulse rounded-full" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center mt-32">
        <Link href="/blog" className="inline-block px-14 py-4 border-2 border-neutral-200 text-neutral-800 rounded-full hover:border-neutral-800 hover:bg-neutral-50 transition-all">
          View All
        </Link>
      </div>
    </div>
  );
}
