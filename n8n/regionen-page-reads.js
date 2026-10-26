/**
 * n8n Code node "Seite: Auftrag" (workflow "BEER Regionen"): Strapi reads for the page.
 */

const query = $input.first()?.json?.query ?? {};
const projectQuery = (n) => ({
  "pagination[page]": n,
  "pagination[pageSize]": 100,
  status: "draft",
  locale: "de",
  "fields[0]": "title",
  "fields[1]": "slug",
  "fields[2]": "place",
  "fields[3]": "createdAt",
  "populate[regions][fields][0]": "slug",
  "populate[image][fields][0]": "formats",
});
return [
  { json: { kind: "regions", query, url: `${CMS}/api/regions?${qs({ status: "draft", locale: "de", "pagination[pageSize]": 100, "fields[0]": "name", "fields[1]": "slug", "fields[2]": "intro", "fields[3]": "lesetext", "populate[seo]": "true" })}` } },
  { json: { kind: "projects", query, url: `${CMS}/api/projects?${qs(projectQuery(1))}` } },
  { json: { kind: "projects", query, url: `${CMS}/api/projects?${qs(projectQuery(2))}` } },
  { json: { kind: "published", query, url: `${CMS}/api/projects?${qs({ status: "published", locale: "de", "pagination[pageSize]": 100, "fields[0]": "slug", "fields[1]": "publishedAt" })}` } },
];
