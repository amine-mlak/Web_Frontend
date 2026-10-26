/**
 * n8n Code node "Antwort" (workflow "BEER Meldungen"): the chat reply after saving.
 * Confirms the draft (and that it is not published), links to it in Strapi, and gives the
 * texts for the Google Business Profile and social media to copy.
 */

const store = $getWorkflowStaticData("global");
const { sessionId } = $("Auftrag").first().json;
const draft = $("Entwurf").first().json;
const saved = $("Speichern").first().json;
const live = $input.first().json;

const id = saved?.data?.documentId;
if (!id) {
  return [{ json: { output: `Der Entwurf wurde nicht gespeichert: ${saved?.error?.message ?? "Strapi hat nicht geantwortet"}. Die Notizen bleiben erhalten – bitte später noch einmal senden.` } }];
}
delete store.sessions[sessionId];

const published = Boolean(live?.data?.publishedAt);
const lines = [
  published
    ? `⚠️ Achtung: Strapi meldet eine veröffentlichte Fassung von „${saved.data.title}“. Bitte sofort in Strapi prüfen.`
    : `Entwurf gespeichert (nicht veröffentlicht): **${saved.data.title}**`,
  `Strapi: ${adminUrl("articles", id)}`,
  draft.project
    ? `Fotos: ${draft.project.photos} aus dem Projekt „${draft.project.title}“ – Titelbild und Galerie bitte prüfen.`
    : "Fotos: keine passenden gefunden – bitte in Strapi ein Titelbild wählen.",
  draft.similar?.length ? `Ähnliche Artikel gibt es schon (${draft.similar.join(", ")}) – bitte prüfen, ob es doppelt ist.` : "",
  draft.categoryMissing ? `Kategorie „${draft.categoryMissing}“ gibt es in Strapi noch nicht – bitte anlegen und zuordnen.` : "",
  "Bitte in Strapi lesen, ergänzen und dann veröffentlichen.",
  "",
  "**Google-Unternehmensprofil** (zum Kopieren):",
  draft.gbpPost,
  "",
  "**Instagram / Facebook** (zum Kopieren):",
  draft.socialPost,
];
return [{ json: { output: lines.filter((line, i) => line !== "" || i > 4).join("\n") } }];
