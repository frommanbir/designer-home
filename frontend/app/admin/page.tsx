"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import {
  Briefcase,
  Image,
  BookOpen,
  Star,
  MessageSquare,
  Folder,
  AlertCircle,
  CheckCheck,
  MessageCircleReply,
  ArrowUpRight,
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
  { key: "services",   label: "Services",   icon: Briefcase,   color: "text-blue-600",   bg: "bg-blue-50",   link: "/admin/services" },
  { key: "projects",   label: "Projects",   icon: Folder,      color: "text-violet-600", bg: "bg-violet-50", link: "/admin/projects" },
  { key: "portfolios", label: "Portfolios", icon: Image,       color: "text-rose-600",   bg: "bg-rose-50",   link: "/admin/portfolios" },
  { key: "blogs",      label: "Blog Posts", icon: BookOpen,    color: "text-amber-600",  bg: "bg-amber-50",  link: "/admin/blogs" },
  { key: "ratings",    label: "Ratings",    icon: Star,        color: "text-emerald-600", bg: "bg-emerald-50", link: "/admin/settings" },
];

const STATUS_COLOR: Record<string, string> = {
  new:     "bg-blue-50 text-blue-700",
  read:    "bg-gray-50 text-gray-600",
  replied: "bg-emerald-50 text-emerald-700",
  closed:  "bg-neutral-100 text-neutral-500",
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
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-neutral-200 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-28 bg-neutral-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-neutral-100 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
        <AlertCircle className="text-red-400" size={40} />
        <h2 className="text-lg font-semibold text-neutral-700">Failed to load dashboard</h2>
        <p className="text-sm text-neutral-400">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-black text-white text-sm rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="text-neutral-500 text-sm mt-1">Live statistics from your website content.</p>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STATS_CONFIG.map(({ key, label, icon: Icon, color, bg, link }) => (
          <Link href={link} key={key} className="group p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={20} />
            </div>
            <p className="text-sm text-neutral-500 font-medium">{label}</p>
            <h3 className="text-3xl font-black text-neutral-900 mt-1">
              {data ? (data as any)[key] : "—"}
            </h3>
            <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1 group-hover:text-black transition-colors">
              Manage <ArrowUpRight size={12} />
            </p>
          </Link>
        ))}
      </div>

      {/* Inquiry Status */}
      {data?.inquiries && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Inquiries", value: data.inquiries.total, icon: MessageSquare, color: "text-neutral-700" },
            { label: "New",     value: data.inquiries.new,     icon: AlertCircle,        color: "text-blue-600" },
            { label: "Read",    value: data.inquiries.read,    icon: CheckCheck,         color: "text-gray-500" },
            { label: "Replied", value: data.inquiries.replied, icon: MessageCircleReply, color: "text-emerald-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
              <Icon className={color} size={24} />
              <div>
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="text-2xl font-black text-neutral-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Inquiries Table */}
      {data?.recent_inquiries && data.recent_inquiries.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <h3 className="font-bold text-neutral-900">Recent Inquiries</h3>
            <Link href="/admin/inquiries" className="text-xs font-semibold text-black hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-neutral-400 uppercase border-b border-neutral-100 bg-neutral-50">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900">{inq.name}</td>
                    <td className="px-6 py-4 text-neutral-500">{inq.email}</td>
                    <td className="px-6 py-4 text-neutral-500 max-w-xs truncate">{inq.subject || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[inq.status] || "bg-neutral-100 text-neutral-600"}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-xs">
                      {new Date(inq.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.recent_inquiries?.length === 0 && (
        <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200">
          <MessageSquare className="mx-auto text-neutral-300 mb-4" size={40} />
          <p className="text-neutral-400">No inquiries received yet.</p>
        </div>
      )}
    </div>
  );
}
