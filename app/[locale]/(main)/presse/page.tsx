import type { Metadata } from "next";
import LocaleLink from "@/components/LocaleLink";
import NextSteps from "@/components/catalog/NextSteps";
import { EntryGrid } from "@/components/catalog/EntryCard";
import { articleCards } from "@/lib/catalog-cards";
import { isPressArticle } from "@/lib/catalog";
import { fetchArticles } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 120;

// One sentence for the page and for search results.
const COPY = {
  de: { title: "Aktuelles", intro: "Termine, Presseberichte und Neues aus der Manufaktur und der Ausstellung in Wolfersdorf." },
  en: { title: "News", intro: "Dates, press and news from the workshop and the showroom in Wolfersdorf." },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const copy = COPY[(await getRequestLocale()) === "en" ? "en" : "de"];
  return pageMetadata({
    title: `${copy.title} | BEER Küchenmanufaktur`,
    description: copy.intro,
    path: "/presse",
  });
}

export default async function PressePage() {
  const locale = await getRequestLocale();
  const copy = COPY[locale === "en" ? "en" : "de"];
  const articles = await fetchArticles();
  const items = articleCards(articles.filter(isPressArticle));
  const guides = articleCards(articles.filter((item) => !isPressArticle(item)).slice(0, 3));

  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <h1 className="font-serif text-[40px] leading-[0.95] font-medium tracking-[-0.03em] text-ink md:text-[56px]">
          {copy.title}
        </h1>
        <p className="type-intro mt-8 max-w-2xl">{copy.intro}</p>
        <div className="mt-16">
          <EntryGrid items={items} />
        </div>
      </div>

      {guides.length > 0 ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby="presse-guides">
          <div className="mx-auto max-w-[90rem]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="type-eyebrow text-gold">{locale === "en" ? "Guides" : "Ratgeber"}</p>
                <h2 id="presse-guides" className="mt-3 font-serif text-[32px] leading-tight font-medium text-ink md:text-[40px]">
                  {locale === "en" ? "Read before the conversation." : "Lesen vor dem Gespräch."}
                </h2>
              </div>
              <LocaleLink href="/ratgeber" className="inline-flex min-h-6 items-center gap-2 font-sans text-[14px] text-ink underline underline-offset-4">
                {locale === "en" ? "All guides" : "Alle Ratgeber"} <span aria-hidden="true">→</span>
              </LocaleLink>
            </div>
            <div className="mt-10">
              <EntryGrid items={guides} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-nacht px-5 py-16 text-paper sm:px-8 lg:px-14 lg:py-20" aria-labelledby="presse-contact">
        <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="presse-contact" className="font-serif text-[32px] leading-tight font-medium md:text-[42px]">
              {locale === "en" ? "Press enquiries" : "Presseanfragen"}
            </h2>
            <p className="mt-4 max-w-md font-sans text-[16px] leading-relaxed font-light text-paper/80">
              {locale === "en"
                ? "For interviews, photos or a visit to the workshop, write to"
                : "Für Gespräche, Bilder oder einen Besuch in der Werkstatt schreiben Sie an"}{" "}
              <a href="mailto:info@beer.de" className="text-paper underline underline-offset-4">
                info@beer.de
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <NextSteps locale={locale} tone="dark" />
          </div>
        </div>
      </section>
    </main>
  );
}
