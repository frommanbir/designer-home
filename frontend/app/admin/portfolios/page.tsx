"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Briefcase,
  Tag
} from "lucide-react";
import { 
  getAdminPortfolios, 
  deletePortfolio, 
  createPortfolio, 
  updatePortfolio 
} from "@/lib/portfolios";
import { getPortfolioCategories } from "@/lib/portfolio-categories";
import { Portfolio } from "@/types/portfolio";
import { PortfolioCategory } from "@/types/portfolio-category";
import { toast } from "sonner";
import Link from "next/link";

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState<Partial<Portfolio> | null>(null);

  // Form states (simplified for now, using FormData for submission)
  const [formFiles, setFormFiles] = useState<{
    main_image: File | null;
    gallery_images: File[];
  }>({
    main_image: null,
    gallery_images: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [portfoliosData, categoriesData] = await Promise.all([
        getAdminPortfolios(),
        getPortfolioCategories()
      ]);
      setPortfolios(portfoliosData);
      setCategories(categoriesData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;
    
    try {
      await deletePortfolio(id);
      setPortfolios(prev => prev.filter(p => p.id !== id));
      toast.success("Portfolio deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete portfolio");
    }
  };

  const handleOpenModal = (portfolio?: Portfolio) => {
    if (portfolio) {
      setIsEditing(true);
      setCurrentPortfolio(portfolio);
    } else {
      setIsEditing(false);
      setCurrentPortfolio({
        title: "",
        slug: "",
        short_description: "",
        description: "",
        sort_order: 0,
        is_active: true,
        is_featured: false,
        portfolio_category_id: null as any
      });
    }
    setFormFiles({ main_image: null, gallery_images: [] });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Fields to include in the request
      const allowedFields = [
        "title", "slug", "short_description", "description", 
        "sort_order", "is_active", "is_featured", "portfolio_category_id"
      ];

      allowedFields.forEach(field => {
        const value = (currentPortfolio as any)[field];
        if (value !== null && value !== undefined) {
          if (typeof value === "boolean") {
            formData.append(field, value ? "1" : "0");
          } else {
            formData.append(field, value.toString());
          }
        }
      });

      if (formFiles.main_image) {
        formData.append("main_image", formFiles.main_image);
      }

      formFiles.gallery_images.forEach((file) => {
        formData.append("gallery_images[]", file);
      });

      if (isEditing && currentPortfolio?.id) {
        await updatePortfolio(currentPortfolio.id, formData);
        toast.success("Portfolio updated successfully");
      } else {
        await createPortfolio(formData);
        toast.success("Portfolio created successfully");
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPortfolios = portfolios.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category?.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Portfolio Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your portfolio items, categories, and showcase items.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/portfolios/categories"
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
            Add Portfolio
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search portfolios..."
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
            <p className="text-sm text-neutral-500 font-medium">Loading portfolios...</p>
          </div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <Briefcase size={28} />
            </div>
            <h3 className="font-bold text-neutral-900">No portfolios found</h3>
            <p className="text-sm text-neutral-500 mt-1">Try adjusting your filters or add a new portfolio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Project</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Order</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredPortfolios.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 flex-shrink-0">
                          {item.main_image_url ? (
                            <img src={item.main_image_url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-neutral-900 truncate">{item.title}</span>
                          <span className="text-xs text-neutral-500 truncate">{item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
                        {item.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${item.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                          {item.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {item.is_featured && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                            <Plus size={10} className="stroke-[3]" /> Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-neutral-600 font-medium">
                      {item.sort_order}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
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

      {/* Portfolio Form Modal (Basic Version) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900">
                {isEditing ? "Edit Portfolio" : "New Portfolio"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-xl transition-all"
              >
                <XCircle size={20} className="text-neutral-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Title *</label>
                  <input 
                    required
                    type="text"
                    value={currentPortfolio?.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setCurrentPortfolio(prev => ({ ...prev, title, slug }));
                    }}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Slug *</label>
                  <input 
                    required
                    type="text"
                    value={currentPortfolio?.slug || ""}
                    onChange={(e) => setCurrentPortfolio(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Category</label>
                <select 
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                  value={currentPortfolio?.portfolio_category_id || ""}
                  onChange={(e) => setCurrentPortfolio(prev => ({ ...prev, portfolio_category_id: e.target.value as any }))}
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
                  value={currentPortfolio?.short_description || ""}
                  onChange={(e) => setCurrentPortfolio(prev => ({ ...prev, short_description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Main Image</label>
                <div className="flex items-center gap-4">
                  {(formFiles.main_image || currentPortfolio?.main_image_url) && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200">
                      <img 
                        src={formFiles.main_image ? URL.createObjectURL(formFiles.main_image) : currentPortfolio?.main_image_url || ""} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormFiles(prev => ({ ...prev, main_image: e.target.files?.[0] || null }))}
                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Gallery Images</label>
                <div className="space-y-4">
                  {currentPortfolio?.gallery_image_urls && currentPortfolio.gallery_image_urls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentPortfolio.gallery_image_urls.map((url, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-200">
                          <img src={url} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  <input 
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormFiles(prev => ({ ...prev, gallery_images: files }));
                    }}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                  />
                  {formFiles.gallery_images.length > 0 && (
                    <p className="text-xs text-neutral-500 font-medium">
                      {formFiles.gallery_images.length} new files selected
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-8 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={currentPortfolio?.is_active || false}
                    onChange={(e) => setCurrentPortfolio(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="text-sm font-semibold text-neutral-700 group-hover:text-black">Active</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={currentPortfolio?.is_featured || false}
                    onChange={(e) => setCurrentPortfolio(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="text-sm font-semibold text-neutral-700 group-hover:text-black">Featured</span>
                </label>
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
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                  {isEditing ? "Save Changes" : "Create Portfolio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
