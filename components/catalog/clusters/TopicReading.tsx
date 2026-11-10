import { linkPlaces, namesPlace } from "@/components/catalog/PlaceText";
import { isSeededReading } from "@/lib/entry-reading";
import type { Locale } from "@/lib/i18n";
import { topicPlaces } from "@/lib/topic-places";
import { topicReading, type TopicReadingCopy } from "@/lib/topic-reading";
import { cn } from "@/lib/utils";

function fromCms(cms?: { ueberschrift?: string; lesetext?: string; title?: string }) {
  const body = cms?.lesetext?.trim();
  if (!body || isSeededReading(body)) {
    return null;
  }
  const heading = cms?.ueberschrift?.trim() || cms?.title || "";
  return {
    title: heading,
    description: "",
    heading,
    paragraphs: body
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean),
  } satisfies TopicReadingCopy;
}

/**
 * The reading text of a page: the heading stays beside the text while it is read, the text
 * runs in one measured column. The CMS text comes first, then the text given by the page, then
 * the topic text in code. A line starting with "## " is a sub-heading. Place names link to
 * their pages, once each; a text that names no place gets the page's own paragraph on where
 * BEER builds.
 */
export default function TopicReading({
  slug,
  locale,
  copy: given,
  cms,
  self,
}: {
  slug?: string;
  locale: Locale;
  copy?: TopicReadingCopy | null;
  cms?: { ueberschrift?: string; lesetext?: string; title?: string };
  /** The page's own address, so a place page does not link to itself. */
  self?: string;
}) {
  const copy = fromCms(cms) ?? given ?? (slug ? topicReading(slug, locale === "en" ? "en" : "de") : null);
  if (!copy) {
    return null;
  }
  const where = slug ? topicPlaces(slug, locale) : null;
  const paragraphs =
    where && !copy.paragraphs.some((paragraph) => namesPlace(paragraph, locale))
      ? [...copy.paragraphs, where]
      : copy.paragraphs;
  const id = `reading-${slug ?? "seite"}`;
  const seen = new Set<string>();
  const first = paragraphs.findIndex((paragraph) => !paragraph.startsWith("## "));

  return (
    <section className="border-t border-line bg-paper" aria-labelledby={id}>
      <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-24">
        <div className="lg:col-span-4">
          <h2 id={id} data-rise="" className="t-section text-ink lg:sticky lg:top-32">
            {copy.heading}
          </h2>
        </div>
        <div className="max-w-2xl lg:col-span-7 lg:col-start-6">
          {paragraphs.map((paragraph, index) =>
            paragraph.startsWith("## ") ? (
              <h3 key={index} className="t-item mt-10 text-ink">
                {paragraph.slice(3)}
              </h3>
            ) : index === first ? (
              <p key={index} className="font-sans text-[19px] leading-[1.6] text-ink">
                {linkPlaces(paragraph, locale, seen, self)}
              </p>
            ) : (
              <p
                key={index}
                className={cn(
                  "font-sans text-[17px] leading-[1.7] text-ink/85",
                  paragraphs[index - 1]?.startsWith("## ") ? "mt-3" : "mt-6",
                )}
              >
                {linkPlaces(paragraph, locale, seen, self)}
              </p>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
