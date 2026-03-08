import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import VideoBackground from "@/components/VideoBackground";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Yann COTINEAU - Blog",
  description: "Thoughts on software, AI, music, and more",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${lora.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen text-slate-100 selection:bg-emerald-500/30">
        <VideoBackground />
        <Navbar />
        <main className="relative z-10 mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
