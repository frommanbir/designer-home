"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Rating {
  id: number;
  customer_name: string;
  review_date?: string | null;
  review_text?: string | null;
  rating: number;
}

interface TestimonialsSliderProps {
  ratings: Rating[];
}

export default function TestimonialsSlider({ ratings }: TestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    if (ratings.length <= 2) return;
    setCurrentIndex((prev) => (prev + 1) % (ratings.length - 1));
  };

  const prev = () => {
    if (ratings.length <= 2) return;
    setCurrentIndex((prev) => (prev - 1 + (ratings.length - 1)) % (ratings.length - 1));
  };

  const visibleRatings = ratings.length > 2
    ? ratings.slice(currentIndex, currentIndex + 2)
    : ratings;

  return (
    <div className="container mx-auto px-6 lg:px-24 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-12">
        <h2 className="text-white text-5xl md:text-7xl font-bold font-inter leading-tight tracking-tight">
          What Our Customer Says
        </h2>
        <div className="flex gap-4">
          <button
            onClick={prev}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-all bg-black/20"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shadow-xl hover:bg-[#C59D5F] hover:text-white transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-x-12 gap-y-24">
        {visibleRatings.length > 0 ? visibleRatings.map((rating: any) => (
          <div key={rating.id} className="relative transition-all duration-500 animate-in fade-in slide-in-from-right-5">
            {/* SINGLE unified box: name + date + review text */}
            <div className="border-2 border-white rounded-[30px] p-10 md:p-12 pt-8 bg-white/5 backdrop-blur-xl h-[400px] flex flex-col">
              <h4 className="text-2xl md:text-3xl font-bold text-white mb-1">{rating.customer_name}</h4>
              <p className="text-white/50 text-sm md:text-base font-medium tracking-wide mb-6">
                {rating.review_date || "Valued Client"}
              </p>
              <div className="flex-1 overflow-hidden">
                <p className="text-white text- msmd:text-sm leading-relaxed font-light whitespace-pre-line line-clamp-9 text-justify">
                  {rating.review_text}
                </p>
              </div>
            </div>

            {/* Star rating: its own separate floating box, overlapping the top-right corner */}
            <div className="absolute -top-6 right-10 border-2 border-white rounded-full px-6 py-2 bg-black/20 backdrop-blur-md flex gap-1.5 shadow-2xl">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill={i < rating.rating ? "white" : "none"} className={i < rating.rating ? "text-white" : "text-white/20"} />
              ))}
            </div>
          </div>
        )) : (
          // Realistic Testimonial Placeholders
          [1, 2].map((i) => (
            <div key={i} className="relative p-12 pt-8 border-2 border-white/20 rounded-[30px] bg-white/5 animate-pulse h-[400px]">
              <div className="absolute -top-6 right-10 w-48 h-12 border-2 border-white/10 rounded-full bg-white/5" />
              <div className="space-y-6">
                <div className="h-10 w-64 bg-white/10 rounded-full" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-4/5 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center gap-4 mt-20">
        {ratings.length > 0 && Array.from({ length: Math.min(ratings.length, 3) }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${(currentIndex === i || (ratings.length <= 2 && i === 0)) ? "w-20 bg-white" : "w-8 bg-white/20"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
