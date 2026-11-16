/**
 * Moves every Referenzküche into its page blocks (kopf, eckdaten, einleitung, abschnitte, weitereFotos,
 * aehnlicheHaeuser, schluss), keeping exactly the placement the page shows today
 * (legacyProjectBlocks). German only; the old fields stay untouched.
 *
 *   npx tsx scripts/migrate-project-blocks.ts            dry run: report only
 *   npx tsx scripts/migrate-project-blocks.ts --apply    write (published projects stay published)
 *   npx tsx scripts/migrate-project-blocks.ts --verify   read back and compare with the plan
 *
 * Needs STRAPI_API_TOKEN (full access) in .env.local.
 */
import fs from "node:fs";
import type { Project, ProjectFrame } from "@/lib/catalog";
import { enrichProjectBody } from "@/lib/project-photos";
import { legacyProjectBlocks, similarProjects, type ProjectSection } from "@/lib/project-blocks";

const MODE = process.argv[2] ?? "--dry";
const CMS = "https://cms.beer.de";
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => /^\w+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^["']|["']$/g, "")]),
);
const H = { Authorization: `Bearer ${env.STRAPI_API_TOKEN}`, "Content-Type": "application/json" };

/** Old Eckdaten labels → the fixed list. "Ort" rows go: the place stands under the title. */
const LABELS: Record<string, string | null> = {
  Form: "Form", Stil: "Stil", Stilwelt: "Stil", Fronten: "Fronten", Front: "Fronten", Holz: "Fronten",
  Arbeitsplatte: "Arbeitsplatte", Platte: "Arbeitsplatte", Rückwand: "Rückwand", Wand: "Rückwand",
  Spüle: "Spüle", Armatur: "Spüle", Kochen: "Kochen", Kochtafel: "Kochen", Geräte: "Geräte", Grill: "Geräte",
  Insel: "Insel", Theke: "Theke", Nische: "Nische", Nischen: "Nische", Innen: "Innen", Vorrat: "Innen",
  Ecken: "Innen", Griffe: "Griffe", Licht: "Licht", "Nach Maß": "Nach Maß", Außerdem: "Außerdem",
  Regale: "Außerdem", Eiche: "Außerdem", Breite: "Außerdem", Besonderes: "Außerdem", Ausstattung: "Außerdem",
  Einsatz: "Außerdem", Ort: null,
};

type Media = { id: number; url: string; width?: number; height?: number; alternativeText?: string | null; caption?: string | null };
type Row = Record<string, any>;

async function list(status: "draft" | "published"): Promise<Row[]> {
  const q = [
    // The website's order (newest first): ties among similar houses keep it.
    "locale=de", `status=${status}`, "pagination[pageSize]=100", "sort[0]=year:desc", "sort[1]=id:asc",
    "populate[image]=true", "populate[gallery]=true", "populate[specs]=true",
    "populate[topics][fields][0]=slug", "populate[materials][fields][0]=slug",
    "populate[brands][fields][0]=slug", "populate[regions][fields][0]=slug",
    // The new fields exist once the CMS schema is deployed (needed to skip projects already moved).
    ...(MODE === "--dry" ? [] : ["populate[kopf][populate]=*"]),
  ].join("&");
  let rows: Row[] = [];
  for (let page = 1; page < 10; page++) {
    const r = await fetch(`${CMS}/api/projects?${q}&pagination[page]=${page}`, { headers: H });
    if (!r.ok) throw new Error(`${status} page ${page}: ${r.status} ${(await r.text()).slice(0, 200)}`);
    const d = await r.json();
    rows = rows.concat(d.data);
    if (page >= d.meta.pagination.pageCount) break;
  }
  return rows;
}

const mediaByUrl = new Map<string, number>();
const frame = (m: Media | null | undefined): ProjectFrame | undefined => {
  if (!m?.url) return undefined;
  mediaByUrl.set(m.url, m.id);
  const portrait = Boolean(m.width && m.height && m.height > m.width);
  return { src: m.url, alt: (m.alternativeText || m.caption || "").trim(), ...(portrait ? { portrait } : {}) };
};

