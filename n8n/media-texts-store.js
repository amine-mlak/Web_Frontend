/**
 * n8n Code node "Alt-Text merken" (workflow "BEER Mediathek").
 * Checks each AI answer with the same rules as "BEER Projekttexte" and stores it. A clean text
 * is marked "bereit" and saved to Strapi in the same run; one with a warning waits on the review
 * page ("prüfen"). A refused answer counts as a failed try and comes back on a later run.
 */

const REFUSED = [
  [/\b(kaufen|nach maß|küchenstudio|schreinerei|manufaktur)\b/i, "Suchwort oder Firmenbezeichnung"],
  [/\bbeer\b/i, "Firmenname"],
  [/\b(traum|wunderschön|schön|modern|hochwertig|luxus|luxuriös|perfekt|exklusiv|stilvoll)|\bedel(e|en|er|es)?\b/i, "Wertung"],
];
// Counts above two were often wrong on project photos; dates on a poster are fine.
const COUNTS = /\b(drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|dreifach)\b/i;

const refusal = (alt) => {
  if (alt.length < 40 || alt.length > 140) return `${alt.length} Zeichen`;
  if (/^[a-zäöü\d]/.test(alt)) return "beginnt klein";
  for (const [pattern, reason] of REFUSED) if (pattern.test(alt)) return reason;
  if (COUNTS.test(alt)) return "Anzahl";
  return "";
};

const store = $getWorkflowStaticData("global");
store.media ??= {};
const jobs = $("Anfrage bauen").all().map((item) => item.json);
const texts = new Map(Object.entries(store.media).filter(([, m]) => m.t).map(([id, m]) => [m.t.toLowerCase(), id]));

$input.all().forEach((item, i) => {
  const { photo } = jobs[i] ?? {};
  if (!photo) return;
  const known = store.media[photo.id];
  const fail = (error) => (store.media[photo.id] = { s: "fehler", c: (known?.c ?? 0) + 1, e: error, o: photo.old, at: new Date().toISOString() });
  const answer = claudeAnswer(item.json);
  const value = answer.value ?? {};
  const alt = String(value.alt ?? "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .replace(/^(bild|foto|ansicht)( von)?( einer| einem| eines| der| dem| den)?:?\s+/i, "")
    .replace(/\.$/, "")
    .trim();
  if (answer.error || !alt) return fail(answer.error ?? "leere Beschreibung");
  const refused = refusal(alt);
  if (refused) return fail(`abgelehnt (${refused}): ${alt}`);

  const warnings = [];
  if (value.unsicher) warnings.push(`KI unsicher: ${value.unsicher}`);
  const same = texts.get(alt.toLowerCase());
  if (same && same !== String(photo.id)) warnings.push(`gleicher Text wie Foto ${same}`);
  texts.set(alt.toLowerCase(), String(photo.id));

  store.media[photo.id] = {
    s: warnings.length ? "prüfen" : "bereit",
    t: alt,
    n: photoName("", alt, photo.ext),
    x: photo.ext,
    u: photo.url,
    o: photo.old,
    b: value.bildart,
    v: value.sichtbar ?? [],
    w: warnings,
    at: new Date().toISOString(),
  };
});

return [{ json: { stored: $input.all().length } }];
