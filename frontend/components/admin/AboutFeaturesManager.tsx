"use client";

import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaPen,
  FaTrash,
  FaSpinner,
  FaImage as ImageIcon,
} from "react-icons/fa";
import { toast } from "sonner";
import {
  getAboutFeatures,
  createAboutFeature,
  updateAboutFeature,
  deleteAboutFeature,
} from "@/lib/aboutfeatures";
import type { AboutFeature, AboutFeatureFormState } from "@/types/about-feature";

const EMPTY_FORM: AboutFeatureFormState = {
  title: "",
  description: "",
  sort_order: 0,
  is_active: true,
};

export default function AboutFeaturesManager() {
  const [features, setFeatures] = useState<AboutFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AboutFeatureFormState>(EMPTY_FORM);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  async function fetchFeatures() {
    try {
      setLoading(true);
      const data = await getAboutFeatures();
      setFeatures([...data].sort((a, b) => a.sort_order - b.sort_order));
    } catch (error: any) {
      toast.error(error.message || "Failed to load features.");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIconFile(null);
    setIconPreview("");
    setModalOpen(true);
  }

  function openEditModal(feature: AboutFeature) {
    setEditingId(feature.id);
    setForm({
      title: feature.title,
      description: feature.description || "",
      sort_order: feature.sort_order,
      is_active: feature.is_active,
    });
    setIconFile(null);
    setIconPreview(feature.icon?.url || "");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  }

  function handleFormChange<K extends keyof AboutFeatureFormState>(
    field: K,
    value: AboutFeatureFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("sort_order", String(form.sort_order));
    formData.append("is_active", form.is_active ? "1" : "0");

    try {
      if (editingId) {
        await updateAboutFeature(editingId, formData);
        toast.success("Feature updated successfully.");
      } else {
        await createAboutFeature(formData);
        toast.success("Feature created successfully.");
      }
      setModalOpen(false);
      fetchFeatures();
    } catch (error: any) {
      toast.error(error.message || "Failed to save feature.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(feature: AboutFeature) {
    const formData = new FormData();
    formData.append("title", feature.title);
    formData.append("description", feature.description || "");
    formData.append("sort_order", String(feature.sort_order));
    formData.append("is_active", feature.is_active ? "0" : "1");

    try {
      await updateAboutFeature(feature.id, formData);
      toast.success(`Feature ${feature.is_active ? "deactivated" : "activated"} successfully.`);
      fetchFeatures();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteAboutFeature(id);
      toast.success("Feature deleted successfully.");
      setFeatures((prev) => prev.filter((f) => f.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete feature.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Why Choose Us — Features</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Manage the feature cards shown in the &ldquo;Why Choose Us&rdquo; section.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-blue-500 transition-colors shadow-md"
        >
          <FaPlus size={14} /> Add Feature
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <FaSpinner className="animate-spin text-neutral-400" size={28} />
        </div>
      ) : features.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 text-neutral-400 shadow-sm">
            <ImageIcon size={22} />
          </div>
          <p className="font-semibold text-neutral-900">No features yet</p>
          <p className="text-sm text-neutral-500 mt-1">Add your first feature card to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="text-xs text-neutral-500 uppercase border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Paragraph</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-neutral-600">
              {features.map((feature) => (
                <tr key={feature.id} className="border-b border-neutral-50 last:border-0">
                  <td className="py-3 px-4 font-semibold text-neutral-900">{feature.title}</td>
                  <td className="py-3 px-4 max-w-md truncate text-neutral-500">
                    {feature.description || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(feature)}
                        className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors"
                        aria-label="Edit feature"
                      >
                        <FaPen size={14} />
                      </button>
                      {deletingId === feature.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(feature.id)}
                            className="px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-500"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(null)}
                            className="px-2 py-1 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-medium hover:bg-neutral-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeletingId(feature.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
                          aria-label="Delete feature"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit}>
              <div className="p-6 md:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-neutral-900">
                  {editingId ? "Edit Feature" : "Add Feature"}
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-900">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                    placeholder="e.g. Secure Payments"
                    maxLength={255}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-900">Paragraph</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-neutral-400"
                    placeholder="Write the feature details here..."
                  />
                </div>
              </div>

              <div className="p-6 md:px-8 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl font-medium text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                >
                  {saving ? (
                    <>
                      <FaSpinner size={16} className="animate-spin" /> Saving...
                    </>
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Add Feature"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}