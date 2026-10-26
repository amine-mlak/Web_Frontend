/* eslint-disable @typescript-eslint/no-unused-vars -- shared helpers, pasted in front of the Code nodes that use them */
/**
 * The SEO rules, shared by "BEER SEO-Prüfung" (report) and "BEER SEO-Vorschläge" (fixes).
 * Pasted in after lib-common.js. seoRows() takes the "Abfragen" items and the Strapi answers
 * in the same order and returns one row per German entry with its issues. Each issue has a
 * level (fehler = fix before publishing, hinweis = improvement) and a code.
 */

const SEO_TYPES = {
  projects: { label: "Projekte", path: (e) => `/projekte/${e.slug}`, seo: true },
  "kitchen-topics": { label: "Küchen-Themen", path: (e) => `/kuechen/${e.cluster}/${e.slug}`, seo: true },
  regions: { label: "Regionen", path: (e) => `/regionen/${e.slug}`, seo: true },
  materials: { label: "Material", path: (e) => `/material/${e.slug}`, seo: true },
  appliances: { label: "Geräte", path: (e) => `/geraete/${e.slug}`, seo: true },
  brands: { label: "Marken", path: (e) => `/marken/${e.slug}`, seo: true },
  "furniture-items": { label: "Möbel", path: (e) => `/moebel/${e.slug}`, seo: true },
  "site-pages": { label: "Feste Seiten", path: (e) => `/${e.slug}`, seo: false },
  articles: { label: "Artikel", path: (e) => `/${e.category?.slug === "presse" ? "presse" : "ratgeber"}/${e.slug}`, seo: false },
};

// Codes that "SEO-Vorschläge" can fix with a new meta title and description.
const META_CODES = ["meta-title-missing", "meta-title-long", "meta-desc-missing", "meta-desc-long", "meta-desc-short", "dup-title", "dup-desc"];

function seoRows(requests, answers) {
  const drafts = {};
  const published = {};
  const english = {};
  const failed = [];
  answers.forEach((answer, i) => {
    const request = requests[i];
    if (!request) return;
    if (!Array.isArray(answer?.data)) {
      failed.push(`${request.api} (${request.status}, ${request.locale}, Seite ${request.page})`);
      return;
    }
    for (const entry of answer.data) {
      if (request.locale === "en") (english[request.api] ??= new Set()).add(entry.documentId);
      else if (request.status === "published") (published[request.api] ??= new Map()).set(entry.documentId, entry.updatedAt);
      else (drafts[request.api] ??= []).push(entry);
    }
  });

  const len = (value) => String(value ?? "").trim().length;
  const all = [];
  for (const [api, entries] of Object.entries(drafts)) {
    const type = SEO_TYPES[api];
    if (!type) continue;
    for (const entry of entries) {
      const name = entry.title || entry.name || "";
      const issues = [];
      const add = (level, code, text) => issues.push({ level, code, text });

      if (!name) add("fehler", "title", "Titel fehlt.");
      if (!entry.slug) add("fehler", "slug", "Adresse (Slug) fehlt.");
      else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.slug))
        add("fehler", "slug", `Adresse „${entry.slug}“: nur a–z, 0–9 und Bindestriche (ä → ae, ß → ss).`);

      const live = published[api]?.get(entry.documentId);
      if (!live) add("hinweis", "unpublished", "Noch nicht veröffentlicht.");
      else if (new Date(entry.updatedAt) > new Date(live)) add("hinweis", "changed", "Entwurf geändert, noch nicht veröffentlicht.");

      const metaTitle = entry.seo?.metaTitle || "";
      const metaDescription = type.seo ? entry.seo?.metaDescription || "" : entry.intro || entry.description || "";
      if (type.seo) {
        if (!metaTitle) add("hinweis", "meta-title-missing", "Kein Meta-Titel – Google zeigt den Seitentitel.");
        else if (len(metaTitle) > 60) add("hinweis", "meta-title-long", `Meta-Titel hat ${len(metaTitle)} Zeichen – Google kürzt ab etwa 60.`);
        if (!metaDescription) add("fehler", "meta-desc-missing", "Meta-Beschreibung fehlt.");
        else if (len(metaDescription) > 160) add("fehler", "meta-desc-long", `Meta-Beschreibung hat ${len(metaDescription)} Zeichen – höchstens 160.`);
        else if (len(metaDescription) < 70) add("hinweis", "meta-desc-short", `Meta-Beschreibung hat nur ${len(metaDescription)} Zeichen – 120 bis 160 sind ideal.`);
      } else if (!metaDescription) {
        add("hinweis", "intro", "Keine Einleitung – Google bekommt keine Beschreibung dieser Seite.");
      }

      const cover = api === "articles" ? entry.cover : entry.image;
      if (!cover) add(api === "site-pages" ? "hinweis" : "fehler", "cover", "Kein Titelbild – auch kein Vorschaubild beim Teilen.");
      else if (weakAlt(cover.alternativeText)) add("hinweis", "cover-alt", "Titelbild ohne Beschreibung (Alt-Text).");

      if (api === "projects") {
        const gallery = entry.gallery ?? [];
        const missing = gallery.filter((photo) => weakAlt(photo.alternativeText)).length;
        if (gallery.length < 4) add("hinweis", "gallery", `Nur ${gallery.length} Fotos in der Galerie – mindestens 4 zeigen die Küche.`);
        if (missing) add("hinweis", "gallery-alt", `${missing} von ${gallery.length} Fotos ohne Beschreibung (Alt-Text).`);
        if (!entry.place) add("hinweis", "place", "Kein Ort angegeben.");
        else if (/^raum münchen$/i.test(entry.place.trim())) add("hinweis", "place", "Nur „Raum München“ – ein echter Ort hilft bei der lokalen Suche.");
        if (!entry.year) add("hinweis", "year", "Kein Jahr angegeben.");
        if (!entry.regions?.length) add("hinweis", "region", "Keine Region verknüpft – erscheint auf keiner Regionsseite.");
        if (!entry.topics?.length) add("hinweis", "topic", "Kein Thema (Stil, Farbe, Form) – erscheint auf keiner Themenseite.");
        if (len(entry.body) < 300) add("hinweis", "body", `Kurzer Text (${len(entry.body)} Zeichen) – 300 und mehr erzählen die Küche.`);
      } else if (!entry.intro && !entry.description) {
        add("fehler", "intro", "Einleitung fehlt.");
      }

      all.push({
        api,
        entry,
        name,
        live: Boolean(live),
        metaTitle: metaTitle || name,
        metaDescription,
        issues,
        english: english[api]?.has(entry.documentId) ?? false,
      });
    }
  }

  // Same title or description on two pages: Google cannot tell them apart.
  const groups = (key) => {
    const map = new Map();
    for (const row of all) {
      const value = String(row[key] ?? "").trim().toLowerCase();
      if (value) map.set(value, [...(map.get(value) ?? []), row]);
    }
    return [...map.values()].filter((rows) => rows.length > 1);
  };
  for (const rows of groups("metaTitle"))
    for (const row of rows)
      row.issues.push({ level: "fehler", code: "dup-title", text: `Gleicher Titel wie: ${rows.filter((r) => r !== row).map((r) => r.name).join(", ")}.` });
  for (const rows of groups("metaDescription"))
    for (const row of rows)
      row.issues.push({ level: "hinweis", code: "dup-desc", text: `Gleiche Beschreibung wie: ${rows.filter((r) => r !== row).map((r) => r.name).join(", ")}.` });

  return { all, failed };
}
