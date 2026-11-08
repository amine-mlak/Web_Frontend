/**
 * n8n Code node "Auswahl" (workflow "BEER Mediathek").
 * Reads the whole media library (Strapi returns every file in one list) and picks the next
 * photos that still have a weak description and no stored proposal. One item per photo.
 * Each run takes BATCH photos, so with Kimi's limit of about one request in 45 seconds a run
 * fits into the 15 minutes between two schedule runs.
 */

const BATCH = AI_PROVIDER === "kimi" ? 15 : 60;
const MAX_TRIES = 3;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const store = $getWorkflowStaticData("global");
store.media ??= {};

const files = $input.all().map((item) => item.json);
const failed = files.find((file) => !file.id || file.error);
if (failed || !files.length) {
  store.lastScan = { at: new Date().toISOString(), error: failed?.error?.message ?? failed?.message ?? "Mediathek leer oder nicht lesbar" };
  return [];
}

const open = files.filter((file) => {
  if (!IMAGE_TYPES.includes(String(file.mime).toLowerCase()) || !weakAlt(file.alternativeText)) return false;
  const known = store.media[file.id];
  return !known || (known.s === "fehler" && (known.c ?? 0) < MAX_TRIES);
});
store.lastScan = { at: new Date().toISOString(), files: files.length, open: open.length };

const photoUrl = (media) => `${CMS}${media.formats?.medium?.url ?? media.formats?.small?.url ?? media.url}`;
return open
  .sort((a, b) => b.id - a.id)
  .slice(0, BATCH)
  .map((file) => ({ json: { photo: { id: file.id, url: photoUrl(file), old: file.alternativeText ?? "", oldName: file.name ?? "", ext: file.ext ?? "" } } }));
