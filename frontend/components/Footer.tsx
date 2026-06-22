import React from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#111] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#C59D5F] flex items-center justify-center rounded-sm">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
            <span className="text-white font-bold text-xl tracking-wider">DESIGNER HOME</span>
          </div>
          <p className="text-gray-400 leading-relaxed text-sm">
            Designer Home Pvt. Ltd. is dedicated to transforming ideas into 
            inspiring spaces through innovative interior design solutions. 
            One-stop solution for all your interior needs.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C59D5F] transition-colors">
              <FaFacebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C59D5F] transition-colors">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C59D5F] transition-colors">
              <FaLinkedin size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#C59D5F]">
            Quick Links
          </h3>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#C59D5F]">
            Contact Details
          </h3>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <MapPin className="text-[#C59D5F] shrink-0" size={20} />
              <span className="text-gray-400 text-sm">Naxal, Kathmandu, Nepal 44600</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="text-[#C59D5F] shrink-0" size={20} />
              <span className="text-gray-400 text-sm">info@designerhomenepal.com</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="text-[#C59D5F] shrink-0" size={20} />
              <span className="text-gray-400 text-sm">+977 9702910457</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#C59D5F]">
            Stay Connected
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Subscribe to get latest updates and offers.
          </p>
          <div className="relative">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-[#C59D5F] transition-colors text-sm"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-[#C59D5F] text-white px-4 rounded-md hover:bg-[#b08b53] transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Designer Home Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
