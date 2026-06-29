import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { getProjectCategories } from "@/lib/project-categories";
import { ProjectCategory } from "@/types/project-category";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface SearchParams { category?: string; search?: string; }

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;

  const [projects, categories] = await Promise.all([
    getProjects(filters).catch(() => []),
    getProjectCategories().catch(() => [] as ProjectCategory[]),
  ]);

  const activeCategory = filters.category
    ? (categories as ProjectCategory[]).find((c) => c.slug === filters.category)
    : categories[0]; // Default to first category if none selected

  const heroImage = activeCategory?.hero_image?.url || "/images/about-home.png";
  const heroTitle = activeCategory?.hero_title || "Turning Houses Into Dream Homes";

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen">

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[700px] w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={heroTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 z-20 left-0 w-full px-6">
            <h1 className="text-white text-5xl md:text-7xl leading-tight">
              Turning Houses Into
              <br />
              Dream Homes
            </h1>
            <div className="mt-6 h-[3px] w-full max-w-[500px] bg-white"></div>
        </div>
      </section>

      {/* Category Intro Section */}
      {activeCategory && (
        <section className="max-w-7xl mx-auto py-24 px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="space-y-4">
            <h2 className="text-7xl md:text-6xl font-black text-[#222] tracking-tighter uppercase whitespace-pre-line">
              {heroTitle}
            </h2>
            {activeCategory.subtitle && (
              <h3 className="text-xl md:text-2xl text-[#333] font-medium italic">
                {activeCategory.subtitle}
              </h3>
            )}
          </div>
          {activeCategory.description && (
            <p className="text-lg text-[#666] leading-relaxed max-w-7xl mx-auto font-light text-justify">
              {activeCategory.description}
            </p>
          )}
        </section>
      )}

      {/* Projects List - Row Based */}
      <section className="max-w-7xl mx-auto pb-32 px-6">
        {projects.length === 0 ? (
          <div className="py-20 text-center bg-[#F9F9F9] rounded-[3rem]">
            <h3 className="text-2xl font-light text-neutral-400">Our projects in this category are arriving soon.</h3>
          </div>
        ) : (
          <div className="space-y-32">
            {projects.map((project: any, idx: number) => (
              <div
                key={project.id}
                className={`grid lg:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-${idx * 200}`}
              >
                <div className={`space-y-8 ${idx % 2 === 1 ? 'lg:order-last' : ''}`}>
                  <div className="space-y-4">
                    <h4 className="text-[#C59D5F] font-black tracking-[0.3em] uppercase text-xs">
                      {project.subtitle || "Premium Design"}
                    </h4>
                    <h3 className="text-4xl md:text-5xl font-black text-[#222] tracking-tighter uppercase leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-lg text-[#666] leading-relaxed font-light">
                    {project.description || "Every project receives our full dedication, craftsmanship, and attention to detail. We transform visions into reality with precision."}
                  </p>
                  <div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-4 px-8 py-4 bg-[#222] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#C59D5F] transition-all transform hover:-translate-y-1 shadow-lg"
                    >
                      View More
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {project.gallery_image_urls?.slice(0, 2).map((url: string, i: number) => (
                    <div
                      key={i}
                      className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.02] 
                        ${project.gallery_image_urls.length === 1 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/5]'} 
                        ${(i === 1 && project.gallery_image_urls.length > 1) ? 'translate-y-8' : ''}`}
                    >
                      <img src={url} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {(!project.gallery_image_urls || project.gallery_image_urls.length === 0) && (
                    <div className="col-span-2 aspect-[16/10] rounded-[2.5rem] bg-neutral-100 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-neutral-300 font-black text-6xl">DH</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}