import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { Locale } from "@/lib/i18n";

/**
 * The places BEER builds for, as they are written in running text. A place name in a reading
 * text becomes a link to its page, once per section, so the text carries the way to the place
 * pages without a list of links beside it.
 */
const PLACES: Record<"de" | "en", [name: string, slug: string][]> = {
  de: [
    ["München", "muenchen"],
    ["Freising", "freising"],
    ["Erding", "erding"],
    ["Dachau", "dachau"],
    ["Pfaffenhofen", "pfaffenhofen"],
    ["Augsburg", "augsburg"],
    ["Ingolstadt", "ingolstadt"],
    ["Landshut", "landshut"],
    ["Mainburg", "mainburg"],
    ["Regensburg", "regensburg"],
    ["Nürnberg", "nuernberg"],
  ],
  en: [
    ["Munich", "muenchen"],
    ["Freising", "freising"],
    ["Erding", "erding"],
    ["Dachau", "dachau"],
    ["Pfaffenhofen", "pfaffenhofen"],
    ["Augsburg", "augsburg"],
    ["Ingolstadt", "ingolstadt"],
    ["Landshut", "landshut"],
    ["Mainburg", "mainburg"],
    ["Regensburg", "regensburg"],
    ["Nuremberg", "nuernberg"],
  ],
};

function tableFor(locale: Locale) {
  return PLACES[locale === "en" ? "en" : "de"];
}

// A whole word, also in the genitive ("Münchens"), never inside another word ("Freisinger").
function pattern(locale: Locale) {
  const names = tableFor(locale).map(([name]) => name).join("|");
  return new RegExp(String.raw`(?<!\p{L})(${names})(?=s?(?!\p{L}))`, "gu");
}

/** True when the text names at least one of the places with a page. */
export function namesPlace(text: string, locale: Locale) {
  return pattern(locale).test(text);
}

/**
 * The text with each place linked the first time it appears. `seen` is shared by all
 * paragraphs of one section; `skip` is the page's own address, which is never linked.
 */
export function linkPlaces(text: string, locale: Locale, seen: Set<string>, skip?: string): ReactNode[] {
  const table = new Map(tableFor(locale));
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern(locale))) {
    const name = match[1];
    const href = `/regionen/${table.get(name)}`;
    if (href === skip || seen.has(href)) {
      continue;
    }
    seen.add(href);
    const start = match.index ?? 0;
    parts.push(text.slice(last, start));
    parts.push(
      <LocaleLink
        key={`${href}-${start}`}
        href={href}
        className="text-ink underline decoration-ink/25 underline-offset-[5px] transition-colors hover:decoration-ink"
      >
        {name}
      </LocaleLink>,
    );
    last = start + name.length;
  }
  parts.push(text.slice(last));
  return parts;
}
