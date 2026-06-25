"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaSave, FaImage as ImageIcon, FaInfo, FaCheckCircle, FaStar, FaHandshake, FaListUl } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import AboutFeaturesManager from "@/components/admin/AboutFeaturesManager";

export default function AboutPageSetup() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    hero: { title: "" },
    welcome: { title: "", description: "" },
    main_about: { title: "", description: "" },
    why_choose_us: { title: "", description: "" }
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    hero_image: null,
    main_image: null
  });

  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetchApi("/about-page");
      if (res.success && res.data) {
        const sanitize = (obj: any) => {
          if (!obj) return {};
          return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, v === null ? "" : v])
          );
        };

        setSettings((prev) => ({
          hero: { ...prev.hero, ...sanitize(res.data.hero) },
          welcome: { ...prev.welcome, ...sanitize(res.data.welcome) },
          main_about: { ...prev.main_about, ...sanitize(res.data.main_about) },
          why_choose_us: { ...prev.why_choose_us, ...sanitize(res.data.why_choose_us) }
        }));

        setPreviews({
          hero_image: res.data.hero?.image?.url || "",
          main_image: res.data.main_about?.image?.url || ""
        });
      }
    } catch (error: any) {
      console.error("Error fetching about page settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles({ ...files, [fieldName]: file });
      setPreviews({ ...previews, [fieldName]: URL.createObjectURL(file) });
    }
  };

  const handleInputChange = (category: keyof typeof settings, field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();

    // Map nested state back to flat API expected form data
    formData.append("hero_title", settings.hero.title);
    formData.append("welcome_title", settings.welcome.title);
    formData.append("welcome_description", settings.welcome.description);
    formData.append("main_title", settings.main_about.title);
    formData.append("main_description", settings.main_about.description);
    formData.append("why_choose_title", settings.why_choose_us.title);
    formData.append("why_choose_description", settings.why_choose_us.description);

    if (files.hero_image) formData.append("hero_image", files.hero_image);
    if (files.main_image) formData.append("main_image", files.main_image);

    try {
      const res = await fetchApi("/admin/about-page", {
        method: "POST",
        body: formData,
      });

      if (res.success) {
        toast.success("About page updated successfully.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error(res.message || "Failed to update about page.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "hero", label: "Hero Banner", icon: FaStar },
    { id: "welcome", label: "Welcome Section", icon: FaHandshake },
    { id: "main_about", label: "Main About", icon: FaInfo },
    { id: "why_choose", label: "Why Choose Us", icon: FaListUl },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <FaSpinner className="animate-spin text-neutral-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">About Page Setup</h1>
        <p className="text-neutral-500 text-sm mt-1">Configure the content and imagery for the public About Us page.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Vertical Tabs Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <tab.icon size={18} className={isActive ? "text-white" : "text-neutral-500"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Content Area */}
        <div className="flex-1 space-y-8">
          {(activeTab !== "why_choose") ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  {activeTab === "hero" && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                      <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Hero Banner</h2>
                      
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-neutral-900">Hero Image</label>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl hover:border-black transition-colors bg-neutral-50">
                          {previews.hero_image ? (
                             // eslint-disable-next-line @next/next/no-img-element
                            <img src={previews.hero_image} alt="Hero" className="h-32 object-cover rounded-xl mb-4 shadow-sm" />
                          ) : (
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                          <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all">
                            Choose Image
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'hero_image')} />
                          </label>
                          <p className="text-xs text-neutral-400 mt-3 text-center">Max size: 2MB. 1920x1080px recommended.</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Hero Title</label>
                        <input
                          type="text"
                          value={settings.hero.title}
                          onChange={(e) => handleInputChange("hero", "title", e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                          placeholder="e.g. Revolutionizing the way you shop"
                          maxLength={255}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "welcome" && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                      <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Welcome Section</h2>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Welcome Title</label>
                        <input
                          type="text"
                          value={settings.welcome.title}
                          onChange={(e) => handleInputChange("welcome", "title", e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                          placeholder="e.g. Welcome to ShopEase"
                          maxLength={255}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Welcome Description</label>
                        <textarea
                          value={settings.welcome.description}
                          onChange={(e) => handleInputChange("welcome", "description", e.target.value)}
                          rows={6}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-neutral-400"
                          placeholder="Write a welcoming message for your visitors..."
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "main_about" && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                      <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Main About Content</h2>
                      
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-neutral-900">Main Content Image</label>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl hover:border-black transition-colors bg-neutral-50">
                          {previews.main_image ? (
                             // eslint-disable-next-line @next/next/no-img-element
                            <img src={previews.main_image} alt="Main About" className="h-32 object-cover rounded-xl mb-4 shadow-sm" />
                          ) : (
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                          <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all">
                            Choose Image
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'main_image')} />
                          </label>
                          <p className="text-xs text-neutral-400 mt-3 text-center">Max size: 2MB. Square or 4:3 aspect ratio recommended.</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Main Title</label>
                        <input
                          type="text"
                          value={settings.main_about.title}
                          onChange={(e) => handleInputChange("main_about", "title", e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                          placeholder="e.g. Our Story"
                          maxLength={255}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Main Description</label>
                        <textarea
                          value={settings.main_about.description}
                          onChange={(e) => handleInputChange("main_about", "description", e.target.value)}
                          rows={8}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-neutral-400"
                          placeholder="Provide deep details about your company history and operations..."
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 md:px-8 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                  >
                    {saving ? (
                      <><FaSpinner size={18} className="animate-spin" /> Saving Changes...</>
                    ) : (
                      <><FaSave size={18} /> Save Changes</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              {/* <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Why Choose Us Section Settings</h2>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-900">Section Title</label>
                    <input
                      type="text"
                      value={settings.why_choose_us.title}
                      onChange={(e) => handleInputChange("why_choose_us", "title", e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                      placeholder="e.g. Why Choose Us?"
                      maxLength={255}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-900">Section Description</label>
                    <textarea
                      value={settings.why_choose_us.description}
                      onChange={(e) => handleInputChange("why_choose_us", "description", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-neutral-400"
                      placeholder="List your unique selling points or advantages..."
                    />
                  </div>
                </div>
                <div className="p-6 md:px-8 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                  >
                    {saving ? (
                      <><FaSpinner size={18} className="animate-spin" /> Saving...</>
                    ) : (
                      <><FaSave size={18} /> Save Section Settings</>
                    )}
                  </button>
                </div>
              </form> */}

              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden p-6 md:p-8">
                <AboutFeaturesManager />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}