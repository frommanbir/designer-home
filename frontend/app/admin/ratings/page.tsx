"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Calendar,
  X,
  MessageSquare
} from "lucide-react";
import { 
  getAdminRatings, 
  deleteRating, 
  createRating, 
  updateRating 
} from "@/lib/ratings";
import { Rating } from "@/types/rating";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function RatingsAdminPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentRating, setCurrentRating] = useState<Partial<Rating> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getAdminRatings();
      setRatings(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch ratings");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this rating?")) return;
    
    try {
      await deleteRating(id);
      setRatings(prev => prev.filter(r => r.id !== id));
      toast.success("Rating deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete rating");
    }
  };

  const handleOpenModal = (rating?: Rating) => {
    if (rating) {
      setIsEditing(true);
      setCurrentRating({
        ...rating,
        review_date: rating.review_date ? new Date(rating.review_date).toISOString().split('T')[0] : ""
      });
    } else {
      setIsEditing(false);
      setCurrentRating({
        customer_name: "",
        rating: 5,
        review_text: "",
        review_date: new Date().toISOString().split('T')[0],
        sort_order: 0,
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (isEditing && currentRating?.id) {
        await updateRating(currentRating.id, currentRating);
        toast.success("Rating updated successfully");
      } else {
        await createRating(currentRating);
        toast.success("Rating created successfully");
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRatings = ratings.filter(r => {
    const matchesSearch = r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (r.review_text || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredRatings.length / ITEMS_PER_PAGE);
  const paginatedRatings = filteredRatings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-neutral-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ratings & Reviews</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage customer testimonials and feedback.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all font-semibold shadow-sm w-max"
        >
          <Plus size={18} />
          Add Rating
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search by customer name or review text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <p className="text-sm text-neutral-500 font-medium">Loading ratings...</p>
          </div>
        ) : filteredRatings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <Star size={28} />
            </div>
            <h3 className="font-bold">No ratings found</h3>
            <p className="text-sm text-neutral-500 mt-1">Try adding a new rating for your customers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">S.No</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Rating</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {paginatedRatings.map((item, index) => (
                  <tr key={item.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-neutral-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold">{item.customer_name}</span>
                        <span className="text-xs text-neutral-500 line-clamp-1 max-w-xs">{item.review_text}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < item.rating ? "fill-orange-400 text-orange-400" : "text-neutral-200"} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell text-sm text-neutral-600">
                      {item.review_date ? new Date(item.review_date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${item.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                        {item.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {item.is_active ? 'Visible' : 'Hidden'}
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
            <div className="px-6 py-4 bg-neutral-50/30 border-t border-neutral-100 flex items-center justify-between">
              <div className="text-sm text-neutral-600 font-medium">
                Showing {filteredRatings.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredRatings.length)} of {filteredRatings.length}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {isEditing ? "Edit Rating" : "New Rating"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                <X size={20} className="text-neutral-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} /> Customer Name *
                  </label>
                  <input 
                    required
                    type="text"
                    value={currentRating?.customer_name || ""}
                    onChange={(e) => setCurrentRating(prev => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                      <Star size={12} /> Rating (1-5) *
                    </label>
                    <select 
                      required
                      value={currentRating?.rating || 5}
                      onChange={(e) => setCurrentRating(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                    >
                      {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={12} /> Review Date
                    </label>
                    <input 
                      type="date"
                      value={currentRating?.review_date || ""}
                      onChange={(e) => setCurrentRating(prev => ({ ...prev, review_date: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={12} /> Review Text
                  </label>
                  <textarea 
                    rows={4}
                    value={currentRating?.review_text || ""}
                    onChange={(e) => setCurrentRating(prev => ({ ...prev, review_text: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black transition-all resize-none"
                    placeholder="Write the customer's review here..."
                  />
                </div>

                <div className="flex items-center justify-between py-2 px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={currentRating?.is_active || false}
                      onChange={(e) => setCurrentRating(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                    />
                    <span className="text-sm font-semibold text-neutral-700 group-hover:text-black">Publicly Visible</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Display Order</label>
                    <input 
                      type="number"
                      min={0}
                      value={currentRating?.sort_order || 0}
                      onChange={(e) => setCurrentRating(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                      className="w-20 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-black transition-all text-sm text-center"
                    />
                  </div>
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
                  {isEditing ? "Save Changes" : "Create Rating"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