function toProject(row: Row): Project {
  const body = enrichProjectBody(row.slug, (row.lesetext || row.body || "").trim());
  return {
    slug: row.slug,
    title: row.title,
    place: row.place ?? "",
    year: row.year ?? "",
    intro: (row.intro || "").trim(),
    body,
    image: frame(row.image)?.src ?? "",
    gallery: (row.gallery ?? []).map(frame).filter(Boolean) as ProjectFrame[],
    topics: (row.topics ?? []).map((t: Row) => ({ slug: t.slug })) as Project["topics"],
    materials: (row.materials ?? []).map((t: Row) => ({ slug: t.slug })) as Project["materials"],
    brands: (row.brands ?? []).map((t: Row) => ({ slug: t.slug })) as Project["brands"],
    regions: (row.regions ?? []).map((t: Row) => ({ slug: t.slug })) as Project["regions"],
    appliances: [],
    specs: (row.specs ?? []).map((s: Row) => ({ label: (s.label || "").trim(), value: (s.value || "").trim() })),
  };
}

const id = (photo?: ProjectFrame) => (photo ? mediaByUrl.get(photo.src) ?? null : null);

function section(kind: "einleitung" | "text", item: ProjectSection) {
  const two = Boolean(item.photo2);
  const component = kind === "einleitung"
    ? (two ? "projekt.einleitung-zwei-fotos" : "projekt.einleitung-ein-foto")
    : (two ? "projekt.text-zwei-fotos" : "projekt.text-ein-foto");
  return {
    __component: component,
    ...(kind === "text" ? { zwischenueberschrift: item.heading ?? null } : {}),
    text: item.text,
    foto: id(item.photo),
    ...(two ? { zweitesFoto: id(item.photo2) } : {}),
  };
}

