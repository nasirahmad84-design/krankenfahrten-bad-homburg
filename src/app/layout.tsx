import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { MobileContactBar } from "@/components/layout/mobile-contact-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site-config";
import { productionOrigin } from "@/lib/site-url";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(productionOrigin),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: "Sitzende Krankenfahrten in Bad Homburg für Arzt-, Klinik-, Dialyse-, Therapie- und Entlassungstermine.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
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
