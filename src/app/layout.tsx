import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website Analyser | AI Visibility & Commerce Auditor",
  description: "Advanced AI-powered benchmark for production websites. Audit your visibility for AI-first search and capture the next wave of commerce.",
  keywords: ["AI Audit", "Website Analysis", "Commerce Visibility", "AI-First Search", "SEO Benchmark"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
