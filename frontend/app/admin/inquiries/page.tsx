"use client";

import React, { useEffect, useState } from "react";
import {
  getContactInquiries,
  deleteContactInquiry,
  updateContactInquiry,
} from "@/lib/contact-inquiries";
import { ContactInquiry } from "@/types/contact-inquiry";
import {
  Search,
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  X,
  Loader2,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      setLoading(true);
      const data = await getContactInquiries();
      setInquiries(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await deleteContactInquiry(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      toast.success("Inquiry deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete inquiry");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateContactInquiry(id, { status });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
      toast.success(`Inquiry marked as ${status}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const filteredInquiries = inquiries.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.subject?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "read":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Read
          </span>
        );
      case "new":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={12} /> New
          </span>
        );
      case "replied":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Mail size={12} /> Replied
          </span>
        );
      case "closed":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <X size={12} /> Closed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <AlertCircle size={12} /> {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">User Inquiries</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage and respond to contact messages from your users.
          </p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-sm text-neutral-500 font-medium">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <MessageSquare size={28} />
            </div>
            <h3 className="font-bold text-neutral-900">No inquiries found</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-xs px-4">
              {searchQuery ? "Try refining your search terms." : "When users contact you, their messages will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">User</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Subject</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredInquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900">{item.name}</span>
                        <span className="text-xs text-neutral-500 mt-0.5">{item.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-700 font-medium truncate max-w-[200px]">
                          {item.subject || "No Subject"}
                        </span>
                        <span className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                          {item.message}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        {getStatusBadge(item.status)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(item);
                            setIsModalOpen(true);
                            if (item.status.toLowerCase() === "new") {
                              handleUpdateStatus(item.id, "read");
                            }
                          }}
                          className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this inquiry?")) {
                              handleDelete(item.id);
                            }
                          }}
                          disabled={deletingId === item.id}
                          className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          title="Delete Inquiry"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
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

      {/* Inquiry Detail Modal */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="h-2 bg-blue-600 w-full" />
            
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 ring-4 ring-blue-100/50">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">{selectedInquiry.name}</h2>
                    <p className="text-sm text-neutral-500">Inquiry Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2.5 bg-neutral-100 text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-neutral-50 rounded-lg text-neutral-400">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Email Address</p>
                      <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-semibold text-neutral-700 hover:text-blue-600 transition-colors">
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-neutral-50 rounded-lg text-neutral-400">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-sm font-semibold text-neutral-700">
                        {selectedInquiry.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-neutral-50 rounded-lg text-neutral-400">
                      <AlertCircle size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-neutral-50 rounded-lg text-neutral-400">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Submitted On</p>
                      <p className="text-sm font-semibold text-neutral-700">
                        {selectedInquiry.created_at ? new Date(selectedInquiry.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : "Recently"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-neutral-100">
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Subject</p>
                  <p className="text-lg font-bold text-neutral-900">
                    {selectedInquiry.subject || "No Subject"}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Message</p>
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                    <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject || "Your Inquiry"}`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  <Mail size={18} /> Reply via Email
                </a>
                {selectedInquiry.status.toLowerCase() !== "read" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, "read")}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-2xl hover:bg-emerald-100 transition-all"
                  >
                    <CheckCircle2 size={18} /> Mark as Read
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this inquiry?")) {
                      handleDelete(selectedInquiry.id);
                      setIsModalOpen(false);
                    }
                  }}
                  className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 font-bold rounded-2xl hover:bg-red-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
