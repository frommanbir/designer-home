"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Responsive items count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1280) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalImages = images.length;
  const maxIndex = Math.max(0, totalImages - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
    document.body.style.overflow = "auto";
  };

  if (!images || images.length === 0) return null;

  return (
    <section className="bg-neutral-50 py-32 px-6">
      <div className="max-w-[1400px] mx-auto relative group">
        {/* Navigation Arrows */}
        {totalImages > itemsPerView && (
          <>
            <button
              onClick={prev}
              className="absolute -left-8 md:-left-16 top-1/2 -translate-y-1/2 z-30 p-2 text-neutral-300 hover:text-[#C59D5F] transition-all transform hover:scale-110 active:scale-95"
              aria-label="Previous images"
            >
              <ChevronLeft size={64} strokeWidth={1} />
            </button>
            <button
              onClick={next}
              className="absolute -right-8 md:-right-16 top-1/2 -translate-y-1/2 z-30 p-2 text-neutral-300 hover:text-[#C59D5F] transition-all transform hover:scale-110 active:scale-95"
              aria-label="Next images"
            >
              <ChevronRight size={64} strokeWidth={1} />
            </button>
          </>
        )}

        {/* Slider Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / totalImages)}%)`,
              width: `${(totalImages / itemsPerView) * 100}%`
            }}
          >
            {images.map((url, idx) => (
              <div
                key={idx}
                className="px-3 md:px-4"
                style={{ width: `${100 / totalImages}%` }}
              >
                <div 
                  className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-neutral-200 cursor-pointer shadow-xl group/item"
                  onClick={() => openFullscreen(idx)}
                >
                  <img
                    src={url}
                    alt={`${title} - Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-all duration-500 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-5 rounded-full opacity-0 group-hover/item:opacity-100 transition-all scale-75 group-hover/item:scale-100 border border-white/30">
                      <Maximize2 size={32} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalImages > itemsPerView && (
          <div className="flex justify-center gap-3 mt-16">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all duration-500 rounded-full ${
                  currentIndex === idx ? "w-16 bg-[#C59D5F]" : "w-4 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      {fullscreenIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-all transform hover:rotate-90 z-[110]"
          >
            <X size={48} strokeWidth={1} />
          </button>

          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setFullscreenIndex((prev) => (prev! - 1 + totalImages) % totalImages); }}
                className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all transform hover:scale-110 hidden md:block"
              >
                <ChevronLeft size={80} strokeWidth={1} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setFullscreenIndex((prev) => (prev! + 1) % totalImages); }}
                className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all transform hover:scale-110 hidden md:block"
              >
                <ChevronRight size={80} strokeWidth={1} />
              </button>
            </>
          )}

          <div className="relative max-w-full max-h-full flex flex-col items-center gap-8">
            <div className="relative group/light">
                <img
                  src={images[fullscreenIndex]}
                  alt={title}
                  className="max-w-full max-h-[80vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-2xl animate-in zoom-in-95 duration-500"
                  onClick={(e) => e.stopPropagation()}
                />
            </div>
            <div className="text-center space-y-2">
                <p className="text-white font-bold tracking-[0.3em] uppercase text-xs">
                    {title}
                </p>
                <p className="text-white/40 font-light tracking-[0.1em] text-xs">
                    Image {fullscreenIndex + 1} of {totalImages}
                </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
