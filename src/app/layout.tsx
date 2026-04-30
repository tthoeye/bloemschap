import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
  title: "Bloesmschap — Stuur een Bloemschap!",
  description: "Typ je boodschap, kies je boeket, en laat het vandaag nog bezorgen.",
};

const ROMANTICS_ONLY_LOGO_URL =
  "https://44a6c80ff9.clvaw-cdnwnd.com/b94f3baaaf906e4f53c019b6c29a664c/200000001-3c0323c033/700/Logo%20Romantics%20only%20klein.webp?ph=44a6c80ff9";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
       
        {children}
      </body>
    </html>
  );
}
