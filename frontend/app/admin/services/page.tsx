"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  Wrench,
  Tag,
  X
} from "lucide-react";
import { 
  getAdminServices, 
  deleteService, 
  createService, 
  updateService 
} from "@/lib/services";
import { getServiceCategories } from "@/lib/service-categories";
import { Service } from "@/types/service";
import { ServiceCategory } from "@/types/service-category";
import { toast } from "sonner";
import Link from "next/link";

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> & {
    service_category_id?: number | null;
    why_choose_title?: string;
    why_choose_description?: string;
    why_choose_points?: string[];
  } | null>(null);

  // Form file states
  const [formFiles, setFormFiles] = useState<{
    thumbnail_image: File | null;
    hero_image: File | null;
    why_choose_image: File | null;
    gallery_images: File[];
  }>({
    thumbnail_image: null,
    hero_image: null,
    why_choose_image: null,
    gallery_images: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [servicesData, categoriesData] = await Promise.all([
        getAdminServices(),
        getServiceCategories()
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success("Service deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service");
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setIsEditing(true);
      setCurrentService({
        ...service,
        service_category_id: service.category?.id || null,
        why_choose_title: service.why_choose?.title || "",
        why_choose_description: service.why_choose?.description || "",
        why_choose_points: service.why_choose?.points || [""],
      });
    } else {
      setIsEditing(false);
      setCurrentService({
        title: "",
        slug: "",
        subtitle: "",
        short_description: "",
        description: "",
        sort_order: 0,
        is_active: true,
        service_category_id: null,
        why_choose_title: "",
        why_choose_description: "",
        why_choose_points: [""],
      });
    }
    setFormFiles({ thumbnail_image: null, hero_image: null, why_choose_image: null, gallery_images: [] });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      
      const textFields = [
        "title", "slug", "subtitle", "short_description", "description", 
        "sort_order", "is_active", "service_category_id",
        "why_choose_title", "why_choose_description"
      ];

      textFields.forEach(field => {
        const value = (currentService as any)[field];
        if (value !== null && value !== undefined && value !== "") {
          if (typeof value === "boolean") {
            formData.append(field, value ? "1" : "0");
          } else {
            formData.append(field, value.toString());
          }
        }
      });

      // Why choose points
      if (currentService?.why_choose_points) {
        currentService.why_choose_points
          .filter(p => p.trim() !== "")
          .forEach((point) => {
            formData.append("why_choose_points[]", point);
          });
      }

      if (formFiles.thumbnail_image) {
        formData.append("thumbnail_image", formFiles.thumbnail_image);
      }
      if (formFiles.hero_image) {
        formData.append("hero_image", formFiles.hero_image);
      }
      if (formFiles.why_choose_image) {
        formData.append("why_choose_image", formFiles.why_choose_image);
      }

      formFiles.gallery_images.forEach((file) => {
        formData.append("gallery_images[]", file);
      });

      if (isEditing && currentService?.id) {
        await updateService(currentService.id, formData);
        toast.success("Service updated successfully");
      } else {
        await createService(formData);
        toast.success("Service created successfully");
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const addWhyChoosePoint = () => {
    setCurrentService(prev => ({
      ...prev,
      why_choose_points: [...(prev?.why_choose_points || []), ""]
    }));
  };

  const removeWhyChoosePoint = (index: number) => {
    setCurrentService(prev => ({
      ...prev,
      why_choose_points: (prev?.why_choose_points || []).filter((_, i) => i !== index)
    }));
  };

  const updateWhyChoosePoint = (index: number, value: string) => {
    setCurrentService(prev => ({
      ...prev,
      why_choose_points: (prev?.why_choose_points || []).map((p, i) => i === index ? value : p)
    }));
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || s.category?.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-neutral-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your professional services and offerings.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/services/categories"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-900 rounded-xl hover:bg-neutral-200 transition-all font-semibold border border-neutral-200"
          >
            <Tag size={18} />
            Categories
          </Link>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all font-semibold shadow-sm"
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-neutral-400" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <p className="text-sm text-neutral-500 font-medium">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <Wrench size={28} />
            </div>
            <h3 className="font-bold">No services found</h3>
            <p className="text-sm text-neutral-500 mt-1">Try adjusting your filters or add a new service.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Service</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredServices.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 flex-shrink-0">
                          {item.thumbnail_image?.url ? (
                            <img src={item.thumbnail_image.url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold truncate">{item.title}</span>
                          <span className="text-xs text-neutral-500 truncate">{item.subtitle || item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
                        {item.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${item.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                        {item.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {isEditing ? "Edit Service" : "New Service"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                <X size={20} className="text-neutral-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Title *</label>
                  <input 
                    required
                    type="text"
                    value={currentService?.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setCurrentService(prev => ({ ...prev, title, slug }));
                    }}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Slug *</label>
                  <input 
                    required
                    type="text"
                    value={currentService?.slug || ""}
                    onChange={(e) => setCurrentService(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Subtitle</label>
                <input 
                  type="text"
                  value={currentService?.subtitle || ""}
                  onChange={(e) => setCurrentService(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                  placeholder="e.g. Premium Interior Solutions"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Category</label>
                <select 
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                  value={currentService?.service_category_id || ""}
                  onChange={(e) => setCurrentService(prev => ({ ...prev, service_category_id: e.target.value ? Number(e.target.value) : null }))}
                >
                  <option value="">No Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Short Description</label>
                <textarea 
                  rows={2}
                  value={currentService?.short_description || ""}
                  onChange={(e) => setCurrentService(prev => ({ ...prev, short_description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                <textarea 
                  rows={4}
                  value={currentService?.description || ""}
                  onChange={(e) => setCurrentService(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Thumbnail Image</label>
                  <div className="flex items-center gap-4">
                    {(formFiles.thumbnail_image || currentService?.thumbnail_image?.url) && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200">
                        <img src={formFiles.thumbnail_image ? URL.createObjectURL(formFiles.thumbnail_image) : currentService?.thumbnail_image?.url || ""} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormFiles(prev => ({ ...prev, thumbnail_image: e.target.files?.[0] || null }))}
                      className="flex-1 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Hero Image</label>
                  <div className="flex items-center gap-4">
                    {(formFiles.hero_image || currentService?.hero_image?.url) && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200">
                        <img src={formFiles.hero_image ? URL.createObjectURL(formFiles.hero_image) : currentService?.hero_image?.url || ""} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormFiles(prev => ({ ...prev, hero_image: e.target.files?.[0] || null }))}
                      className="flex-1 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700"
                    />
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Gallery Images</label>
                <input 
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFormFiles(prev => ({ ...prev, gallery_images: Array.from(e.target.files || []) }))}
                  className="w-full text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700"
                />
                {formFiles.gallery_images.length > 0 && (
                  <p className="text-xs text-neutral-500">{formFiles.gallery_images.length} file(s) selected</p>
                )}
                {isEditing && currentService?.gallery_images && currentService.gallery_images.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {currentService.gallery_images.map((img, i) => (
                      <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200">
                        <img src={img.url || ""} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Why Choose Section */}
              <div className="border-t border-neutral-100 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Why Choose Us Section</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Title</label>
                    <input 
                      type="text"
                      value={currentService?.why_choose_title || ""}
                      onChange={(e) => setCurrentService(prev => ({ ...prev, why_choose_title: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                      placeholder="Why Choose Us"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Image</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormFiles(prev => ({ ...prev, why_choose_image: e.target.files?.[0] || null }))}
                      className="w-full text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows={2}
                    value={currentService?.why_choose_description || ""}
                    onChange={(e) => setCurrentService(prev => ({ ...prev, why_choose_description: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Points</label>
                  {(currentService?.why_choose_points || []).map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={point}
                        onChange={(e) => updateWhyChoosePoint(idx, e.target.value)}
                        className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all text-sm"
                        placeholder={`Point ${idx + 1}`}
                      />
                      <button 
                        type="button"
                        onClick={() => removeWhyChoosePoint(idx)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={addWhyChoosePoint}
                    className="text-xs font-bold text-[#C59D5F] hover:text-[#222] transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Point
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-8 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={currentService?.is_active || false}
                    onChange={(e) => setCurrentService(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="text-sm font-semibold text-neutral-700 group-hover:text-black">Active</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Sort</label>
                  <input 
                    type="number"
                    min={0}
                    value={currentService?.sort_order || 0}
                    onChange={(e) => setCurrentService(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-20 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-black transition-all text-sm text-center"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] px-6 py-3 bg-black text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting && <Loader2 size={18} className="animate-spin" />}
                  {isEditing ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
