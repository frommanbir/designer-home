"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Tag,
  Wrench,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import {
  getAdminServices,
  createService,
  updateService,
  deleteService,
  type Service,
} from "@/lib/services-admin";
import {
  getAdminServiceCategories,
  type ServiceCategory,
} from "@/lib/service-categories";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Category Modal ───────────────────────────────────────────────────────────

function CategoryModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: ServiceCategory;
  onClose: () => void;
  onSave: (name: string, slug: string) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugTouched) setSlug(toSlug(name));
  }, [name, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required."); return; }
    setSaving(true);
    try {
      await onSave(name.trim(), slug.trim() || toSlug(name));
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">{initial ? "Edit Category" : "New Category"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
            <X size={20} className="text-neutral-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Name *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Residential"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Slug <span className="font-normal normal-case text-neutral-400">(auto-generated)</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
              placeholder="e.g. residential"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all font-mono text-xs"
            />
          </div>
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] px-6 py-3 bg-black text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Service Modal ────────────────────────────────────────────────────────────

function ServiceModal({
  initial,
  categories,
  onClose,
  onSave,
}: {
  initial?: Partial<Service>;
  categories: ServiceCategory[];
  onClose: () => void;
  onSave: (fd: FormData) => Promise<void>;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    subtitle: initial?.subtitle ?? "",
    short_description: initial?.short_description ?? "",
    description: initial?.description ?? "",
    sort_order: initial?.sort_order?.toString() ?? "0",
    is_active: initial?.is_active ?? true,
    service_category_id: initial?.category?.id?.toString() ?? "",
  });
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [files, setFiles] = useState<{
    thumbnail_image: File | null;
    hero_image: File | null;
    gallery_images: File[];
  }>({ thumbnail_image: null, hero_image: null, gallery_images: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slugTouched) setForm((p) => ({ ...p, slug: toSlug(form.title) }));
  }, [form.title, slugTouched]);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      const fields = ["title", "slug", "subtitle", "short_description", "description", "sort_order", "service_category_id"];
      fields.forEach((f) => {
        const val = (form as any)[f];
        if (val !== null && val !== undefined && val !== "") fd.append(f, val.toString());
      });
      fd.append("is_active", form.is_active ? "1" : "0");
      if (files.thumbnail_image) fd.append("thumbnail_image", files.thumbnail_image);
      if (files.hero_image) fd.append("hero_image", files.hero_image);
      files.gallery_images.forEach((f) => fd.append("gallery_images[]", f));
      await onSave(fd);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold">{initial?.id ? "Edit Service" : "New Service"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
            <X size={20} className="text-neutral-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
          {/* Title + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Title *</label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", toSlug(e.target.value)); }}
                className={inputCls}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Slug *</label>
              <input
                required
                type="text"
                value={form.slug}
                onChange={(e) => { set("slug", e.target.value); setSlugTouched(true); }}
                className={`${inputCls} font-mono text-xs`}
              />
            </div>
          </div>

          {/* Category + Sort Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Category</label>
              <select
                value={form.service_category_id}
                onChange={(e) => set("service_category_id", e.target.value)}
                className={inputCls}
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Sort Order</label>
              <input
                type="number"
                min="0"
                value={form.sort_order}
                onChange={(e) => set("sort_order", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="e.g. Luxury Interior Solutions"
              className={inputCls}
            />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Short Description</label>
            <textarea
              rows={2}
              value={form.short_description}
              onChange={(e) => set("short_description", e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Full Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Thumbnail Image</label>
              <div className="flex items-center gap-4">
                {(files.thumbnail_image || initial?.thumbnail_image?.url) && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                    <img
                      src={files.thumbnail_image ? URL.createObjectURL(files.thumbnail_image) : initial?.thumbnail_image?.url}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFiles((p) => ({ ...p, thumbnail_image: e.target.files?.[0] || null }))}
                  className="flex-1 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Hero Image</label>
              <div className="flex items-center gap-4">
                {(files.hero_image || initial?.hero_image?.url) && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                    <img
                      src={files.hero_image ? URL.createObjectURL(files.hero_image) : initial?.hero_image?.url}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFiles((p) => ({ ...p, hero_image: e.target.files?.[0] || null }))}
                  className="flex-1 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700"
                />
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Gallery Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles((p) => ({ ...p, gallery_images: Array.from(e.target.files || []) }))}
              className="w-full text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700"
            />
            {files.gallery_images.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {files.gallery_images.map((f, i) => (
                  <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-neutral-200">
                    <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {initial?.gallery_images && initial.gallery_images.length > 0 && files.gallery_images.length === 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {initial.gallery_images.map((img, i) => (
                  <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-neutral-200">
                    <img src={img.url} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center gap-8 py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
              />
              <span className="text-sm font-semibold text-neutral-700 group-hover:text-black">Active</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
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
              {initial?.id ? "Save Changes" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminServicesPage() {
  // Services
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [serviceModal, setServiceModal] = useState<null | "create" | Service>(null);

  // Categories
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  async function fetchData() {
    setLoading(true);
    try {
      const [svc, cats] = await Promise.all([getAdminServices(), getAdminServiceCategories()]);
      setServices(svc);
      setCategories(cats);
    } catch (err: any) {
      toast.error(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  // Service handlers
  const handleCreateService = async (fd: FormData) => {
    await createService(fd);
    toast.success("Service created successfully");
    fetchData();
  };
  const handleUpdateService = async (id: number, fd: FormData) => {
    await updateService(id, fd);
    toast.success("Service updated successfully");
    fetchData();
  };
  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(id);
      setServices((p) => p.filter((s) => s.id !== id));
      toast.success("Service deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete service");
    }
  };

  const filteredServices = services.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "all" || s.category?.id.toString() === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-neutral-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your services and their categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services/categories"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 rounded-xl transition-all font-semibold border border-neutral-200"
          >
            <Tag size={18} />
            Categories
            {categories.length > 0 && (
              <span className="bg-neutral-300 text-neutral-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {categories.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setServiceModal("create")}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all font-semibold shadow-sm"
          >
            <Plus size={18} />
            New Service
          </button>
        </div>
      </div>

      {/* Services */}
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl outline-none focus:border-black transition-all text-sm"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl outline-none focus:border-black transition-all text-sm font-medium"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-neutral-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm font-medium">Loading services…</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-24 text-center">
            <Wrench size={40} className="mx-auto text-neutral-200 mb-4" />
            <p className="text-neutral-400 text-sm font-medium">
              {searchQuery || selectedCategory !== "all" ? "No services match your filters." : "No services yet. Create one to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left py-3.5 px-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">Service</th>
                  <th className="text-left py-3.5 px-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">Category</th>
                  <th className="text-left py-3.5 px-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">Order</th>
                  <th className="text-left py-3.5 px-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">Status</th>
                  <th className="py-3.5 px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                          {svc.thumbnail_image?.url ? (
                            <img src={svc.thumbnail_image.url} alt={svc.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Wrench size={18} className="text-neutral-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{svc.title}</p>
                          <p className="text-xs text-neutral-400 truncate max-w-[200px]">{svc.subtitle || svc.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
                        {svc.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400 text-xs font-mono">{svc.sort_order}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${svc.is_active ? "text-emerald-600" : "text-red-500"}`}>
                        {svc.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {svc.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setServiceModal(svc)}
                          className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(svc.id)}
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

      {/* Service Modals */}
      {serviceModal === "create" && (
        <ServiceModal
          categories={categories}
          onClose={() => setServiceModal(null)}
          onSave={handleCreateService}
        />
      )}
      {serviceModal && serviceModal !== "create" && (
        <ServiceModal
          initial={serviceModal as Service}
          categories={categories}
          onClose={() => setServiceModal(null)}
          onSave={(fd) => handleUpdateService((serviceModal as Service).id, fd)}
        />
      )}

    </div>
  );
}