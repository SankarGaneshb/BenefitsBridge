import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BenefitsBridge | AI-Assisted Crisis Intake",
  description: "Transforming messy crisis records into structured, program-ready benefit applications. Fast, secure, and compassionate.",
  keywords: ["FEMA", "SNAP", "crisis assistance", "document extraction", "benefits intake"],
  openGraph: {
    title: "BenefitsBridge",
    description: "AI-assisted intake for disaster and food assistance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="animate-fade-in">{children}</body>
    </html>
  );
}
