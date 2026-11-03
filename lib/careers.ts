import type { Locale } from "@/lib/i18n";

/**
 * Job ads live in the CMS collection "Stellen": a published entry is an open position at
 * /karriere/<slug>, and unpublishing it ends the ad. While no entry is published, the older
 * ads in the "punkte" list of the Karriere page still show (jobsFrom), so the page never
 * loses its jobs during the move.
 */
export type Job = {
  slug: string;
  title: string;
  teaser: string;
  body: string;
  kind: JobKind;
  postedAt?: string;
};

export type JobKind = "ausbildung" | "praktikum" | "teilzeit" | "vollzeit";

const KIND_LABEL: Record<Locale, Record<JobKind, string>> = {
  de: { ausbildung: "Ausbildung", praktikum: "Praktikum", teilzeit: "Teilzeit", vollzeit: "Vollzeit" },
  en: { ausbildung: "Apprenticeship", praktikum: "Internship", teilzeit: "Part-time", vollzeit: "Full-time" },
};

/** schema.org employmentType (Google job search). */
const EMPLOYMENT_TYPE: Record<JobKind, string> = {
  ausbildung: "FULL_TIME",
  praktikum: "INTERN",
  teilzeit: "PART_TIME",
  vollzeit: "FULL_TIME",
};

export function jobKindLabel(kind: JobKind, locale: Locale) {
  return KIND_LABEL[locale][kind];
}

export function employmentType(kind: JobKind) {
  return EMPLOYMENT_TYPE[kind];
}

function kindOf(title: string, text: string): JobKind {
  const words = `${title} ${text.slice(0, 300)}`.toLowerCase();
  if (/ausbildung|azubi|apprentice/.test(title.toLowerCase())) return "ausbildung";
  if (/praktikum|intern/.test(title.toLowerCase())) return "praktikum";
  if (/teilzeit|minijob|part-time/.test(words)) return "teilzeit";
  return "vollzeit";
}

export function jobSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\((?:m|w|d|f)(?:\/(?:m|w|d|f))*\)/g, " ")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The first paragraph before any heading, as plain text. */
function teaserOf(text: string) {
  const first = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("- ") && !block.startsWith(">"));
  return (first ?? "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Strips the teaser paragraph from the ad, so the job page does not say it twice. */
function bodyOf(text: string, teaser: string) {
  const blocks = text.split(/\n\s*\n/);
  const index = blocks.findIndex((block) => teaserOf(block) === teaser && teaser);
  return (index === 0 ? blocks.slice(1) : blocks).join("\n\n").trim();
}

/** One entry of the CMS collection "Stellen". */
export function jobFromEntry(entry: {
  title?: string;
  slug?: string;
  art?: string;
  teaser?: string;
  text?: string;
  createdAt?: string;
}): Job | null {
  const title = entry.title?.trim();
  const text = entry.text?.trim() ?? "";
  const slug = entry.slug?.trim() || (title ? jobSlug(title) : "");
  if (!title || !slug) return null;
  const teaser = entry.teaser?.trim() || teaserOf(text);
  const kind = Object.keys(EMPLOYMENT_TYPE).includes(entry.art ?? "") ? (entry.art as JobKind) : kindOf(title, text);
  return { slug, title, teaser, body: bodyOf(text, teaser), kind, postedAt: entry.createdAt };
}

export function jobsFrom(points: { titel: string; text: string }[] | undefined): Job[] {
  const seen = new Set<string>();
  const jobs: Job[] = [];
  for (const point of points ?? []) {
    const title = point.titel?.trim();
    const text = point.text?.trim() ?? "";
    const slug = title ? jobSlug(title) : "";
    if (!title || !slug || seen.has(slug)) continue;
    seen.add(slug);
    const teaser = teaserOf(text);
    jobs.push({ slug, title, teaser, body: bodyOf(text, teaser), kind: kindOf(title, text) });
  }
  return jobs;
}