async function main() {
const drafts = await list("draft");
const published = await list("published");
const live = new Set(published.map((r) => r.documentId));
const docBySlug = new Map(drafts.map((r) => [r.slug, r.documentId]));
// The site shows published projects; similar houses are chosen among them, as on the page.
const liveProjects = published.map(toProject);

const plan: { slug: string; documentId: string; live: boolean; data: Row; notes: string[] }[] = [];
const skipped: string[] = [];
for (const row of drafts) {
  const project = toProject(row);
  if (row.kopf?.titelfoto && MODE === "--apply") {
    skipped.push(`${row.slug} (already has blocks)`);
    continue;
  }
  if (!project.image || project.gallery.length === 0) {
    skipped.push(`${row.slug} (no photos)`);
    continue;
  }
  const pool = live.has(row.documentId) ? liveProjects : [...liveProjects, project];
  const blocks = legacyProjectBlocks(project, similarProjects(project, pool).map((p) => p.slug), "de");
  const notes: string[] = [];
  // A paragraph that found no photo (too few photos) joins the text of the last section.
  if (blocks.textOnly.length) {
    const last = blocks.sections.at(-1) ?? blocks.intro;
    if (last) last.text = [last.text, ...blocks.textOnly.map((item) => item.text)].join(String.fromCharCode(10).repeat(2));
    notes.push(`${blocks.textOnly.length} text(s) joined to the last section`);
  }
  if (!blocks.hero.detailLeft) notes.push("no Dreierbild");
  if (!blocks.intro) notes.push("no intro");
  // Facts: the fixed labels; two rows with one label become one row.
  const facts: { bezeichnung: string; wert: string }[] = [];
  for (const fact of blocks.facts) {
    const label = LABELS[fact.label];
    if (label === undefined) notes.push(`unknown label ${fact.label}`);
    if (!label) continue;
    const same = facts.find((f) => f.bezeichnung === label);
    if (same) same.wert = `${same.wert}; ${fact.value}`;
    else facts.push({ bezeichnung: label, wert: fact.value });
  }
  for (const f of facts) if (f.wert.length > 80) notes.push(`fact too long: ${f.bezeichnung}`);
  const data = {
    kopf: { titelfoto: id(blocks.hero.photo), detailfotoLinks: id(blocks.hero.detailLeft), detailfotoRechts: id(blocks.hero.detailRight) },
    eckdaten: facts,
    einleitung: blocks.intro ? [section("einleitung", blocks.intro)] : [],
    abschnitte: blocks.sections.map((item) => section("text", item)),
    weitereFotos: blocks.morePhotos.map((p) => id(p)),
    aehnlicheHaeuser: blocks.similar.map((slug) => ({ haus: { connect: [{ documentId: docBySlug.get(slug) }] } })),
    schluss: {
      titel: blocks.close.title,
      text: blocks.close.text,
      foto: id(blocks.close.photo),
      buttonText: blocks.close.buttonText,
      buttonZiel: blocks.close.buttonHref,
    },
  };
  const missing = JSON.stringify(data).includes(":null") && [data.kopf.titelfoto, ...data.einleitung.map((e) => e.foto), ...data.abschnitte.map((a) => a.foto), ...data.weitereFotos].some((v) => v === null);
  if (missing) notes.push("PHOTO WITHOUT MEDIA ID");
  plan.push({ slug: row.slug, documentId: row.documentId, live: live.has(row.documentId), data, notes });
}

const count = (f: (p: (typeof plan)[number]) => boolean) => plan.filter(f).length;
console.log(`projects ${drafts.length}, to migrate ${plan.length} (${count((p) => p.live)} live), skipped ${skipped.length}: ${skipped.join(", ")}`);
console.log(`without Dreierbild ${count((p) => p.notes.includes("no Dreierbild"))}, sections ${JSON.stringify(Object.fromEntries([1, 2, 3, 4].map((n) => [n, count((p) => p.data.abschnitte.length === n)])))}`);
console.log(`facts per project ${JSON.stringify(Object.fromEntries([2, 3, 4, 5, 6, 7].map((n) => [n, count((p) => p.data.eckdaten.length === n)])))}, more photos min ${Math.min(...plan.map((p) => p.data.weitereFotos.length))}`);
const other = plan.flatMap((p) => p.notes.filter((n) => n !== "no Dreierbild").map((n) => `${p.slug}: ${n}`));
console.log("other notes:", other.length ? other.join("\n  ") : "none");
fs.writeFileSync("D:/Beer/tmp/project-blocks-plan.json", JSON.stringify(plan, null, 1));

if (MODE === "--similar") {
  // Rewrites only "Ähnliche Häuser" (e.g. after a change in how they are chosen).
  let ok = 0;
  for (const p of plan) {
    const r = await fetch(`${CMS}/api/projects/${p.documentId}?locale=de&status=${p.live ? "published" : "draft"}`, {
      method: "PUT", headers: H, body: JSON.stringify({ data: { aehnlicheHaeuser: p.data.aehnlicheHaeuser } }),
    });
    if (!r.ok) console.log("FAILED", p.slug, r.status, (await r.text()).slice(0, 300));
    else ok++;
  }
  console.log("similar houses rewritten", ok, "of", plan.length);
}

if (MODE === "--apply") {
  let ok = 0;
  for (const p of plan) {
    if (p.notes.some((n) => n.startsWith("PHOTO WITHOUT") || n.startsWith("unknown"))) {
      console.log("SKIP", p.slug, p.notes.join("; "));
      continue;
    }
    const r = await fetch(`${CMS}/api/projects/${p.documentId}?locale=de&status=${p.live ? "published" : "draft"}`, {
      method: "PUT", headers: H, body: JSON.stringify({ data: p.data }),
    });
    if (!r.ok) console.log("FAILED", p.slug, r.status, (await r.text()).slice(0, 300));
    else ok++;
  }
  console.log("written", ok, "of", plan.length);
}
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
