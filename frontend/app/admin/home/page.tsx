"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { 
  FaSave, FaImage as ImageIcon, FaInfo, FaStar, FaSpinner 
} from "react-icons/fa";
import { toast } from "sonner";
import Image from "next/image";

function HomePageContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "designing";
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    section2_title: "",
    section2_description_1: "",
    section2_description_2: "",
    // section2_btn_inquiry_text: "",
    // section2_btn_inquiry_link: "",
    // section2_btn_projects_text: "",
    // section2_btn_projects_link: "",
    
    section3_title: "",
    section3_stat1_value: "",
    section3_stat1_label: "",
    section3_stat2_value: "",
    section3_stat2_label: "",
    section3_stat3_value: "",
    section3_stat3_label: "",
    // section3_btn_text: "",
    // section3_btn_link: "",
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    hero_image: null,
    section2_image: null,
    section3_image: null
  });

  const [previews, setPreviews] = useState<Record<string, string>>({
    hero_image: "",
    section2_image: "",
    section3_image: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/home-page");
      if (res.success && res.data) {
        setSettings({
          section2_title: res.data.section2_title || "",
          section2_description_1: res.data.section2_description_1 || "",
          section2_description_2: res.data.section2_description_2 || "",
          // section2_btn_inquiry_text: res.data.section2_btn_inquiry_text || "",
          // section2_btn_inquiry_link: res.data.section2_btn_inquiry_link || "",
          // section2_btn_projects_text: res.data.section2_btn_projects_text || "",
          // section2_btn_projects_link: res.data.section2_btn_projects_link || "",
          
          section3_title: res.data.section3_title || "",
          section3_stat1_value: res.data.section3_stat1_value || "",
          section3_stat1_label: res.data.section3_stat1_label || "",
          section3_stat2_value: res.data.section3_stat2_value || "",
          section3_stat2_label: res.data.section3_stat2_label || "",
          section3_stat3_value: res.data.section3_stat3_value || "",
          section3_stat3_label: res.data.section3_stat3_label || "",
          // section3_btn_text: res.data.section3_btn_text || "",
          // section3_btn_link: res.data.section3_btn_link || "",
        });

        setPreviews({
          hero_image: res.data.hero_image?.url || "/images/about-home.png",
          section2_image: res.data.section2_image?.url || "/images/designspace.png",
          section3_image: res.data.section3_image?.url || "/images/webring.png"
        });
      }
    } catch (error: any) {
      console.error("Error fetching homepage settings", error);
      toast.error("Failed to load homepage settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles((prev) => ({ ...prev, [fieldName]: file }));
      setPreviews((prev) => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    
    // Append settings
    Object.entries(settings).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append files
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    try {
      const res = await fetchApi("/admin/home-page", {
        method: "POST",
        body: formData,
      });

      if (res.success && res.data) {
        toast.success("Homepage settings updated successfully.");
        
        setSettings({
          section2_title: res.data.section2_title || "",
          section2_description_1: res.data.section2_description_1 || "",
          section2_description_2: res.data.section2_description_2 || "",
          // section2_btn_inquiry_text: res.data.section2_btn_inquiry_text || "",
          // section2_btn_inquiry_link: res.data.section2_btn_inquiry_link || "",
          // section2_btn_projects_text: res.data.section2_btn_projects_text || "",
          // section2_btn_projects_link: res.data.section2_btn_projects_link || "",
          
          section3_title: res.data.section3_title || "",
          section3_stat1_value: res.data.section3_stat1_value || "",
          section3_stat1_label: res.data.section3_stat1_label || "",
          section3_stat2_value: res.data.section3_stat2_value || "",
          section3_stat2_label: res.data.section3_stat2_label || "",
          section3_stat3_value: res.data.section3_stat3_value || "",
          section3_stat3_label: res.data.section3_stat3_label || "",
          // section3_btn_text: res.data.section3_btn_text || "",
          // section3_btn_link: res.data.section3_btn_link || "",
        });

        setPreviews({
          hero_image: res.data.hero_image?.url || "/images/about-home.png",
          section2_image: res.data.section2_image?.url || "/images/designspace.png",
          section3_image: res.data.section3_image?.url || "/images/webring.png"
        });

        setFiles({ hero_image: null, section2_image: null, section3_image: null });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error(res.message || "Failed to save settings.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <FaSpinner className="animate-spin text-neutral-400" size={32} />
      </div>
    );
  }

  const tabLabel: Record<string, string> = {
    hero: "Hero Banner Section",
    designing: "Designing Spaces Section",
    value: "Value Proposition Section",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Homepage — {tabLabel[activeTab] ?? "Designing Spaces Section"}</h1>
        <p className="text-neutral-500 text-sm mt-1">Configure and manage dynamic content on your landing/homepage.</p>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* HERO IMAGE SECTION */}
              {activeTab === "hero" && (
                <div className="space-y-8 animate-in zoom-in-95 duration-300">
                  <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Hero Banner</h2>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-neutral-900">Background Image</label>
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50 hover:bg-neutral-100/50 transition-colors">
                      {previews.hero_image ? (
                        <div className="relative w-full h-[300px] border border-neutral-100 rounded-xl overflow-hidden mb-4">
                          <Image src={previews.hero_image} alt="Hero Background" fill sizes="400px" unoptimized className="object-cover rounded-xl shadow-sm" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                          <ImageIcon size={24} />
                        </div>
                      )}
                      <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 shadow-sm transition-all">
                        Choose Image
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'hero_image')} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* DESIGNING SPACES SECTION */}
              {activeTab === "designing" && (
                <div className="space-y-8 animate-in zoom-in-95 duration-300">
                  <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Designing Spaces</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel: Inputs */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Section Title</label>
                        <input
                          type="text"
                          value={settings.section2_title}
                          onChange={(e) => handleInputChange("section2_title", e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                          placeholder="e.g. Designing Spaces That inspire Living"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Description Paragraph 1</label>
                        <textarea
                          value={settings.section2_description_1}
                          onChange={(e) => handleInputChange("section2_description_1", e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                          placeholder="Explain interior & architectural design solutions..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Description Paragraph 2</label>
                        <textarea
                          value={settings.section2_description_2}
                          onChange={(e) => handleInputChange("section2_description_2", e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                          placeholder="e.g. Established in 2016 A.D..."
                        />
                      </div>

                      {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-neutral-900">Button 1 Text (Inquiry)</label>
                          <input
                            type="text"
                            value={settings.section2_btn_inquiry_text}
                            onChange={(e) => handleInputChange("section2_btn_inquiry_text", e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-neutral-900">Button 1 Link</label>
                          <input
                            type="text"
                            value={settings.section2_btn_inquiry_link}
                            onChange={(e) => handleInputChange("section2_btn_inquiry_link", e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-neutral-900">Button 2 Text (Projects)</label>
                          <input
                            type="text"
                            value={settings.section2_btn_projects_text}
                            onChange={(e) => handleInputChange("section2_btn_projects_text", e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-neutral-900">Button 2 Link</label>
                          <input
                            type="text"
                            value={settings.section2_btn_projects_link}
                            onChange={(e) => handleInputChange("section2_btn_projects_link", e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                          />
                        </div>
                      </div>*/}
                    </div>

                    {/* Right Panel: Image Upload */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-neutral-900">Section Showcase Image</label>
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50 hover:bg-neutral-100/50 transition-colors">
                        {previews.section2_image ? (
                          <div className="relative w-full h-[258px] border border-neutral-100 rounded-xl overflow-hidden mb-4">
                            <Image src={previews.section2_image} alt="Showcase" fill sizes="400px" unoptimized className="object-cover rounded-xl shadow-sm" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                        <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 shadow-sm transition-all">
                          Choose Image
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'section2_image')} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VALUE PROPOSITION SECTION */}
              {activeTab === "value" && (
                <div className="space-y-8 animate-in zoom-in-95 duration-300">
                  <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Value Proposition</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel: Inputs */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Section Headline Paragraph</label>
                        <textarea
                          value={settings.section3_title}
                          onChange={(e) => handleInputChange("section3_title", e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                          placeholder="e.g. We bring dreams to life through thoughtful interior..."
                        />
                      </div>

                      {/* Stat 1 */}
                      <div className="grid grid-cols-2 gap-4 border border-neutral-100 p-4 rounded-xl bg-neutral-50/50">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-neutral-500 uppercase">Stat 1 Value</label>
                          <input
                            type="text"
                            value={settings.section3_stat1_value}
                            onChange={(e) => handleInputChange("section3_stat1_value", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm outline-none"
                            placeholder="e.g. 200+"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-neutral-500 uppercase">Stat 1 Label</label>
                          <input
                            type="text"
                            value={settings.section3_stat1_label}
                            onChange={(e) => handleInputChange("section3_stat1_label", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm outline-none"
                            placeholder="e.g. Our Expertise"
                          />
                        </div>
                      </div>

                      {/* Stat 2 */}
                      <div className="grid grid-cols-2 gap-4 border border-neutral-100 p-4 rounded-xl bg-neutral-50/50">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-neutral-500 uppercase">Stat 2 Value</label>
                          <input
                            type="text"
                            value={settings.section3_stat2_value}
                            onChange={(e) => handleInputChange("section3_stat2_value", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm outline-none"
                            placeholder="e.g. 400+"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-neutral-500 uppercase">Stat 2 Label</label>
                          <input
                            type="text"
                            value={settings.section3_stat2_label}
                            onChange={(e) => handleInputChange("section3_stat2_label", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm outline-none"
                            placeholder="e.g. Projects"
                          />
                        </div>
                      </div>

                      {/* Stat 3 */}
                      <div className="grid grid-cols-2 gap-4 border border-neutral-100 p-4 rounded-xl bg-neutral-50/50">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-neutral-500 uppercase">Stat 3 Value</label>
                          <input
                            type="text"
                            value={settings.section3_stat3_value}
                            onChange={(e) => handleInputChange("section3_stat3_value", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm outline-none"
                            placeholder="e.g. 4.5"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-neutral-500 uppercase">Stat 3 Label</label>
                          <input
                            type="text"
                            value={settings.section3_stat3_label}
                            onChange={(e) => handleInputChange("section3_stat3_label", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm outline-none"
                            placeholder="e.g. Out of 5.0"
                          />
                        </div>
                      </div>

                      {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-neutral-900">Button Text</label>
                          <input
                            type="text"
                            value={settings.section3_btn_text}
                            onChange={(e) => handleInputChange("section3_btn_text", e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-neutral-900">Button Link</label>
                          <input
                            type="text"
                            value={settings.section3_btn_link}
                            onChange={(e) => handleInputChange("section3_btn_link", e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                          />
                        </div>
                      </div>*/}
                    </div>

                    {/* Right Panel: Image Upload */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-neutral-900">Proposition Showcase Image</label>
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50 hover:bg-neutral-100/50 transition-colors">
                        {previews.section3_image ? (
                          <div className="relative w-full h-[258px] border border-neutral-100 rounded-xl overflow-hidden mb-4">
                            <Image src={previews.section3_image} alt="Proposition" fill sizes="400px" unoptimized className="object-cover rounded-xl shadow-sm" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                        <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 shadow-sm transition-all">
                          Choose Image
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'section3_image')} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="p-6 md:px-8 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                {saving ? (
                  <><FaSpinner size={18} className="animate-spin" /> Saving Homepage Settings...</>
                ) : (
                  <><FaSave size={18} /> Save All Changes</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HomePageSetup() {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <FaSpinner className="animate-spin text-neutral-400" size={32} />
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
