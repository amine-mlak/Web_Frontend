/**
 * n8n Code node "Alt-Text merken" (workflow "BEER Projekttexte").
 * Pairs Claude's answers with the "Fotos" items and stores the proposed descriptions.
 * Nothing is written to the CMS here; that happens only after "Übernehmen".
 */

const store = $getWorkflowStaticData("global");
const photos = $("Fotos").all().map((item) => item.json);

$input.all().forEach((item, i) => {
  const { documentId, photo } = photos[i] ?? {};
  const proposal = store.proposals?.[documentId];
  if (!proposal) return;
  const answer = claudeAnswer(item.json);
  const alt = String(answer.value?.alt ?? "")
    .replace(/\s+/g, " ")
    .replace(/^(bild|foto|ansicht)( von| einer| eines)?:?\s+/i, "")
    .trim();
  if (answer.error || !alt) {
    proposal.errors.push(`Foto ${photo.id}: ${answer.error ?? "leere Beschreibung"}`);
    return;
  }
  proposal.alt[photo.id] = { id: photo.id, thumb: photo.thumb, old: photo.old, text: alt.slice(0, 160) };
});

return [{ json: { stored: $input.all().length } }];
