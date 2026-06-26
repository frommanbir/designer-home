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
      <div className="flex flex-col gap-32">
        {portfolios.map((item: any, idx: number) => {
          const hasDescription = !!item.short_description;
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
                  className="w-full h-[600px] md:h-[800px] object-cover transition-transform duration-[3s] group-hover:scale-105 cursor-zoom-in"
                  onClick={() => openFullscreen(imageUrl)}
                />

                {/* Overlay Style Card (Used if description exists) */}
                {hasDescription && (
                  <div className="absolute top-0 left-0 w-full md:w-[600px] h-full bg-neutral-800/90 flex flex-col justify-center px-12 md:px-20 space-y-8 animate-in fade-in slide-in-from-left duration-700">
                    <h3 className="text-white text-3xl md:text-5xl font-semibold font-inter leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-base font-baumans leading-relaxed">
                      {item.short_description}
                    </p>
                  </div>
                )}
              </div>

              {/* Standard Style Title Below (Used if no description exists) */}
              {!hasDescription && (
                <div className="mt-12 text-center max-w-3xl mx-auto space-y-4">
                  <h3 className="text-neutral-700 text-3xl md:text-5xl font-semibold font-inter">
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
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500"
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
