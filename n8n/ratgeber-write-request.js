/**
 * n8n Code node "Artikel: Anfrage" (workflow "BEER Ratgeber").
 * Asks Claude to write the chosen topic as an article from BEER's own material: the FAQ
 * answers, the matching projects, and the pages it may link to. No invented numbers;
 * anything that needs a fact from BEER is marked [prüfen: …] for the editor.
 */

const store = $getWorkflowStaticData("global");
const bestand = ratgeberBestand();
const topic = store.topics?.[bestand.trigger.body?.topicId];
if (!topic) return [];

const projects = bestand.projects.filter((p) => topic.projects.includes(p.slug));
const SYSTEM = `Du schreibst Ratgeber-Artikel für die Website der BEER Küchenmanufaktur.
${BEER_FACTS}

Leser: Menschen in Bayern, die eine Küche planen. Anrede „Sie“. Ruhiger, sachlicher Ton einer Werkstatt, die ihr Handwerk erklärt. Keine Superlative, keine Werbefloskeln, keine Ausrufezeichen.

Aufbau (so zitieren Google und KI-Suche einen Text gern):
- Erster Absatz: beantwortet die Frage direkt in zwei bis drei Sätzen.
- Danach „## Auf einen Blick“ mit drei bis fünf kurzen Punkten.
- Drei bis sechs Abschnitte mit „##“-Überschrift als Frage oder klare Aussage; jeder Abschnitt beginnt mit der Antwort, dann die Erklärung mit konkreten Beispielen.
- Wo ein Projekt das Thema zeigt: kurz beschreiben und verlinken.
- Zum Schluss „## Häufige Fragen“ mit drei bis fünf Fragen (### Frage) und kurzen Antworten.
- Ein Satz, der zur Beratung oder in die Ausstellung einlädt, mit Link.
- 900 bis 1500 Wörter, Markdown.

Fakten:
- Nur aus den FAQ-Antworten, Projektangaben und Firmenangaben unten, plus allgemein gesichertes Fachwissen (Maße, Materialeigenschaften).
- Keine erfundenen Preise, Lieferzeiten, Garantien, Zahlen oder Zitate. Wo eine BEER-eigene Angabe den Text besser machte, aber fehlt: „[prüfen: …]“ mit der Frage an die Redaktion.
- Kundennamen nie nennen.
- Links nur auf die Seiten der Liste, als Markdown-Link mit der Adresse genau wie angegeben.

Ausgabe:
- title: höchstens 70 Zeichen. description: Teaser, höchstens 80 Zeichen.
- slug: a–z, 0–9, Bindestriche, ä→ae, ö→oe, ü→ue, ß→ss, höchstens 60 Zeichen.
- category: ${RATGEBER_CATEGORIES.join(", ")}.
- body: der Artikel in Markdown.
- checks: alle [prüfen: …]-Fragen als Liste.
- note: ein Satz an die Redaktion, was beim Lesen besonders zu prüfen ist.`;

const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    slug: { type: "string" },
    category: { type: "string", enum: RATGEBER_CATEGORIES },
    body: { type: "string" },
    checks: { type: "array", items: { type: "string" } },
    note: { type: "string" },
  },
  required: ["title", "description", "slug", "category", "body", "checks", "note"],
  additionalProperties: false,
};

const user = `Thema: ${topic.title}
Suchfrage: ${topic.question}
Kategorie: ${topic.category}
Was BEER beitragen kann: ${topic.angle}

FAQ der Website (Frage → Antwort der BEER):
${bestand.faq.map((f) => `- ${f.question} → ${String(f.answer ?? "").replace(/\s+/g, " ")}`).join("\n")}

Passende Projekte:
${projects.map((p) => `### ${p.title} (/projekte/${p.slug})\n${p.intro}\n${p.body}\n${(p.specs ?? []).map((s) => `${s.label}: ${s.value}`).join("; ")}`).join("\n\n") || "keine"}

Seiten, auf die verlinkt werden darf:
${ratgeberLinks(bestand).join("\n")}
${projects.map((p) => `/projekte/${p.slug} – ${p.title}`).join("\n")}`;

return [{ json: { topicId: topic.id, request: claudeRequest({ system: SYSTEM, user, schema, effort: "high", maxTokens: 32000 }) } }];
