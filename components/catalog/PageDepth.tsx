import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/Frame";
import Questions from "@/components/catalog/Questions";
import { articleHref, isPressArticle, type Article } from "@/lib/catalog";
import { fetchArticles } from "@/lib/catalog-api";
import type { PresentedTopic } from "@/lib/collection-topics";
import { findArticle, guideExcerpt } from "@/lib/guide-excerpt";
import { pageDepth } from "@/lib/page-depth";
import { careCopy } from "@/lib/page-reading/care";

/**
 * What BEER has already written about a page's subject, shown on the page itself: the care
 * notes for a material, the guide article on the subject, and the questions buyers ask about
 * it. Which of these a page gets is listed in lib/page-depth.ts; a page without an entry
 * shows none of them.
 */
type Props = {
  hub: PresentedTopic;
  /** The page's address; pages that carry it on the hub leave this out. */
  path?: string;
};

function depthOf({ hub, path }: Props) {
  return pageDepth(path ?? hub.depth?.path);
}

/** Care notes for a material: what to clean it with, what it needs, what harms it. */
export function PageCare({ hub, path }: Props) {
  const care = careCopy(depthOf({ hub, path })?.care, hub.locale);
  if (!care) {
    return null;
  }
  const en = hub.locale === "en";
  const name = hub.depth?.name ?? hub.title;

  return (
    <section className="bg-karte" aria-labelledby="page-care">
      <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-gutter lg:py-24">
        <div className="lg:col-span-4">
          <p className="type-eyebrow text-gold">{en ? "From our care guide" : "Aus der Pflegeanleitung"}</p>
          <h2 id="page-care" data-rise="" className="t-section mt-3 text-ink">
            {en ? `${name}: everyday care` : `${name} pflegen`}
          </h2>
          <p className="mt-5 max-w-md font-sans text-[16px] leading-[1.7] text-ink/85">{care.intro}</p>
          <LocaleLink href="/faq/pflege" className="btn-quiet mt-7 text-ink">
            {en ? "All questions on care" : "Alle Fragen zur Pflege"} <span aria-hidden="true">→</span>
          </LocaleLink>
        </div>
        <dl className="border-b border-line lg:col-span-7 lg:col-start-6">
          {care.rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-2 border-t border-line py-6 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8"
            >
              <dt className="font-serif text-[18px] leading-[1.25] text-ink">{row.label}</dt>
              <dd className="font-sans text-[16px] leading-[1.7] text-ink/85">{row.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function kind(item: Article, lead = false) {
  if (isPressArticle(item)) {
    return lead ? "Aus dem Magazin" : "Magazin";
  }
  return lead ? "Aus dem Ratgeber" : "Ratgeber";
}

/** Articles whose cover photo shows a person; they are quoted without the photo. */
const NO_COVER = ["kuechenschreiner-aus-muenchen", "designkuche-referenz", "moderne-designkuche-mit-bora-xbo"];

function ArticleRows({ items, summary = false }: { items: Article[]; summary?: boolean }) {
  return (
    <ul className="border-b border-line">
      {items.map((item) => (
        <li key={item.slug} className="border-t border-line">
          <LocaleLink href={articleHref(item)} className="group flex items-baseline gap-5 py-5">
            <span className="min-w-0 flex-1">
              <span className="block font-sans text-[12px] tracking-[0.18em] text-muted uppercase">{kind(item)}</span>
              <span
                className={`mt-1.5 block font-serif leading-[1.25] text-ink underline-offset-4 group-hover:underline ${
                  summary ? "text-[24px]" : "text-[21px]"
                }`}
              >
                {item.title}
              </span>
              {summary && item.description ? (
                <span className="mt-2.5 block max-w-2xl font-sans text-[16px] leading-[1.7] text-ink/85">
                  {item.description}
                </span>
              ) : null}
            </span>
            <span aria-hidden="true" className="font-sans text-[18px] text-ink">
              →
            </span>
          </LocaleLink>
        </li>
      ))}
    </ul>
  );
}

/**
 * The article BEER wrote about the page's subject: its opening paragraphs, what else it
 * covers, and the link to the rest; further articles on the subject are listed beside it.
 * A page with no article of its own gets the list alone, each article with its summary.
 * The articles exist in German only, so the block is left out in English.
 */
export async function PageGuide({ hub, path }: Props) {
  const depth = depthOf({ hub, path });
  if (!depth || hub.locale === "en" || (!depth.guide && !depth.more?.length)) {
    return null;
  }

  const articles = await fetchArticles();
  const picked = [depth.guide, ...(depth.more ?? [])]
    .map((key) => findArticle(articles, key))
    .filter((item): item is Article => Boolean(item));
  const list = picked.filter((item, index) => picked.findIndex((other) => other.slug === item.slug) === index);
  const feature = list[0];
  if (!feature) {
    return null;
  }
  // Only the article named as the page's guide is quoted; the others are linked.
  const excerpt = depth.guide && findArticle(articles, depth.guide) === feature ? guideExcerpt(feature.body) : null;

  if (!excerpt) {
    return (
      <section className="border-t border-line bg-karte" aria-labelledby="page-guide">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-gutter lg:py-24">
          <div className="lg:col-span-4">
            <p className="type-eyebrow text-gold">Aus Ratgeber und Magazin</p>
            <h2 id="page-guide" data-rise="" className="t-section mt-3 text-ink">
              Zum Weiterlesen
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ArticleRows items={list} summary />
          </div>
        </div>
      </section>
    );
  }

  const rest = list.slice(1);
  const href = articleHref(feature);
  const image = feature.image && !NO_COVER.some((slug) => feature.slug.startsWith(slug)) ? feature.image : null;
  const heading = (
    <>
      <p className="type-eyebrow text-gold">{kind(feature, true)}</p>
      <h2 id="page-guide" data-rise="" className="t-section mt-3 text-ink">
        {feature.title}
      </h2>
    </>
  );

  return (
    <section className="border-t border-line bg-karte" aria-labelledby="page-guide">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-14 lg:px-gutter lg:py-24">
        {image ? (
          <LocaleLink href={href} tabIndex={-1} aria-hidden="true" className="block lg:col-span-5 lg:row-start-1">
            <Frame
              src={image}
              srcSet={feature.srcSet}
              alt=""
              className="aspect-[4/3] w-full"
              imgClassName={feature.portrait ? "object-top" : undefined}
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
          </LocaleLink>
        ) : (
          <div className="lg:col-span-5 lg:row-start-1">{heading}</div>
        )}

        <div className="max-w-2xl lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          {image ? heading : null}
          {excerpt.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? `font-sans text-[18px] leading-[1.6] text-ink ${image ? "mt-7" : ""}`
                  : "mt-6 font-sans text-[16px] leading-[1.7] text-ink/85"
              }
            >
              {paragraph}
            </p>
          ))}

          {excerpt.headings.length > 1 ? (
            <div className="mt-10">
              <p className="type-eyebrow text-muted">Im Beitrag</p>
              <ul className="mt-4 border-b border-line">
                {excerpt.headings.map((heading) => (
                  <li
                    key={heading}
                    className="border-t border-line py-3 font-sans text-[16px] leading-[1.5] text-ink/85"
                  >
                    {heading}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <LocaleLink href={href} className="btn-quiet mt-9 text-ink">
            Ganzen Beitrag lesen <span aria-hidden="true">→</span>
          </LocaleLink>
        </div>

        {rest.length > 0 ? (
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2">
            <p className="type-eyebrow text-muted">Mehr zum Thema</p>
            <div className="mt-4">
              <ArticleRows items={rest} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** The questions picked for the page, filled up from its FAQ theme. */
export function PageQuestions({
  hub,
  path,
  theme,
  limit = 6,
  narrow,
}: Props & {
  /** The FAQ theme used when the page's entry names none. */
  theme?: string;
  limit?: number;
  narrow?: boolean;
}) {
  const depth = depthOf({ hub, path });
  return (
    <Questions
      slugs={depth?.questions}
      theme={depth?.theme ?? theme}
      name={hub.depth?.name}
      title={hub.title}
      locale={hub.locale}
      limit={limit}
      narrow={narrow}
    />
  );
}
