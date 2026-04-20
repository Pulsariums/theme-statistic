import type { Metadata } from "next";
import { Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const marker = Permanent_Marker({
  variable: "--font-marker",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulsar Themes | OpenAnime Tema Portalı",
  description: "OpenAnime için takım ve proje destekli tema paylaşım sitesi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} ${marker.variable} antialiased bg-[var(--background)] text-[var(--text)] transition-colors duration-300`}>
        <Header />
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">{children}</div>
      </body>
    </html>
  );
}
