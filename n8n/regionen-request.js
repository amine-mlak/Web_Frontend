/**
 * n8n Code node "Anfrage" (workflow "BEER Regionen"): the Claude request for a region text
 * (from the projects in that region) or a Google Business Profile post (for one project).
 */

const jobs = $("Aktion").all().map((i) => i.json);
const answers = $input.all().map((i) => i.json);
const part = (name) => answers[jobs.findIndex((j) => j.part === name)]?.data;
const job = jobs[0];

if (job.kind === "text") {
  const region = part("region");
  const projects = part("projects") ?? [];
  if (!region) return [];
  const SYSTEM = `Du schreibst die Texte einer Regionsseite für die Website der BEER Küchenmanufaktur.
${BEER_FACTS}

Stil: ruhig, kurz, konkret, wie die übrigen Seiten der BEER – Beispiel einer Themenseite: Überschrift „Weiße Küchen, nie nur weiß.“, Lesetext in kurzen Absätzen, keine Superlative, keine Werbefloskeln.
Inhalt: was die BEER in dieser Region gebaut hat (nur die Projekte unten, keine Kundennamen), wie Aufmaß, Fertigung in Wolfersdorf und Montage ablaufen, und dass die Ausstellung in Wolfersdorf besucht werden kann. Nur Orte nennen, die in den Projekten oder im Regionsnamen vorkommen. Keine Entfernungen, Fahrzeiten oder Zahlen erfinden.
Felder: ueberschrift (höchstens 60 Zeichen), seitentitel (ein bis drei Wörter), betonung (Teil der Überschrift, der hervorgehoben wird), intro (ein Satz, höchstens 160 Zeichen), lesetext (zwei bis vier kurze Absätze), aussage (ein bis zwei Sätze), hinweis (ein Satz), schlussTitel (höchstens 40 Zeichen), schlussText (ein bis zwei Sätze), metaTitle (40–60 Zeichen), metaDescription (120–155 Zeichen).`;
  const fields = ["ueberschrift", "seitentitel", "betonung", "intro", "lesetext", "aussage", "hinweis", "schlussTitel", "schlussText", "metaTitle", "metaDescription"];
  const schema = { type: "object", properties: Object.fromEntries(fields.map((f) => [f, { type: "string" }])), required: fields, additionalProperties: false };
  const user = `Region: ${region.name}
Bisherige Texte (zum Vergleich, nicht kopieren): ${region.intro ?? ""} ${String(region.lesetext ?? "").slice(0, 600)}

Projekte in dieser Region:
${projects.map((p) => `- ${p.title}${p.place ? ` (${p.place})` : ""}: ${p.intro} ${(p.specs ?? []).map((s) => `${s.label}: ${s.value}`).join("; ")}`).join("\n")}`;
  return [{ json: { ...job, shareImage: region.seo?.shareImage?.id ?? null, request: claudeRequest({ system: SYSTEM, user, schema, effort: "high" }) } }];
}

const project = part("project");
if (!project) return [];
const photos = [project.image, ...(project.gallery ?? [])].filter(Boolean).slice(0, 3).map((m) => `${CMS}${m.formats?.large?.url ?? m.formats?.medium?.url ?? ""}`);
const SYSTEM = `Du schreibst Beiträge für das Google-Unternehmensprofil der BEER Küchenmanufaktur.
${BEER_FACTS}
Ein Beitrag zeigt eine neu fertiggestellte Küche: 600 bis 1200 Zeichen, erster Satz sagt, was zu sehen ist, dann zwei bis drei Details (Fronten, Material, Geräte, Form), dann eine ruhige Einladung in die Ausstellung oder zur Beratung. Ort nur, wenn angegeben. Keine Kundennamen, keine Hashtags, keine Superlative, keine Telefonnummern oder Preise.`;
const schema = { type: "object", properties: { text: { type: "string" } }, required: ["text"], additionalProperties: false };
const user = `Projekt: ${project.title}${project.place ? ` (${project.place})` : ""}\n${project.intro}\n${project.body}\nSeite: ${SITE}/projekte/${project.slug}`;
return [{ json: { ...job, photos, request: claudeRequest({ system: SYSTEM, user, schema, effort: "medium" }) } }];
