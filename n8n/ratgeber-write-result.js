/**
 * n8n Code node "Artikel: Ergebnis" (workflow "BEER Ratgeber").
 * Records on the topic whether Strapi saved the draft, and that nothing was published.
 */

const store = $getWorkflowStaticData("global");
const { topicId } = $("Artikel: bauen").first().json;
const topic = store.topics?.[topicId];
const saved = $("Speichern").first().json;
const live = $input.first().json;
if (!topic) return [];

if (saved?.data?.documentId) {
  topic.status = "entwurf";
  topic.documentId = saved.data.documentId;
  topic.writtenAt = new Date().toISOString();
  topic.error = live?.data?.publishedAt ? "Achtung: Strapi meldet eine veröffentlichte Fassung – bitte prüfen." : null;
} else {
  topic.status = "offen";
  topic.error = `Nicht gespeichert: ${saved?.error?.message ?? "Strapi hat nicht geantwortet"}`;
}
return [{ json: { topicId, status: topic.status } }];
