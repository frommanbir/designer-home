import React from "react";
import { ChevronDown } from "lucide-react";

const Navbar = ({ transparent = true }: { transparent?: boolean }) => {
  return (
    <nav className={`w-full z-50 transition-all duration-300 ${transparent ? 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 md:py-8">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#C59D5F] flex items-center justify-center rounded-sm group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <span className={`font-bold text-xl tracking-wider ${transparent ? 'text-white' : 'text-black'}`}>DESIGNER HOME</span>
        </a>
        
        <div className={`hidden md:flex items-center gap-10 text-sm font-bold tracking-widest ${transparent ? 'text-white/95' : 'text-gray-800'}`}>
          <a href="/" className="hover:text-[#C59D5F] transition-colors uppercase">HOME</a>
          <a href="/about" className="hover:text-[#C59D5F] transition-colors uppercase">ABOUT</a>
          
          <div className="group relative">
            <button className="flex items-center gap-1 hover:text-[#C59D5F] transition-colors uppercase">
              SERVICES <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-4 w-48 bg-white shadow-xl rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <a href="/services/residential" className="block px-4 py-3 text-gray-700 hover:bg-[#F9F9F9] hover:text-[#C59D5F] text-xs font-semibold">RESIDENTIAL</a>
              <a href="/services/commercial" className="block px-4 py-3 text-gray-700 hover:bg-[#F9F9F9] hover:text-[#C59D5F] text-xs font-semibold">COMMERCIAL</a>
            </div>
          </div>

          <div className="group relative">
            <button className="flex items-center gap-1 hover:text-[#C59D5F] transition-colors uppercase">
              PROJECTS <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-4 w-48 bg-white shadow-xl rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <a href="/projects/residential" className="block px-4 py-3 text-gray-700 hover:bg-[#F9F9F9] hover:text-[#C59D5F] text-xs font-semibold">RESIDENTIAL</a>
              <a href="/projects/commercial" className="block px-4 py-3 text-gray-700 hover:bg-[#F9F9F9] hover:text-[#C59D5F] text-xs font-semibold">COMMERCIAL</a>
              <a href="/projects/hotel" className="block px-4 py-3 text-gray-700 hover:bg-[#F9F9F9] hover:text-[#C59D5F] text-xs font-semibold">HOTEL</a>
              <a href="/projects/ongoing" className="block px-4 py-3 text-gray-700 hover:bg-[#F9F9F9] hover:text-[#C59D5F] text-xs font-semibold">ONGOING</a>
            </div>
          </div>

          <a href="/portfolio" className="hover:text-[#C59D5F] transition-colors uppercase">PORTFOLIO</a>
          <a href="/blog" className="hover:text-[#C59D5F] transition-colors uppercase">BLOG</a>
          
          <button className={`ml-4 px-6 py-2 border rounded-full transition-all ${transparent ? 'border-white/50 hover:bg-white hover:text-black' : 'border-black hover:bg-black hover:text-white'}`}>
            CONTACT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
