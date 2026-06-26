"use client";

import React, { useState } from "react";
import { submitContactInquiry } from "@/lib/contact-inquiries";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await submitContactInquiry(formData);
      setStatus({ type: "success", msg: "Thank you! Your inquiry has been submitted successfully." });
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message || "Failed to submit inquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {status && (
        <div
          className={`p-5 rounded-lg text-sm font-medium ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.msg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-neutral-700 text-lg font-medium font-inter">
            Name<span className="text-[#C59D5F]">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            maxLength={255}
            placeholder="Enter Name"
            className="w-full bg-[#F3F4F6]/50 border-0 rounded-md px-5 py-4 text-lg font-inter text-neutral-800 placeholder:text-black/25 outline-none focus:ring-1 focus:ring-[#C59D5F] transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-neutral-700 text-lg font-medium font-inter">
            Phone No<span className="text-[#C59D5F]">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength={50}
            placeholder="+977"
            className="w-full bg-[#F3F4F6]/50 border-0 rounded-md px-5 py-4 text-lg font-inter text-neutral-800 placeholder:text-black/25 outline-none focus:ring-1 focus:ring-[#C59D5F] transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-neutral-700 text-lg font-medium font-inter">
            Email<span className="text-[#C59D5F]">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            maxLength={255}
            placeholder="Enter your email"
            className="w-full bg-[#F3F4F6]/50 border-0 rounded-md px-5 py-4 text-lg font-inter text-neutral-800 placeholder:text-black/25 outline-none focus:ring-1 focus:ring-[#C59D5F] transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-neutral-700 text-lg font-medium font-inter">
            Subject<span className="text-[#C59D5F]">*</span>
          </label>
          <div className="relative">
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full bg-[#F3F4F6]/50 border-0 rounded-md px-5 py-4 text-lg font-inter text-neutral-800 outline-none focus:ring-1 focus:ring-[#C59D5F] transition-all appearance-none"
            >
              <option value="">Select a subject</option>
              <option value="Turnkey Projects">Turnkey Projects</option>
              <option value="Interior Design">Interior Design</option>
              <option value="3D Modeling">3D Modeling</option>
              <option value="Construction">Construction</option>
              <option value="Consultation">Design Consultation</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 border-r-2 border-b-2 border-neutral-400 rotate-45" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <label className="block text-neutral-700 text-lg font-medium font-inter">
            Message<span className="text-[#C59D5F]">*</span>
          </label>
          <span className="text-xs text-neutral-400 font-inter">
            {formData.message.length} / 1000
          </span>
        </div>
        <textarea
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={6}
          maxLength={1000}
          placeholder="How Can we help you?..."
          className="w-full bg-[#F3F4F6]/50 border-0 rounded-md px-5 py-4 text-lg font-inter text-neutral-800 placeholder:text-black/25 outline-none focus:ring-1 focus:ring-[#C59D5F] transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-[#C59D5F] text-white text-xl font-medium font-inter py-4 rounded-md flex items-center justify-center gap-3 transition-all ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#B48C50] transform hover:-translate-y-0.5"
        }`}
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Submit
            <Send size={20} className="rotate-45" />
          </>
        )}
      </button>
    </form>
  );
}
