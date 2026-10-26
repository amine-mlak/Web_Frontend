/**
 * n8n Code node "Fotos" (workflow "BEER Projekttexte").
 * One Claude request per photo that needs a description. "Alt-Text Claude" sends it.
 */

const SYSTEM = [
  "Du schreibst Alternativtexte (alt) für Fotos von Küchen und Möbeln der BEER Küchenmanufaktur in Bayern.",
  "Der Text beschreibt in einem deutschen Satz von 60 bis 125 Zeichen nur, was auf dem Foto sichtbar ist:",
  "Fronten, Farben, Holz und Stein, Arbeitsplatte, Griffe, Geräte, Licht, Raum.",
  "Nicht mit „Bild“, „Foto“ oder „Ansicht“ beginnen. Keine Werbung, keine Wertungen wie „traumhaft“.",
  "Keine Personen, Namen oder Orte nennen. Markennamen nur, wenn sie auf dem Foto lesbar sind.",
  "Der Projekttitel und die Einleitung helfen beim Verständnis; beschreibe trotzdem nur dieses Foto.",
].join(" ");

const SCHEMA = { type: "object", properties: { alt: { type: "string" } }, required: ["alt"], additionalProperties: false };

const items = [];
for (const { json: project } of $input.all()) {
  for (const photo of project.photos) {
    items.push({
      json: {
        documentId: project.documentId,
        photo,
        request: claudeRequest({
          system: SYSTEM,
          schema: SCHEMA,
          effort: "low",
          maxTokens: 4000,
          user: [
            { type: "image", source: { type: "url", url: photo.url } },
            { type: "text", text: `Projekt: ${project.title}. ${project.intro}` },
          ],
        }),
      },
    });
  }
}
return items;
