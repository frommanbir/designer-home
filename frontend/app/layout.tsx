import type { Metadata } from "next";
import { Inter, Baumans } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const baumans = Baumans({
  variable: "--font-baumans",
  subsets: ["latin"],
  weight: ["400"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const faviconUrl = settings?.branding?.favicon_url || "/favicon.ico";
  const siteTitle = settings?.branding?.website_title || "Designer Home";
  const siteSlogan = settings?.branding?.website_slogan || "Crafting beautiful spaces";

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteSlogan,
    icons: {
      icon: faviconUrl,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${baumans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
