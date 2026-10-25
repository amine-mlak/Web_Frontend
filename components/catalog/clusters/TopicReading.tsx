import LocaleLink from "@/components/LocaleLink";
import { stilePlaces } from "@/lib/stile-reading";
import { topicReading, type TopicReadingCopy } from "@/lib/topic-reading";
import type { Locale } from "@/lib/i18n";

function fromCms(cms?: { ueberschrift?: string; lesetext?: string; title?: string }) {
  const body = cms?.lesetext?.trim();
  if (!body) {
    return null;
  }
  const heading = cms?.ueberschrift?.trim() || cms?.title || "";
  return {
    title: heading,
    description: "",
    heading,
    paragraphs: body.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean),
  } satisfies TopicReadingCopy;
}

export default function TopicReading({
  slug,
  locale,
  copy: given,
  cms,
}: {
  slug?: string;
  locale: Locale;
  copy?: TopicReadingCopy | null;
  cms?: { ueberschrift?: string; lesetext?: string; title?: string };
}) {
  const copy = fromCms(cms) ?? given ?? (slug ? topicReading(slug, locale === "en" ? "en" : "de") : null);
  if (!copy) {
    return null;
  }
  const places = stilePlaces(locale === "en" ? "en" : "de");

  return (
    <section className="border-t border-line bg-paper" aria-labelledby={`reading-${slug ?? "seite"}`}>
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-24">
        <div className="lg:col-span-4">
          <p className="type-eyebrow text-gold">{places.eyebrow}</p>
          <h2
            id={`reading-${slug ?? "seite"}`}
            className="mt-4 font-serif text-[36px] leading-[1.05] font-medium tracking-[-0.03em] text-ink md:text-[44px]"
          >
            {copy.heading}
          </h2>
          <p className="mt-8 font-serif text-[22px] leading-snug text-ink">{places.title}</p>
          <p className="mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-muted">{places.text}</p>
          <p className="type-eyebrow mt-8 text-muted">{places.linksLabel}</p>
          <ul className="mt-3 space-y-2">
            {places.places.map(([label, href]) => (
              <li key={href}>
                <LocaleLink
                  href={href}
                  className="font-serif text-[20px] text-ink transition-opacity hover:opacity-60"
                >
                  {label}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-2xl space-y-6 lg:col-span-7 lg:col-start-6">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="font-sans text-[17px] leading-[1.7] text-ink/85">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
