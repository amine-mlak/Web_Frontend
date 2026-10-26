/**
 * n8n Code node "Anfrage" (workflow "BEER Neue Seite").
 * Builds the Claude request: from the team's brief, a page draft of the right type in the
 * house style, or one question back. Notes of a chat session are kept until a draft exists.
 */

const store = $getWorkflowStaticData("global");
store.sessions ??= {};
const requests = $("Bestand: Auftrag").all().map((i) => i.json);
const answers = $input.all().map((i) => i.json);
const existing = {};
let example = null;
answers.forEach((a, i) => {
  const kind = requests[i]?.kind;
  if (kind === "beispiel") example = a?.data?.[0] ?? null;
  else if (Array.isArray(a?.data)) existing[kind] = a.data.map((e) => `${e.title ?? e.name} (${e.slug})`);
});

const { chatInput = "", sessionId = "ohne-sitzung" } = requests[0]?.chat ?? {};
const earlier = store.sessions[sessionId];
const notes = [earlier?.open ? earlier.notes : "", String(chatInput).trim()].filter(Boolean).join("\n\n");
store.sessions[sessionId] = { notes, open: false, at: new Date().toISOString() };

const LABEL = {
  "site-pages": "Feste Seite (z. B. Über uns, Nachhaltigkeit, Karriere)",
  "kitchen-topics": "Küchen-Thema (Farbe, Stil, Form, Insel, Besonderes)",
  materials: "Material (Front, Arbeitsplatte, Innenausstattung)",
  appliances: "Gerät (Kochen, Backen, Kälte, Spülen, Extra)",
  brands: "Marke",
  "furniture-items": "Möbel außerhalb der Küche",
  regions: "Region",
};

const SYSTEM = `Du legst neue Seiten für die Website der BEER Küchenmanufaktur an.
${BEER_FACTS}

Aus der Notiz der Redaktion entsteht ein Seitenentwurf im Stil der vorhandenen Seiten. Stil: kurze, ruhige Sätze wie aus der Werkstatt, konkrete Dinge statt Adjektive, keine Superlative, keine Werbefloskeln, keine Ausrufezeichen. Das Beispiel unten zeigt Ton und Länge der Felder.

Regeln:
- Zuerst den Seitentyp bestimmen: ${Object.entries(LABEL).map(([k, v]) => `"${k}" = ${v}`).join("; ")}.
- Gibt es schon eine Seite zum selben Thema (Liste unten), oder ist unklar, worum es gehen soll: action "frage" mit genau einer kurzen Rückfrage; alle anderen Felder leer.
- Nur Fakten aus der Notiz, dem Beispiel und den Firmenangaben. Keine erfundenen Zahlen, Preise, Namen. „zitat“ nur, wenn die Notiz ein echtes Zitat enthält – sonst zitat und zitatQuelle leer.
- cluster nur bei kitchen-topics (formen, stile, farben, inseln, besondere); kind bei materials (front, worktop, interior) und appliances (kochen, backen, kaelte, spuelen, extra); sonst leer.
- name: Seitenname, höchstens 40 Zeichen. slug: a–z, 0–9, Bindestriche, ä→ae, ö→oe, ü→ue, ß→ss.
- intro: ein Satz, höchstens 160 Zeichen. ueberschrift: höchstens 60 Zeichen, betonung ist ein Teil davon. seitentitel: ein bis drei Wörter.
- lesetext: zwei bis vier kurze Absätze. aussage: ein bis zwei Sätze. hinweis: ein Satz. schlussTitel: höchstens 40 Zeichen. schlussText: ein bis zwei Sätze.
- punkte: genau drei, je titel (ein Wort) und text (zwei kurze Zeilen, mit \\n getrennt). stichworte: genau vier, je wert (ein Wort) und zeile (zwei bis drei Wörter).
- metaTitle: 40–60 Zeichen. metaDescription: 120–155 Zeichen.
- projectWords: zwei bis drei markante Wörter aus dem Titel eines Projekts, das als Titelbild passt; sonst leer.`;

const str = { type: "string" };
const pair = (a, b) => ({ type: "object", properties: { [a]: str, [b]: str }, required: [a, b], additionalProperties: false });
const fields = ["frage", "name", "slug", "cluster", "kind", "intro", "ueberschrift", "betonung", "seitentitel", "lesetext", "aussage", "hinweis", "zitat", "zitatQuelle", "schlussTitel", "schlussText", "metaTitle", "metaDescription"];
const schema = {
  type: "object",
  properties: {
    action: { type: "string", enum: ["frage", "entwurf"] },
    type: { type: "string", enum: [...Object.keys(LABEL), ""] },
    ...Object.fromEntries(fields.map((f) => [f, str])),
    punkte: { type: "array", items: pair("titel", "text") },
    stichworte: { type: "array", items: pair("wert", "zeile") },
    projectWords: { type: "array", items: str },
  },
  required: ["action", "type", ...fields, "punkte", "stichworte", "projectWords"],
  additionalProperties: false,
};

const sample = example
  ? JSON.stringify({ name: example.name, intro: example.intro, ueberschrift: example.ueberschrift, betonung: example.betonung, seitentitel: example.seitentitel, lesetext: example.lesetext, aussage: example.aussage, hinweis: example.hinweis, schlussTitel: example.schlussTitel, schlussText: example.schlussText, punkte: example.punkte?.map(({ titel, text }) => ({ titel, text })), stichworte: example.stichworte?.map(({ wert, zeile }) => ({ wert, zeile })), metaTitle: example.seo?.metaTitle, metaDescription: example.seo?.metaDescription }, null, 1)
  : "(kein Beispiel verfügbar)";

const user = `Notiz der Redaktion:
${notes}

Beispiel einer fertigen Seite (Küchen-Thema „Weiße Küchen“):
${sample}

Vorhandene Seiten:
${Object.entries(existing).map(([k, list]) => `${LABEL[k]}: ${list.join(", ")}`).join("\n")}`;

return [{ json: { sessionId, notes, existing, request: claudeRequest({ system: SYSTEM, user, schema, effort: "high" }) } }];
