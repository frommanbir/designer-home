"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { FaSave, FaImage, FaSpinner } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetchApi("/site-settings");
      if (res.success && res.data) {
        setHeroTitle(
          res.data.service_hero_title ??
          res.data.hero_title ??
          res.data.hero?.title ??
          ""
        );
        setHeroSubtitle(
          res.data.service_hero_subtitle ??
          res.data.hero_subtitle ??
          res.data.hero?.subtitle ??
          ""
        );
        setPreview(
          res.data.service_hero_image?.url ??
          res.data.service_hero_image ??
          res.data.hero?.image?.url ??
          res.data.hero_image?.url ??
          res.data.hero_image ??
          ""
        );
      }
    } catch (error: any) {
      console.error("Failed to load services page settings", error);
      toast.error("Unable to load service page settings.");
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    setHeroImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.set("service_hero_title", heroTitle);
    formData.set("hero_title", heroTitle);
    formData.set("service_hero_subtitle", heroSubtitle);
    formData.set("hero_subtitle", heroSubtitle);
    if (heroImageFile) {
      formData.set("service_hero_image", heroImageFile);
      formData.set("hero_image", heroImageFile);
    }

    try {
      const res = await fetchApi("/admin/site-settings", {
        method: "POST",
        body: formData,
      });

      if (res.success) {
        toast.success("Service page hero updated successfully.");
      } else {
        toast.error(res.message || "Failed to update the service page.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Services
          </Link>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Services Page Settings</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Configure the public Services page hero banner and headline.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <FaSpinner className="animate-spin text-neutral-400" size={32} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Hero Banner</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Upload the hero image and set the headline displayed at the top of the services page.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-900">Hero Image</label>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-3xl bg-neutral-50">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Service page hero preview"
                      className="h-40 w-full object-cover rounded-3xl shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                      <FaImage size={24} />
                    </div>
                  )}
                  <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all mt-4">
                    Choose Hero Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="text-xs text-neutral-400 mt-3 text-center">
                    Recommended size: 1920x1080px. Max file size depends on your backend configuration.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-900">Hero Headline</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="e.g. Discover our premium interior services"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-900">Hero Subtitle</label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="e.g. From concept to completion"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-white flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
