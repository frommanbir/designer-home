import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getPortfolios } from "@/lib/portfolios";
import { getPortfolioCategories } from "@/lib/portfolio-categories";
import { Plus } from "lucide-react";

interface SearchParams { category?: string; search?: string; }

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;

  const [portfolios, categories] = await Promise.all([
    getPortfolios(filters).catch(() => []),
    getPortfolioCategories().catch(() => []),
  ]);

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen text-neutral-900 border-none">
      {/* Hero */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent z-10" />
          <img
            src="/images/about-home.png"
            alt="Portfolio Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 flex flex-col items-center text-center px-6 space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-[1500ms]">
          <h1 className="text-white text-6xl md:text-8xl font-bold font-inter tracking-tight drop-shadow-lg">
            PORTFOLIO
          </h1>
          <p className="text-white text-2xl md:text-4xl font-baumans tracking-wide opacity-90 drop-shadow-md">
            Our Work Speaks for Itself
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-zinc-50/50 py-12 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm font-bold uppercase tracking-widest">
            <Link
              href="/portfolio"
              className={`transition-colors hover:text-[#C59D5F] ${!filters.category ? "text-[#C59D5F] underline underline-offset-8 decoration-2" : "text-neutral-400"}`}
            >
              All Projects
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/portfolio?category=${cat.slug}`}
                className={`transition-colors hover:text-[#C59D5F] ${filters.category === cat.slug ? "text-[#C59D5F] underline underline-offset-8 decoration-2" : "text-neutral-400"}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Items */}
      <section className="py-24 space-y-32">
        <div className="max-w-7xl mx-auto px-6">
          {portfolios.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-2xl font-light text-neutral-400">No projects found in this collection.</h3>
            </div>
          ) : (
            <div className="flex flex-col gap-32">
              {portfolios.map((item: any, idx: number) => {
                // Alternating layout: every 3rd project gets a darker overlay style (like Gorkarneshwor in snippet)
                const isOverlayStyle = idx % 3 === 0;

                return (
                  <div key={item.id} className="relative group">
                     <div className="relative rounded-[20px] overflow-hidden shadow-2xl">
                        {/* Plus Icon placeholder like in snippet */}
                        <div className="absolute top-6 right-6 z-30">
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-45 transition-transform duration-500">
                              <Plus className="text-neutral-700" size={20} />
                           </div>
                        </div>

                        {/* Image */}
                        <img
                          src={item.main_image_url || item.gallery_image_urls?.[0] || "/images/about-home.png"}
                          alt={item.title}
                          className="w-full h-[320px] md:h-[600px] object-cover transition-transform duration-[3s] group-hover:scale-105"
                        />
                        {isOverlayStyle && (
                           <div className="absolute top-0 left-0 w-full md:w-[600px] h-full bg-neutral-800/90 flex flex-col justify-center px-12 md:px-20 space-y-8 animate-in fade-in slide-in-from-left duration-700">
                              <h3 className="text-white text-3xl md:text-5xl font-semibold font-inter leading-tight">
                                 {item.title}
                              </h3>
                              <p className="text-white/80 text-base font-baumans leading-relaxed">
                                 {item.short_description || "A complete turnkey solution combining luxury, comfort, and functionality to create a sophisticated and beautiful environment."}
                              </p>
                           </div>
                        )}
                     </div>

                     {/* Standard Style Title Below (Santaneshwor style) */}
                     {!isOverlayStyle && (
                        <div className="mt-12 text-center">
                           <h3 className="text-neutral-700 text-3xl md:text-4xl font-medium font-inter">
                              {item.title}
                           </h3>
                           <Link href={`/portfolio/${item.slug}`} className="mt-4 inline-block text-neutral-400 hover:text-[#C59D5F] transition-colors text-xs font-bold uppercase tracking-widest">
                              View Project
                           </Link>
                        </div>
                     )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}