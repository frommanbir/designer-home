"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out border-r border-neutral-200/50 bg-[var(--background)] text-[var(--foreground)] flex flex-col fixed inset-y-0 z-50`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold">
            D
          </div>
          {sidebarOpen && (
            <span className="font-bold text-xl tracking-tight text-neutral-900 dark:text-white">
              Admin
            </span>
          )}
        </div>
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2 text-sm font-medium">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 mb-4"
          >
            <Menu size={20} />
          </button>
        )}
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
                isActive
                  ? "bg-neutral-100 text-black"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
              }`}
            >
              <item.icon
                size={20}
                className={isActive ? "text-black" : ""}
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
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors group relative">
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
  );
}
