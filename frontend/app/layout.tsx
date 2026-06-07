import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIEST - Inteligência Epidemiológica",
  description: "Sistema de Inteligência Epidemiológica e Socio-Territorial para monitoramento de saúde pública.",
  openGraph: {
    title: "SIEST - Portal Público",
    description: "Monitoramento avançado e previsões de sobrecarga clínica usando dados socioterritoriais.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body suppressHydrationWarning className="bg-slate-950 min-h-screen flex flex-col font-sans">
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
