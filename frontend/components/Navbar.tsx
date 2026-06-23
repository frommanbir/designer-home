"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ transparent = true }: { transparent?: boolean }) => {
  const pathname = usePathname();

  const getLinkClasses = (path: string, partial = false) => {
    const active = partial ? pathname.startsWith(path) : pathname === path;
    const baseClasses = "transition-all duration-300 uppercase";
    
    if (active) {
      return `${baseClasses} text-[#C59D5F] scale-105`;
    }
    
    return `${baseClasses} hover:text-[#C59D5F] ${transparent ? 'text-white/95' : 'text-gray-800'}`;
  };

  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    import("@/lib/project-categories").then(lib => {
      lib.getProjectCategories().then(data => {
        setCategories(data);
      }).catch(() => {});
    });
  }, []);

  return (
    <nav className={`w-full z-50 transition-all duration-300 ${transparent ? 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 md:py-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#C59D5F] flex items-center justify-center rounded-sm group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <span className={`font-bold text-xl tracking-wider ${transparent ? 'text-white' : 'text-black'}`}>DESIGNER HOME</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-bold tracking-widest">
          <Link href="/" className={getLinkClasses("/")}>HOME</Link>
          <Link href="/about" className={getLinkClasses("/about")}>ABOUT</Link>
          
          <div className="group relative">
            <button className={`flex items-center gap-1 transition-colors uppercase cursor-pointer outline-none ${pathname.startsWith('/services') ? 'text-[#C59D5F]' : (transparent ? 'text-white/95 hover:text-[#C59D5F]' : 'text-gray-800 hover:text-[#C59D5F]')}`}>
              SERVICES <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-4 w-48 bg-white shadow-xl rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-gray-800">
              <Link href="/services/residential" className={`block px-4 py-3 text-xs font-semibold uppercase hover:bg-[#F9F9F9] hover:text-[#C59D5F] ${pathname === '/services/residential' ? 'text-[#C59D5F]' : ''}`}>RESIDENTIAL</Link>
              <Link href="/services/commercial" className={`block px-4 py-3 text-xs font-semibold uppercase hover:bg-[#F9F9F9] hover:text-[#C59D5F] ${pathname === '/services/commercial' ? 'text-[#C59D5F]' : ''}`}>COMMERCIAL</Link>
            </div>
          </div>

          <div className="group relative">
            <button className={`flex items-center gap-1 transition-colors uppercase cursor-pointer outline-none ${pathname.startsWith('/projects') ? 'text-[#C59D5F]' : (transparent ? 'text-white/95 hover:text-[#C59D5F]' : 'text-gray-800 hover:text-[#C59D5F]')}`}>
              PROJECTS <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-4 w-56 bg-white shadow-xl rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-gray-800 border border-neutral-100">
              <Link href="/projects" className={`block px-4 py-3 text-xs font-bold uppercase border-b border-neutral-50 hover:bg-[#F9F9F9] hover:text-[#C59D5F] ${pathname === '/projects' ? 'text-[#C59D5F]' : ''}`}>Explore All</Link>
              {categories.map((cat) => (
                <Link 
                  key={cat.id}
                  href={`/projects?category=${cat.slug}`} 
                  className={`block px-4 py-3 text-xs font-semibold uppercase hover:bg-[#F9F9F9] hover:text-[#C59D5F] ${pathname.includes(cat.slug) ? 'text-[#C59D5F]' : ''}`}
                >
                  {cat.name}
                </Link>
              ))}
              {categories.length === 0 && (
                 <div className="px-4 py-3 text-[10px] text-neutral-400 uppercase italic">Loading categories...</div>
              )}
            </div>
          </div>

          <Link href="/portfolio" className={getLinkClasses("/portfolio")}>PORTFOLIO</Link>
          <Link href="/blog" className={getLinkClasses("/blog")}>BLOG</Link>
          
          <Link href="/contact" className={`ml-4 px-6 py-2 border rounded-full transition-all text-center ${pathname === '/contact' ? 'bg-[#C59D5F] border-[#C59D5F] text-white' : (transparent ? 'border-white/50 text-white hover:bg-white hover:text-black' : 'border-black text-black hover:bg-black hover:text-white')}`}>
            CONTACT
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
