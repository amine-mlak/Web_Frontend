/**
 * n8n Code node "Artikel: bauen" (workflow "BEER Ratgeber").
 * Turns Claude's article into a Strapi draft: free address, category, cover and slider
 * photos from the topic's projects, and links checked against the allowed pages.
 */

const store = $getWorkflowStaticData("global");
const bestand = ratgeberBestand();
const { topicId } = $("Artikel: Anfrage").first().json;
const topic = store.topics?.[topicId];
const answer = claudeAnswer($input.first().json);
if (!topic) return [];
if (answer.error) {
  topic.status = "offen";
  topic.error = answer.error;
  return [];
}
const article = answer.value;

const taken = new Set(bestand.articles.map((a) => a.slug));
const base = slugify(article.slug || article.title);
let slug = base;
for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

// Links Claude was not given are turned back into plain text.
const allowed = new Set([
  ...ratgeberLinks(bestand).map((line) => line.split(" – ")[0]),
  ...topic.projects.map((s) => `/projekte/${s}`),
]);
const removed = [];
const body = article.body.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
  if (allowed.has(href)) return match;
  removed.push(href);
  return text;
});

const projects = bestand.projects.filter((p) => topic.projects.includes(p.slug));
const photos = projects.flatMap((p) => [p.image, ...(p.gallery ?? [])]).filter(Boolean);
const unique = [...new Map(photos.map((m) => [m.id, m])).values()];
const cover = unique[0];
const slider = unique.slice(1, 7);
const category = bestand.categories.find((c) => c.slug === article.category);

const blocks = [{ __component: "shared.rich-text", body }];
if (slider.length) blocks.push({ __component: "shared.slider", files: slider.map((p) => p.id) });

topic.draft = { title: article.title, slug, checks: article.checks ?? [], note: article.note ?? "", removedLinks: removed, words: body.split(/\s+/).length };
return [
  {
    json: {
      topicId,
      payload: JSON.stringify({
        data: {
          title: article.title.slice(0, 120),
          description: article.description.slice(0, 80),
          slug,
          blocks,
          ...(cover ? { cover: cover.id } : {}),
          ...(category ? { category: category.documentId } : {}),
        },
      }),
    },
  },
];
