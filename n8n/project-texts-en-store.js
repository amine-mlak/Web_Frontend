/**
 * n8n Code node "Englisch merken" (workflow "BEER Projekttexte").
 * Checks Claude's translation and stores it as a proposal. Written to the CMS only after
 * "Übernehmen", and then as an English draft (never published).
 */

const store = $getWorkflowStaticData("global");
const jobs = $("Übersetzung vorbereiten").all().map((item) => item.json);
const BRANDS = ["BEER", "Bora", "Miele", "Gaggenau", "Siemens", "Quooker", "Fenix", "Taj Mahal"];

$input.all().forEach((item, i) => {
  const { documentId, specCount } = jobs[i] ?? {};
  const proposal = store.proposals?.[documentId];
  if (!proposal) return;
  const answer = claudeAnswer(item.json);
  const en = answer.value;
  if (answer.error || !en?.title) {
    proposal.errors.push(`Englisch: ${answer.error ?? "kein Titel"}`);
    return;
  }
  const warnings = [];
  if (en.specs.length !== specCount) warnings.push(`Ausstattung: ${en.specs.length} statt ${specCount} Zeilen.`);
  if (en.metaTitle.length > 60) warnings.push(`Meta-Titel hat ${en.metaTitle.length} Zeichen.`);
  if (en.metaDescription.length > 160) warnings.push(`Meta-Beschreibung hat ${en.metaDescription.length} Zeichen.`);
  const german = JSON.stringify(jobs[i]?.request?.messages ?? "");
  for (const brand of BRANDS)
    if (german.includes(brand) && !JSON.stringify(en).includes(brand)) warnings.push(`Marke „${brand}“ fehlt in der Übersetzung.`);
  proposal.en = { ...en, warnings };
});

return [{ json: { stored: $input.all().length } }];
