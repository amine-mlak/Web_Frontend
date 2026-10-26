/**
 * n8n Code node "Auswahl" (workflow "BEER Projekttexte").
 * Pairs the Strapi answers with the "Auftrag" items, then picks the projects that still
 * need photo descriptions or an English version and have no open proposal yet.
 * Output: one item per chosen project.
 */

// English drafts stay off for now: Strapi copies a project's shared fields (photos, year,
// topic links) from whichever language is saved to the other one, and an English project
// cannot link to the topics yet because they exist only in German. Publishing such an
// English draft would wipe the German links. Switch on once the topics exist in English
// and this has been tried on a copy of the CMS.
const ENGLISH = false;
const requests = $("Auftrag").all().map((item) => item.json);
const answers = $input.all().map((item) => item.json);
const store = $getWorkflowStaticData("global");
store.proposals ??= {};

const { documentId, limit } = requests[0] ?? {};
const projects = [];
const english = new Set();
const published = new Set();
answers.forEach((answer, i) => {
  for (const entry of Array.isArray(answer?.data) ? answer.data : []) {
    if (requests[i]?.kind === "en") english.add(entry.documentId);
    else if (requests[i]?.kind === "published") published.add(entry.documentId);
    else projects.push(entry);
  }
});
// Published projects, and new drafts on their way there; drafts that were taken offline
// on purpose (older and unpublished) are left alone.
const RECENT = Date.now() - 14 * 24 * 3600 * 1000;
const current = (project) => published.has(project.documentId) || new Date(project.createdAt).getTime() > RECENT;

const photoUrl = (media) => `${CMS}${media.formats?.medium?.url ?? media.formats?.small?.url ?? media.url}`;
const thumbUrl = (media) => `${CMS}${media.formats?.thumbnail?.url ?? media.formats?.small?.url ?? media.url}`;

const chosen = [];
for (const project of projects) {
  // Without an explicit project: skip open and rejected proposals, so the schedule does not
  // ask Claude again for something a person still has to look at or already turned down.
  const earlier = store.proposals[project.documentId]?.status;
  if (documentId ? project.documentId !== documentId : !current(project) || earlier === "offen" || earlier === "verworfen") continue;
  const media = [project.image, ...(project.gallery ?? [])].filter(Boolean);
  const unique = [...new Map(media.map((m) => [m.id, m])).values()];
  const photos = unique
    .filter((m) => weakAlt(m.alternativeText))
    .map((m) => ({ id: m.id, url: photoUrl(m), thumb: thumbUrl(m), old: m.alternativeText ?? "" }));
  const needsEnglish = ENGLISH && !english.has(project.documentId);
  if (!documentId && !photos.length && !needsEnglish) continue;
  chosen.push({
    json: {
      documentId: project.documentId,
      slug: project.slug,
      title: project.title,
      place: project.place ?? "",
      intro: project.intro ?? "",
      body: project.body ?? "",
      ueberschrift: project.ueberschrift ?? "",
      lesetext: project.lesetext ?? "",
      specs: (project.specs ?? []).map(({ label, value }) => ({ label, value })),
      seo: { metaTitle: project.seo?.metaTitle ?? "", metaDescription: project.seo?.metaDescription ?? "" },
      // Shared with every language; sent along with the English draft so saving it
      // cannot empty them on the German version.
      shared: {
        year: project.year ?? null,
        order: project.order ?? null,
        image: project.image?.id ?? null,
        gallery: (project.gallery ?? []).map((m) => m.id),
      },
      photos,
      needsEnglish,
    },
  });
  if (chosen.length >= limit) break;
}

// Start a fresh proposal for each chosen project; the branches fill it in.
for (const { json } of chosen) {
  store.proposals[json.documentId] = {
    documentId: json.documentId,
    slug: json.slug,
    title: json.title,
    createdAt: new Date().toISOString(),
    status: "offen",
    alt: {},
    en: null,
    shared: json.shared,
    errors: [],
  };
}
return chosen;
