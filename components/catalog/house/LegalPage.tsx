import LocaleLink from "@/components/LocaleLink";
import RichText, { richTextHeadings } from "@/components/RichText";
import type { PresentedHouse } from "@/lib/house-pages";
import { getSiteSettings } from "@/lib/site-settings";

/**
 * Impressum, Datenschutz, AGB: title, "Stand" from the CMS, a table of
 * contents once the text has three or more sections, the text itself
 * (Markdown in "Text"), then who to ask and the other legal pages.
 */

const COPY = {
  de: {
    updated: "Stand",
    contents: "Inhalt",
    questions: "Fragen zu dieser Seite?",
    questionsText: "Schreiben Sie uns oder rufen Sie an.",
    more: "Rechtliches",
  },
  en: {
    updated: "Last updated",
    contents: "Contents",
    questions: "Questions about this page?",
    questionsText: "Write to us or give us a call.",
    more: "Legal",
  },
} as const;

const LEGAL_PAGES = {
  de: [
    { slug: "impressum", label: "Impressum" },
    { slug: "datenschutz", label: "Datenschutz" },
    { slug: "agb", label: "AGB" },
  ],
  en: [
    { slug: "impressum", label: "Legal notice" },
    { slug: "datenschutz", label: "Privacy" },
    { slug: "agb", label: "Terms" },
  ],
} as const;

function formatDate(value: string | undefined, locale: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function LegalPage({ house }: { house: PresentedHouse }) {
  const locale = house.locale === "en" ? "en" : "de";
  const copy = COPY[locale];
  const settings = await getSiteSettings();
  const headings = richTextHeadings(house.body);
  const updated = formatDate(house.updatedAt, locale);
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <main className="bg-paper">
      <header className="mx-auto max-w-6xl px-5 pt-28 pb-4 sm:px-8 md:pt-32">
        <p className="type-eyebrow text-gold">{house.eyebrow || "BEER"}</p>
        <h1 className="type-h1 mt-3 text-ink">{house.title}</h1>
        {house.lede ? <p className="type-intro mt-6 max-w-2xl">{house.lede}</p> : null}
        {updated ? (
          <p className="mt-4 font-sans text-[13px] text-muted">
            {copy.updated}: <time dateTime={house.updatedAt}>{updated}</time>
          </p>
        ) : null}
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-12 lg:py-16">
        {headings.length >= 3 ? (
          <nav aria-labelledby="legal-contents" className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p id="legal-contents" className="type-eyebrow text-muted">
                {copy.contents}
              </p>
              <ol className="mt-4 space-y-1 border-l border-line">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-4 font-sans text-[14px] leading-snug text-muted transition-colors hover:border-ink hover:text-ink"
                    >
                      {heading.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        ) : null}

        <div className={headings.length >= 3 ? "lg:col-span-8" : "lg:col-span-8 lg:col-start-1"}>
          {house.body ? <RichText source={house.body} anchors /> : null}

          <aside className="mt-16 grid gap-8 border-t border-line pt-8 sm:grid-cols-2" aria-label={copy.more}>
            <div>
              <p className="font-serif text-[22px] leading-snug font-medium text-ink">{copy.questions}</p>
              <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted">{copy.questionsText}</p>
              <p className="mt-4 flex flex-col gap-1 font-sans text-[15px] text-ink">
                <a href={`mailto:${settings.email}`} className="inline-flex min-h-6 w-fit items-center underline underline-offset-4">
                  {settings.email}
                </a>
                <a href={phoneHref} className="inline-flex min-h-6 w-fit items-center underline underline-offset-4" data-umami-event="tel_click">
                  {settings.phone}
                </a>
              </p>
            </div>
            <nav aria-label={copy.more}>
              <p className="type-eyebrow text-muted">{copy.more}</p>
              <ul className="mt-4 space-y-2">
                {LEGAL_PAGES[locale].map((page) => (
                  <li key={page.slug}>
                    <LocaleLink
                      href={`/${page.slug}`}
                      aria-current={page.slug === house.slug ? "page" : undefined}
                      className="inline-flex min-h-6 items-center font-sans text-[15px] text-ink underline-offset-4 hover:underline aria-[current=page]:text-muted"
                    >
                      {page.label}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
