"use client";

import React from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getServiceCategories } from "@/lib/service-categories";
import type { ServiceCategory } from "@/lib/service-categories";

const Navbar = ({ transparent = true, settings }: { transparent?: boolean; settings?: any }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const getLinkClasses = (path: string, partial = false) => {
    const active = partial ? pathname.startsWith(path) : pathname === path;
    const baseClasses = "transition-all duration-300 uppercase";
    if (active) return `${baseClasses} text-[#C59D5F] scale-105`;
    return `${baseClasses} hover:text-[#C59D5F] ${transparent ? "text-white/95" : "text-gray-800"}`;
  };

  const logoUrl = settings?.branding?.logo_url;
  const siteName = settings?.branding?.website_name || "DESIGNER HOME";

  return (
    <>
      <nav className={`w-full z-50 transition-all duration-300 ${transparent ? 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 md:py-8">
          <Link href="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-16 w-auto object-contain" />
            ) : (
              <div>
                <span className="text-white font-bold text-2xl">{siteName.charAt(0)}</span>
              </div>
            )}
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-bold tracking-widest">
            <Link href="/" className={getLinkClasses("/")}>HOME</Link>
            <Link href="/about" className={getLinkClasses("/about")}>ABOUT</Link>
            
            <div className="group relative">
              <button className={`flex items-center gap-1 transition-colors uppercase cursor-pointer outline-none ${pathname.startsWith('/services') ? 'text-[#C59D5F]' : (transparent ? 'text-white/95 hover:text-[#C59D5F]' : 'text-gray-800 hover:text-[#C59D5F]')}`}>
                SERVICES <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-gray-800 border border-neutral-100 z-[100]">
                {/* Decorative Tip */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-neutral-100" />
                
                <div className={`relative bg-white p-2 ${allServices.length > 12 ? "max-h-[500px] overflow-y-auto custom-scrollbar" : ""}`}>
                  {allServices.map((srv) => (
                    <Link
                      key={srv.id}
                      href={`/services/${srv.slug}`}
                      className={`block px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.1em] rounded-lg hover:bg-[#C59D5F]/5 hover:text-[#C59D5F] transition-all duration-300 ${pathname === `/services/${srv.slug}` ? 'text-[#C59D5F] bg-[#C59D5F]/5' : 'text-neutral-600'}`}
                    >
                      {srv.title}
                    </Link>
                  ))}
                  {allServices.length === 0 && (
                    <div className="px-6 py-8 text-center text-[10px] text-neutral-400 uppercase italic tracking-widest">
                      Updating Collections...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="group relative">
              <button className={`flex items-center gap-1 transition-colors uppercase cursor-pointer outline-none ${pathname.startsWith('/projects') ? 'text-[#C59D5F]' : (transparent ? 'text-white/95 hover:text-[#C59D5F]' : 'text-gray-800 hover:text-[#C59D5F]')}`}>
                PROJECTS <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-4 w-56 bg-white shadow-xl rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-gray-800 border border-neutral-100">
                {projectCategories.map((cat) => (
                  <Link 
                    key={cat.id}
                    href={`/projects?category=${cat.slug}`} 
                    className={`block px-4 py-3 text-xs font-semibold uppercase hover:bg-[#F9F9F9] hover:text-[#C59D5F] ${pathname.includes(cat.slug) ? 'text-[#C59D5F]' : ''}`}
                  >
                    {cat.name}
                  </Link>
                ))}
                {projectCategories.length === 0 && (
                   <div className="px-4 py-3 text-[10px] text-neutral-400 uppercase italic">Loading...</div>
                )}
              </div>
            </div>

            <Link href="/portfolio" className={getLinkClasses("/portfolio")}>PORTFOLIO</Link>
            <Link href="/blog" className={getLinkClasses("/blog")}>BLOG</Link>
            
            <Link href="/contact" className={`ml-4 px-6 py-2 border rounded-full transition-all text-center ${pathname === '/contact' ? 'bg-[#C59D5F] border-[#C59D5F] text-white' : (transparent ? 'border-white/50 text-white hover:bg-white hover:text-black' : 'border-black text-black hover:bg-black hover:text-white')}`}>
              CONTACT
            </Link>
          </div>

          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Menu size={24} className={transparent ? "text-white" : "text-neutral-800"} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4">
              <span className="font-bold text-lg tracking-wider text-black">{siteName}</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-xl transition-all"
              >
                <X size={24} className="text-neutral-600" />
              </button>
            </div>
            
            <div className="flex flex-col gap-5 text-sm font-bold tracking-widest overflow-y-auto pr-1">
              <Link href="/" className="text-neutral-800 hover:text-[#C59D5F] transition-colors py-2 border-b border-neutral-50" onClick={() => setMobileMenuOpen(false)}>HOME</Link>
              <Link href="/about" className="text-neutral-800 hover:text-[#C59D5F] transition-colors py-2 border-b border-neutral-50" onClick={() => setMobileMenuOpen(false)}>ABOUT</Link>
              
              <div className="py-2 border-b border-neutral-50">
                <p className="text-neutral-400 text-xs font-black uppercase tracking-wider mb-2">SERVICES</p>
                <div className="pl-4 flex flex-col gap-3">
                  {allServices.map(srv => (
                    <Link
                      key={srv.id}
                      href={`/services/${srv.slug}`}
                      className="text-neutral-800 hover:text-[#C59D5F] transition-colors text-xs py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {srv.title}
                    </Link>
                  ))}
                  {allServices.length === 0 && <span className="text-xs text-neutral-400 italic">Updating Collections...</span>}
                </div>
              </div>

              <div className="py-2 border-b border-neutral-50">
                <p className="text-neutral-400 text-xs font-black uppercase tracking-wider mb-2">PROJECTS</p>
                <div className="pl-4 flex flex-col gap-3">
                  {projectCategories.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/projects?category=${cat.slug}`}
                      className="text-neutral-800 hover:text-[#C59D5F] transition-colors text-xs py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {projectCategories.length === 0 && <span className="text-xs text-neutral-400 italic">Loading...</span>}
                </div>
              </div>

              <Link href="/portfolio" className="text-neutral-800 hover:text-[#C59D5F] transition-colors py-2 border-b border-neutral-50" onClick={() => setMobileMenuOpen(false)}>PORTFOLIO</Link>
              <Link href="/blog" className="text-neutral-800 hover:text-[#C59D5F] transition-colors py-2 border-b border-neutral-50" onClick={() => setMobileMenuOpen(false)}>BLOG</Link>
              
              <Link href="/contact" className="mt-4 px-6 py-3 bg-black text-white rounded-full text-center hover:bg-neutral-800 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;