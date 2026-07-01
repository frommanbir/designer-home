import Link from "next/link";
import { getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import { ArrowLeft, Maximize2 } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) return notFound();

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[60vh] sm:min-h-[80vh] w-full flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={project.gallery_image_urls?.[0] || "/images/placeholder.jpg"}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 z-20 left-0 w-full px-6">
          <h1 className="text-white text-5xl md:text-7xl leading-tight">
            {project.category?.hero_title || "Turning Houses Into Dream Homes"}
          </h1>
          <div className="mt-6 h-[3px] w-full max-w-[500px] bg-white"></div>
        </div>
      </section>

      {/* Project Header */}
      <section className="max-w-7xl mx-auto pt-24 px-6 animate-in fade-in slide-in-from-bottom-5 duration-700">  
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-neutral-900 text-center tracking-tighter uppercase leading-[0.9]">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-white/90 text-xl italic max-w-2xl mx-auto">&ldquo;{project.subtitle}&rdquo;</p>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <h2 className="text-4xl font-black uppercase text-neutral-900 mb-8 tracking-tight">
          Project <span className="text-[#C59D5F]">Overview</span>
        </h2>
        <p className="text-neutral-600 text-xl font-light leading-relaxed whitespace-pre-line text-justify">
          {project.description}
        </p>
      </section>

      {/* Gallery */}
      {project.gallery_image_urls?.length > 0 && (
        <section className="bg-neutral-50 py-32 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-neutral-900">
                Visual <span className="text-[#C59D5F]">Gallery</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {project.gallery_image_urls.map((url: string, idx: number) => (
                <div
                  key={idx}
                  className={`relative group overflow-hidden rounded-3xl bg-neutral-200 aspect-[4/5] shadow-lg ${idx % 2 === 1 ? "md:translate-y-12" : ""}`}
                >
                  <img
                    src={url}
                    alt={`${project.title} Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700 flex items-center justify-center">
                    <Maximize2 size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
