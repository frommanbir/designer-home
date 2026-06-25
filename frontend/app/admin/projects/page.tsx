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
  Briefcase,
  Tag,
  X
} from "lucide-react";
import { 
  getAdminProjects, 
  deleteProject, 
  createProject, 
  updateProject 
} from "@/lib/projects";
import { getAdminProjectCategories } from "@/lib/project-categories";
import { Project } from "@/types/project";
import { ProjectCategory } from "@/types/project-category";
import { toast } from "sonner";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);

  // Form states
  const [formFiles, setFormFiles] = useState<{
    gallery_images: File[];
  }>({
    gallery_images: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [projectsData, categoriesData] = await Promise.all([
        getAdminProjects(),
        getAdminProjectCategories()
      ]);
      setProjects(projectsData);
      setCategories(categoriesData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success("Project deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setIsEditing(true);
      setCurrentProject({
        ...project,
        project_category_id: project.category?.id
      });
    } else {
      setIsEditing(false);
      setCurrentProject({
        title: "",
        slug: "",
        subtitle: "",
        short_description: "",
        description: "",
        sort_order: 0,
        is_active: true,
        project_category_id: null
      });
    }
    setFormFiles({ gallery_images: [] });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      
      const allowedFields = [
        "title", "slug", "subtitle", "short_description", "description", 
        "sort_order", "is_active", "project_category_id"
      ];

      allowedFields.forEach(field => {
        const value = (currentProject as any)[field];
        if (value !== null && value !== undefined) {
          if (typeof value === "boolean") {
            formData.append(field, value ? "1" : "0");
          } else {
            formData.append(field, value.toString());
          }
        }
      });

      formFiles.gallery_images.forEach((file) => {
        formData.append("gallery_images[]", file);
      });

      if (isEditing && currentProject?.id) {
        await updateProject(currentProject.id, formData);
        toast.success("Project updated successfully");
      } else {
        await createProject(formData);
        toast.success("Project created successfully");
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category?.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-neutral-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your professional projects and case studies.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/projects/categories"
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
            Add Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
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
            <p className="text-sm text-neutral-500 font-medium">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <Briefcase size={28} />
            </div>
            <h3 className="font-bold">No projects found</h3>
            <p className="text-sm text-neutral-500 mt-1">Try adjusting your filters or add a new project.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Project</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredProjects.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 flex-shrink-0">
                          {item.gallery_image_urls?.[0] ? (
                            <img src={item.gallery_image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
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
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
                        {item.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
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
                {isEditing ? "Edit Project" : "New Project"}
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
                    value={currentProject?.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setCurrentProject(prev => ({ ...prev, title, slug }));
                    }}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Slug *</label>
                  <input 
                    required
                    type="text"
                    value={currentProject?.slug || ""}
                    onChange={(e) => setCurrentProject(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Subtitle</label>
                <input 
                  type="text"
                  value={currentProject?.subtitle || ""}
                  onChange={(e) => setCurrentProject(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                  placeholder="e.g. Modern Minimalist Residence"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Category</label>
                <select 
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                  value={currentProject?.project_category_id || ""}
                  onChange={(e) => setCurrentProject(prev => ({ ...prev, project_category_id: e.target.value as any }))}
                >
                  <option value="">No Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                <textarea 
                  rows={4}
                  value={currentProject?.description || ""}
                  onChange={(e) => setCurrentProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all resize-none"
                  placeholder="Describe this specific project..."
                />
              </div>

              <div className="space-y-2 border-t border-neutral-100 pt-6">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 block">Project Gallery Images (Multiple)</label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {currentProject?.gallery_image_urls?.map((url, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-neutral-100">
                      <img src={url} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {formFiles.gallery_images.map((file, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50 relative group">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="animate-spin text-emerald-600" size={16} />
                      </div>
                    </div>
                  ))}
                </div>
                <input 
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormFiles(prev => ({ ...prev, gallery_images: files }));
                  }}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-8 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={currentProject?.is_active || false}
                    onChange={(e) => setCurrentProject(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="text-sm font-semibold text-neutral-700 group-hover:text-black">Active</span>
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
                  {submitting && <Loader2 size={18} className="animate-spin" />}
                  {isEditing ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
