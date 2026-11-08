/**
 * n8n Code node "Aktion" (workflow "BEER Mediathek").
 * Button "Übernehmen" on the review page: every photo waiting for review gets what stands in
 * its field (a person's correction wins) and is marked "bereit"; an emptied field marks it
 * "verworfen" so it is not asked again. "Speichern vorbereiten" then sends all "bereit" ones.
 * Button "Jetzt speichern" only sends what is already "bereit".
 */

const store = $getWorkflowStaticData("global");
const body = $input.first()?.json?.body ?? {};
store.media ??= {};

if (body.aktion === "uebernehmen") {
  for (const [key, value] of Object.entries(body)) {
    const id = key.startsWith("alt_") ? key.slice(4) : "";
    const media = store.media[id];
    if (!media || media.s !== "prüfen") continue;
    const text = String(value ?? "").normalize("NFC").replace(/\s+/g, " ").replace(/\.$/, "").trim();
    if (!text) {
      media.s = "verworfen";
      continue;
    }
    media.t = text;
    media.n = photoName("", text, media.x);
    media.s = "bereit";
  }
}

return [{ json: { aktion: body.aktion ?? "" } }];
