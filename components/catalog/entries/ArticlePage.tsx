import Accordion from "@/components/Accordion";
import CmsImage from "@/components/CmsImage";
import FaqJsonLd from "@/components/FaqJsonLd";
import LocaleLink from "@/components/LocaleLink";
import RichText from "@/components/RichText";
import NextSteps from "@/components/catalog/NextSteps";
import { Breadcrumbs } from "@/components/catalog/clusters/parts";
import { Frame } from "@/components/catalog/collections/parts";
import { articleHref, isPressArticle, type Article, type ArticleBlock } from "@/lib/catalog";
import { filterFaqItems } from "@/lib/faq";
import type { Locale } from "@/lib/i18n";
import { absoluteAsset, absoluteUrl } from "@/lib/seo";
import { fetchFaqHub } from "@/lib/strapi";

/**
 * A Ratgeber or Presse article: where it sits, when it was written, how
 * long it takes to read, the body blocks in editor order, then the
 * questions people ask on the topic, related pages, more articles and the
 * next step. Carries Article + BreadcrumbList JSON-LD.
 */

const COPY = {
  de: {
    guide: "Ratgeber",
    press: "Aktuelles",
    allGuide: "Alle Ratgeber",
    allPress: "Alle Meldungen",
    minutes: (n: number) => `${n} Min. Lesezeit`,
    updated: "Aktualisiert",
    faqEyebrow: "Häufige Fragen",
    faqAll: "Alle Fragen zum Thema",
    topics: "Zum Thema",
    moreEyebrow: "Weiterlesen",
    moreGuide: "Mehr aus dem Ratgeber.",
    morePress: "Weitere Meldungen.",
    bandTitle: "Lieber persönlich besprechen?",
    bandText:
      "In der Ausstellung in Wolfersdorf klären wir Ihre Fragen an Mustern, Kanten und Geräten. Mit Termin, ohne Verkaufsdruck.",
  },
  en: {
    guide: "Guides",
    press: "News",
    allGuide: "All guides",
    allPress: "All news",
    minutes: (n: number) => `${n} min read`,
    updated: "Updated",
    faqEyebrow: "Frequent questions",
    faqAll: "All questions on this topic",
    topics: "On this topic",
    moreEyebrow: "Read on",
    moreGuide: "More from the guides.",
    morePress: "More news.",
    bandTitle: "Rather talk it through?",
    bandText:
      "In the Wolfersdorf showroom we answer your questions in front of samples, edges and appliances. By appointment, without sales pressure.",
  },
} as const;

/** Article category → FAQ theme in the CMS. */
const FAQ_THEME: Record<string, string> = {
  kosten: "kosten",
  planung: "planung",
  geraete: "geraete",
  material: "material",
  presse: "ausstellung",
};

/** Article category → the site's own pages on the subject. */
const TOPIC_LINKS: Record<Locale, Record<string, { href: string; label: string }[]>> = {
  de: {
    kosten: [
      { href: "/beratung", label: "Küche planen" },
      { href: "/faq/kosten", label: "Fragen zu Kosten" },
      { href: "/projekte", label: "Projekte" },
    ],
    planung: [
      { href: "/beratung", label: "Küche planen" },
      { href: "/ausstellung", label: "Ausstellung" },
      { href: "/kuechen", label: "Küchen" },
    ],
    geraete: [
      { href: "/geraete", label: "Geräte" },
      { href: "/marken", label: "Marken" },
      { href: "/kuechen/inseln", label: "Kücheninseln" },
    ],
    material: [
      { href: "/material", label: "Material" },
      { href: "/material/arbeitsplatten", label: "Arbeitsplatten" },
      { href: "/material/fronten", label: "Fronten" },
    ],
    presse: [
      { href: "/ausstellung", label: "Ausstellung" },
      { href: "/ueber", label: "Über BEER" },
      { href: "/kontakt", label: "Kontakt" },
    ],
  },
  en: {
    kosten: [
      { href: "/beratung", label: "Plan your kitchen" },
      { href: "/faq/kosten", label: "Questions on cost" },
      { href: "/projekte", label: "Projects" },
    ],
    planung: [
      { href: "/beratung", label: "Plan your kitchen" },
      { href: "/ausstellung", label: "Showroom" },
      { href: "/kuechen", label: "Kitchens" },
    ],
    geraete: [
      { href: "/geraete", label: "Appliances" },
      { href: "/marken", label: "Brands" },
      { href: "/kuechen/inseln", label: "Kitchen islands" },
    ],
    material: [
      { href: "/material", label: "Materials" },
      { href: "/material/arbeitsplatten", label: "Worktops" },
      { href: "/material/fronten", label: "Fronts" },
    ],
    presse: [
      { href: "/ausstellung", label: "Showroom" },
      { href: "/ueber", label: "About BEER" },
      { href: "/kontakt", label: "Contact" },
    ],
  },
};

