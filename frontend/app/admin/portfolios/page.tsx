"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Briefcase,
  Tag,
  Layout,
  Save,
  GripVertical
} from "lucide-react";
import { 
  getAdminPortfolios, 
  deletePortfolio, 
  createPortfolio, 
  updatePortfolio,
  getPortfolioPageData,
  updatePortfolioPage
} from "@/lib/portfolios";
import { getPortfolioCategories } from "@/lib/portfolio-categories";
import { Portfolio } from "@/types/portfolio";
import { PortfolioCategory } from "@/types/portfolio-category";
import { toast } from "sonner";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

function PortfoliosPageContent() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Track deletion of the existing main image separately from a replacement upload
  const [removeMainImage, setRemoveMainImage] = useState(false);

  // Drag-to-reorder state
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // Portfolio Page Hero Banner states
  const [heroTitle, setHeroTitle] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [heroSaving, setHeroSaving] = useState(false);

  // Sidebar Vertical Tab states
  const searchParams = useSearchParams();
  const pageTab = (searchParams.get("tab") as "hero" | "portfolios") || "portfolios";

  useEffect(() => {
    fetchData();
    fetchHeroSettings();
  }, []);

  async function fetchHeroSettings() {
    try {
      const res = await getPortfolioPageData();
      if (res.hero) {
        setHeroTitle(res.hero.title || "");
        setHeroImagePreview(res.hero.image?.url || "");
      }
    } catch (err) {
      console.error("Failed to fetch hero settings:", err);
    }
  }

  async function handleHeroSave(e: React.FormEvent) {
    e.preventDefault();
    setHeroSaving(true);
    try {
      const fd = new FormData();
      fd.append("hero_title", heroTitle);
      if (heroImageFile) {
        fd.append("hero_image", heroImageFile);
      }
      await updatePortfolioPage(fd);
      toast.success("Portfolio page hero updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update hero.");
    } finally {
      setHeroSaving(false);
    }
  }

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

  // Sort order is fully automated: the first portfolio starts at 0, and every
  // new portfolio is appended one past the current highest sort_order so
  // values never repeat. Manual reordering happens via drag-and-drop below.
  const getNextSortOrder = () => {
    if (portfolios.length === 0) return 0;
    return Math.max(...portfolios.map(p => p.sort_order ?? 0)) + 1;
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
        sort_order: getNextSortOrder(),
        is_active: true,
        is_featured: false,
        portfolio_category_id: null as any
      });
    }
    setRemoveMainImage(false);
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
      } else if (removeMainImage) {
        formData.append("remove_main_image", "1");
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

  // Always display portfolios in their real sort_order so the list itself
  // reflects the automated ordering (ties broken by id as a stable fallback).
  const orderedPortfolios = [...portfolios].sort((a, b) => {
    const diff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
    return diff !== 0 ? diff : a.id - b.id;
  });

  const filteredPortfolios = orderedPortfolios.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category?.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dragging is only safe when no search/category filter is active, since
  // drag reorder is computed against the full unfiltered list below.
  const filtersActive = searchQuery.trim() !== "" || selectedCategory !== "all";

  // Builds a minimal FormData payload for a sort_order-only update, carrying
  // over the portfolio's existing core fields so a partial PUT doesn't clobber them.
  const buildSortOrderFormData = (portfolio: Portfolio, newSortOrder: number) => {
    const fd = new FormData();
    if (portfolio.title) fd.append("title", portfolio.title);
    if (portfolio.slug) fd.append("slug", portfolio.slug);
    if (portfolio.short_description) fd.append("short_description", portfolio.short_description);
    if (portfolio.description) fd.append("description", portfolio.description);
    if (portfolio.category?.id) fd.append("portfolio_category_id", String(portfolio.category.id));
    fd.append("sort_order", String(newSortOrder));
    fd.append("is_active", portfolio.is_active ? "1" : "0");
    fd.append("is_featured", portfolio.is_featured ? "1" : "0");
    return fd;
  };

  // Dragging is computed against the full sorted list (orderedPortfolios),
  // not the search/category-filtered view, so an active filter can't
  // scramble the real global order. After the drop, every affected item is
  // renumbered 0..n-1 sequentially, so values stay unique and gap-free.
  const handleDropReorder = async (targetId: number) => {
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }
    const draggedIdx = orderedPortfolios.findIndex(p => p.id === draggedId);
    const targetIdx = orderedPortfolios.findIndex(p => p.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const reordered = [...orderedPortfolios];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIdx, 0, moved);

    const updates = reordered
      .map((p, i) => ({ portfolio: p, newOrder: i }))
      .filter(u => (u.portfolio.sort_order ?? 0) !== u.newOrder);

    if (updates.length === 0) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    setReorderingId(draggedId);
    try {
      await Promise.all(
        updates.map(u => updatePortfolio(u.portfolio.id, buildSortOrderFormData(u.portfolio, u.newOrder)))
      );
      await fetchData();
    } catch (error: any) {
      console.error("Reorder failed:", error);
      toast.error(error.message || "Failed to reorder portfolios");
    } finally {
      setReorderingId(null);
      setDraggedId(null);
      setDragOverId(null);
    }
  };

  const totalPages = Math.ceil(filteredPortfolios.length / ITEMS_PER_PAGE);
  const paginatedPortfolios = filteredPortfolios.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const tabLabel: Record<string, string> = {
    portfolios: "Portfolios List",
    hero: "Hero Banner",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-neutral-900 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Portfolio Setup — {tabLabel[pageTab]}</h1>
          <p className="text-sm text-neutral-500 mt-1">Configure the hero banner and manage portfolio items.</p>
        </div>
        
        {pageTab === "portfolios" && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all font-semibold shadow-sm cursor-pointer"
            >
              <Plus size={18} />
              Add Portfolio
            </button>
          </div>
        )}
      </div>

      <div>
        {/* Content Area */}
        <div className="space-y-6">
          {pageTab === "hero" ? (
            /* ── Portfolio Page Hero Banner Editor ─────────────── */
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-8 py-5 border-b border-neutral-100 bg-neutral-50/30">
                <h2 className="font-bold text-neutral-900 flex items-center gap-2">
                  <Layout size={16} className="text-[#C59D5F]" />
                  Portfolio Page Hero Banner
                </h2>
                <p className="text-xs text-neutral-400 mt-1">This image and title appear at the top of the user-facing Portfolio page.</p>
              </div>
              <form onSubmit={handleHeroSave} className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Hero Image</label>
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-200 rounded-[2rem] bg-neutral-50 hover:bg-white hover:border-black transition-all">
                      {(heroImageFile ? URL.createObjectURL(heroImageFile) : heroImagePreview) ? (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md mb-4">
                          <img
                            src={heroImageFile ? URL.createObjectURL(heroImageFile) : heroImagePreview}
                            alt="Portfolio Hero"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 text-neutral-200 shadow-sm">
                          <ImageIcon size={28} />
                        </div>
                      )}
                      <label className="cursor-pointer bg-[#C59D5F] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all">
                        Choose Image
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setHeroImageFile(file);
                            if (file) setHeroImagePreview(URL.createObjectURL(file));
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-neutral-400 mt-3 text-center">Max 2MB · 1920×1080px recommended</p>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Hero Title</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={e => setHeroTitle(e.target.value)}
                      className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-black transition-all font-bold text-neutral-800"
                      placeholder="e.g. Creating Spaces Without Compromise"
                      maxLength={255}
                    />
                    <p className="text-[10px] text-neutral-400">Shown as the large heading over the hero image.</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={heroSaving}
                    className="px-8 py-3 bg-[#C59D5F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {heroSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {heroSaving ? "Saving..." : "Save Hero"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
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
              </div>

              {/* Table */}
              {filtersActive && (
                <p className="text-[11px] font-bold text-neutral-400 px-2">
                  Clear the search box to drag-reorder portfolios — dragging reflects the full list order.
                </p>
              )}
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
                  <th className="py-4 px-4 w-8"></th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">S.No</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Project</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                  {/* <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Order</th> */}
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {paginatedPortfolios.map((item, index) => (
                  <tr
                    key={item.id}
                    draggable={!filtersActive}
                    onDragStart={e => { e.dataTransfer.setData("text/plain", String(item.id)); e.dataTransfer.effectAllowed = "move"; setDraggedId(item.id); }}
                    onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (!filtersActive) setDragOverId(item.id); }}
                    onDragLeave={() => setDragOverId(prev => (prev === item.id ? null : prev))}
                    onDrop={e => { e.preventDefault(); if (!filtersActive) handleDropReorder(item.id); }}
                    onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                    className={`hover:bg-neutral-50/40 transition-colors ${draggedId === item.id ? "opacity-40" : ""} ${dragOverId === item.id && draggedId !== item.id ? "border-t-2 border-black" : ""}`}
                  >
                    <td className="py-4 px-4 text-center">
                      {reorderingId !== null ? (
                        <Loader2 size={16} className="animate-spin text-neutral-300 mx-auto" />
                      ) : (
                        <GripVertical
                          size={16}
                          className={`mx-auto text-neutral-300 ${filtersActive ? "cursor-not-allowed opacity-40" : "cursor-grab active:cursor-grabbing hover:text-black"}`}
                        />
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-neutral-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
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
                    {/* <td className="py-4 px-6 text-sm text-neutral-600 font-medium">
                      {item.sort_order}
                    </td> */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
                          title="Edit Portfolio"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Delete Portfolio"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-neutral-50/30 border-t border-neutral-100 flex items-center justify-between">
              <div className="text-sm text-neutral-600 font-medium">
                Showing {filteredPortfolios.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredPortfolios.length)} of {filteredPortfolios.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
            </div>
          )}
        </div>
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

              {/* <div className="space-y-2">
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
              </div> */}

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Short Description</label>
                <textarea 
                  rows={2}
                  value={currentPortfolio?.short_description || ""}
                  onChange={(e) => setCurrentPortfolio(prev => ({ ...prev, short_description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all resize-none"
                />
              </div>

              {/* <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Sort Order</label>
                <input 
                  type="number"
                  min="0"
                  value={currentPortfolio?.sort_order ?? 0}
                  onChange={(e) => setCurrentPortfolio(prev => ({ ...prev, sort_order: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="w-full md:w-1/2 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                />
              </div> */}

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Main Image</label>
                <div className="flex items-center gap-4">
                  {(formFiles.main_image || (currentPortfolio?.main_image_url && !removeMainImage)) && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 group">
                      <img 
                        src={formFiles.main_image ? URL.createObjectURL(formFiles.main_image) : currentPortfolio?.main_image_url || ""} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormFiles(prev => ({ ...prev, main_image: null }));
                          setRemoveMainImage(true);
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 text-white transition-all cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormFiles(prev => ({ ...prev, main_image: file }));
                      if (file) setRemoveMainImage(false);
                    }}
                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                  />
                </div>
                {removeMainImage && !formFiles.main_image && (
                  <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Image will be removed on save</p>
                )}
              </div>

              {/* <div className="space-y-2">
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
              </div> */}

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
                
                {/* <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={currentPortfolio?.is_featured || false}
                    onChange={(e) => setCurrentPortfolio(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="text-sm font-semibold text-neutral-700 group-hover:text-black">Featured</span>
                </label> */}
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

export default function PortfoliosPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    }>
      <PortfoliosPageContent />
    </Suspense>
  );
}