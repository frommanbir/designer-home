"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Info,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  FileText,
  Star,
  Wrench,
  Globe,
  Phone,
  Share2,
  Image as ImageIcon,
  Plus,
  Minus,
  Tags,
  Layout,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string; icon: React.ElementType }[];
}

const sidebarItems: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Services",
    href: "/admin/services",
    icon: Wrench,
    children: [
      { name: "Services List", href: "/admin/services?tab=services", icon: Wrench },
      { name: "Hero Banner", href: "/admin/services?tab=hero", icon: Layout },
      // { name: "Categories", href: "/admin/services/categories", icon: Tags },
    ],
  },
  {
    name: "Portfolios",
    href: "/admin/portfolios",
    icon: Briefcase,
    children: [
      { name: "Portfolios List", href: "/admin/portfolios?tab=portfolios", icon: Briefcase },
      { name: "Hero Banner", href: "/admin/portfolios?tab=hero", icon: Layout },
      { name: "Categories", href: "/admin/portfolios/categories", icon: Tags },
    ],
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: Briefcase,
    children: [
      { name: "Projects List", href: "/admin/projects?tab=projects", icon: Briefcase },
      { name: "Hero Banner", href: "/admin/projects?tab=hero", icon: Layout },
      { name: "Categories", href: "/admin/projects/categories", icon: Tags },
    ],
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
    children: [
      { name: "Blogs List", href: "/admin/blogs?tab=blogs", icon: FileText },
      { name: "Hero Banner", href: "/admin/blogs?tab=hero", icon: Layout },
    ],
  },
  {
    name: "About Page",
    href: "/admin/about",
    icon: Info,
    children: [
      { name: "Why Choose Us", href: "/admin/about?tab=why_choose", icon: Star },
      { name: "Main About", href: "/admin/about?tab=main_about", icon: Info },
      { name: "Hero Banner", href: "/admin/about?tab=hero", icon: Layout },
    ],
  },
  { name: "Ratings", href: "/admin/ratings", icon: Star },
  { name: "User Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    children: [
      { name: "Branding", href: "/admin/settings?tab=branding", icon: ImageIcon },
      { name: "About", href: "/admin/settings?tab=about", icon: Info },
      { name: "Contact Details", href: "/admin/settings?tab=contact", icon: Phone },
      { name: "Social Media", href: "/admin/settings?tab=social", icon: Share2 },
    ],
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Track which groups are expanded.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleGroup = (name: string) => {
    setExpanded((prev) => {
      const isCurrentlyExpanded = prev[name];
      const nextExpanded: Record<string, boolean> = {};
      sidebarItems.forEach((sibling) => {
        if (sibling.children) {
          nextExpanded[sibling.name] = sibling.name === name ? !isCurrentlyExpanded : false;
        }
      });
      return nextExpanded;
    });
  };

  const handleLogout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch {
      // Even if the server call fails, clear local state
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict";
      router.push("/login");
    }
  };

  const isItemActive = (item: NavItem) => {
    if (item.children) {
      // Parent is "active" if any child matches
      return item.children.some((child) => {
        const [childPath, childQuery] = child.href.split("?");
        const tab = childQuery?.split("=")?.[1];
        return pathname === childPath && (!tab || searchParams.get("tab") === tab);
      });
    }
    return pathname === item.href;
  };

  const isChildActive = (href: string) => {
    const [childPath, childQuery] = href.split("?");
    const tab = childQuery?.split("=")?.[1];
    return pathname === childPath && (!tab || searchParams.get("tab") === tab);
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

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-medium mt-2">
          {sidebarItems.map((item) => {
            const active = isItemActive(item);
            const isExpanded = expanded[item.name];

            if (item.children) {
              const firstChildHref = item.children[0].href;
              return (
                <div key={item.name} className="space-y-1">
                  {/* Split Navigation & Expansion Header */}
                  <div className="flex items-center justify-between gap-0.5 group relative">
                    <Link
                      href={firstChildHref}
                      className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-l-lg transition-all ${
                        active
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                      }`}
                    >
                      <item.icon
                        size={20}
                        className={active ? "text-blue-600 flex-shrink-0" : "text-neutral-500 flex-shrink-0"}
                      />
                      {sidebarOpen && <span className="flex-1 text-left">{item.name}</span>}
                    </Link>

                    {sidebarOpen && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleGroup(item.name);
                        }}
                        className={`p-2 rounded-r-lg transition-all ${
                          active
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100/50"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                        }`}
                      >
                        {isExpanded ? (
                          <Minus size={16} className="text-neutral-500 flex-shrink-0" />
                        ) : (
                          <Plus size={16} className="text-neutral-500 flex-shrink-0" />
                        )}
                      </button>
                    )}

                    {/* Tooltip when collapsed */}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </div>

                  {/* Sub-items — only visible when sidebar is open and group is expanded */}
                  {sidebarOpen && isExpanded && (
                    <div className="mt-1 ml-4 pl-3 border-l-2 border-neutral-200 space-y-1">
                      {item.children.map((child) => {
                        const childActive = isChildActive(child.href);
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                              childActive
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                            }`}
                          >
                            <child.icon size={16} className={childActive ? "text-white" : "text-neutral-400"} />
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular flat item
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                <item.icon
                  size={20}
                  className={active ? "text-white" : "text-neutral-500"}
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
