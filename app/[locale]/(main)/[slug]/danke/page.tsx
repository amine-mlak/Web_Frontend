import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocaleLink from "@/components/LocaleLink";
import { fetchBooklet } from "@/lib/booklet";
import { brandedTitle } from "@/lib/seo";

export const revalidate = 120;

/**
 * Thank-you page after a booklet request (beer.de/7-geheimnisse/danke). It is the page the ad
 * platforms count as the conversion. Never in Google. `versand` only changes the wording; the
 * PDF is free to download anyway.
 */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const booklet = await fetchBooklet(slug);
  return {
    title: brandedTitle(booklet ? `Danke – ${booklet.title}` : "Danke"),
    robots: { index: false, follow: false },
  };
}

const NEXT_STEPS = [
  { href: "/projekte", label: "Echte Küchen ansehen" },
  { href: "/beratung", label: "Welche Küche passt zu Ihnen?" },
  { href: "/ausstellung", label: "Ausstellung in Wolfersdorf besuchen" },
];

export default async function BookletThanksPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ versand?: string | string[] }>;
}) {
  const { slug } = await params;
  const booklet = await fetchBooklet(slug);
  if (!booklet) notFound();

  const raw = (await searchParams).versand;
  const delivery = (Array.isArray(raw) ? raw[0] : raw) ?? "digital";
  const digital = delivery !== "print";
  const print = delivery === "print" || delivery === "both";
  const thanksLines = booklet.thanksText.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  return (
    <main className="bg-paper">
      <section aria-labelledby="danke-title" className="px-5 py-16 sm:px-8 lg:px-gutter lg:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="type-eyebrow text-gold">{booklet.title}</p>
          <h1 id="danke-title" className="type-h1 mt-3 text-ink">
            {booklet.thanksTitle}
          </h1>
          <div className="type-intro mt-6 space-y-4">
            {thanksLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {digital ? (
              <p>
                {booklet.pdfUrl
                  ? "Hier können Sie es gleich lesen. Den Link schicken wir Ihnen auch per E-Mail."
                  : "Wir schicken es Ihnen in den nächsten Minuten per E-Mail."}
              </p>
            ) : null}
            {print ? <p>Die gedruckte Ausgabe geht in den nächsten Tagen zur Post und ist in 4–5 Tagen bei Ihnen.</p> : null}
          </div>
          {digital && booklet.pdfUrl ? (
            <a
              href={booklet.pdfUrl}
              target="_blank"
              rel="noopener"
              className="pill pill-primary mt-8"
              data-umami-event="booklet_download"
            >
              Booklet als PDF öffnen
            </a>
          ) : null}

          <div className="mt-14 border-t border-line pt-8">
            <p className="type-eyebrow text-gold">Wie es weitergeht</p>
            <ul className="mt-4 divide-y divide-line">
              {NEXT_STEPS.map((step) => (
                <li key={step.href}>
                  <LocaleLink href={step.href} className="flex min-h-12 items-center justify-between py-3 font-serif text-[21px] text-ink hover:text-gold">
                    {step.label}
                    <span aria-hidden="true" className="font-sans text-[16px]">→</span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
