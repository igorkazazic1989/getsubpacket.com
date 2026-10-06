import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Public_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display", display: "swap" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: subcontractor COIs, W-9s and agreements for small builders`, template: `%s | ${site.name}` },
  description:
    "Collect certificates of insurance, W-9s and signed agreements from your subs by text. Get reminded before anything expires. Built for residential builders and remodelers.",
  openGraph: { siteName: site.name, type: "website" },
};

export const viewport: Viewport = { themeColor: "#F3F4F1" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
