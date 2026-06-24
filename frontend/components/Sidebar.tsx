"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Info,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  FileText
} from "lucide-react";
import { fetchApi } from "@/lib/api";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "About Page", href: "/admin/about", icon: Info },
  { name: "Portfolios", href: "/admin/portfolios", icon: Briefcase },
  { name: "Projects", href: "/admin/projects", icon: Briefcase },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch {
      // Even if the server call fails, clear local state
    } finally {
      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      // Expire the auth cookie so middleware redirects correctly
      document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict";
      router.push("/login");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[var(--background)] text-[var(--foreground)] border-r border-neutral-200/50 transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? "translate-x-0 w-64" 
            : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg hover:bg-neutral-100 transition-all duration-300 ${!sidebarOpen && "mx-auto"}`}
          >
            {sidebarOpen ? (
              <ChevronLeft size={24} className="text-neutral-600" />
            ) : (
              <ChevronRight size={24} className="text-neutral-600" />
            )}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 text-sm font-medium mt-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                <item.icon
                  size={20}
                  className={isActive ? "text-white" : "text-neutral-500"}
                />
                {sidebarOpen && <span>{item.name}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors group relative"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
