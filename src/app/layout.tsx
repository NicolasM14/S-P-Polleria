import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";

import { Toaster } from "@/shared/components/ui/sonner";
import { siteConfig } from "@/config/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brandSerif = Source_Serif_4({
  variable: "--font-brand-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: siteConfig.logoPath,
    apple: siteConfig.logoPath,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brandSerif.variable} font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
