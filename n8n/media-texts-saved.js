/**
 * n8n Code node "Gespeichert" (workflow "BEER Mediathek"): marks what Strapi accepted. A photo
 * Strapi refused stays "bereit" and is sent again next run; the reason shows on the page.
 */

const store = $getWorkflowStaticData("global");
const sent = $("Speichern vorbereiten").all().map((item) => item.json);
let saved = 0;

$input.all().forEach((item, i) => {
  const job = sent[i];
  const media = store.media?.[job?.id];
  if (!media) return;
  const answer = item.json;
  if (Number(answer?.id) === job.id && answer.alternativeText === job.alt) {
    media.s = "gespeichert";
    media.saved = new Date().toISOString();
    saved += 1;
  } else {
    store.saveError = { at: new Date().toISOString(), message: answer?.error?.message ?? answer?.message ?? "Strapi hat nicht gespeichert" };
  }
});
if (saved) store.saveError = null;

return [{ json: { saved } }];
