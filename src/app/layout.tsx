import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Blog",
  description: "Next + Contentlayer + MDX",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--bg)] text-[var(--fg)] antialiased">
        <div className="mx-auto max-w-3xl px-5 py-10">
          <header className="mb-10 flex items-center justify-between">
            <a href="/" className="text-lg font-semibold tracking-tight hover:opacity-90">
              My Blog
            </a>
            <nav className="text-sm text-[var(--muted)]">
              <a href="/" className="hover:text-[var(--fg)]">Home</a>
            </nav>
          </header>

          {children}

          <footer className="mt-14 border-t border-white/10 pt-6 text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} — Built with Next + Contentlayer + MDX
          </footer>
        </div>
      </body>
    </html>
  );
}
