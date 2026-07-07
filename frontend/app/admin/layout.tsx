"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, UserCircle, Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
import { fetchApi } from "@/lib/api";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [websiteTitle, setWebsiteTitle] = useState<string>("Designer Home");
  const [faviconUrl, setFaviconUrl] = useState<string>("/favicon.ico");

  // Close sidebar by default on mobile, open on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetchApi("/site-settings")
      .then((res) => {
        if (res.success && res.data) {
          const branding = res.data.branding;
          if (branding?.favicon_url) {
            setFaviconUrl(branding.favicon_url);
          }
          if (branding?.logo_url) {
            setLogoUrl(branding.logo_url);
          }
          if (branding?.website_title) {
            setWebsiteTitle(branding.website_title);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch settings in admin layout:", err);
      });
  }, []);

  // Update favicon in head
  useEffect(() => {
    if (!faviconUrl) return;
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = faviconUrl;
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(link);
    }
  }, [faviconUrl]);

  return (
    <div className="flex min-h-screen admin-theme font-sans">
      <Suspense fallback={<div className="w-20 lg:w-64 bg-[var(--background)]" />}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </Suspense>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Header */}
        <header className="h-16 border-b border-neutral-200/50 bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={websiteTitle}
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-contain shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold shadow-sm">
                {websiteTitle.substring(0, 2)}
              </div>
            )}
            <span className="font-bold text-lg tracking-tight text-neutral-900 hidden sm:block">
              {websiteTitle}
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
