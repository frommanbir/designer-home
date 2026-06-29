import { getPortfolios } from "@/lib/portfolios";
import { getPortfolioCategories } from "@/lib/portfolio-categories";
import PortfolioList from "@/components/PortfolioList";

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
      <section className="relative h-[70vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10" />
          <img
            src="/images/portfolio.png"
            alt="Portfolio Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 flex -translate-y-16 flex-col items-center text-center px-6 space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-[1500ms]">
          <h1 className="text-white text-6xl md:text-8xl font-bold font-inter tracking-tight drop-shadow-lg">
            PORTFOLIO
          </h1>
          <p className="text-white text-2xl md:text-4xlfont-baumans tracking-wide opacity-90 drop-shadow-md">
            Our Work Speaks for Itself
          </p>
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
            <PortfolioList portfolios={portfolios} />
          )}
        </div>
      </section>
    </div>
  );
}