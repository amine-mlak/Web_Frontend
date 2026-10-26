/**
 * n8n Code node "Gespeichert" (workflow "BEER Regionen"): records the draft writes.
 */

const store = $getWorkflowStaticData("global");
const jobs = $("Aktion").all().map((i) => i.json);
$input.all().forEach((item, i) => {
  const job = jobs[i];
  const data = item.json?.data;
  const error = !data?.documentId
    ? `Nicht gespeichert: ${item.json?.error?.message ?? "Strapi hat nicht geantwortet"}`
    : data.publishedAt
      ? "Achtung: Strapi meldet die Fassung als veröffentlicht – bitte prüfen."
      : null;
  if (job.kind === "projekt") store.saved[job.id] = { at: new Date().toISOString(), error };
  if (job.kind === "region" && store.regionTexts[job.id]) Object.assign(store.regionTexts[job.id], { status: error && !data?.documentId ? "offen" : "übernommen", doneAt: new Date().toISOString(), error });
});
return [{ json: { checked: $input.all().length } }];
