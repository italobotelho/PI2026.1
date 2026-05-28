import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  description: "Sistema de Inteligência Epidemiológica e Socio-Territorial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
