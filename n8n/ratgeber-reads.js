/**
 * n8n Code node "Bestand lesen: Auftrag" (workflow "BEER Ratgeber").
 * Strapi reads for both steps (topic ideas and writing): existing articles, the FAQ
 * questions with BEER's own answers, kitchen topics (for links), categories and projects.
 * The trigger item is passed through as `trigger` so the next nodes know what was asked.
 */

const trigger = $input.first()?.json ?? {};
const pageOf = (n) => ({ "pagination[page]": n, "pagination[pageSize]": 100 });
const reads = [
  ["articles", { ...pageOf(1), status: "draft", locale: "de", "fields[0]": "title", "fields[1]": "slug", "fields[2]": "description", "populate[category][fields][0]": "slug" }],
  ["faq", { ...pageOf(1), locale: "de", "fields[0]": "question", "fields[1]": "answer" }],
  ["topics", { ...pageOf(1), locale: "de", "fields[0]": "name", "fields[1]": "slug", "fields[2]": "cluster" }],
  ["categories", { ...pageOf(1), locale: "de", "fields[0]": "slug", "fields[1]": "name" }],
  ...[1, 2].map((n) => [
    "projects",
    {
      ...pageOf(n),
      locale: "de",
      "fields[0]": "title",
      "fields[1]": "slug",
      "fields[2]": "intro",
      "fields[3]": "body",
      "populate[specs]": "true",
      "populate[image][fields][0]": "name",
      "populate[gallery][fields][0]": "name",
      "populate[topics][fields][0]": "slug",
    },
  ]),
];
const API = { articles: "articles", faq: "faq-items", topics: "kitchen-topics", categories: "categories", projects: "projects" };
return reads.map(([kind, query]) => ({ json: { kind, trigger, url: `${CMS}/api/${API[kind]}?${qs(query)}` } }));
