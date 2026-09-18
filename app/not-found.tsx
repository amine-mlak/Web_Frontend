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
            Diese Seite gibt es nicht. Zurück zur Startseite von BEER
            Küchenmanufaktur.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/" className="pill pill-primary">
              Zur Startseite
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
