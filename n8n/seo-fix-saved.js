/**
 * n8n Code node "Gespeichert" (workflow "BEER SEO-Vorschläge"): records which drafts Strapi
 * accepted, and warns if a save ever came back published.
 */

const store = $getWorkflowStaticData("global");
const jobs = $("Neuer SEO-Text").all().map((i) => i.json);
$input.all().forEach((item, i) => {
  const proposal = store.proposals[jobs[i]?.documentId];
  if (!proposal) return;
  const data = item.json?.data;
  proposal.doneAt = new Date().toISOString();
  if (data?.documentId) {
    proposal.status = "übernommen";
    proposal.error = data.publishedAt ? "Achtung: Strapi meldet die Fassung als veröffentlicht – bitte prüfen." : null;
  } else {
    proposal.status = "offen";
    proposal.error = `Nicht gespeichert: ${item.json?.error?.message ?? "Strapi hat nicht geantwortet"}`;
  }
});
return [{ json: { checked: $input.all().length } }];
