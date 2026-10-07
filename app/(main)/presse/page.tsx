import type { Metadata } from "next";
import { EntryGrid } from "@/components/catalog/EntryCard";
import { articleCards } from "@/lib/catalog-cards";
import { isPressArticle } from "@/lib/catalog";
import { fetchArticles } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return locale === "en"
    ? {
        title: "News | BEER Küchenmanufaktur",
        description: "Dates and notes from the workshop in Wolfersdorf.",
      }
    : {
        title: "Aktuelles | BEER Küchenmanufaktur",
        description: "Termine und Meldungen aus der Manufaktur in Wolfersdorf.",
      };
}

export default async function PressePage() {
  const locale = await getRequestLocale();
  const items = articleCards(
    (await fetchArticles()).filter(isPressArticle),
  );

  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <p className="type-eyebrow text-muted">
          {locale === "en" ? "Workshop" : "Manufaktur"}
        </p>
        <h1 className="mt-3 font-serif text-[40px] leading-[0.95] font-medium tracking-[-0.03em] text-ink md:text-[56px]">
          {locale === "en" ? "News" : "Aktuelles"}
          <br />
          <em className="font-medium italic">
            {locale === "en" ? "when there is something to say." : "wenn es etwas zu sagen gibt."}
          </em>
        </h1>
        <p className="type-intro mt-8 max-w-2xl">
          {locale === "en"
            ? "Not a feed. Dates, press, the showroom. Drafts stay in the CMS until someone publishes."
            : "Kein Nachrichtenstrom. Termine, Presse, die Ausstellung. Entwürfe bleiben im CMS, bis jemand veröffentlicht."}
        </p>
        <div className="mt-16">
          <EntryGrid items={items} />
        </div>
      </div>
    </main>
  );
}
