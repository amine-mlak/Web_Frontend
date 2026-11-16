/* eslint-disable @typescript-eslint/no-explicit-any -- one-off migration over raw CMS JSON */
/**
 * Moves the Küchen pages (old collection "Küchenthemen") into the five new collections with their
 * page blocks, keeping exactly what each page shows today: the texts, every photo, the kitchens,
 * the articles and the questions. The old collection stays untouched.
 *
 *   npx tsx scripts/migrate-kuechen-blocks.ts            dry run: writes the plan, reports gaps
 *   npx tsx scripts/migrate-kuechen-blocks.ts --apply    creates the pages (published) and links them
 *
 * Needs STRAPI_API_TOKEN (full access) in .env.local.
 */
import fs from "node:fs";
import { KITCHEN_CLUSTERS, topicsInCluster, type KitchenClusterSlug } from "@/lib/catalog";
import { fetchArticles, fetchKitchenTopics, fetchProjects } from "@/lib/catalog-api";
import { presentTopic, type PresentedTopic } from "@/lib/collection-topics";
import { pageDepth } from "@/lib/page-depth";
import { findArticle } from "@/lib/guide-excerpt";
import { filterFaqItems } from "@/lib/faq";
import { fetchFaqHub } from "@/lib/strapi";
import { readingCopy } from "@/components/catalog/clusters/TopicReading";
import { platesFor } from "@/components/catalog/clusters/StileTopics";

const MODE = process.argv[2] ?? "--dry";
const CMS = "https://cms.beer.de";
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => /^\w+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^["']|["']$/g, "")]),
);
const H = { Authorization: `Bearer ${env.STRAPI_API_TOKEN}`, "Content-Type": "application/json" };
const NL2 = String.fromCharCode(10).repeat(2);

type Row = Record<string, any>;

/** The collection, the project picker and the list of other pages for each group. */
const TARGET: Record<KitchenClusterSlug, { path: string; siblings: string; pick: string; photo: boolean; showcase: string }> = {
  formen: { path: "kuechen-formen", siblings: "weitereFormen", pick: "form", photo: false, showcase: "Projekte mit diesem Grundriss" },
  stile: { path: "kuechen-stile", siblings: "weitereStile", pick: "stil", photo: false, showcase: "Weitere Küchen in diesem Stil" },
  farben: { path: "kuechen-farben", siblings: "weitereFarben", pick: "farbe", photo: true, showcase: "" },
  inseln: { path: "kuechen-inseln", siblings: "weitereInseln", pick: "insel", photo: true, showcase: "Projekte mit Insel" },
  besondere: { path: "kuechen-loesungen", siblings: "weitereLoesungen", pick: "loesung", photo: true, showcase: "Projekte mit dieser Lösung" },
};

