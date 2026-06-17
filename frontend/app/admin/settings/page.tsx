"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { 
  FaSave, FaImage as ImageIcon,FaMapPin, FaPhone, FaFacebook, 
  FaTwitter, FaInstagram, FaGlobe, FaInfo, FaBuilding
} from "react-icons/fa" ;
import { FaSpinner } from "react-icons/fa";
import { LuMail } from "react-icons/lu";

export default function SiteSettingsPage() {
  const [activeTab, setActiveTab] = useState("branding");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [settings, setSettings] = useState({
    branding: { website_title: "", website_slogan: "", logo: "", favicon: "" },
    about: { about_us: "" },
    contact_details: { primary_phone: "", secondary_phone: "", email_address: "", physical_address: "", google_maps_embed: "" },
    social_media: { 
      facebook_title: "", facebook_url: "", facebook_icon: "",
      twitter_title: "", twitter_url: "", twitter_icon: "",
      instagram_title: "", instagram_url: "", instagram_icon: ""
    }
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    logo: null,
    favicon: null,
    facebook_icon: null,
    twitter_icon: null,
    instagram_icon: null
  });

  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/site-settings");
      if (res.success && res.data) {
        // Sanitize to replace nulls with empty strings
        const sanitize = (obj: any) => {
          if (!obj) return {};
          return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, v === null ? "" : v])
          );
        };

        setSettings({
          branding: { ...settings.branding, ...sanitize(res.data.branding) },
          about: { ...settings.about, ...sanitize(res.data.about) },
          contact_details: { ...settings.contact_details, ...sanitize(res.data.contact_details) },
          social_media: { ...settings.social_media, ...sanitize(res.data.social_media) }
        });
        
        // Pre-fill previews
        setPreviews({
          logo: res.data.branding?.logo || "",
          favicon: res.data.branding?.favicon || "",
          facebook_icon: res.data.social_media?.facebook_icon || "",
          twitter_icon: res.data.social_media?.twitter_icon || "",
          instagram_icon: res.data.social_media?.instagram_icon || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching settings", error);
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
    setMessage(null);

    const formData = new FormData();
    
    // Append string fields
    const categories = ['branding', 'about', 'contact_details', 'social_media'] as const;
    categories.forEach(category => {
      Object.entries(settings[category]).forEach(([key, value]) => {
        if (!['logo', 'favicon', 'facebook_icon', 'twitter_icon', 'instagram_icon'].includes(key)) {
          formData.append(key, (value || "") as string);
        }
      });
    });

    // Append files
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    try {
      const res = await fetchApi("/admin/site-settings", {
        method: "POST",
        body: formData, // fetchApi will clear Content-Type for FormData
      });

      if (res.success) {
        setMessage({ type: 'success', text: "Site settings updated successfully." });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage({ type: 'error', text: res.message || "Failed to update settings." });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "An unexpected error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "branding", label: "Branding", icon: FaGlobe },
    { id: "about", label: "About", icon: FaInfo },
    { id: "contact", label: "Contact Details", icon: FaBuilding },
    { id: "social", label: "Social Media", icon: FaFacebook },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <FaSpinner className="animate-spin text-neutral-400" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Site Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your website's global information, branding, and contact details.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        } border`}>
          <FaInfo size={20} />
          <p className="font-medium text-sm">{message.text}</p>
        </div>
      )}

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
                    ? "bg-black text-white shadow-md"
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
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                
                {/* BRANDING TAB */}
                {activeTab === "branding" && (
                  <div className="space-y-8 animate-in zoom-in-95 duration-300">
                    <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Branding & Identity</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-neutral-900">Website Logo</label>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl hover:border-black transition-colors bg-neutral-50">
                          {previews.logo ? (
                            <img src={previews.logo} alt="Logo" className="h-20 object-contain mb-4" />
                          ) : (
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                          <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all">
                            Choose Logo
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                          </label>
                          <p className="text-xs text-neutral-400 mt-3 text-center">Max size: 2MB. Transparent PNG recommended.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-neutral-900">Favicon</label>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl hover:border-black transition-colors bg-neutral-50">
                          {previews.favicon ? (
                            <img src={previews.favicon} alt="Favicon" className="w-12 h-12 object-contain mb-4 rounded shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 bg-neutral-100 rounded-md flex items-center justify-center mb-4 text-neutral-400">
                              <FaGlobe size={20} />
                            </div>
                          )}
                          <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all">
                            Choose Favicon
                            <input type="file" className="hidden" accept="image/x-icon,image/png,image/jpeg" onChange={(e) => handleFileChange(e, 'favicon')} />
                          </label>
                          <p className="text-xs text-neutral-400 mt-3 text-center">Standard formats: .ico or .png (32x32px).</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Website Title</label>
                        <input
                          type="text"
                          value={settings.branding.website_title}
                          onChange={(e) => handleInputChange("branding", "website_title", e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                          placeholder="e.g. ShopEase | Your Online Marketplace"
                          maxLength={255}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Website Slogan</label>
                        <input
                          type="text"
                          value={settings.branding.website_slogan}
                          onChange={(e) => handleInputChange("branding", "website_slogan", e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                          placeholder="e.g. Shop the world in one place"
                          maxLength={255}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ABOUT TAB */}
                {activeTab === "about" && (
                  <div className="space-y-6 animate-in zoom-in-95 duration-300">
                    <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">About Us</h2>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-neutral-900">Company Overview</label>
                      <textarea
                        value={settings.about.about_us}
                        onChange={(e) => handleInputChange("about", "about_us", e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-neutral-400"
                        placeholder="Write a brief description about your company, mission, and vision..."
                      />
                      <p className="text-xs text-neutral-500 mt-2">This content will be displayed on the 'About Us' public page.</p>
                    </div>
                  </div>
                )}

                {/* CONTACT DETAILS TAB */}
                {activeTab === "contact" && (
                  <div className="space-y-6 animate-in zoom-in-95 duration-300">
                    <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Contact Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Primary Phone</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone size={16} className="text-neutral-400" />
                          </div>
                          <input
                            type="text"
                            value={settings.contact_details.primary_phone}
                            onChange={(e) => handleInputChange("contact_details", "primary_phone", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                            maxLength={30}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">Secondary Phone (Optional)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone size={16} className="text-neutral-400" />
                          </div>
                          <input
                            type="text"
                            value={settings.contact_details.secondary_phone}
                            onChange={(e) => handleInputChange("contact_details", "secondary_phone", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="+1 (555) 111-1111"
                            maxLength={30}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-neutral-900">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LuMail size={16} className="text-neutral-400" />
                        </div>
                        <input
                          type="email"
                          value={settings.contact_details.email_address}
                          onChange={(e) => handleInputChange("contact_details", "email_address", e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                          placeholder="contact@yourcompany.com"
                          maxLength={255}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-neutral-900">Physical Address</label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none flex items-start">
                          <FaMapPin size={16} className="text-neutral-400" />
                        </div>
                        <textarea
                          value={settings.contact_details.physical_address}
                          onChange={(e) => handleInputChange("contact_details", "physical_address", e.target.value)}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                          placeholder="123 Commerce St, Kathmandu, Nepal"
                          maxLength={1000}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-neutral-900 flex items-center justify-between">
                        Google Maps Embed Code
                        <a href="https://support.google.com/maps/answer/144361" target="_blank" rel="noreferrer" className="text-indigo-600 font-normal text-xs hover:underline">How to get embed code?</a>
                      </label>
                      <textarea
                        value={settings.contact_details.google_maps_embed}
                        onChange={(e) => handleInputChange("contact_details", "google_maps_embed", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none text-neutral-600"
                        placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                        maxLength={5000}
                      />
                    </div>
                  </div>
                )}

                {/* SOCIAL MEDIA TAB */}
                {activeTab === "social" && (
                  <div className="space-y-8 animate-in zoom-in-95 duration-300">
                    <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Social Network Links</h2>
                    
                    {/* Facebook */}
                    <div className="p-5 border border-blue-100 bg-blue-50/30 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaFacebook className="text-blue-600" size={20} />
                        <h3 className="font-bold text-blue-900">Facebook Settings</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-700">Page Title</label>
                          <input type="text" value={settings.social_media.facebook_title} onChange={(e) => handleInputChange("social_media", "facebook_title", e.target.value)} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. ShopEase Official" maxLength={100} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-700">Profile URL</label>
                          <input type="url" value={settings.social_media.facebook_url} onChange={(e) => handleInputChange("social_media", "facebook_url", e.target.value)} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="https://facebook.com/..." maxLength={1000} />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-neutral-700">Custom Icon (Optional)</label>
                          <div className="flex items-center gap-4">
                            {previews.facebook_icon && <img src={previews.facebook_icon} className="w-8 h-8 rounded object-cover shadow-sm bg-white" alt="FB Icon" />}
                            <label className="text-xs font-medium cursor-pointer bg-white px-3 py-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50">
                              Upload Icon
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'facebook_icon')} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Twitter */}
                    <div className="p-5 border border-sky-100 bg-sky-50/30 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaTwitter className="text-sky-500" size={20} />
                        <h3 className="font-bold text-sky-900">X / Twitter Settings</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-700">Profile Title</label>
                          <input type="text" value={settings.social_media.twitter_title} onChange={(e) => handleInputChange("social_media", "twitter_title", e.target.value)} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-sky-500 outline-none" placeholder="e.g. ShopEase Support" maxLength={100} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-700">Profile URL</label>
                          <input type="url" value={settings.social_media.twitter_url} onChange={(e) => handleInputChange("social_media", "twitter_url", e.target.value)} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-sky-500 outline-none" placeholder="https://twitter.com/..." maxLength={1000} />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-neutral-700">Custom Icon (Optional)</label>
                          <div className="flex items-center gap-4">
                            {previews.twitter_icon && <img src={previews.twitter_icon} className="w-8 h-8 rounded object-cover shadow-sm bg-white" alt="Twitter Icon" />}
                            <label className="text-xs font-medium cursor-pointer bg-white px-3 py-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50">
                              Upload Icon
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'twitter_icon')} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="p-5 border border-pink-100 bg-pink-50/30 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaInstagram className="text-pink-600" size={20} />
                        <h3 className="font-bold text-pink-900">Instagram Settings</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-700">Profile Title</label>
                          <input type="text" value={settings.social_media.instagram_title} onChange={(e) => handleInputChange("social_media", "instagram_title", e.target.value)} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-pink-500 outline-none" placeholder="e.g. @shopease" maxLength={100} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-700">Profile URL</label>
                          <input type="url" value={settings.social_media.instagram_url} onChange={(e) => handleInputChange("social_media", "instagram_url", e.target.value)} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-pink-500 outline-none" placeholder="https://instagram.com/..." maxLength={1000} />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-neutral-700">Custom Icon (Optional)</label>
                          <div className="flex items-center gap-4">
                            {previews.instagram_icon && <img src={previews.instagram_icon} className="w-8 h-8 rounded object-cover shadow-sm bg-white" alt="Insta Icon" />}
                            <label className="text-xs font-medium cursor-pointer bg-white px-3 py-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50">
                              Upload Icon
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'instagram_icon')} />
                            </label>
                          </div>
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
                  className="px-6 py-3 bg-black text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                >
                  {saving ? (
                    <><FaSpinner size={18} className="animate-spin" /> Saving Settings...</>
                  ) : (
                    <><FaSave size={18} /> Save All Changes</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
