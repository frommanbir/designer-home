import React from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Link from "next/link";

const Footer = ({ settings }: { settings?: any }) => {
  const siteName = settings?.branding?.website_name || "DESIGNER HOME";
  const logoUrl = settings?.branding?.logo_url;
  
  const contact = settings?.contact_info || {};
  const socials = settings?.social_links || {};

  return (
    <footer className="bg-black/90 text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-12 w-auto object-contain" />
            ) : (
              <div className="w-12 h-12 bg-[#C59D5F] flex items-center justify-center rounded-sm">
                <span className="text-white font-bold text-3xl italic">H</span>
              </div>
            )}
            <span className="text-white font-bold text-xl tracking-wider uppercase font-inter">{siteName}</span>
          </div>
          <p className="text-white/60 leading-relaxed text-sm max-w-xs font-inter">
            {settings?.branding?.website_slogan || "Building beautiful and functional spaces that reflect your unique vision and lifestyle since 2016."}
          </p>

        </div>

        <div>
          <h3 className="font-bold text-xl mb-8 font-inter">Quick Links</h3>
          <ul className="space-y-4 text-white/70 font-medium text-lg font-inter">
            <li><Link href="/" className="hover:text-[#C59D5F] transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-[#C59D5F] transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-[#C59D5F] transition-colors">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-[#C59D5F] transition-colors">Portfolio</Link></li>
            <li><Link href="/blog" className="hover:text-[#C59D5F] transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-8 font-inter">Contact Details</h3>
          <div className="space-y-6 text-white/80 font-normal font-inter">
            <p className="flex flex-col gap-2">
               <span className="font-bold text-[#C59D5F] text-xs uppercase tracking-widest">Office</span>
               {contact.address || "Naxal, Kathmandu, Nepal 44600"}
            </p>
            <p className="flex flex-col gap-2">
               <span className="font-bold text-[#C59D5F] text-xs uppercase tracking-widest">Email</span>
               {contact.email || "info@designerhomenepal.com"}
            </p>
            <p className="flex flex-col gap-2">
               <span className="font-bold text-[#C59D5F] text-xs uppercase tracking-widest">Phone</span>
               {contact.phone && contact.phone2 ? `${contact.phone}, ${contact.phone2}` : contact.phone || "+977 9709080688, 9702910457"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-8 font-inter">Stay Connected</h3>
          <p className="text-white/60 text-sm leading-relaxed mb-6 font-inter">
            Follow us on social media for the latest design inspiration, updates, and sneak peeks of our projects.
          </p>
          <div className="flex gap-4">
             {[
               { icon: FaFacebook, link: socials.facebook || "https://facebook.com", label: "Facebook" },
               { icon: FaInstagram, link: socials.instagram || "https://instagram.com", label: "Instagram" },
               { icon: FaTwitter, link: socials.twitter || "https://twitter.com", label: "Twitter" }
             ].map((soc, i) => (
               <a 
                 key={i} 
                 href={soc.link} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 title={soc.label}
                 className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
               >
                 <soc.icon size={18} />
               </a>
             ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/50 text-sm font-inter">
        <p>© {new Date().getFullYear()} Designer Home. All rights reserved.</p>
        <div className="flex gap-8 uppercase tracking-tighter text-xs font-bold">
           <span>Privacy Policy</span>
           <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
