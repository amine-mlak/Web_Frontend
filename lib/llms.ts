import { articleHref, isPressArticle, KITCHEN_CLUSTERS, type Article, type SitePage } from "@/lib/catalog";
import { fetchCatalog, fetchOpenJobs } from "@/lib/catalog-api";
import type { CmsSeo } from "@/lib/cms-seo";
import { GERAETE_KIND_ROUTES, MATERIAL_KIND_ROUTES } from "@/lib/collection-entries";
import { absoluteUrl } from "@/lib/seo";
import { getSiteSettings, type OpeningHours, type SiteSettings } from "@/lib/site-settings";
import { fetchFaqHub } from "@/lib/strapi";

/**
 * /llms.txt and /llms-full.txt (https://llmstxt.org): a map of the site for AI assistants, built from
 * the same CMS data as the pages and the sitemap, so it stays current without a hand-kept file.
 * German only: the English pages are not meant for search (see pageMetadata).
 */

/** Facts stated on /ueber, /ausstellung and the start page; kept here so every answer uses the same words. */
const PROFILE = [
  "Seit 1981 in Wolfersdorf bei Freising (Landkreis Freising, Bayern), nördlich von München.",
  "Küchen und Möbel nach Maß: Beratung, Planung, Fertigung in zwei eigenen Werken und Montage durch das eigene Team, alles aus einer Hand.",
  "Jede Küche wird für ihren Raum geplant und als Einzelstück in der eigenen Werkstatt gefertigt, keine Serienküche aus dem Katalog.",
  "Ausstellung in Werk 2 in Wolfersdorf mit ganzen Küchen, Mustern zum Anfassen und Blick in die Fertigung; für eine Beratung am besten mit Termin.",
  "Einzugsgebiet: München und Umland, Montage bis etwa 200 Kilometer um Wolfersdorf.",
];

const HUB_LINES: [path: string, name: string, fallback: string][] = [
  ["/kuechen", "Küchen", "Küchen nach Form, Stil, Farbe, mit Insel und besondere Lösungen wie Edelstahl"],
  ["/projekte", "Projekte", "Gebaute Küchen mit Ort, Jahr, Fotos, Materialien und Geräten"],
  ["/material", "Material", "Fronten, Arbeitsplatten, Innenleben und Spülen"],
  ["/geraete", "Geräte", "Einbaugeräte zum Kochen, Backen, Kühlen und Spülen"],
  ["/marken", "Marken", "Gerätemarken, die BEER in Küchen einplant"],
  ["/moebel", "Möbel", "Möbel nach Maß aus derselben Werkstatt"],
  ["/regionen", "Regionen", "Orte im Einzugsgebiet mit gebauten Küchen"],
  ["/ratgeber", "Ratgeber", "Artikel zu Planung, Kosten, Geräten und Material"],
  ["/faq", "Häufige Fragen", "Antworten nach Themen"],
  ["/ausstellung", "Ausstellung", "Ausstellung in Wolfersdorf, Öffnungszeiten und Anfahrt"],
  ["/beratung", "Küche planen", "Küchenplaner: Wünsche angeben und eine Planung anfragen"],
  ["/kontakt", "Kontakt und Termin", "Termin buchen, Telefon, E-Mail, Adresse, Öffnungszeiten"],
];

const ABOUT_LINES: [path: string, name: string, fallback: string][] = [
  ["/ueber", "Über BEER", "Geschichte, Manufaktur und Arbeitsweise"],
  ["/team", "Team", "Die Menschen, die beraten, planen, fertigen und montieren"],
  ["/nachhaltigkeit", "Nachhaltigkeit", "Material, Langlebigkeit und Fertigung vor Ort"],
  ["/karriere", "Karriere", "Offene Stellen in Werkstatt, Montage und Planung"],
  ["/presse", "Presse und Aktuelles", "Meldungen, Termine und Berichte"],
];

const DAY_NAMES: Record<string, string> = {
  Monday: "Mo",
  Tuesday: "Di",
  Wednesday: "Mi",
  Thursday: "Do",
  Friday: "Fr",
  Saturday: "Sa",
  Sunday: "So",
};

