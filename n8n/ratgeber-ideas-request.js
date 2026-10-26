/**
 * n8n Code node "Themen: Anfrage" (workflow "BEER Ratgeber").
 * Asks Claude (with web search) for six guide topics that people around Munich and
 * Freising really search for, that BEER can answer from its own experience, and that the
 * site does not cover yet.
 */

const bestand = ratgeberBestand();

const SYSTEM = `Du planst Ratgeber-Artikel für die Website der BEER Küchenmanufaktur.
${BEER_FACTS}

Ziel: Artikel, die Menschen beim Planen einer Küche wirklich weiterhelfen und die Google und KI-Suche (AI Overviews, ChatGPT, Perplexity) als Antwort zitieren. Wenige gute Artikel, keine Massenware.

Vorgehen:
1. Suche im Web, welche Fragen Menschen in Deutschland vor dem Küchenkauf stellen (Foren, "Ähnliche Fragen", Ratgeberseiten) und welche Antworten dort fehlen oder oberflächlich sind.
2. Wähle sechs Themen, die die BEER aus eigener Erfahrung als Manufaktur beantworten kann (Planung, Maße, Material, Geräte, Kosten-Faktoren, Ablauf, Pflege), die die Website noch nicht abdeckt und die zu den vorhandenen Projekten passen.
3. Kein Thema doppelt zu einem vorhandenen Artikel. Keine reinen Ortsseiten.

Für jedes Thema:
- question: die Suchfrage, wie Menschen sie stellen.
- title: Artikeltitel, höchstens 70 Zeichen.
- category: eines von ${RATGEBER_CATEGORIES.join(", ")}.
- why: ein Satz, warum das Thema gesucht wird (mit Bezug auf die Suche).
- angle: was BEER Eigenes beitragen kann, das andere Seiten nicht haben.
- projects: bis zu drei Projekt-Slugs aus der Liste, die das Thema zeigen.
- sources: bis zu drei Adressen aus deiner Suche, die die Nachfrage belegen.`;

const schema = {
  type: "object",
  properties: {
    topics: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          title: { type: "string" },
          category: { type: "string", enum: RATGEBER_CATEGORIES },
          why: { type: "string" },
          angle: { type: "string" },
          projects: { type: "array", items: { type: "string" } },
          sources: { type: "array", items: { type: "string" } },
        },
        required: ["question", "title", "category", "why", "angle", "projects", "sources"],
        additionalProperties: false,
      },
    },
  },
  required: ["topics"],
  additionalProperties: false,
};

const store = $getWorkflowStaticData("global");
const earlier = Object.values(store.topics ?? {}).map((t) => `- ${t.title} (${t.status})`);

const user = `Vorhandene Artikel:
${bestand.articles.map((a) => `- ${a.title} (${a.category?.slug ?? "ohne Kategorie"})`).join("\n") || "- keine"}

Bereits vorgeschlagene Themen (nicht wiederholen):
${earlier.join("\n") || "- keine"}

Fragen aus dem FAQ der Website (schon kurz beantwortet; ein Artikel darf eine davon ausführlich behandeln):
${bestand.faq.map((f) => `- ${f.question}`).join("\n")}

Küchen-Themenseiten: ${bestand.topics.map((t) => t.name).join(", ")}

Projekte (Slug – Titel):
${bestand.projects.map((p) => `${p.slug} – ${p.title}`).join("\n")}`;

return [{ json: { request: claudeRequest({ system: SYSTEM, user, schema, effort: "high", webSearch: 6 }) } }];
