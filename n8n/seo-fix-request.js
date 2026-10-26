/**
 * n8n Code node "Auswahl" (workflow "BEER SEO-Vorschläge").
 * Uses the same rules as the SEO check (lib-seo.js) and picks up to 15 entries whose meta
 * title or description has a problem and no open proposal. One Claude request writes new
 * titles and descriptions for all of them, knowing every other title so none repeats.
 */

const store = $getWorkflowStaticData("global");
store.proposals ??= {};
const { all } = seoRows($("Abfragen").all().map((i) => i.json), $input.all().map((i) => i.json));

const candidates = all
  .filter((row) => SEO_TYPES[row.api].seo && row.issues.some((i) => META_CODES.includes(i.code)))
  .filter((row) => !["offen", "verworfen"].includes(store.proposals[row.entry.documentId]?.status))
  .sort((a, b) => Number(b.live) - Number(a.live))
  .slice(0, 15);
if (!candidates.length) return [];

const SYSTEM = `Du schreibst Meta-Titel und Meta-Beschreibungen (Google-Snippets) für die Website der BEER Küchenmanufaktur.
${BEER_FACTS}

Regeln:
- metaTitle: 40 bis 60 Zeichen, nennt das Thema der Seite zuerst; „BEER“, „Wolfersdorf“ oder „Freising“ nur, wenn Platz ist und es passt. Jeder Titel einzigartig – auch gegenüber der Liste der vorhandenen Titel.
- metaDescription: 120 bis 155 Zeichen, ein bis zwei ganze Sätze, beschreibt konkret, was die Seite zeigt (bei Projekten: Fronten, Material, Form), und endet wenn möglich mit „– von BEER.“ oder einer ruhigen Einladung. Keine Superlative, keine Ausrufezeichen.
- Nur Fakten aus Name, Einleitung und Text des Eintrags. Nichts erfinden.
- Gib für jeden Eintrag die id genau so zurück, wie sie kam.`;

const schema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, metaTitle: { type: "string" }, metaDescription: { type: "string" } },
        required: ["id", "metaTitle", "metaDescription"],
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
};

const others = all.filter((row) => !candidates.includes(row)).map((row) => `- ${row.metaTitle}`);
const user = `Einträge:
${candidates
  .map((row) => `id: ${row.entry.documentId}
Typ: ${SEO_TYPES[row.api].label}
Name: ${row.name}
Einleitung: ${row.entry.intro ?? ""}
Text: ${String(row.entry.body ?? "").slice(0, 700)}
Bisher: Titel „${row.entry.seo?.metaTitle ?? ""}“, Beschreibung „${row.entry.seo?.metaDescription ?? ""}“
Probleme: ${row.issues.filter((i) => META_CODES.includes(i.code)).map((i) => i.text).join(" ")}`)
  .join("\n\n")}

Vorhandene Titel anderer Seiten (nicht wiederholen):
${others.join("\n")}`;

return [
  {
    json: {
      rows: candidates.map((row) => ({
        api: row.api,
        documentId: row.entry.documentId,
        name: row.name,
        path: row.entry.slug ? SEO_TYPES[row.api].path(row.entry) : "",
        live: row.live,
        old: { metaTitle: row.entry.seo?.metaTitle ?? "", metaDescription: row.entry.seo?.metaDescription ?? "" },
        issues: row.issues.filter((i) => META_CODES.includes(i.code)).map((i) => i.text),
      })),
      request: claudeRequest({ system: SYSTEM, user, schema, effort: "medium" }),
    },
  },
];