async function get(path: string): Promise<any> {
  const r = await fetch(`${CMS}${path}`, { headers: H });
  if (!r.ok) throw new Error(`${path}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

/** slug → documentId for a whole collection (published German entries). */
async function documentIds(api: string) {
  const map = new Map<string, string>();
  for (let page = 1; page < 50; page++) {
    const d = await get(`/api/${api}?locale=de&fields[0]=slug&pagination[pageSize]=100&pagination[page]=${page}`);
    for (const item of d.data) map.set(item.slug, item.documentId);
    if (page >= d.meta.pagination.pageCount) break;
  }
  return map;
}

/** Every file of the media library by its file name (originals and their sizes). */
async function mediaIds() {
  const map = new Map<string, number>();
  const files: Row[] = await get(`/api/upload/files?pagination[pageSize]=10000`);
  for (const file of files) {
    map.set(String(file.url).split("/").pop()!, file.id);
    for (const format of Object.values(file.formats ?? {}) as Row[]) {
      if (format?.url && !map.has(String(format.url).split("/").pop()!)) map.set(String(format.url).split("/").pop()!, file.id);
    }
  }
  return map;
}

async function main() {
  const [topics, projects, articles, faq, media, projectIds, articleIds, faqIds, themeIds] = await Promise.all([
    fetchKitchenTopics(),
    fetchProjects(),
    fetchArticles(),
    fetchFaqHub(),
    mediaIds(),
    documentIds("projects"),
    documentIds("articles"),
    documentIds("faq-items"),
    documentIds("faq-themes"),
  ]);
  if (topics.some((topic) => topic.blocks)) {
    throw new Error("The new Küchen collections already hold pages: nothing to migrate.");
  }
  // The old entries themselves: SEO, card photo and tagged projects in their order.
  const old: Row[] = (
    await get(
      "/api/kitchen-topics?locale=de&pagination[pageSize]=100&populate[seo][populate][shareImage][fields][0]=url&populate[image][fields][0]=url&populate[projects][fields][0]=slug",
    )
  ).data;
  const oldBySlug = new Map(old.map((row) => [row.slug, row]));
  // The website falls back to its built-in data when the CMS does not answer in time: never migrate that.
  const strangers = [
    ...topics.filter((topic) => !oldBySlug.has(topic.slug)).map((topic) => `topic ${topic.slug}`),
    ...projects.filter((item) => !projectIds.has(item.slug)).map((item) => `project ${item.slug}`),
  ];
  if (strangers.length || topics.length !== old.length || projects.length !== projectIds.size) {
    throw new Error(
      `The website did not get the live CMS data (topics ${topics.length}/${old.length}, projects ${projects.length}/${projectIds.size}; ${strangers.slice(0, 5).join(", ")}). Run again.`,
    );
  }

  const gaps: string[] = [];
  const photoId = (src: string | undefined, where: string) => {
    if (!src) return null;
    const file = src.split("?")[0].split("/").pop()!;
    const id = media.get(file) ?? media.get(file.replace(/^(large|medium|small|thumbnail)_/, ""));
    if (!id) gaps.push(`${where}: photo ${file} not in the media library`);
    return id ?? null;
  };
  const project = (href: string, where: string) => {
    const slug = href.split("/").pop()!;
    const documentId = projectIds.get(slug);
    if (!documentId) gaps.push(`${where}: project ${slug} not found`);
    return documentId ? { connect: [{ documentId }] } : null;
  };

  const plan: { cluster: KitchenClusterSlug; slug: string; data: Row; siblings: Row[] }[] = [];
  for (const cluster of KITCHEN_CLUSTERS) {
    const inCluster = topicsInCluster(topics, cluster.slug);
    for (const topic of inCluster) {
      const where = `${cluster.slug}/${topic.slug}`;
      const hub: PresentedTopic = {
        ...presentTopic(cluster.slug, topic, "de", inCluster, projects),
        depth: { path: `/kuechen/${cluster.slug}/${topic.slug}`, name: topic.name },
      };
      const target = TARGET[cluster.slug];
      const row = oldBySlug.get(topic.slug);
      const data: Row = {
        name: topic.name,
        slug: topic.slug,
        reihenfolge: topic.order,
        kachelfoto: row?.image?.id ?? null,
      };

      // 1 · Kopf
      const plates = cluster.slug === "stile" ? platesFor(topic.slug, hub) : null;
      const kopf: Row = { titel: hub.title, betonung: hub.emphasis || null, einleitung: hub.lede };
      if (cluster.slug === "farben") {
        kopf.titelfoto = photoId(hub.heroImage, `${where} Kopf`);
        kopf.farbton = hub.hex;
      } else if (cluster.slug !== "besondere") {
        kopf.titelfoto = photoId(plates ? plates[0] : hub.heroImage, `${where} Kopf`);
      }
      data.kopf = kopf;
      if (!hub.lede) gaps.push(`${where}: no Einleitung`);

      // Eckdaten (Stile), Eckdaten mit Foto (Besondere)
      if (cluster.slug === "stile" || cluster.slug === "besondere") {
        data.eckdaten = {
          zeilen: hub.facts.map((fact) => ({ wert: fact.value, zeile: fact.label })),
          ...(cluster.slug === "besondere" ? { foto: photoId(hub.heroImage, `${where} Eckdaten`) } : {}),
        };
      }

      // Kernaussage mit Punkten
      data.kernaussage = {
        satz: hub.statement,
        hinweis: hub.statementNote || null,
        punkte: hub.branches.map((branch) => ({ titel: branch.title, text: branch.text })),
      };
      if (hub.branches.some((branch) => branch.points.length)) gaps.push(`${where}: points carry a list (not moved)`);

      // Zwei Fotos (Stile)
      if (plates) {
        data.zweiFotos = { fotoLinks: photoId(plates[1], `${where} Zwei Fotos`), fotoRechts: photoId(plates[2], `${where} Zwei Fotos`) };
      }

      // Lesetext: exactly the text on the page (colour pages show the CMS text as it is).
      const reading =
        cluster.slug === "farben" && hub.lesetext?.trim()
          ? { heading: hub.ueberschrift || hub.heroAlt, paragraphs: hub.lesetext.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) }
          : readingCopy({ slug: topic.slug, locale: "de", cms: hub });
      if (reading) data.lesetext = { ueberschrift: reading.heading, text: reading.paragraphs.join(NL2) };
      else gaps.push(`${where}: no Lesetext`);

      // Küchen im Porträt
      const features = hub.features ?? [];
      data.kuechenPortraet = {
        titel: target.showcase || null,
        kuechen: features.map((feature) => ({
          kueche: project(feature.href, `${where} Porträt`),
          foto: photoId(feature.image, `${where} Porträt`),
          detailfoto: photoId(feature.detail?.src, `${where} Porträt`),
        })),
      };

      // Weitere Küchen (the line after the portraits) / all kitchens in the colour
      if (cluster.slug === "farben") {
        const name = hub.heroAlt.charAt(0).toLowerCase() + hub.heroAlt.slice(1);
        data.alleKuechenTitel = features.length ? `Weitere ${name}` : `${hub.heroAlt} aus unseren Projekten`;
      } else {
        const featured = new Set(features.map((feature) => feature.href));
        const further = (hub.taggedHouses?.length ? hub.taggedHouses : hub.houses.filter((house) => !featured.has(house.href))).slice(0, 4);
        data.weitereKuechen = {
          titel: features.length ? "Weitere Küchen" : target.showcase,
          kuechen: further.map((house) => ({ kueche: project(house.href, `${where} Weitere Küchen`) })),
        };
        if (!features.length) data.kuechenPortraet.titel = target.showcase;
      }

      // Ratgeber: as PageGuide resolves lib/page-depth.ts today.
      const depth = pageDepth(hub.depth?.path);
      if (depth && (depth.guide || depth.more?.length)) {
        const picked = [depth.guide, ...(depth.more ?? [])].map((key) => findArticle(articles, key)).filter(Boolean) as typeof articles;
        const list = picked.filter((item, index) => picked.findIndex((other) => other.slug === item.slug) === index);
        const quoted = list[0] && depth.guide && findArticle(articles, depth.guide) === list[0];
        const ref = (slug: string) => {
          const documentId = articleIds.get(slug);
          if (!documentId) gaps.push(`${where}: article ${slug} not found`);
          return documentId ? { connect: [{ documentId }] } : null;
        };
        data.ratgeber = {
          artikel: quoted ? ref(list[0].slug) : null,
          weitere: (quoted ? list.slice(1) : list).map((item) => ({ artikel: ref(item.slug) })),
        };
      } else {
        gaps.push(`${where}: no Ratgeber`);
      }

      // Häufige Fragen: as Questions resolves them today (picked, then the theme, six at most).
      const bySlug = new Map(faq.items.map((item) => [item.slug, item]));
      const pickedQ = (depth?.questions ?? []).flatMap((slug) => bySlug.get(slug) ?? []);
      const taken = new Set(pickedQ.map((item) => item.slug));
      const fill = depth?.theme ? filterFaqItems(faq.items, depth.theme).filter((item) => !taken.has(item.slug)) : [];
      const questions = [...pickedQ, ...fill].slice(0, 6);
      if (questions.length) {
        data.fragen = {
          titel: hub.depth?.name ?? topic.name,
          thema: depth?.theme && themeIds.get(depth.theme) ? { connect: [{ documentId: themeIds.get(depth.theme) }] } : null,
          fragen: questions.map((item) => {
            const documentId = faqIds.get(item.slug);
            if (!documentId) gaps.push(`${where}: question ${item.slug} not found`);
            return { item: documentId ? { connect: [{ documentId }] } : null };
          }),
        };
      } else {
        gaps.push(`${where}: no questions`);
      }

      // Schluss mit Foto
      data.schluss = {
        titel: hub.closeTitle,
        text: hub.closeText,
        foto: photoId(hub.closeImage, `${where} Schluss`),
        buttonText: hub.ctaLabel,
        buttonZiel: hub.ctaHref,
      };

      // SEO as it is; the tagged projects in their order.
      const seo = row?.seo;
      data.seo = seo
        ? {
            metaTitle: seo.metaTitle ?? null,
            metaDescription: seo.metaDescription ?? null,
            shareImage: seo.shareImage?.id ?? null,
            noindex: Boolean(seo.noindex),
            canonicalPath: seo.canonicalPath ?? null,
          }
        : null;
      data.projekte = { connect: (row?.projects ?? []).map((item: Row) => ({ documentId: item.documentId })) };

      // The other pages of the group, linked once every page exists.
      const siblings =
        cluster.slug === "farben"
          ? hub.swatches.filter((swatch) => !swatch.href.endsWith(`/${topic.slug}`)).map((swatch) => ({ slug: swatch.href.split("/").pop()!, image: swatch.image }))
          : hub.siblings.map((item) => ({ slug: item.href.split("/").pop()!, image: item.image }));
      plan.push({
        cluster: cluster.slug,
        slug: topic.slug,
        data,
        siblings: siblings.map((item) => ({ slug: item.slug, foto: target.photo ? photoId(item.image, `${where} Weitere`) : undefined })),
      });
    }
  }

  fs.writeFileSync("D:/Beer/tmp/kuechen-blocks-plan.json", JSON.stringify(plan, null, 1));
  console.log(`pages ${plan.length}: ${KITCHEN_CLUSTERS.map((c) => `${c.slug} ${plan.filter((p) => p.cluster === c.slug).length}`).join(", ")}`);
  console.log(
    `portraits ${plan.map((p) => p.data.kuechenPortraet.kuechen.length).join(",")} · further ${plan.map((p) => p.data.weitereKuechen?.kuechen.length ?? "-").join(",")} · questions ${plan.map((p) => p.data.fragen?.fragen.length ?? 0).join(",")}`,
  );
  console.log(gaps.length ? `gaps:\n  ${gaps.join("\n  ")}` : "gaps: none");

  if (MODE !== "--apply") return;
  if (gaps.some((gap) => gap.includes("not in the media library") || gap.includes("not found"))) {
    throw new Error("Missing photos or relations: nothing written.");
  }
  // 1. Create every page (published).
  const created = new Map<string, string>();
  for (const page of plan) {
    const path = TARGET[page.cluster].path;
    const r = await fetch(`${CMS}/api/${path}?locale=de&status=published`, { method: "POST", headers: H, body: JSON.stringify({ data: page.data }) });
    if (!r.ok) throw new Error(`${page.cluster}/${page.slug}: ${r.status} ${(await r.text()).slice(0, 400)}`);
    created.set(`${page.cluster}/${page.slug}`, (await r.json()).data.documentId);
    console.log("created", page.cluster, page.slug);
  }
  // 2. Link the other pages of each group.
  for (const page of plan) {
    const { path, siblings, pick, photo } = TARGET[page.cluster];
    const list = page.siblings.map((item) => ({
      [pick]: { connect: [{ documentId: created.get(`${page.cluster}/${item.slug}`) }] },
      ...(photo ? { foto: item.foto } : {}),
    }));
    const r = await fetch(`${CMS}/api/${path}/${created.get(`${page.cluster}/${page.slug}`)}?locale=de&status=published`, {
      method: "PUT",
      headers: H,
      body: JSON.stringify({ data: { [siblings]: list } }),
    });
    if (!r.ok) throw new Error(`${page.cluster}/${page.slug} siblings: ${r.status} ${(await r.text()).slice(0, 400)}`);
  }
  console.log("linked the other pages of each group");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
