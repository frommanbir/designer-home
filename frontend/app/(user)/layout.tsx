import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { serverFetch } from "@/lib/server-api";

async function getSiteSettings() {
  try {
    const res = await serverFetch("/site-settings");
    return res.data ?? {};
  } catch (err) {
    console.error("Failed to fetch site settings:", err);
    return {};
  }
}

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
