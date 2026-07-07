"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  X,
  Calendar,
  Layout,
  Save
} from "lucide-react";
import { 
  getAdminBlogs, 
  deleteBlog, 
  createBlog, 
  updateBlog,
  getBlogPageData,
  updateBlogPage
} from "@/lib/blogs";
import { Blog } from "@/types/blog";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

function BlogsAdminContent() {
  const searchParams = useSearchParams();
  const pageTab = (searchParams.get("tab") as "hero" | "blogs") || "blogs";
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog> | null>(null);

  // Form states
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Blog Page Hero Banner states
  const [heroTitle, setHeroTitle] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [heroSaving, setHeroSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
    fetchHeroSettings();
  }, []);

  async function fetchHeroSettings() {
    try {
      const res = await getBlogPageData();
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
      await updateBlogPage(fd);
      toast.success("Blog page hero updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update hero.");
    } finally {
      setHeroSaving(false);
    }
  }

  async function fetchBlogs() {
    try {
      setLoading(true);
      const data = await getAdminBlogs();
      setBlogs(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      await deleteBlog(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
      toast.success("Blog post deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog post");
    }
  };

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setIsEditing(true);
      setCurrentBlog({ ...blog });
    } else {
      setIsEditing(false);
      setCurrentBlog({
        title: "",
        slug: "",
        short_description: "",
        content: "",
        published_date: new Date().toISOString().split('T')[0],
        sort_order: 0,
        is_active: true
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      
      const allowedFields = [
        "title", "slug", "short_description", "content", 
        "published_date", "sort_order", "is_active"
      ];

      allowedFields.forEach(field => {
        const value = (currentBlog as any)[field];
        if (value !== null && value !== undefined) {
          if (typeof value === "boolean") {
            formData.append(field, value ? "1" : "0");
          } else {
            formData.append(field, value.toString());
          }
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditing && currentBlog?.id) {
        await updateBlog(currentBlog.id, formData);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(formData);
        toast.success("Blog created successfully");
      }
      
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const tabLabel: Record<string, string> = {
    blogs: "Blogs List",
    hero: "Hero Banner",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-neutral-900 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Blog Setup — {tabLabel[pageTab]}</h1>
          <p className="text-sm text-neutral-500 mt-1">Configure the hero banner and manage blog posts.</p>
        </div>
        
        {pageTab === "blogs" && (
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all font-semibold shadow-sm cursor-pointer"
          >
            <Plus size={18} />
            Write New Post
          </button>
        )}
      </div>

      <div>
        {/* Content Area */}
        <div className="space-y-6">
          {pageTab === "hero" ? (
            /* ── Blog Page Hero Banner Editor ─────────────── */
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-8 py-5 border-b border-neutral-100 bg-neutral-50/30">
                <h2 className="font-bold text-neutral-900 flex items-center gap-2">
                  <Layout size={16} className="text-[#C59D5F]" />
                  Blog Page Hero Banner
                </h2>
                <p className="text-xs text-neutral-400 mt-1">This image and title appear at the top of the user-facing Blog page.</p>
              </div>
              <form onSubmit={handleHeroSave} className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Hero Image</label>
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-200 rounded-[2rem] bg-neutral-50 hover:bg-white hover:border-black transition-all">
                      {(heroImageFile ? URL.createObjectURL(heroImageFile) : heroImagePreview) ? (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md mb-4">
                          <Image
                            src={heroImageFile ? URL.createObjectURL(heroImageFile) : heroImagePreview}
                            alt="Blog Hero"
                            fill
                            sizes="300px"
                            unoptimized
                            className="object-cover"
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
              <div className="bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <p className="text-sm text-neutral-500 font-medium">Fetching posts...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <FileText size={28} />
            </div>
            <h3 className="font-bold">No blog posts found</h3>
            <p className="text-sm text-neutral-500 mt-1">Ready to share some design knowledge?</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">S.No</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Post Details</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {paginatedBlogs.map((item, index) => (
                  <tr key={item.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-neutral-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 flex-shrink-0 relative">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.title} fill sizes="64px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold truncate">{item.title}</span>
                          <span className="text-xs text-neutral-500 truncate">{item.short_description || item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar size={14} />
                        {new Date(item.published_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${item.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                        {item.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {item.is_active ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
                          title="Edit Blog"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Delete Blog"
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
                Showing {filteredBlogs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredBlogs.length)} of {filteredBlogs.length}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-xl font-bold">
                {isEditing ? "Modify Masterpiece" : "Draft New Narrative"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-200 rounded-xl transition-all">
                <X size={20} className="text-neutral-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-8">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Title *</label>
                  <input 
                    required
                    type="text"
                    value={currentBlog?.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setCurrentBlog(prev => ({ ...prev, title, slug }));
                    }}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all text-lg"
                    placeholder="e.g. The Nuance of Natural Light"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">URL Slug *</label>
                  <input 
                    required
                    type="text"
                    value={currentBlog?.slug || ""}
                    onChange={(e) => setCurrentBlog(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {/* Teaser & Meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Short Description (Teaser)</label>
                  <textarea 
                    rows={2}
                    value={currentBlog?.short_description || ""}
                    onChange={(e) => setCurrentBlog(prev => ({ ...prev, short_description: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all resize-none text-sm"
                    placeholder="A brief hook for the blog card..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Published Date</label>
                  <input 
                    type="date"
                    value={currentBlog?.published_date || ""}
                    onChange={(e) => setCurrentBlog(prev => ({ ...prev, published_date: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all text-sm"
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Article Body Content</label>
                <textarea 
                  rows={12}
                  value={currentBlog?.content || ""}
                  onChange={(e) => setCurrentBlog(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all font-sans leading-relaxed"
                  placeholder="Tell your story..."
                />
              </div>

              {/* Media */}
              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-48 h-32 rounded-xl border-2 border-dashed border-neutral-200 bg-white flex items-center justify-center overflow-hidden relative">
                    {imageFile || currentBlog?.image_url ? (
                      <Image 
                        src={imageFile ? URL.createObjectURL(imageFile) : currentBlog?.image_url || ""} 
                        alt="Blog cover preview"
                        fill
                        sizes="192px"
                        unoptimized
                        className="object-cover" 
                      />
                    ) : (
                      <ImageIcon size={32} className="text-neutral-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h4 className="font-bold text-sm">Cover Image</h4>
                    <p className="text-xs text-neutral-500">Professional photography recommended. Optimal ratio 16:9.</p>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="flex flex-wrap items-center gap-10 py-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={currentBlog?.is_active || false}
                    onChange={(e) => setCurrentBlog(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-5 h-5 rounded-md border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="font-bold text-neutral-700 group-hover:text-black">Publicly Visible</span>
                </label>
                
                {/* <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Priority (Sort Order)</span>
                  <input 
                    type="number"
                    value={currentBlog?.sort_order || 0}
                    onChange={(e) => setCurrentBlog(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                    className="w-20 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div> */}
              </div>

              <div className="flex gap-4 pt-6 pb-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-2xl transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {submitting && <Loader2 size={20} className="animate-spin" />}
                  {isEditing ? "Sync Updates" : "Publish to World"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogsAdminPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    }>
      <BlogsAdminContent />
    </Suspense>
  );
}
