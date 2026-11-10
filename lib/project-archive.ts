import type { KitchenClusterSlug, Project } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";

export type ArchiveHouse = {
  href: string;
  title: string;
  image: string;
  srcSet?: string;
  /** The place when it is a real one, then what the kitchen is, in two or three words. */
  meta: string;
  /** Slugs of the themes the kitchen shows; the filters match on them. */
  tags: string[];
  /** Already shown large above the archive. */
  lead: boolean;
};

export type ArchiveFilter = { slug: string; label: string; count: number };
export type ArchiveGroup = { label: string; filters: ArchiveFilter[] };

/** The filter rows, in reading order. Islands are a question of layout, so they sit with the forms. */
const GROUPS: { clusters: KitchenClusterSlug[]; de: string; en: string }[] = [
  { clusters: ["stile"], de: "Stil", en: "Style" },
  { clusters: ["farben"], de: "Farbe", en: "Colour" },
  { clusters: ["formen", "inseln"], de: "Form", en: "Layout" },
  { clusters: ["besondere"], de: "Detail", en: "Detail" },
];

/** One or two words per theme: "Landhaus" reads better in a row of filters than "Landhausküchen". */
const SHORT: Record<string, { de: string; en: string }> = {
  landhaus: { de: "Landhaus", en: "Country" },
  holz: { de: "Holz", en: "Wood" },
  modern: { de: "Modern", en: "Modern" },
  design: { de: "Design", en: "Design" },
  purist: { de: "Puristisch", en: "Purist" },
  weiss: { de: "Weiß", en: "White" },
  schwarz: { de: "Schwarz", en: "Black" },
  grau: { de: "Grau", en: "Grey" },
  salbei: { de: "Salbei", en: "Sage" },
  "u-form": { de: "U-Form", en: "U-shape" },
  "l-form": { de: "L-Form", en: "L-shape" },
  zeile: { de: "Zeile", en: "Single line" },
  kochinsel: { de: "Kochinsel", en: "Cooking island" },
  essinsel: { de: "Insel mit Sitzplatz", en: "Island with seating" },
  arbeitsinsel: { de: "Arbeitsinsel", en: "Work island" },
  grifflos: { de: "Grifflos", en: "Handleless" },
  raumhoch: { de: "Raumhoch", en: "Floor to ceiling" },
  outdoor: { de: "Outdoor", en: "Outdoor" },
};

/** Every BEER kitchen is made to measure, so the theme tells nothing apart. */
const SKIP = new Set(["nach-mass"]);
/** A filter with one or two kitchens behind it is not worth a place in the row. */
const MIN_HOUSES = 3;
/** "Raum München" stands on most projects and names no place. */
const NO_PLACE = /^(Raum\s|Munich area|Greater Munich)/i;

const CLUSTER_ORDER: KitchenClusterSlug[] = ["stile", "farben", "formen", "inseln", "besondere"];

/** The houses of the archive and the filters that lead through them. */
export function projectArchive(projects: Project[], locale: Locale, leadCount: number) {
  const lang = locale === "en" ? "en" : "de";
  const label = (slug: string, name: string) => SHORT[slug]?.[lang] ?? name;

  const houses: ArchiveHouse[] = projects
    .filter((project) => project.image)
    .map((project, index) => {
      const topics = project.topics
        .filter((topic) => !SKIP.has(topic.slug))
        .sort((a, b) => CLUSTER_ORDER.indexOf(a.cluster) - CLUSTER_ORDER.indexOf(b.cluster));
      const place = project.place && !NO_PLACE.test(project.place) ? project.place : "";
      const words = topics.map((topic) => label(topic.slug, topic.name)).slice(0, place ? 2 : 3);
      return {
        href: `/projekte/${project.slug}`,
        title: project.title,
        image: project.image,
        srcSet: project.srcSet,
        meta: [place, ...words].filter(Boolean).join(" · "),
        tags: topics.map((topic) => topic.slug),
        lead: index < leadCount,
      };
    });

  const counts = new Map<string, number>();
  for (const house of houses) {
    for (const tag of house.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const named = new Map(projects.flatMap((project) => project.topics).map((topic) => [topic.slug, topic]));

  const groups: ArchiveGroup[] = GROUPS.map((group) => ({
    label: group[lang],
    filters: [...named.values()]
      .filter((topic) => group.clusters.includes(topic.cluster) && (counts.get(topic.slug) ?? 0) >= MIN_HOUSES)
      .map((topic) => ({ slug: topic.slug, label: label(topic.slug, topic.name), count: counts.get(topic.slug)! }))
      .sort((a, b) => b.count - a.count),
  })).filter((group) => group.filters.length > 0);

  return { houses, groups };
}
