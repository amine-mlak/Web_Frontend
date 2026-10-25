import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Seite nicht gefunden | BEER Küchenmanufaktur",
  robots: { index: false, follow: true },
};

// URLs that match no route at all. Pages that call notFound() use
// app/[locale]/not-found.tsx with the normal header and footer instead.
export default function GlobalNotFound() {
  return (
    <html lang="de">
      <body className={`${figtree.className} antialiased bg-paper`}>
        <main className="mx-auto max-w-xl px-6 py-32 text-center">
          <p className="type-eyebrow">404</p>
          <h1 className="type-h1 mt-4 text-ink">Seite nicht gefunden</h1>
          <p className="type-body mt-4">
            Diese Seite gibt es nicht. Page not found.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link href="/" className="pill pill-primary">
              Zur Startseite
            </Link>
            <Link href="/en" className="pill">
              English
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
