"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  XCircle,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

const EMPTY_FORM = { name: "", slug: "" };

export default function ServiceCategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const res = await fetchApi("/admin/service-categories");
      setCategories(res.data ?? []);
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This will affect all services in this category.")) return;
    try {
      await fetchApi(`/admin/service-categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete category");
    }
  };

  const handleOpenModal = (category?: ServiceCategory) => {
    if (category) {
      setIsEditing(true);
      setEditingId(category.id);
      setForm({ name: category.name, slug: category.slug });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setForm({ ...EMPTY_FORM });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing && editingId) {
        await fetchApi(`/admin/service-categories/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Category updated successfully");
      } else {
        await fetchApi("/admin/service-categories", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-neutral-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/services"
            className="p-2 hover:bg-neutral-100 rounded-xl transition-all text-neutral-500"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Service Categories</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Organize your specialized interior services into categories.
            </p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all font-semibold shadow-sm"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <p className="text-sm text-neutral-500 font-medium">Loading categories...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <Tag size={28} />
            </div>
            <h3 className="font-bold">No categories found</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Start by adding a category for your interior services.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Category Name</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">URL Slug</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-neutral-900">{item.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-neutral-500">{item.slug}</td>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">{isEditing ? "Edit Category" : "New Category"}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-xl transition-all"
              >
                <XCircle size={20} className="text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                      setForm((prev) => ({ ...prev, name, slug }));
                    }}
                    placeholder="e.g. Living Room Design"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Slug *</label>
                  <input
                    required
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all font-mono text-xs"
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
                  {isEditing ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}