"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Image as ImageIcon,
  Loader2,
  X,
  Type,
  Layout,
  Star,
  Settings as SettingsIcon,
  Save,
  ChevronRight,
  Wrench
} from "lucide-react";
import { 
  getAdminServices, 
  deleteService, 
  createService, 
  updateService 
} from "@/lib/services";
import { Service } from "@/types/service";
import { toast } from "sonner";

// ─── Types & Defaults ──────────────────────────────────────
interface WhyChooseBlock {
  title: string;
  description: string;
  points: string[];
  image_file?: File | null;
  existing_image_url?: string | null;
}

interface FormState extends Partial<Service> {
  why_choose_blocks: WhyChooseBlock[];
}

const emptyBlock = (): WhyChooseBlock => ({
  title: "",
  description: "",
  points: [""],
  image_file: null,
  existing_image_url: null,
});

const emptyForm = (): FormState => ({
  title: "",
  slug: "",
  subtitle: "",
  short_description: "",
  description: "",
  sort_order: 0,
  is_active: true,
  why_choose_blocks: [emptyBlock()],
});

function normalizeBlocks(wc: any): WhyChooseBlock[] {
  if (!wc) return [emptyBlock()];
  const arr = Array.isArray(wc) ? wc.filter(Boolean) : [wc].filter(Boolean);
  if (arr.length === 0) return [emptyBlock()];
  return arr.map((b: any) => ({
    title: b.title || "",
    description: b.description || "",
    points: b.points?.length ? b.points : [""],
    image_file: null,
    existing_image_url: b.image?.url || null,
  }));
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Selection & Tab Management
  const [selectedServiceId, setSelectedServiceId] = useState<number | 'new' | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [currentService, setCurrentService] = useState<FormState>(emptyForm());
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [expandedBlock, setExpandedBlock] = useState<number>(0);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getAdminServices();
      setServices(data);
      if (data.length > 0 && selectedServiceId === null) {
        handleSelectService(data[0]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }

  const handleSelectService = (service: Service | 'new') => {
    if (service === 'new') {
      setSelectedServiceId('new');
      setCurrentService(emptyForm());
    } else {
      setSelectedServiceId(service.id);
      setCurrentService({
        ...service,
        why_choose_blocks: normalizeBlocks(service.why_choose),
      });
    }
    setHeroImageFile(null);
    setActiveTab("content");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...", { selectedServiceId });
    setSaving(true);
    try {
      const fd = new FormData();
      if (currentService.title) fd.append("title", currentService.title);
      if (currentService.slug) fd.append("slug", currentService.slug);
      if (currentService.subtitle) fd.append("subtitle", currentService.subtitle);
      if (currentService.short_description) fd.append("short_description", currentService.short_description);
      if (currentService.description) fd.append("description", currentService.description);
      fd.append("sort_order", String(currentService.sort_order || 0));
      fd.append("is_active", currentService.is_active ? "1" : "0");

      if (heroImageFile) fd.append("hero_image", heroImageFile);

      currentService.why_choose_blocks.forEach((block, i) => {
        if (block.title) fd.append(`why_choose[${i}][title]`, block.title);
        if (block.description) fd.append(`why_choose[${i}][description]`, block.description);
        block.points.filter(p => !!p?.trim()).forEach(p => fd.append(`why_choose[${i}][points][]`, p));
        if (block.image_file) fd.append(`why_choose[${i}][image]`, block.image_file);
      });

      if (selectedServiceId === 'new') {
        console.log("Creating new service via POST...");
        const res = await createService(fd);
        toast.success("Service created successfully!");
        setSelectedServiceId(res.id);
      } else if (selectedServiceId) {
        console.log("Updating service via PUT...", selectedServiceId);
        await updateService(selectedServiceId as number, fd);
        toast.success("Service updated successfully!");
      }
      
      console.log("Submission completed, refreshing data.");
      fetchData();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to save changes. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service permanently?")) return;
    try {
      await deleteService(id);
      toast.success("Service deleted");
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      if (updated.length > 0) handleSelectService(updated[0]);
      else handleSelectService('new');
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  };

  const tabs = [
    { id: "content", label: "Basic Content", icon: Type },
    { id: "hero", label: "Hero Image", icon: Layout },
    { id: "why_choose", label: "Why Choose Us Blocks", icon: Star },
    { id: "settings", label: "Status & Sorting", icon: SettingsIcon },
  ];

  // ─── Block Helpers ────────────────────────────────────────
  const updateBlock = (idx: number, patch: Partial<WhyChooseBlock>) => {
    setCurrentService(prev => ({
      ...prev,
      why_choose_blocks: prev.why_choose_blocks.map((b, i) => i === idx ? { ...b, ...patch } : b),
    }));
  };
  const addBlock = () => {
    setCurrentService(prev => ({ ...prev, why_choose_blocks: [...prev.why_choose_blocks, emptyBlock()] }));
    setExpandedBlock(currentService.why_choose_blocks.length);
  };
  const removeBlock = (idx: number) => {
    setCurrentService(prev => ({ ...prev, why_choose_blocks: prev.why_choose_blocks.filter((_, i) => i !== idx) }));
  };
  const addPoint = (bIdx: number) => {
    updateBlock(bIdx, { points: [...currentService.why_choose_blocks[bIdx].points, ""] });
  };
  const updatePoint = (bIdx: number, pIdx: number, val: string) => {
    const updated = [...currentService.why_choose_blocks[bIdx].points];
    updated[pIdx] = val;
    updateBlock(bIdx, { points: updated });
  };
  const removePoint = (bIdx: number, pIdx: number) => {
    updateBlock(bIdx, { points: currentService.why_choose_blocks[bIdx].points.filter((_, i) => i !== pIdx) });
  };

  const filtered = services.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading && services.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" size={40} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500 text-neutral-900 font-sans">
      
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Configure your professional offerings in a unified view.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* ── SERVICE SIDEBAR ── */}
        <div className="w-full lg:w-80 flex flex-col bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b border-neutral-50">
            <button 
              type="button"
              onClick={() => handleSelectService('new')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all shadow-md active:scale-95"
            >
              <Plus size={18} /> New Service
            </button>
          </div>
          
          <div className="p-4 bg-neutral-50/50 border-b border-neutral-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input 
                type="text" 
                placeholder="Search services..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-black transition-all" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filtered.map(s => {
              const isSelected = selectedServiceId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectService(s)}
                  className={`w-full group flex items-center justify-between p-4 rounded-2xl text-left transition-all ${
                    isSelected ? "bg-neutral-900 text-white shadow-xl translate-x-1" : "hover:bg-neutral-50 text-neutral-600"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-white/10" : "bg-neutral-100"}`}>
                        <Wrench size={16} className={isSelected ? "text-white" : "text-neutral-400"} />
                     </div>
                     <span className="text-[13px] font-bold truncate leading-none uppercase tracking-tight">{s.title}</span>
                  </div>
                  <ChevronRight size={14} className={isSelected ? "text-[#C59D5F]" : "text-neutral-300 opacity-0 group-hover:opacity-100"} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── EDITOR CONTENT ────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden min-w-0">
          
          <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-50 bg-neutral-50/30">
            <div className="flex gap-4">
              {tabs.map(t => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                      isActive ? "bg-black text-white shadow-md" : "text-neutral-400 hover:text-black hover:bg-white"
                    }`}
                  >
                    <t.icon size={14} /> {t.label}
                  </button>
                );
              })}
            </div>
            
            {selectedServiceId !== 'new' && (
              <button 
                type="button"
                onClick={() => handleDelete(selectedServiceId as number)}
                className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Service"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            
            {activeTab === "content" && (
              <div className="max-w-3xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Title *</label>
                    <input required type="text" value={currentService.title} onChange={e => {
                      const t = e.target.value;
                      const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      setCurrentService(prev => ({ ...prev, title: t, slug }));
                    }} className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-black transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Slug *</label>
                    <input required type="text" value={currentService.slug} onChange={e => setCurrentService(prev => ({ ...prev, slug: e.target.value }))} className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-black transition-all font-mono text-xs text-neutral-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Subtitle (Tagline)</label>
                  <input type="text" value={currentService.subtitle || ""} onChange={e => setCurrentService(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-black transition-all" placeholder="Enter service subtitle..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Short Summary</label>
                  <textarea rows={2} value={currentService.short_description || ""} onChange={e => setCurrentService(prev => ({ ...prev, short_description: e.target.value }))} className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-black transition-all resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Full Narrative Description</label>
                  <textarea rows={5} value={currentService.description || ""} onChange={e => setCurrentService(prev => ({ ...prev, description: e.target.value }))} className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-black transition-all resize-none" />
                </div>
              </div>
            )}

            {activeTab === "hero" && (
              <div className="max-w-3xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Service Landing Image</label>
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-neutral-200 rounded-[3rem] bg-neutral-50 hover:bg-white hover:border-black transition-all group">
                    {(heroImageFile || currentService.hero_image?.url) ? (
                       <div className="relative w-full max-w-md aspect-video rounded-3xl overflow-hidden shadow-2xl mb-8">
                          <img src={heroImageFile ? URL.createObjectURL(heroImageFile) : currentService.hero_image?.url || ""} className="w-full h-full object-cover" alt="hero" />
                       </div>
                    ) : (
                       <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 text-neutral-200 shadow-sm"><ImageIcon size={32} /></div>
                    )}
                    <label className="cursor-pointer bg-black text-white px-8 py-3 rounded-2xl font-bold text-xs shadow-xl active:scale-95 transition-all">
                      Choose Hero Image
                      <input type="file" className="hidden" accept="image/*" onChange={e => setHeroImageFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "why_choose" && (
              <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold uppercase tracking-tight">Why Choose Section Blocks</h3>
                  <button type="button" onClick={addBlock} className="flex items-center gap-2 px-5 py-2 bg-[#C59D5F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md">
                    <Plus size={14} /> Add Block
                  </button>
                </div>
                <div className="space-y-4">
                  {currentService.why_choose_blocks.map((block, bi) => (
                    <div key={bi} className="border border-neutral-100 rounded-3xl overflow-hidden shadow-sm">
                      <button type="button" onClick={() => setExpandedBlock(expandedBlock === bi ? -1 : bi)} className="w-full flex items-center justify-between px-8 py-5 bg-white hover:bg-neutral-50 transition-all font-bold text-sm">
                        <span>Block {bi + 1}: {block.title || "Untitled"}</span>
                        <div className="flex items-center gap-4">
                          {currentService.why_choose_blocks.length > 1 && (
                            <X onClick={e => { e.stopPropagation(); removeBlock(bi); }} className="text-neutral-300 hover:text-red-500 cursor-pointer" size={16} />
                          )}
                          <ChevronRight className={`transition-transform duration-300 ${expandedBlock === bi ? "rotate-90 text-black" : "text-neutral-300"}`} size={20} />
                        </div>
                      </button>
                      {expandedBlock === bi && (
                        <div className="p-8 bg-neutral-50/30 border-t border-neutral-50 space-y-6">
                           <div className="grid md:grid-cols-2 gap-8">
                             <div className="space-y-2">
                               <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Title</label>
                               <input type="text" value={block.title} onChange={e => updateBlock(bi, { title: e.target.value })} className="w-full px-5 py-3 bg-white border border-neutral-200 rounded-2xl outline-none focus:border-black transition-all font-bold" />
                             </div>
                             <div className="space-y-2">
                               <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Image</label>
                               <div className="flex items-center gap-4">
                                  {(block.image_file || block.existing_image_url) && (
                                     <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-200 shrink-0 shadow-sm">
                                        <img src={block.image_file ? URL.createObjectURL(block.image_file) : block.existing_image_url || ""} className="w-full h-full object-cover" alt="prev" />
                                     </div>
                                  )}
                                  <input type="file" className="text-[10px] file:bg-black file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:font-bold" onChange={e => updateBlock(bi, { image_file: e.target.files?.[0] || null })} />
                               </div>
                             </div>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Description</label>
                             <textarea rows={2} value={block.description} onChange={e => updateBlock(bi, { description: e.target.value })} className="w-full px-5 py-3 bg-white border border-neutral-200 rounded-2xl outline-none focus:border-black transition-all resize-none font-medium" />
                           </div>
                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Bullet Points</label>
                             {block.points.map((p, pi) => (
                               <div key={pi} className="flex gap-2">
                                 <input type="text" value={p} onChange={e => updatePoint(bi, pi, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-neutral-200 rounded-xl outline-none text-xs" />
                                 <button type="button" onClick={() => removePoint(bi, pi)} className="p-2 text-neutral-300 hover:text-red-500 transition-colors"><X size={14} /></button>
                               </div>
                             ))}
                             <button type="button" onClick={() => addPoint(bi)} className="text-[10px] font-bold text-[#C59D5F] flex items-center gap-1"><Plus size={14} /> Add Point</button>
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between p-8 bg-neutral-50/50 rounded-3xl border border-neutral-100">
                  <div className="space-y-1">
                    <p className="font-bold">Publishing Status</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Make this service visible on site</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCurrentService(p => ({ ...p, is_active: !p.is_active }))}
                    className={`w-14 h-8 rounded-full p-1 transition-all ${currentService.is_active ? "bg-emerald-500" : "bg-neutral-300"}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-all ${currentService.is_active ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-8 bg-neutral-50/50 rounded-3xl border border-neutral-100">
                  <div className="space-y-1">
                    <p className="font-bold">Display Order</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Numeric value for manual sorting</p>
                  </div>
                  <input type="number" value={currentService.sort_order || 0} onChange={e => setCurrentService(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="w-20 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-center font-bold" />
                </div>
              </div>
            )}
            
            <div className="mt-16 pt-8 border-t border-neutral-50 flex items-center justify-between bg-white sticky bottom-0 z-10">
              <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${saving ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`} />
                 <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{saving ? "Syncing Workspace..." : "All systems normal"}</span>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-10 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin text-[#C59D5F]" /> : <Save size={18} className="text-[#C59D5F]" />}
                {selectedServiceId === 'new' ? "Create Expertise" : "Save All Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
