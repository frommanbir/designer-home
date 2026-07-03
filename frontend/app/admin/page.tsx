"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import {
  Wrench,
  Image as ImageIcon,
  FileText,
  Star,
  MessageSquare,
  Briefcase,
  AlertCircle,
  CheckCheck,
  MessageCircleReply,
  ArrowUpRight,
  Plus,
  Settings as SettingsIcon,
  Layout,
  Clock,
  Compass,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  services: number;
  projects: number;
  portfolios: number;
  blogs: number;
  ratings: number;
  inquiries: {
    total: number;
    new: number;
    read: number;
    replied: number;
  };
  recent_inquiries: {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    status: string;
    created_at: string;
  }[];
}

const STATS_CONFIG = [
  { key: "services",   label: "Services",   icon: Wrench,      color: "text-amber-600",   bg: "bg-amber-50",   link: "/admin/services" },
  { key: "projects",   label: "Projects",   icon: Briefcase,   color: "text-zinc-700",    bg: "bg-neutral-100", link: "/admin/projects" },
  { key: "portfolios", label: "Portfolios", icon: ImageIcon,   color: "text-emerald-600", bg: "bg-emerald-50", link: "/admin/portfolios" },
  { key: "blogs",      label: "Blog Posts", icon: FileText,    color: "text-blue-600",    bg: "bg-blue-50",    link: "/admin/blogs" },
  { key: "ratings",    label: "Ratings",    icon: Star,        color: "text-rose-500",    bg: "bg-rose-50",    link: "/admin/ratings" },
];

const STATUS_COLOR: Record<string, string> = {
  new:     "bg-blue-50 text-blue-700 border border-blue-100",
  read:    "bg-gray-50 text-gray-600 border border-gray-100",
  replied: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  closed:  "bg-neutral-100 text-neutral-500 border border-neutral-200",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi("/admin/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-2">
        <div className="h-32 bg-neutral-100 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-neutral-50 rounded-2xl border border-neutral-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-neutral-50 rounded-2xl border border-neutral-100" />
          <div className="h-80 bg-neutral-50 rounded-2xl border border-neutral-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
        <AlertCircle className="text-red-500" size={48} />
        <h2 className="text-lg font-bold text-neutral-800">Failed to load dashboard</h2>
        <p className="text-sm text-neutral-500 max-w-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-neutral-900 font-sans p-1">
      
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden bg-slate-600 text-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-zinc-700/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome Back, Admin</h1>
            <p className="text-neutral-300 text-sm max-w-lg leading-relaxed">
              Here is a summary of your workspace state. You have{" "}
              <span className="text-amber-400 font-bold underline decoration-wavy decoration-2">
                {data?.inquiries.new || 0} new inquiries
              </span>{" "}
              waiting for your reply.
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="self-start md:self-auto flex items-center gap-2 px-6 py-3.5 bg-white text-zinc-900 hover:bg-neutral-100 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Manage Inquiries
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Main Stat Counters ── */}
      <div>
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Workspace Statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
          {STATS_CONFIG.map(({ key, label, icon: Icon, color, bg, link }) => (
            <Link href={link} key={key} className="group p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between h-36">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center transition-all group-hover:scale-105`}>
                  <Icon size={20} />
                </div>
                <span className="text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">{label}</p>
                <h3 className="text-3xl font-black text-neutral-900 mt-1">
                  {data ? (data as any)[key] : "—"}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Split Layout: Shortcuts & Inquiries ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions Shortcuts */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Quick Shortcuts</h2>
          </div>
          
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              
              <Link 
                href="/admin/projects?tab=projects" 
                className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/50 rounded-2xl text-center group transition-all"
              >
                <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                  <Plus size={18} />
                </div>
                <span className="text-xs font-bold text-neutral-800">Add Project</span>
              </Link>

              <Link 
                href="/admin/portfolios?tab=portfolios" 
                className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/50 rounded-2xl text-center group transition-all"
              >
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                  <Plus size={18} />
                </div>
                <span className="text-xs font-bold text-neutral-800">Add Portfolio</span>
              </Link>

              <Link 
                href="/admin/blogs?tab=blogs" 
                className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/50 rounded-2xl text-center group transition-all"
              >
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                  <Plus size={18} />
                </div>
                <span className="text-xs font-bold text-neutral-800">New Blog Post</span>
              </Link>

              <Link 
                href="/admin/services?tab=services" 
                className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/50 rounded-2xl text-center group transition-all"
              >
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                  <Plus size={18} />
                </div>
                <span className="text-xs font-bold text-neutral-800">New Service</span>
              </Link>

              <Link 
                href="/admin/settings" 
                className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/50 rounded-2xl text-center group transition-all col-span-2"
              >
                <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                  <SettingsIcon size={18} />
                </div>
                <span className="text-xs font-bold text-neutral-800">Configure General Settings</span>
              </Link>

            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Statistics & Recent Table */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Inquiries Overview</h2>
          </div>

          {/* Inquiry breakdown */}
          {data?.inquiries && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Received", value: data.inquiries.total, icon: MessageSquare, color: "text-zinc-800", bg: "bg-neutral-100" },
                { label: "New Alerts",     value: data.inquiries.new,     icon: AlertCircle,   color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Read Inquiries", value: data.inquiries.read,    icon: CheckCheck,    color: "text-neutral-500", bg: "bg-neutral-50" },
                // { label: "Replied Back",   value: data.inquiries.replied, icon: MessageCircleReply, color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={color} size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{label.split(" ")[0]}</p>
                    <p className="text-lg font-black text-neutral-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Inquiries List */}
          {data?.recent_inquiries && data.recent_inquiries.length > 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                <h3 className="font-bold text-neutral-900">Recent Customer Inquiries</h3>
                <Link href="/admin/inquiries" className="text-xs font-bold text-blue-700 hover:text-blue-500 flex items-center gap-1">
                  View inbox <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 bg-neutral-50/50">
                    <tr>
                      <th className="px-6 py-4">Sender</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_inquiries.map((inq) => (
                      <tr key={inq.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-neutral-800">{inq.name}</td>
                        <td className="px-6 py-4 text-neutral-500 text-xs">{inq.email}</td>
                        <td className="px-6 py-4 text-neutral-500 max-w-xs truncate text-xs">{inq.subject || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLOR[inq.status] || "bg-neutral-100 text-neutral-600"}`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-400 text-xs whitespace-nowrap">
                          {new Date(inq.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200">
              <MessageSquare className="mx-auto text-neutral-300 mb-4" size={40} />
              <p className="text-neutral-400 font-medium">No inquiries received yet.</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
