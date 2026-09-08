import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader>
        <Header />
      </SiteHeader>
      <main className="bg-paper">
        <section className="mx-auto max-w-xl px-6 py-32 text-center">
          <p className="type-eyebrow">404</p>
          <h1 className="type-h1 mt-4 text-ink">Seite nicht gefunden</h1>
          <p className="type-body mt-4">
            Diese Demo hat die Startseite (Strapi), /v2 und /storyblok.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link href="/" className="pill pill-primary">
              Zur Startseite
            </Link>
            <Link href="/v2" className="pill pill-secondary">
              Version 2
            </Link>
            <Link href="/storyblok" className="pill pill-secondary">
              Storyblok
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
