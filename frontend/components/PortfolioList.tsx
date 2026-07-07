"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import Link from "next/link";

interface PortfolioListProps {
  portfolios: any[];
}

export default function PortfolioList({ portfolios }: PortfolioListProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const openFullscreen = (url: string) => {
    setFullscreenImage(url);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="flex flex-col gap-20">
        {portfolios.map((item: any, idx: number) => {
          const hasDescription = !!item.short_description && item.short_description.trim() !== "";
          const imageUrl = item.main_image_url || item.gallery_image_urls?.[0] || "/images/about-home.png";

          return (
            <div key={item.id} className="relative group">
              <div className="relative rounded-[20px] overflow-hidden shadow-2xl">
                {/* Plus Icon - Clickable to open fullscreen */}
                <button 
                  onClick={() => openFullscreen(imageUrl)}
                  className="absolute top-6 right-6 z-30 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-45 transition-all duration-500 hover:scale-110 active:scale-95"
                  aria-label="View full image"
                >
                  <Plus className="text-neutral-700" size={20} />
                </button>

                {/* Image */}
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-[240px] sm:h-[350px] md:h-[450px] lg:h-[550px] object-cover transition-transform duration-[3s] group-hover:scale-105 cursor-zoom-in"
                  onClick={() => openFullscreen(imageUrl)}
                />

                {/* Overlay Style Card (Shown on hover, aligned to the left) */}
                {hasDescription && (
                  <div className="absolute inset-0 md:right-auto md:w-[600px] bg-neutral-900/50 flex flex-col justify-center px-8 sm:px-12 md:px-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none">
                    <p className="text-white/85 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                      {item.short_description}
                    </p>
                  </div>
                )}
              </div>

              {/* Title Below (Visible permanently, small and hugging the image) */}
              {item.title && (
                <div className="mt-3 px-2">
                  <h3 className="text-neutral-700 text-xs sm:text-sm font-semibold font-inter uppercase tracking-wider">
                    {item.title}
                  </h3>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-10 right-10 text-white/50 hover:text-white transition-all transform hover:rotate-90 z-[110]"
          >
            <X size={48} strokeWidth={1.5} />
          </button>
          
          <div className="relative max-w-full max-h-full">
            <img
              src={fullscreenImage}
              alt="Fullscreen view"
              className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-2xl animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
