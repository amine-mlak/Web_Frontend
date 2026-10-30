import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import { articleHref, type Article } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";

/** Category order on the page; anything else follows under "Weitere". */
const ORDER = ["planung", "kosten", "geraete", "material"];

const COPY = {
  de: { title: "Alle Texte", text: (n: number) => `${n} Ratgeber, nach Thema sortiert.`, other: "Weitere" },
  en: { title: "All guides", text: (n: number) => `${n} guides, sorted by topic.`, other: "More" },
} as const;

/**
 * Every guide, grouped by category and newest first, so each one is one
 * click from the hub (the branches above only point at a few).
 */
export default function ArticleIndex({ articles, locale }: { articles: Article[]; locale: Locale }) {
  const copy = COPY[locale === "en" ? "en" : "de"];
  const groups = new Map<string, { name: string; items: Article[] }>();
  for (const item of articles) {
    const slug = item.category?.slug && ORDER.includes(item.category.slug) ? item.category.slug : "other";
    const group = groups.get(slug) ?? { name: slug === "other" ? copy.other : (item.category?.name ?? copy.other), items: [] };
    group.items.push(item);
    groups.set(slug, group);
  }
  const ordered = [...ORDER, "other"].flatMap((slug) => {
    const group = groups.get(slug);
    return group ? [{ slug, ...group }] : [];
  });
  if (ordered.length === 0) return null;
  const dateFormat = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "de-DE", { month: "long", year: "numeric" });

  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-24" aria-labelledby="ratgeber-index">
      <div className="mx-auto max-w-[90rem]">
        <h2
          id="ratgeber-index"
          className="font-serif text-[40px] leading-[1] font-medium tracking-[-0.035em] text-ink md:text-[52px]"
        >
          {copy.title}
        </h2>
        <p className="mt-4 font-sans text-[17px] leading-relaxed text-muted">{copy.text(articles.length)}</p>

        <div className="mt-14 space-y-16">
          {ordered.map((group) => (
            <section key={group.slug} aria-labelledby={`ratgeber-${group.slug}`} className="grid gap-6 lg:grid-cols-12">
              <h3
                id={`ratgeber-${group.slug}`}
                className="font-serif text-[28px] leading-tight font-medium text-ink lg:col-span-3"
              >
                {group.name}
                <span className="ml-2 font-sans text-[15px] font-normal text-muted">{group.items.length}</span>
              </h3>
              <ul className="border-t border-line lg:col-span-9 lg:grid lg:grid-cols-2 lg:gap-x-10">
                {group.items.map((item) => (
                  <li key={item.slug} className="border-b border-line">
                    <LocaleLink href={articleHref(item)} className="group flex items-center gap-4 py-4">
                      {item.image ? (
                        <span className="relative size-16 shrink-0 overflow-hidden bg-karte">
                          <CmsImage src={item.image} alt="" fill sizes="64px" className={item.portrait ? "object-cover object-top" : "object-cover"} />
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="block font-serif text-[19px] leading-snug text-ink">{item.title}</span>
                        {item.publishedAt ? (
                          <span className="mt-1 block font-sans text-[13px] text-muted">
                            {dateFormat.format(new Date(item.publishedAt))}
                          </span>
                        ) : null}
                      </span>
                      <span aria-hidden="true" className="shrink-0 text-muted transition-colors group-hover:text-ink">
                        →
                      </span>
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