/** Plain text from CMS rich text or Markdown: no tags, links or emphasis marks, one line. */
export function plain(text?: string) {
  return (text ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_`>]+/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Whole sentences up to about `max` characters. */
function short(text: string | undefined, max = 220) {
  const clean = plain(text);
  if (clean.length <= max) return clean;
  let kept = "";
  for (const sentence of clean.split(/(?<=[.!?])\s+/)) {
    const next = kept ? `${kept} ${sentence}` : sentence;
    if (next.length > max) break;
    kept = next;
  }
  return kept || `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

type Described = { seo?: CmsSeo; seoDescription?: string; intro?: string; description?: string };

function describe(item: Described) {
  return short(item.seo?.description || item.seoDescription || item.description || item.intro);
}

/** Pages Google should not list (noindex, or a copy of another address) stay out here too. */
function listed(path: string, seo?: CmsSeo) {
  return !seo?.noindex && (!seo?.canonicalPath || seo.canonicalPath === path);
}

function link(name: string, path: string, note?: string) {
  return `- [${name}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;
}

export function openingHoursText(rows: OpeningHours[]) {
  return rows
    .map((row) => {
      const days = row.days.map((day) => DAY_NAMES[day] ?? day);
      const span = days.length > 2 ? `${days[0]}–${days[days.length - 1]}` : days.join(", ");
      return `${span} ${row.opens}–${row.closes} Uhr`;
    })
    .join(", ");
}

function contactLines(settings: SiteSettings, regions: string[]) {
  return [
    `- Firma: ${settings.legalName} (${settings.siteName})`,
    `- Adresse: ${settings.street}, ${settings.postalCode} ${settings.city}, ${settings.region}, Deutschland`,
    `- Telefon: ${settings.phone}`,
    `- E-Mail: ${settings.email}`,
    `- Öffnungszeiten Ausstellung: ${openingHoursText(settings.openingHours)}; Beratung am besten mit Termin`,
    `- Termin: ${absoluteUrl("/kontakt")}#termin (kostenlos und unverbindlich)`,
    ...(regions.length ? [`- Einzugsgebiet, Orte mit eigener Seite: ${regions.join(", ")}`] : []),
    ...settings.sameAs.map((href) => `- Profil: ${href}`),
  ];
}

function hubLines(pages: SitePage[], rows: [string, string, string][]) {
  return rows.map(([path, name, fallback]) => {
    const page = pages.find((item) => `/${item.slug}` === path);
    return link(name, path, (page && describe(page)) || fallback);
  });
}

async function loadSite() {
  const [catalog, faq, settings] = await Promise.all([fetchCatalog(), fetchFaqHub(), getSiteSettings()]);
  const jobs = await fetchOpenJobs(catalog.pages.find((page) => page.slug === "karriere"));
  return { catalog, faq, settings, jobs };
}

type Site = Awaited<ReturnType<typeof loadSite>>;

function header({ settings }: Site) {
  const summary =
    settings.llmsIntro ||
    `${settings.siteName}: Küchen und Möbel nach Maß, geplant und gefertigt in der eigenen Manufaktur in Wolfersdorf bei Freising, montiert im Raum München.`;
  return [`# ${settings.siteName}`, "", `> ${summary}`, "", "Kurzprofil:", "", ...PROFILE.map((line) => `- ${line}`)];
}

function guideSections(articles: Article[]) {
  const byCategory = new Map<string, Article[]>();
  for (const article of articles) {
    if (isPressArticle(article) || !listed(articleHref(article), article.seo)) continue;
    const name = article.category?.name || "Ratgeber";
    byCategory.set(name, [...(byCategory.get(name) ?? []), article]);
  }
  return [...byCategory].flatMap(([name, items]) => [
    "",
    `## Ratgeber: ${name}`,
    "",
    ...items.map((article) => link(article.title, articleHref(article), describe(article))),
  ]);
}

function sections(site: Site) {
  const { catalog, faq, jobs } = site;
  const out: string[] = [];
  const section = (title: string, lines: string[]) => {
    if (lines.length) out.push("", `## ${title}`, "", ...lines);
  };

  section("Wichtigste Seiten", [link("Startseite", "/", "Überblick über Küchen, Projekte und den Ablauf"), ...hubLines(catalog.pages, HUB_LINES)]);

  for (const cluster of KITCHEN_CLUSTERS) {
    const topics = catalog.topics
      .filter((topic) => topic.cluster === cluster.slug)
      .sort((left, right) => left.order - right.order)
      .filter((topic) => listed(`/kuechen/${cluster.slug}/${topic.slug}`, topic.seo));
    section(cluster.name, [
      link(`Alle ${cluster.name}`, `/kuechen/${cluster.slug}`, short(cluster.seoDescription || cluster.intro)),
      ...topics.map((topic) => link(topic.name, `/kuechen/${cluster.slug}/${topic.slug}`, describe(topic))),
    ]);
  }

  const kindPage = (slug: string) => catalog.pages.find((page) => page.slug === slug);
  section("Material", [
    ...MATERIAL_KIND_ROUTES.map((route) => {
      const page = kindPage(route.slug);
      return link(page?.title || route.slug, route.href, page ? describe(page) : undefined);
    }),
    ...catalog.materials.filter((item) => listed(`/material/${item.slug}`, item.seo)).map((item) => link(item.name, `/material/${item.slug}`, describe(item))),
  ]);
  section("Geräte", [
    ...GERAETE_KIND_ROUTES.map((route) => {
      const page = kindPage(route.slug);
      return link(page?.title || route.slug, route.href, page ? describe(page) : undefined);
    }),
    ...catalog.appliances.filter((item) => listed(`/geraete/${item.slug}`, item.seo)).map((item) => link(item.name, `/geraete/${item.slug}`, describe(item))),
  ]);
  section("Marken", catalog.brands.filter((item) => listed(`/marken/${item.slug}`, item.seo)).map((item) => link(item.name, `/marken/${item.slug}`, describe(item))));
  section("Möbel nach Maß", catalog.furniture.filter((item) => listed(`/moebel/${item.slug}`, item.seo)).map((item) => link(item.name, `/moebel/${item.slug}`, describe(item))));
  section(
    "Projekte: gebaute Küchen",
    catalog.projects
      .filter((item) => listed(`/projekte/${item.slug}`, item.seo))
      .map((item) => link(item.title, `/projekte/${item.slug}`, [[item.place, item.year].filter(Boolean).join(", "), describe(item)].filter(Boolean).join(". "))),
  );
  section("Regionen", catalog.regions.filter((item) => listed(`/regionen/${item.slug}`, item.seo)).map((item) => link(item.name, `/regionen/${item.slug}`, describe(item))));
  out.push(...guideSections(catalog.articles));
  section(
    "Häufige Fragen nach Thema",
    faq.themes.filter((theme) => listed(`/faq/${theme.slug}`, theme.seo)).map((theme) => link(theme.name, `/faq/${theme.slug}`, short(theme.seo?.description || theme.seoDescription || theme.description))),
  );
  section("Über BEER", [
    ...hubLines(catalog.pages, ABOUT_LINES),
    ...jobs.map((job) => link(`Stelle: ${job.title}`, `/karriere/${job.slug}`, short(job.seo?.description || job.teaser))),
  ]);
  return out;
}

function optional({ catalog }: Site) {
  const press = catalog.articles
    .filter((article) => isPressArticle(article) && listed(articleHref(article), article.seo))
    .sort((left, right) => (right.publishedAt ?? "").localeCompare(left.publishedAt ?? ""));
  const legal = ["impressum", "datenschutz", "agb"]
    .map((slug) => catalog.pages.find((page) => page.slug === slug))
    .filter((page): page is SitePage => Boolean(page))
    .map((page) => link(page.title, `/${page.slug}`));
  return [
    "",
    "## Optional",
    "",
    link("Alle Fragen mit Antworten als Text", "/llms-full.txt", "für ausführliche Antworten"),
    ...press.map((article) => link(article.title, articleHref(article), describe(article))),
    ...legal,
  ];
}

export async function llmsText() {
  const site = await loadSite();
  const regions = site.catalog.regions.map((region) => region.name);
  return [
    ...header(site),
    "",
    "## Kontakt",
    "",
    ...contactLines(site.settings, regions),
    ...sections(site),
    ...optional(site),
    "",
  ].join("\n");
}

/** The long version: the same map plus every FAQ answer in full, grouped by theme, ready to quote. */
export async function llmsFullText() {
  const site = await loadSite();
  const { faq, settings, catalog } = site;
  const regions = catalog.regions.map((region) => region.name);
  const out = [...header(site), "", "## Kontakt", "", ...contactLines(settings, regions)];

  const seen = new Set<string>();
  for (const theme of faq.themes) {
    const items = faq.items.filter((item) => item.themes.some((entry) => entry.slug === theme.slug) && !seen.has(item.slug));
    if (!items.length) continue;
    out.push("", `## Fragen: ${theme.name}`, "", `Quelle: ${absoluteUrl(`/faq/${theme.slug}`)}`);
    for (const item of items) {
      seen.add(item.slug);
      out.push("", `### ${plain(item.question)}`, "", plain(item.answer));
    }
  }
  const rest = faq.items.filter((item) => !seen.has(item.slug));
  if (rest.length) {
    out.push("", "## Weitere Fragen", "", `Quelle: ${absoluteUrl("/faq")}`);
    for (const item of rest) out.push("", `### ${plain(item.question)}`, "", plain(item.answer));
  }

  out.push(...sections(site), ...optional(site).filter((line) => !line.includes("/llms-full.txt")), "");
  return out.join("\n");
}

export const LLMS_HEADERS = {
  "content-type": "text/markdown; charset=utf-8",
  "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
};
