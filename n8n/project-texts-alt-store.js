/**
 * n8n Code node "Alt-Text merken" (workflow "BEER Projekttexte").
 * Pairs the AI answers with the "Anfrage bauen" items, checks each description and stores it.
 * A description that breaks a rule is refused and listed as an error. One with a warning is
 * shown for review, and "Übernehmen" leaves it out. Nothing is written to the CMS here.
 */

const REFUSED = [
  [/\b(kaufen|nach maß|küchenstudio|schreinerei|manufaktur)\b/i, "Suchwort oder Firmenbezeichnung"],
  [/\bbeer\b/i, "Firmenname"],
  [/\b(traum|wunderschön|schön|modern|hochwertig|luxus|luxuriös|perfekt|exklusiv|stilvoll)|\bedel(e|en|er|es)?\b/i, "Wertung"],
  // On the first test project the AI miscounted knobs and ovens, so only "zwei" is allowed.
  [/\b(drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|dreifach|\d+)\b/i, "Anzahl"],
];
const BRANDS = /\b(bora|miele|gaggenau|siemens|quooker|fenix|neff|bosch|blanco|franke|dornbracht|liebherr|v-zug)\b/gi;

const refusal = (alt, place) => {
  if (alt.length < 40 || alt.length > 140) return `${alt.length} Zeichen`;
  if (/^[a-zäöü\d]/.test(alt)) return "beginnt klein";
  for (const [pattern, reason] of REFUSED) if (pattern.test(alt)) return reason;
  const towns = String(place ?? "").split(/[\s,/]+/).filter((word) => word.length > 3 && !/^raum$/i.test(word));
  if (towns.some((town) => alt.toLowerCase().includes(town.toLowerCase()))) return "nennt den Ort";
  return "";
};

const store = $getWorkflowStaticData("global");
const jobs = $("Anfrage bauen").all().map((item) => item.json);
const used = new Map();

$input.all().forEach((item, i) => {
  const { documentId, photo, place, facts } = jobs[i] ?? {};
  const proposal = store.proposals?.[documentId];
  if (!proposal) return;
  const answer = claudeAnswer(item.json);
  const value = answer.value ?? {};
  const alt = String(value.alt ?? "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .replace(/^(bild|foto|ansicht)( von)?( einer| einem| eines| der| dem| den)?:?\s+/i, "")
    .replace(/\.$/, "")
    .trim();
  if (answer.error || !alt) {
    proposal.errors.push(`Foto ${photo.id}: ${answer.error ?? "leere Beschreibung"}`);
    return;
  }
  const refused = refusal(alt, place);
  if (refused) {
    proposal.errors.push(`Foto ${photo.id}: abgelehnt (${refused}): ${alt}`);
    return;
  }
  const warnings = [];
  if (value.unsicher) warnings.push(`KI unsicher: ${value.unsicher}`);
  if (value.bildart === "anderes") warnings.push("kein Möbel oder Innenraum erkannt");
  const seen = alt.toLowerCase();
  if (used.has(seen)) warnings.push(`gleicher Text wie Foto ${used.get(seen)}`);
  else used.set(seen, photo.id);
  const elsewhere = Object.values(store.proposals)
    .filter((other) => other.documentId !== documentId)
    .find((other) => Object.values(other.alt ?? {}).some((earlier) => earlier.text.toLowerCase() === seen));
  if (elsewhere) warnings.push(`gleicher Text wie in „${elsewhere.title}“`);
  const brands = (alt.match(BRANDS) ?? []).filter((brand) => !facts.toLowerCase().includes(brand.toLowerCase()));
  if (brands.length) warnings.push(`Marke nicht in den Projektangaben: ${brands.join(", ")}`);
  proposal.alt[photo.id] = { id: photo.id, thumb: photo.thumb, full: photo.url, old: photo.old, text: alt, bildart: value.bildart, sichtbar: value.sichtbar ?? [], warnings };
});

return [{ json: { stored: $input.all().length } }];
