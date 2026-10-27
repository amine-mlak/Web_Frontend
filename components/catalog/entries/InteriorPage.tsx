import Accordion from "@/components/Accordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import LocaleLink from "@/components/LocaleLink";
import PageEnd from "@/components/catalog/PageEnd";
import { Frame } from "@/components/catalog/collections/parts";
import { Crumbs, HouseLine } from "@/components/catalog/clusters/parts";
import type { PagePoint, SitePage } from "@/lib/catalog";
import type { PresentedTopic } from "@/lib/collection-topics";
import { filterFaqItems } from "@/lib/faq";
import { fetchFaqHub } from "@/lib/strapi";

/**
 * /material/innenleben: what sits behind the fronts. Each CMS point is its own section with a
 * large photo, a detail photo, the text and a link to the page it belongs to. The sections
 * change sides, so the page reads like a walk through the cupboards.
 */

const COPY = {
  de: {
    contents: "Auf dieser Seite",
    detail: "Detail",
    faqEyebrow: "Häufige Fragen",
    faqAll: "Alle Fragen zum Innenleben",
    houses: "Küchen mit diesem Innenleben",
    more: "Weitere Ebenen der Küche",
  },
  en: {
    contents: "On this page",
    detail: "Detail",
    faqEyebrow: "Frequent questions",
    faqAll: "All questions on interiors",
    houses: "Kitchens with this interior",
    more: "Other planes of the kitchen",
  },
} as const;

type ShownPoint = PagePoint & { bild: NonNullable<PagePoint["bild"]> };

/** Points with a photo get a section; the page only uses this layout when at least two have one. */
export function interiorPoints(page?: SitePage | null): ShownPoint[] {
  return (page?.punkte ?? []).filter((point): point is ShownPoint => Boolean(point.bild?.src));
}

function anchor(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function PointText({ point, id, lang }: { point: ShownPoint; id: string; lang: string }) {
  const lines = point.text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    <div>
      <h2
        id={id}
        lang={lang}
        className="font-serif text-[36px] leading-[1.02] font-medium tracking-[-0.035em] text-ink hyphens-auto md:text-[48px]"
      >
        {point.titel}
      </h2>
      <div className="mt-6 max-w-md space-y-4">
        {lines.map((line, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "font-serif text-[21px] leading-snug text-ink/85"
                : "font-sans text-[16px] leading-relaxed text-muted"
            }
          >
            {line}
          </p>
        ))}
      </div>
      {point.linkText && point.linkZiel ? (
        <LocaleLink href={point.linkZiel} className="btn-quiet mt-8 text-ink">
          {point.linkText}
          <span className="sr-only">: {point.titel}</span>
        </LocaleLink>
      ) : null}
    </div>
  );
}

