import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { getProjectCategories } from "@/lib/project-categories";

interface SearchParams {
  category?: string;
  search?: string;
}

const ProjectsPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const filters = await searchParams;
  
  const [projects, categories] = await Promise.all([
    getProjects(filters),
    getProjectCategories()
  ]);

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen">
      <Navbar transparent={false} />

      {/* Hero Header */}
      <section className="bg-neutral-900 text-white pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h4 className="text-[#C59D5F] font-bold tracking-[0.3em] uppercase text-xs mb-4">Precision & Detail</h4>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">Our <span className="text-[#C59D5F]">Specialized</span> Projects</h1>
          <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
            From technical execution to artistic installation, explore the depth of our specialized interior solutions.
          </p>
        </div>
      </section>

      {/* Filtering */}
      <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-8 items-center text-[10px] font-black uppercase tracking-widest">
          <Link 
            href="/projects"
            className={`transition-colors hover:text-[#C59D5F] ${!filters.category ? 'text-[#C59D5F]' : 'text-neutral-400'}`}
          >
            All Disciplines
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/projects?category=${cat.slug}`}
              className={`transition-colors hover:text-[#C59D5F] ${filters.category === cat.slug ? 'text-[#C59D5F]' : 'text-neutral-400'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        {projects.length === 0 ? (
          <div className="py-40 text-center">
            <h3 className="text-2xl font-light text-neutral-400">Our specialized projects for this category are arriving soon.</h3>
            <Link href="/projects" className="mt-6 inline-block text-[#C59D5F] font-bold border-b border-[#C59D5F] pb-1 uppercase tracking-widest text-xs">View all projects</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {projects.map((project, idx) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-neutral-100 mb-8">
                  <img 
                    src={project.thumbnail_image_url || "/images/placeholder.jpg"} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[#C59D5F] text-[10px] font-black tracking-widest uppercase">
                      {project.category?.name || "Premium Build"}
                    </span>
                    <div className="h-[1px] flex-1 bg-neutral-100"></div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-neutral-900 group-hover:text-[#C59D5F] transition-colors leading-tight">
                    {project.title}
                  </h3>
                  
                  {project.subtitle && (
                    <p className="text-neutral-500 text-lg font-light leading-relaxed">
                      {project.subtitle}
                    </p>
                  )}
                  
                  <div className="pt-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-900">
                    <span>EXPLORE PROJECT</span>
                    <div className="w-8 h-[1px] bg-neutral-900 group-hover:w-12 transition-all"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
