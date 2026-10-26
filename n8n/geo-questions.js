/**
 * n8n Code node "Fragen" (workflow "BEER GEO-Monitor").
 * One Claude request with web search per buyer question, answered the way an AI assistant
 * would answer someone near Freising. The run is recorded in "Auswerten".
 */

const store = $getWorkflowStaticData("global");
store.questions ??= [...GEO_QUESTIONS];
const questions = store.questions.slice(0, 20);
const runId = new Date().toISOString();

const SYSTEM = `Du bist ein KI-Suchassistent. Eine Person aus der Gegend um Freising (Oberbayern) stellt dir eine Frage. Suche im Web und beantworte sie so, wie du es für diese Person tun würdest: konkret, mit Namen von Betrieben, wenn die Frage danach verlangt.

Gib danach eine Auswertung zurück:
- answer: deine Antwort, höchstens 700 Zeichen.
- businesses: alle Betriebe, die du in der Antwort nennst, mit name und url (leer, wenn keine).
- beerNamed: true, wenn du die BEER Küchenmanufaktur nennst.
- beerSource: true, wenn du eine Seite von beer.de als Quelle nutzt.
- sources: die Adressen, auf die sich die Antwort stützt (höchstens acht).`;

const schema = {
  type: "object",
  properties: {
    answer: { type: "string" },
    businesses: {
      type: "array",
      items: { type: "object", properties: { name: { type: "string" }, url: { type: "string" } }, required: ["name", "url"], additionalProperties: false },
    },
    beerNamed: { type: "boolean" },
    beerSource: { type: "boolean" },
    sources: { type: "array", items: { type: "string" } },
  },
  required: ["answer", "businesses", "beerNamed", "beerSource", "sources"],
  additionalProperties: false,
};

return questions.map((question) => ({
  json: { runId, question, request: claudeRequest({ system: SYSTEM, user: question, schema, effort: "medium", webSearch: 4 }) },
}));