/** One section: the large photo on one side, text and the detail photo on the other. */
function PointSection({ point, index, lang, detailLabel }: { point: ShownPoint; index: number; lang: string; detailLabel: string }) {
  const id = `innen-${anchor(point.titel) || index}`;
  const flip = index % 2 === 1;
  const detail = point.detailbild;
  return (
    <section id={id.replace(/^innen-/, "")} className="scroll-mt-24 border-t border-line" aria-labelledby={id}>
      <div className="grid lg:min-h-[86svh] lg:grid-cols-12">
        <Frame
          src={point.bild.src}
          srcSet={point.bild.srcSet}
          alt={point.titel}
          className={`aspect-[4/3] lg:col-span-7 lg:aspect-auto ${flip ? "lg:order-2" : ""}`}
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div
          className={`flex flex-col justify-between gap-12 px-5 py-14 sm:px-8 lg:col-span-5 lg:px-14 lg:py-20 ${flip ? "lg:order-1" : ""}`}
        >
          <PointText point={point} id={id} lang={lang} />
          {detail?.src ? (
            <figure className="max-w-sm">
              <Frame
                src={detail.src}
                srcSet={detail.srcSet}
                alt={`${point.titel}: ${detailLabel}`}
                className="aspect-[4/3]"
                sizes="(max-width: 1024px) 80vw, 24rem"
              />
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default async function InteriorPage({
  hub,
  page,
  faqTheme,
}: {
  hub: PresentedTopic;
  page: SitePage;
  faqTheme?: string;
}) {
  const locale = hub.locale === "en" ? "en" : "de";
  const copy = COPY[locale];
  const points = interiorPoints(page);
  const faq = faqTheme ? await fetchFaqHub() : null;
  const questions = faq ? filterFaqItems(faq.items, faqTheme).slice(0, 6) : [];
  const theme = faq?.themes.find((item) => item.slug === faqTheme);
  const body = page.body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  const heroImage = page.image || hub.heroImage;

  return (
    <main className="bg-paper">
      <section className="grid lg:min-h-[86svh] lg:grid-cols-12" aria-labelledby="innen-title">
        <div className="flex flex-col justify-end px-5 pt-10 pb-12 sm:px-8 lg:col-span-5 lg:px-14 lg:pt-16 lg:pb-20">
          <Crumbs hub={hub} />
          <h1
            id="innen-title"
            className="mt-10 font-serif text-[52px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[76px]"
          >
            {hub.title}
            {hub.emphasis ? <em className="italic"> {hub.emphasis}</em> : null}
          </h1>
          {page.intro ? (
            <p className="mt-6 max-w-md font-serif text-[22px] leading-snug text-ink/80">{page.intro}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <LocaleLink href={page.ctaUrl || "/beratung"} className="pill pill-primary">
              {page.ctaLabel || (locale === "en" ? "Book an appointment" : "Termin vereinbaren")}
            </LocaleLink>
            <LocaleLink href="/kueche-planen#planer" className="pill pill-secondary">
              {locale === "en" ? "Plan your kitchen" : "Küche planen"}
            </LocaleLink>
          </div>
        </div>
        <Frame
          src={heroImage}
          srcSet={page.image ? page.srcSet : undefined}
          alt={hub.heroAlt}
          className="aspect-[4/3] lg:col-span-7 lg:aspect-auto"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
      </section>

      {hub.statement || body.length ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              {hub.statement ? (
                <h2 className="font-serif text-[30px] leading-snug font-medium tracking-[-0.025em] text-ink md:text-[38px]">
                  {hub.statement}
                </h2>
              ) : null}
              {hub.statementNote ? (
                <p className="mt-6 max-w-md font-sans text-[16px] leading-relaxed text-muted">{hub.statementNote}</p>
              ) : null}
            </div>
            <div className="space-y-6 lg:col-span-5 lg:col-start-8">
              {body.map((paragraph, index) => (
                <p key={index} className="font-sans text-[17px] leading-[1.7] text-ink/85">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {/* The sections below as jump links, so people find the cupboard they care about. */}
          <nav className="mt-14" aria-label={copy.contents}>
            <p className="font-sans text-[14px] text-muted">{copy.contents}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {points.map((point, index) => (
                <li key={point.titel}>
                  <a
                    href={`#${anchor(point.titel) || index}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-line px-4 font-sans text-[14px] text-ink transition-colors hover:border-ink"
                  >
                    {point.titel}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      ) : null}

      {points.map((point, index) => (
        <PointSection key={point.titel} point={point} index={index} lang={locale} detailLabel={copy.detail} />
      ))}

      <HouseLine houses={hub.houses} title={copy.houses} />

      {questions.length > 0 ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby="innen-faq">
          <FaqJsonLd items={questions} />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="type-eyebrow text-gold">{copy.faqEyebrow}</p>
              <h2 id="innen-faq" className="mt-3 font-serif text-[32px] leading-tight font-medium text-ink md:text-[38px]">
                {theme?.name ?? hub.title}
              </h2>
              <LocaleLink href={`/faq/${faqTheme}`} className="mt-6 inline-flex min-h-6 items-center gap-2 font-sans text-[14px] text-ink underline underline-offset-4">
                {copy.faqAll} <span aria-hidden="true">→</span>
              </LocaleLink>
            </div>
            <div className="lg:col-span-8">
              <Accordion items={questions.map((item) => ({ slug: item.slug, question: item.question, answer: item.answer }))} />
            </div>
          </div>
        </section>
      ) : null}

      <PageEnd
        title={hub.closeTitle}
        text={hub.closeText}
        primary={{ href: "/ausstellung", label: locale === "en" ? "Visit the showroom" : "Ausstellung besuchen" }}
        tiles={hub.siblings.map((sibling) => ({ href: sibling.href, title: sibling.title, text: sibling.text, image: sibling.image }))}
        tilesTitle={copy.more}
        locale={hub.locale}
      />
    </main>
  );
}
