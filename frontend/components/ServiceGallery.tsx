"use client";

import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";

interface GalleryImage {
  url?: string | null;
  path?: string | null;
}

interface ServiceGalleryProps {
  images: GalleryImage[];
  title: string;
}

export default function ServiceGallery({ images, title }: ServiceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex]);

  const selectedImage =
    selectedIndex !== null ? images[selectedIndex] : undefined;

  return (
    <>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex(null);
            }}
            className="absolute top-6 right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage.url || "/images/placeholder.jpg"}
            alt={`${title} gallery large`}
            className="max-h-[90vh] max-w-full rounded-3xl object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className="group relative w-full overflow-hidden rounded-3xl bg-neutral-200 aspect-4/5 shadow-lg"
          >
            <img
              src={img.url || "/images/placeholder.jpg"}
              alt={`${title} gallery ${idx + 1}`}
              className="w-full h-full min-h-0 object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={32} className="text-white" />
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
