/**
 * n8n Code node "Antwort" (workflow "BEER Neue Seite"): the chat reply after saving.
 */

const store = $getWorkflowStaticData("global");
const { sessionId } = $("Anfrage").first().json;
const built = $("Bauen").first().json;
const saved = $("Speichern").first().json;
const live = $input.first().json;
const id = saved?.data?.documentId;
if (!id) {
  return [{ json: { output: `Der Entwurf wurde nicht gespeichert: ${saved?.error?.message ?? "Strapi hat nicht geantwortet"}. Die Notiz bleibt erhalten – bitte später noch einmal senden.` } }];
}
delete store.sessions[sessionId];
const name = saved.data.title ?? saved.data.name;
return [
  {
    json: {
      output: [
        live?.data?.publishedAt
          ? `⚠️ Achtung: Strapi meldet eine veröffentlichte Fassung von „${name}“. Bitte sofort prüfen.`
          : `Entwurf gespeichert (nicht veröffentlicht): **${name}**`,
        `Strapi: ${adminUrl(built.type, id)}`,
        built.project ? `Titelbild aus dem Projekt „${built.project}“ – bitte prüfen.` : "Kein passendes Titelbild gefunden – bitte in Strapi wählen.",
        "Bitte Texte lesen, Punkte und Stichworte prüfen, dann veröffentlichen.",
      ].join("\n"),
    },
  },
];
