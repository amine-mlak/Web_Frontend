/**
 * n8n Code node "Speichern vorbereiten" (workflow "BEER Mediathek").
 * One item per stored text marked "bereit": new ones from this run and ones a run before could
 * not save (for example while the Strapi token had no write permission). Media has no drafts in
 * Strapi, so the description and file name apply at once; the address under /uploads stays.
 */

const PER_RUN = 200;
const store = $getWorkflowStaticData("global");
return Object.entries(store.media ?? {})
  .filter(([, media]) => media.s === "bereit" && media.t)
  .slice(0, PER_RUN)
  .map(([id, media]) => ({ json: { id: Number(id), alt: media.t, name: media.n, fileInfo: JSON.stringify({ alternativeText: media.t, name: media.n }) } }));
