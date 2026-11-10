import type { Locale } from "@/lib/i18n";
import type { TopicReadingCopy } from "@/lib/topic-reading";
import { APPLIANCES } from "./appliances";
import { BRANDS } from "./brands";
import { MATERIALS } from "./materials";
import { REGION_HUB, REGIONS } from "./regions";
import type { PageCopy, PageCopySet } from "./types";

export type PageWorld = "material" | "geraete" | "marken" | "regionen";

const WORLDS: Record<PageWorld, PageCopySet> = {
  material: MATERIALS,
  geraete: APPLIANCES,
  marken: BRANDS,
  regionen: REGIONS,
};

function toReading(copy: PageCopy): TopicReadingCopy {
  return {
    title: copy.heading,
    description: copy.description,
    heading: copy.heading,
    paragraphs: copy.paragraphs,
  };
}

/** The reading text written in code for one page, or null when there is none. */
export function pageReading(world: PageWorld, slug: string, locale: Locale): TopicReadingCopy | null {
  const entry = WORLDS[world][slug];
  if (!entry) return null;
  return toReading(locale === "en" ? entry.en : entry.de);
}

/** The short line under a region title and on its tile. */
export function regionLede(slug: string, locale: Locale): string {
  const entry = REGIONS[slug];
  if (!entry) return "";
  return (locale === "en" ? entry.en.lede : entry.de.lede) ?? "";
}

/** The reading text on the Regionen overview. */
export function regionHubReading(locale: Locale): TopicReadingCopy {
  return toReading(locale === "en" ? REGION_HUB.en : REGION_HUB.de);
}

const SEEDED_END = /(Aufmaß in München und im Umland\.|surveyed in Munich and nearby\.)\s*$/;

/** True when a CMS meta description is still the seeded placeholder sentence. */
export function isSeededDescription(text: string | undefined | null): boolean {
  return !text || SEEDED_END.test(text);
}

/** True when a CMS page title is empty or still the seeded "Name · Wolfersdorf". */
export function isSeededTitle(text: string | undefined | null): boolean {
  return !text?.trim() || /· Wolfersdorf\s*$/.test(text);
}

/** The search title written in code: the place with what BEER does there, or the heading of the page text. */
export function pageTitle(world: PageWorld, slug: string, locale: Locale, name: string): string | null {
  if (world === "regionen") {
    return locale === "en" ? `Made-to-measure kitchens in ${name}` : `Küchen nach Maß in ${name}`;
  }
  return pageReading(world, slug, locale)?.heading ?? null;
}
