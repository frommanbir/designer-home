"use client";

import React, { useEffect, useState } from "react";
import {
  FaSpinner,
  FaSave,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaImage,
  FaLayerGroup,
  FaTag,
  FaListUl,
  FaCheckCircle,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { XCircle, Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

interface Service {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  short_description: string | null;
  description: string | null;
  category: ServiceCategory | null;
  thumbnail_image: { path: string | null; url: string | null };
  hero_image: { path: string | null; url: string | null };
  gallery_images: { path: string; url: string | null }[];
  why_choose: {
    title: string | null;
    description: string | null;
    image: { path: string | null; url: string | null } | null;
    points: string[];
  };
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM = {
  title: "",
  slug: "",
  subtitle: "",
  short_description: "",
  description: "",
  service_category_id: "",
  sort_order: "0",
  is_active: true,
  why_choose_title: "",
  why_choose_description: "",
  why_choose_points: [""],
  thumbnail_image: null as File | null,
  why_choose_image: null as File | null,
  gallery_images: [] as File[],
};

type FormTab = "basic" | "images" | "why_choose";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [activeTab, setActiveTab] = useState<FormTab>("basic");

  // Image previews inside modal
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      setLoading(true);
      const [sRes, cRes] = await Promise.all([
        fetchApi("/admin/services"),
        fetchApi("/admin/service-categories"),
      ]);
      setServices(sRes.data ?? []);
      setCategories(cRes.data ?? []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    try {
      await fetchApi(`/admin/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Service deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const handleOpenModal = (service?: Service) => {
    setActiveTab("basic");
    setPreviews({});
    if (service) {
      setIsEditing(true);
      setEditingId(service.id);
      setForm({
        title: service.title,
        slug: service.slug,
        subtitle: service.subtitle ?? "",
        short_description: service.short_description ?? "",
        description: service.description ?? "",
        service_category_id: service.category?.id?.toString() ?? "",
        sort_order: service.sort_order.toString(),
        is_active: service.is_active,
        why_choose_title: service.why_choose?.title ?? "",
        why_choose_description: service.why_choose?.description ?? "",
        why_choose_points: service.why_choose?.points?.length
          ? service.why_choose.points
          : [""],
        thumbnail_image: null,
        why_choose_image: null,
        gallery_images: [],
      });
      setPreviews({
        thumbnail_image: service.thumbnail_image?.url ?? "",
        why_choose_image: service.why_choose?.image?.url ?? "",
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setForm({ ...EMPTY_FORM, why_choose_points: [""] });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({
      ...prev,
      [key]: URL.createObjectURL(file),
    }));
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("title", form.title);
    if (form.slug) fd.append("slug", form.slug);
    if (form.subtitle) fd.append("subtitle", form.subtitle);
    if (form.short_description)
      fd.append("short_description", form.short_description);
    if (form.description) fd.append("description", form.description);
    if (form.service_category_id)
      fd.append("service_category_id", form.service_category_id);
    fd.append("sort_order", form.sort_order);
    fd.append("is_active", form.is_active ? "1" : "0");
    if (form.why_choose_title)
      fd.append("why_choose_title", form.why_choose_title);
    if (form.why_choose_description)
      fd.append("why_choose_description", form.why_choose_description);
    form.why_choose_points
      .filter(Boolean)
      .forEach((p) => fd.append("why_choose_points[]", p));
    if (form.thumbnail_image)
      fd.append("thumbnail_image", form.thumbnail_image);
    if (form.why_choose_image)
      fd.append("why_choose_image", form.why_choose_image);
    form.gallery_images.forEach((img) => fd.append("gallery_images[]", img));
    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = buildFormData();
      const url = isEditing
        ? `/admin/services/${editingId}`
        : "/admin/services";
      await fetchApi(url, { method: isEditing ? "PUT" : "POST", body: fd });
      toast.success(isEditing ? "Service updated" : "Service created");
      setIsModalOpen(false);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const updatePoint = (idx: number, value: string) => {
    setForm((prev) => {
      const points = [...prev.why_choose_points];
      points[idx] = value;
      return { ...prev, why_choose_points: points };
    });
  };

  const addPoint = () =>
    setForm((prev) => ({
      ...prev,
      why_choose_points: [...prev.why_choose_points, ""],
    }));

  const removePoint = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      why_choose_points: prev.why_choose_points.filter((_, i) => i !== idx),
    }));

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modalTabs: { id: FormTab; label: string; icon: React.ElementType }[] =
    [
      { id: "basic", label: "Basic Info", icon: FaLayerGroup },
      { id: "images", label: "Images", icon: FaImage },
      { id: "why_choose", label: "Why Choose Us", icon: FaListUl },
    ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Services Management
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Manage your services and their categories.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/services/categories"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-semibold text-sm shadow-sm"
          >
            <FaTag size={13} />
            Categories
          </Link>
          <Link
            href="/admin/services-page"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-semibold text-sm shadow-sm"
          >
            <FaImage size={13} />
            Page Settings
          </Link>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-600 transition-all font-semibold text-sm shadow-md"
          >
            <FaPlus size={13} />
            New Service
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <FaSpinner className="animate-spin text-neutral-400" size={28} />
            <p className="text-sm text-neutral-500 font-medium">
              Loading services...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <FaLayerGroup size={24} />
            </div>
            <h3 className="font-bold text-neutral-900">No services found</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Start by adding your first service.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {item.thumbnail_image?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.thumbnail_image.url}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover border border-neutral-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
                            <FaImage size={14} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-neutral-900 text-sm">
                            {item.title}
                          </p>
                          <p className="text-xs text-neutral-400 font-mono">
                            {item.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-neutral-600">
                      {item.category?.name ?? (
                        <span className="text-neutral-300 italic">None</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-neutral-600">
                      {item.sort_order}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {item.is_active ? (
                          <FaCheckCircle size={10} />
                        ) : null}
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <FaTrash size={14} />
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
          <div className="bg-neutral-50 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-5 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  {isEditing ? "Edit Service" : "New Service"}
                </h2>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {isEditing
                    ? "Update the service details below."
                    : "Fill in the details to create a new service."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-xl transition-all text-neutral-400"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Tab + Content Layout */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
              {/* Vertical Tabs */}
              <div className="w-full lg:w-52 shrink-0 p-4 space-y-1 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white flex lg:flex-col flex-row overflow-x-auto">
                {modalTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap w-full text-left ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <tab.icon
                        size={15}
                        className={isActive ? "text-white" : "text-neutral-500"}
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto flex flex-col"
              >
                <div className="flex-1 p-6 md:p-8">
                  {/* Basic Info Tab */}
                  {activeTab === "basic" && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                      <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">
                        Basic Info
                      </h2>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={form.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            const slug = title
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, "");
                            setForm((prev) => ({ ...prev, title, slug }));
                          }}
                          placeholder="e.g. Interior Design Consultation"
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">
                          Slug
                        </label>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              slug: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-neutral-900">
                            Category
                          </label>
                          <select
                            value={form.service_category_id}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                service_category_id: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                          >
                            <option value="">None</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-neutral-900">
                            Sort Order
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={form.sort_order}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                sort_order: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={form.subtitle}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              subtitle: e.target.value,
                            }))
                          }
                          placeholder="e.g. Transform your space with expert guidance"
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">
                          Short Description
                        </label>
                        <textarea
                          rows={3}
                          value={form.short_description}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              short_description: e.target.value,
                            }))
                          }
                          placeholder="Brief summary shown in listings..."
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-neutral-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">
                          Full Description
                        </label>
                        <textarea
                          rows={5}
                          value={form.description}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Detailed description of the service..."
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-neutral-400"
                        />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              is_active: !prev.is_active,
                            }))
                          }
                          className="flex items-center gap-2 text-sm font-semibold text-neutral-700"
                        >
                          {form.is_active ? (
                            <FaToggleOn
                              size={22}
                              className="text-green-500"
                            />
                          ) : (
                            <FaToggleOff
                              size={22}
                              className="text-neutral-400"
                            />
                          )}
                          {form.is_active ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Images Tab */}
                  {activeTab === "images" && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                      <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">
                        Images
                      </h2>

                      {[
                        {
                          label: "Thumbnail Image",
                          key: "thumbnail_image",
                          hint: "Shown in service listings. 4:3 ratio recommended.",
                        },
                        {
                          label: "Why Choose Image",
                          key: "why_choose_image",
                          hint: "Displayed alongside the Why Choose Us section.",
                        },
                      ].map(({ label, key, hint }) => (
                        <div key={key} className="space-y-3">
                          <label className="block text-sm font-semibold text-neutral-900">
                            {label}
                          </label>
                          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl hover:border-black transition-colors bg-neutral-50">
                            {previews[key] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={previews[key]}
                                alt={label}
                                className="h-28 object-cover rounded-xl mb-4 shadow-sm"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                                <FaImage size={20} />
                              </div>
                            )}
                            <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all">
                              Choose Image
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, key)}
                              />
                            </label>
                            <p className="text-xs text-neutral-400 mt-3 text-center">
                              {hint}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-neutral-900">
                          Gallery Images
                        </label>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl hover:border-black transition-colors bg-neutral-50">
                          <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                            <FaImage size={20} />
                          </div>
                          <label className="cursor-pointer bg-white border border-neutral-200 px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all">
                            Choose Images
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  gallery_images: Array.from(
                                    e.target.files ?? []
                                  ),
                                }))
                              }
                            />
                          </label>
                          {form.gallery_images.length > 0 && (
                            <p className="text-xs text-green-600 font-medium mt-3">
                              {form.gallery_images.length} file(s) selected
                            </p>
                          )}
                          <p className="text-xs text-neutral-400 mt-2 text-center">
                            Select multiple images for the gallery carousel.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Why Choose Us Tab */}
                  {activeTab === "why_choose" && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                      <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">
                        Why Choose Us
                      </h2>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={form.why_choose_title}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              why_choose_title: e.target.value,
                            }))
                          }
                          placeholder="e.g. Why Choose Us?"
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-900">
                          Section Description
                        </label>
                        <textarea
                          rows={4}
                          value={form.why_choose_description}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              why_choose_description: e.target.value,
                            }))
                          }
                          placeholder="List your unique advantages for this service..."
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-neutral-400"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-neutral-900">
                          Key Points
                        </label>
                        <div className="space-y-2">
                          {form.why_choose_points.map((point, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={point}
                                onChange={(e) =>
                                  updatePoint(idx, e.target.value)
                                }
                                placeholder={`Point ${idx + 1}`}
                                className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                              />
                              {form.why_choose_points.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePoint(idx)}
                                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <XCircle size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addPoint}
                          className="text-sm font-semibold text-neutral-500 hover:text-black flex items-center gap-1.5 transition-colors"
                        >
                          <Plus size={14} /> Add Point
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky Footer */}
                <div className="px-6 md:px-8 py-4 border-t border-neutral-100 bg-white flex items-center justify-between shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-600 transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <FaSpinner size={14} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave size={14} />
                        {isEditing ? "Save Changes" : "Create Service"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}