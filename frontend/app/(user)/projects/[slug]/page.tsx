import { getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/ProjectGallery";

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
      {/* Hero Section (Matches Projects Page) */}
      <section className="relative h-[70vh] min-h-[700px] w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={project.category?.hero_image?.url || "/images/about-home.png"}
            alt={project.category?.hero_title || "Dream Homes"}
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
            <p className="text-neutral-500 text-2xl italic font-light text-center">{project.subtitle}</p>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="max-w-7xl mx-auto py-24 px-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
        <p className="text-neutral-600 text-xl font-light leading-relaxed whitespace-pre-line text-justify">
          {project.description}
        </p>
      </section>

      {/* Gallery */}
      <ProjectGallery images={project.gallery_image_urls || []} title={project.title} />
    </div>
  );
}
