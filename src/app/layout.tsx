import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { MobileContactBar } from "@/components/layout/mobile-contact-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: `Website von ${siteConfig.name}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full`}>
      <body className="site-body flex min-h-full flex-col">
        <a className="skip-link" href="#main-content">
          Zum Inhalt springen
        </a>
        <SiteHeader />
        <main id="main-content" className="flex flex-1 flex-col" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <MobileContactBar />
      </body>
    </html>
  );
}