function bodyBlocks(item: Article): ArticleBlock[] {
  if (item.blocks && item.blocks.length > 0) {
    return item.blocks;
  }
  return item.body ? [{ kind: "text", body: item.body }] : [];
}

function readingMinutes(blocks: ArticleBlock[], intro: string) {
  const words = [intro, ...blocks.map((block) => (block.kind === "image" ? "" : block.body))]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(value: string | undefined, locale: Locale) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ArticlePage({
  item,
  articles,
  locale,
}: {
  item: Article;
  /** Every article, to pick related ones from. */
  articles: Article[];
  locale: Locale;
}) {
  const copy = COPY[locale === "en" ? "en" : "de"];
  const press = isPressArticle(item);
  const hubHref = press ? "/presse" : "/ratgeber";
  const category = item.category?.slug ?? "";
  const blocks = bodyBlocks(item);
  const minutes = readingMinutes(blocks, item.description);
  const published = formatDate(item.publishedAt, locale);
  const updated = formatDate(item.updatedAt, locale);
  const path = articleHref(item);

  const theme = FAQ_THEME[category];
  const faq = theme ? await fetchFaqHub() : null;
  const questions = faq ? filterFaqItems(faq.items, theme).slice(0, 4) : [];
  const themeName = faq?.themes.find((entry) => entry.slug === theme)?.name;
  const topicLinks = TOPIC_LINKS[locale][category] ?? [];

  // Same kind (guide or news), same category first; a lone news item points to the guides.
  // The pick is this article's neighbours in date order (next older, next newer, ...), not the
  // newest three, so every article is linked from the ones next to it.
  const others = articles.filter((other) => other.slug !== item.slug);
  const sameKind = others.filter((other) => isPressArticle(other) === press);
  const moreIsPress = press && sameKind.length > 0;
  const pool = sameKind.length > 0 ? sameKind : others.filter((other) => !isPressArticle(other));
  const sameCategory = articles.filter(
    (other) => isPressArticle(other) === press && other.category?.slug === category,
  );
  const at = sameCategory.findIndex((other) => other.slug === item.slug);
  const neighbours =
    at < 0
      ? []
      : [1, -1, 2, -2, 3, -3]
          .map((step) => sameCategory[(((at + step) % sameCategory.length) + sameCategory.length) % sameCategory.length])
          .filter((other) => other.slug !== item.slug);
  const related = [...new Set([...neighbours, ...pool])].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": press ? "NewsArticle" : "Article",
    headline: item.title,
    description: item.description || undefined,
    image: item.image ? [absoluteAsset(item.image)] : undefined,
    datePublished: item.publishedAt,
    dateModified: item.updatedAt ?? item.publishedAt,
    inLanguage: locale === "en" ? "en" : "de",
    mainEntityOfPage: absoluteUrl(path, locale),
    articleSection: item.category?.name,
    author: { "@type": "Organization", name: "BEER Küchenmanufaktur", url: absoluteUrl("/", locale) },
    publisher: { "@type": "Organization", name: "BEER Küchenmanufaktur", url: absoluteUrl("/", locale) },
  };

  return (
    <main className="bg-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="mx-auto max-w-4xl px-5 pt-10 sm:px-8 lg:pt-16">
          <Breadcrumbs
            items={[{ href: hubHref, label: press ? copy.press : copy.guide }]}
            current={item.title}
            locale={locale}
          />
          <p className="type-eyebrow mt-10 text-gold">{item.category?.name || (press ? copy.press : copy.guide)}</p>
          <h1 className="mt-4 font-serif text-[40px] leading-[1.02] font-medium tracking-[-0.035em] text-ink sm:text-[56px] lg:text-[64px]">
            {item.title}
          </h1>
          {item.description ? <p className="type-intro mt-6 max-w-2xl">{item.description}</p> : null}
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[13px] text-muted">
            {published ? <time dateTime={item.publishedAt}>{published}</time> : null}
            {published ? <span aria-hidden="true">·</span> : null}
            <span>{copy.minutes(minutes)}</span>
            {/* Imported texts carry their original date; re-dating them is not an update. */}
            {updated && updated !== published && !item.originalDate ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {copy.updated} <time dateTime={item.updatedAt}>{updated}</time>
                </span>
              </>
            ) : null}
          </p>
        </header>

        {item.image ? (
          <figure className={`mx-auto mt-10 px-5 sm:px-8 ${item.portrait ? "max-w-xl" : "max-w-6xl"}`}>
            <div className={`relative overflow-hidden bg-karte ${item.portrait ? "aspect-[4/5]" : "aspect-[16/9]"}`}>
              <CmsImage
                src={item.image}
                srcSet={item.srcSet}
                alt={item.title}
                fill
                priority
                sizes={item.portrait ? "(max-width: 576px) 100vw, 576px" : "(max-width: 1200px) 100vw, 1150px"}
                className="object-cover"
              />
            </div>
          </figure>
        ) : null}

        <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 md:py-20">
          <div className="space-y-10">
            {blocks.map((block, index) => {
              if (block.kind === "text") {
                return <RichText key={index} source={block.body} />;
              }
              if (block.kind === "quote") {
                return (
                  <figure key={index} className="border-l-2 border-messing py-2 pl-6">
                    <blockquote className="font-serif text-[24px] leading-snug text-ink italic md:text-[28px]">{block.body}</blockquote>
                    {block.by ? <figcaption className="mt-3 font-sans text-[13px] text-muted">{block.by}</figcaption> : null}
                  </figure>
                );
              }
              return (
                <figure key={index} className="-mx-5 sm:mx-0">
                  <div className="relative aspect-[3/2] overflow-hidden bg-karte">
                    <CmsImage src={block.src} srcSet={block.srcSet} alt={block.alt} fill sizes="(max-width: 700px) 100vw, 672px" className="object-cover" />
                  </div>
                </figure>
              );
            })}
          </div>

          {topicLinks.length > 0 ? (
            <nav aria-labelledby="article-topics" className="mt-14 border-t border-line pt-8">
              <p id="article-topics" className="type-eyebrow text-muted">
                {copy.topics}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {topicLinks.map((link) => (
                  <li key={link.href}>
                    <LocaleLink
                      href={link.href}
                      className="type-nav inline-flex min-h-10 items-center border border-line bg-white px-4 text-ink transition-colors hover:border-ink"
                    >
                      {link.label}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </article>

      {questions.length > 0 ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby="article-faq">
          <FaqJsonLd items={questions} />
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="type-eyebrow text-gold">{copy.faqEyebrow}</p>
              <h2 id="article-faq" className="mt-3 font-serif text-[32px] leading-tight font-medium text-ink md:text-[38px]">
                {themeName ?? item.category?.name}
              </h2>
              <LocaleLink href={`/faq/${theme}`} className="mt-6 inline-flex min-h-6 items-center gap-2 font-sans text-[14px] text-ink underline underline-offset-4">
                {copy.faqAll} <span aria-hidden="true">→</span>
              </LocaleLink>
            </div>
            <div className="lg:col-span-8">
              <Accordion items={questions.map((entry) => ({ slug: entry.slug, question: entry.question, answer: entry.answer }))} />
            </div>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby="article-more">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="type-eyebrow text-gold">{copy.moreEyebrow}</p>
                <h2 id="article-more" className="mt-3 font-serif text-[32px] leading-tight font-medium text-ink md:text-[40px]">
                  {moreIsPress ? copy.morePress : copy.moreGuide}
                </h2>
              </div>
              <LocaleLink href={moreIsPress ? "/presse" : "/ratgeber"} className="inline-flex min-h-6 items-center gap-2 font-sans text-[14px] text-ink underline underline-offset-4">
                {moreIsPress ? copy.allPress : copy.allGuide} <span aria-hidden="true">→</span>
              </LocaleLink>
            </div>
            <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug}>
                  <LocaleLink href={articleHref(other)} className="group block">
                    <Frame
                      src={other.image}
                      alt=""
                      className="aspect-[4/3]"
                      imgClassName={other.portrait ? "object-top" : undefined}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {other.category?.name ? <p className="type-eyebrow mt-5 text-muted">{other.category.name}</p> : null}
                    <h3 className="mt-2 font-serif text-[24px] leading-snug font-medium text-ink">{other.title}</h3>
                    {other.description ? (
                      <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted">{other.description}</p>
                    ) : null}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="bg-nacht px-5 py-16 text-paper sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-[34px] leading-tight font-medium md:text-[46px]">{copy.bandTitle}</h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-[16px] leading-relaxed font-light text-paper/80">{copy.bandText}</p>
          <NextSteps locale={locale} tone="dark" className="mt-8 justify-center" />
        </div>
      </section>
    </main>
  );
}
