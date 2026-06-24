"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  Tag,
  ArrowLeft,
  X,
  Check,
} from "lucide-react";
import {
  getAdminServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  type ServiceCategory,
} from "@/lib/service-categories";
import { toast } from "sonner";
import Link from "next/link";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Modal ────────────────────────────────────────────────────────────────────

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
          <h2 className="text-xl font-bold">{initial ? "Edit Category" : "Add Category"}</h2>
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
              Slug{" "}
              <span className="font-normal normal-case text-neutral-400">(auto-generated)</span>
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
              {saving ? "Saving…" : initial ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServiceCategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<null | "create" | ServiceCategory>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function fetchData() {
    setLoading(true);
    try {
      setCategories(await getAdminServiceCategories());
    } catch (err: any) {
      toast.error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (name: string, slug: string) => {
    await createServiceCategory({ name, slug });
    toast.success("Category created successfully");
    fetchData();
  };

  const handleUpdate = async (id: number, name: string, slug: string) => {
    await updateServiceCategory(id, { name, slug });
    toast.success("Category updated successfully");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category? Services under it may be affected.")) return;
    setDeletingId(id);
    try {
      await deleteServiceCategory(id);
      setCategories((p) => p.filter((c) => c.id !== id));
      toast.success("Category deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-neutral-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/services"
            className="p-2 hover:bg-neutral-100 rounded-xl transition-all text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Service Categories</h1>
            <p className="text-sm text-neutral-500 mt-1">Organize your services into categories.</p>
          </div>
        </div>
        <button
          onClick={() => setModal("create")}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all font-semibold shadow-sm"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl outline-none focus:border-black transition-all text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-neutral-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm font-medium">Loading categories…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <Tag size={40} className="mx-auto text-neutral-200 mb-4" />
            <p className="font-semibold text-neutral-700 mb-1">
              {searchQuery ? "No categories match your search." : "No categories found"}
            </p>
            <p className="text-sm text-neutral-400">
              {searchQuery ? "Try a different keyword." : "Start by adding a category for your services."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left py-3.5 px-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">ID</th>
                  <th className="text-left py-3.5 px-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">Name</th>
                  <th className="text-left py-3.5 px-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">Slug</th>
                  <th className="py-3.5 px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-6 text-neutral-400 font-mono text-xs">{cat.id}</td>
                    <td className="py-4 px-6 font-semibold text-neutral-900">{cat.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-neutral-400">{cat.slug}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal(cat)}
                          className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        >
                          {deletingId === cat.id
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Trash2 size={16} />}
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

      {/* Modals */}
      {modal === "create" && (
        <CategoryModal onClose={() => setModal(null)} onSave={handleCreate} />
      )}
      {modal && modal !== "create" && (
        <CategoryModal
          initial={modal as ServiceCategory}
          onClose={() => setModal(null)}
          onSave={(name, slug) => handleUpdate((modal as ServiceCategory).id, name, slug)}
        />
      )}
    </div>
  );
}