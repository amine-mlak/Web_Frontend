/**
 * n8n Code nodes "Alt-Text gespeichert" and "Englisch gespeichert" (workflow "BEER
 * Projekttexte"): record on the proposal what Strapi accepted, for the review page.
 * KIND is set by pack-workflows.mjs ("alt" or "en").
 */

const store = $getWorkflowStaticData("global");
const sent = $("Verteilen").all(KIND === "alt" ? 0 : 1).map((item) => item.json);

$input.all().forEach((item, i) => {
  const job = sent[i];
  const saved = store.proposals?.[job?.documentId]?.saved;
  if (!saved) return;
  const answer = item.json;
  const ok = KIND === "alt" ? Number(answer?.id) === Number(job.id) : answer?.data?.locale === "en";
  if (ok && KIND === "alt") saved.alt += 1;
  else if (ok) saved.en = true;
  else saved.errors.push(`${KIND === "alt" ? `Foto ${job.id}` : "Englisch"}: ${answer?.error?.message ?? "Strapi hat nicht gespeichert"}`);
});

return [{ json: { checked: $input.all().length } }];
