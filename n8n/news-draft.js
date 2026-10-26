/**
 * n8n Code node "Entwurf" (workflow "BEER Meldungen").
 * Builds the article draft from Claude's plan and the three Strapi lookups. The next node
 * saves it with status=draft; nothing here publishes.
 */

const { plan } = $("Plan").first().json;
const categories = $("Kategorien lesen").first().json?.data ?? [];
const projects = $("Projekt suchen").first().json?.data ?? [];
const existing = $input.first().json?.data ?? [];
const taken = new Set(existing.map((a) => a.slug));

let slug = plan.slug;
for (let n = 2; taken.has(slug); n++) slug = `${plan.slug}-${n}`;

const category = categories.find((c) => c.slug === plan.category);
const project = projects[0];
const photos = project ? [project.image, ...(project.gallery ?? [])].filter(Boolean) : [];
const cover = photos[0];
const more = photos.slice(1, 7).filter((p) => p.id !== cover?.id);

const blocks = [{ __component: "shared.rich-text", body: plan.body }];
if (plan.quote?.text) blocks.push({ __component: "shared.quote", body: plan.quote.text, title: plan.quote.by || "" });
if (more.length) blocks.push({ __component: "shared.slider", files: more.map((p) => p.id) });

const data = {
  title: plan.title.slice(0, 120),
  description: plan.description.slice(0, 80),
  slug,
  blocks,
  ...(cover ? { cover: cover.id } : {}),
  ...(category ? { category: category.documentId } : {}),
};

return [
  {
    json: {
      payload: JSON.stringify({ data }),
      slug,
      categoryMissing: plan.category && !category ? plan.category : null,
      project: project ? { title: project.title, slug: project.slug, photos: photos.length } : null,
      // Drafts whose address starts the same way are probably about the same thing.
      similar: existing.map((a) => a.slug),
      gbpPost: plan.gbpPost,
      socialPost: plan.socialPost,
    },
  },
];
