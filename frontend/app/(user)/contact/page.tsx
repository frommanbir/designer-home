"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitContactInquiry } from "@/lib/contact-inquiries";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await submitContactInquiry(formData);
      setStatus({ type: 'success', msg: "Thank you! Your inquiry has been submitted successfully." });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || "Failed to submit inquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[350px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img
            src="/images/contact-banner.jpg"
            alt="Contact Designer Home"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase shadow-sm">
            Contact <span className="text-[#C59D5F]">Us</span>
          </h1>
          <div className="w-24 h-1.5 bg-[#C59D5F] mx-auto mt-6"></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-[#222] mb-6 tracking-tight uppercase">Let's Talk About Your Project</h2>
              <p className="text-[#666] text-lg leading-relaxed max-w-lg">
                We're here to help you transform your space into something extraordinary. Reach out to us through any of the channels below.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-[#F9F9F9] rounded-xl flex items-center justify-center group-hover:bg-[#C59D5F] transition-colors duration-300">
                  <span className="text-[#C59D5F] group-hover:text-white text-2xl">📍</span>
                </div>
                <div>
                  <h4 className="font-black text-[#222] text-sm tracking-widest uppercase mb-1">Our Location</h4>
                  <p className="text-[#666] text-lg font-medium">Baneshwor, Kathmandu, Nepal</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-[#F9F9F9] rounded-xl flex items-center justify-center group-hover:bg-[#C59D5F] transition-colors duration-300">
                  <span className="text-[#C59D5F] group-hover:text-white text-2xl">📞</span>
                </div>
                <div>
                  <h4 className="font-black text-[#222] text-sm tracking-widest uppercase mb-1">Phone Number</h4>
                  <p className="text-[#666] text-lg font-medium">+977 9801234567 / 01-44XXXXX</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-[#F9F9F9] rounded-xl flex items-center justify-center group-hover:bg-[#C59D5F] transition-colors duration-300">
                  <span className="text-[#C59D5F] group-hover:text-white text-2xl">✉️</span>
                </div>
                <div>
                  <h4 className="font-black text-[#222] text-sm tracking-widest uppercase mb-1">Email Address</h4>
                  <p className="text-[#666] text-lg font-medium">info@designerhome.com.np</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
               <h4 className="font-black text-[#222] text-sm tracking-widest uppercase mb-6">Follow Us</h4>
               <div className="flex gap-4">
                  {["FB", "IG", "LI", "TW"].map((soc) => (
                    <a key={soc} href="#" className="w-12 h-12 border-2 border-gray-100 rounded-full flex items-center justify-center font-bold text-xs text-[#666] hover:border-[#C59D5F] hover:text-[#C59D5F] transition-all">
                      {soc}
                    </a>
                  ))}
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#FBFBFB] p-10 rounded-[2rem] border border-gray-100 shadow-sm transition-all">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status && (
                <div className={`p-4 rounded-xl text-sm font-bold tracking-wide uppercase ${status.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  {status.msg}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-[#222] tracking-widest uppercase mb-3">Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={255}
                    placeholder="John Doe" 
                    className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-[#C59D5F] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#222] tracking-widest uppercase mb-3">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={255}
                    placeholder="john@example.com" 
                    className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-[#C59D5F] transition-colors" 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-[#222] tracking-widest uppercase mb-3">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={50}
                    placeholder="+977 98XXXXXXX" 
                    className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-[#C59D5F] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#222] tracking-widest uppercase mb-3">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={255}
                    placeholder="Design Consultation" 
                    className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-[#C59D5F] transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#222] tracking-widest uppercase mb-3">Message *</label>
                <textarea 
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6} 
                  placeholder="Tell us about your space..." 
                  className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-[#C59D5F] transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-[#222] text-white font-black tracking-widest uppercase py-5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#C59D5F] transform hover:-translate-y-1'}`}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] w-full bg-gray-100 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">
            Interactive Map Integration
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
