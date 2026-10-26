/**
 * n8n Code node "Übersetzung vorbereiten" (workflow "BEER Projekttexte").
 * One Claude request per chosen project without an English version.
 */

const SYSTEM = [
  "You translate kitchen project pages of BEER Küchenmanufaktur (a Bavarian kitchen and furniture maker) from German into British English.",
  "Keep the meaning, the calm factual tone and the paragraph breaks (blank lines). Describe nothing that the German does not say.",
  "Never translate brand or collection names: BEER, Bora, Miele, Gaggenau, Siemens, Quooker, Fenix, Taj Mahal, Simple Elegance, Natures Harmony, Smart Rebellion, Vintage Love, Pure Nature, Natural Beauty.",
  "Place names stay German (Wolfersdorf, Freising, Landshut); „Raum München“ becomes „Munich area“.",
  "metaTitle: at most 60 characters. metaDescription: 120 to 155 characters and ends with „– by BEER.“ when the German ends with „– von BEER.“.",
  "specs keep their order; translate label and value. Empty German fields stay empty.",
].join(" ");

const FIELDS = ["title", "place", "intro", "body", "ueberschrift", "lesetext", "metaTitle", "metaDescription"];
const schema = {
  type: "object",
  properties: {
    ...Object.fromEntries(FIELDS.map((name) => [name, { type: "string" }])),
    specs: {
      type: "array",
      items: {
        type: "object",
        properties: { label: { type: "string" }, value: { type: "string" } },
        required: ["label", "value"],
        additionalProperties: false,
      },
    },
  },
  required: [...FIELDS, "specs"],
  additionalProperties: false,
};

return $input
  .all()
  .filter(({ json }) => json.needsEnglish)
  .map(({ json: project }) => ({
    json: {
      documentId: project.documentId,
      specCount: project.specs.length,
      request: claudeRequest({
        system: SYSTEM,
        schema,
        user: JSON.stringify({
          title: project.title,
          place: project.place,
          intro: project.intro,
          body: project.body,
          ueberschrift: project.ueberschrift,
          lesetext: project.lesetext,
          metaTitle: project.seo.metaTitle,
          metaDescription: project.seo.metaDescription,
          specs: project.specs,
        }),
      }),
    },
  }));
