"use client";

import React, { useState, useEffect } from "react";
import { Search, UserCircle, Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close sidebar by default on mobile, open on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="flex min-h-screen admin-theme font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Header */}
        <header className="h-16 border-b border-neutral-200/50 bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold shadow-sm">
              D
            </div>
            <span className="font-bold text-lg tracking-tight text-neutral-900 hidden sm:block">
              Designer Home
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-neutral-900">Admin User</p>
                <p className="text-xs text-neutral-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 border border-neutral-300">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
          {children}
        </main>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </div>
  );
}
