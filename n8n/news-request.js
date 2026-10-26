/**
 * n8n Code node "Auftrag" (workflow "BEER Meldungen").
 * The team writes a few lines in the chat; this builds the Claude request that turns them
 * into an article draft, or into one question back when something essential is missing.
 * Notes from the same chat session are kept until a draft was saved, so an answer to a
 * question back is read together with the first message.
 */

const store = $getWorkflowStaticData("global");
store.sessions ??= {};

const { chatInput = "", sessionId = "ohne-sitzung" } = $input.first()?.json ?? {};
const earlier = store.sessions[sessionId];
const notes = [earlier?.open ? earlier.notes : "", String(chatInput).trim()].filter(Boolean).join("\n\n");
store.sessions[sessionId] = { notes, open: false, at: new Date().toISOString() };

const today = new Date().toLocaleDateString("de-DE", { timeZone: "Europe/Berlin", weekday: "long", day: "numeric", month: "long", year: "numeric" });

const SYSTEM = `Du schreibst Meldungen für die Website der BEER Küchenmanufaktur.
${BEER_FACTS}
Aus den Notizen der Redaktion entsteht ein Artikelentwurf.

Regeln:
- Nur Fakten aus den Notizen und aus den Firmenangaben oben. Nichts erfinden: keine Preise, Zahlen, Namen, Zitate, Öffnungszeiten oder Adressen, die nicht in den Notizen stehen.
- Kundennamen nie nennen.
- Ruhiger, sachlicher Ton wie eine Werkstatt, die ihr Handwerk zeigt. Keine Superlative, keine Ausrufezeichen.
- Der erste Absatz beantwortet Was, Wann und Wo. Bei Terminen danach eine kurze Liste mit Datum, Uhrzeit und Ort.
- Fehlt bei einem Termin Datum, Uhrzeit oder Ort, oder ist unklar, worum es geht: action "frage" mit genau einer kurzen Rückfrage auf Deutsch; alle anderen Felder leer.
- Sonst action "entwurf":
  title: höchstens 70 Zeichen.
  description: Teaser, höchstens 80 Zeichen.
  slug: nur a–z, 0–9 und Bindestriche, ä→ae, ö→oe, ü→ue, ß→ss, höchstens 60 Zeichen.
  category: "presse" für Neuigkeiten, Termine, Auszeichnungen und gezeigte Projekte; "kosten", "planung", "geraete" oder "material", wenn es ein Ratgeber zu diesem Thema ist.
  body: Markdown, 120 bis 400 Wörter, kurze Absätze, Zwischenüberschriften (##) nur bei längeren Texten.
  quote: nur wenn in den Notizen ein Zitat mit Person steht, sonst text und by leer.
  projectWords: zwei bis drei markante Wörter aus dem Titel eines Projekts, wenn die Meldung eine bestimmte Küche zeigt; sonst leer.
  gbpPost: Text für das Google-Unternehmensprofil, höchstens 1200 Zeichen, ohne Hashtags.
  socialPost: Text für Instagram und Facebook, höchstens 600 Zeichen, bis zu fünf Hashtags am Ende.`;

const str = { type: "string" };
const schema = {
  type: "object",
  properties: {
    action: { type: "string", enum: ["frage", "entwurf"] },
    frage: str,
    title: str,
    description: str,
    slug: str,
    category: { type: "string", enum: ["presse", "kosten", "planung", "geraete", "material", ""] },
    body: str,
    quote: { type: "object", properties: { text: str, by: str }, required: ["text", "by"], additionalProperties: false },
    projectWords: { type: "array", items: str },
    gbpPost: str,
    socialPost: str,
  },
  required: ["action", "frage", "title", "description", "slug", "category", "body", "quote", "projectWords", "gbpPost", "socialPost"],
  additionalProperties: false,
};

return [
  {
    json: {
      sessionId,
      notes,
      request: claudeRequest({ system: SYSTEM, schema, user: `Heute ist ${today}.\n\nNotizen der Redaktion:\n${notes}` }),
    },
  },
];
