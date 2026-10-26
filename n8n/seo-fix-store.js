/**
 * n8n Code node "Vorschläge merken" (workflow "BEER SEO-Vorschläge").
 * Pairs Claude's titles and descriptions with the chosen entries and stores them for the
 * review page. Writes nothing to the CMS.
 */

const store = $getWorkflowStaticData("global");
store.proposals ??= {};
store.log ??= [];
const { rows } = $("Auswahl").first().json;
const answer = claudeAnswer($input.first().json);
if (answer.error) {
  store.log.unshift({ at: new Date().toISOString(), text: `Vorschläge fehlgeschlagen: ${answer.error}` });
  return [{ json: { ok: false } }];
}

const byId = new Map((answer.value.items ?? []).map((item) => [item.id, item]));
let count = 0;
for (const row of rows) {
  const item = byId.get(row.documentId);
  if (!item) continue;
  const warnings = [];
  if (item.metaTitle.length > 60) warnings.push(`Titel hat ${item.metaTitle.length} Zeichen.`);
  if (item.metaDescription.length > 160) warnings.push(`Beschreibung hat ${item.metaDescription.length} Zeichen.`);
  store.proposals[row.documentId] = {
    ...row,
    new: { metaTitle: item.metaTitle.trim(), metaDescription: item.metaDescription.trim() },
    warnings,
    status: "offen",
    createdAt: new Date().toISOString(),
  };
  count++;
}
store.log.unshift({ at: new Date().toISOString(), text: `${count} Vorschläge erstellt.` });
store.log = store.log.slice(0, 50);
return [{ json: { ok: true, count } }];
