/**
 * n8n Code node "Abfragen" (workflow "BEER SEO-Prüfung").
 * One Strapi request per content type, status and page. The next node ("Strapi lesen")
 * sends them with the Strapi credential; "Prüfen" pairs answers with these items by index.
 */



const fields = (list) => Object.fromEntries(list.map((name, i) => [`fields[${i}]`, name]));

const CATALOG = {
  ...fields(["name", "slug", "intro", "updatedAt"]),
  "populate[image][fields][0]": "alternativeText",
  "populate[seo]": "true",
};

const TYPES = [
  {
    api: "projects",
    pages: 3,
    query: {
      ...fields(["title", "slug", "place", "year", "intro", "body", "updatedAt"]),
      "populate[image][fields][0]": "alternativeText",
      "populate[gallery][fields][0]": "alternativeText",
      "populate[gallery][fields][1]": "name",
      "populate[seo]": "true",
      "populate[regions][fields][0]": "slug",
      "populate[topics][fields][0]": "slug",
    },
  },
  { api: "kitchen-topics", query: { ...CATALOG, "fields[4]": "cluster" } },
  { api: "regions", query: CATALOG },
  { api: "materials", query: CATALOG },
  { api: "appliances", query: CATALOG },
  { api: "brands", query: CATALOG },
  { api: "furniture-items", query: CATALOG },
  {
    api: "site-pages",
    query: {
      ...fields(["title", "slug", "intro", "updatedAt"]),
      "populate[image][fields][0]": "alternativeText",
    },
  },
  {
    api: "articles",
    query: {
      ...fields(["title", "slug", "description", "updatedAt"]),
      "populate[cover][fields][0]": "alternativeText",
      "populate[category][fields][0]": "slug",
    },
  },
];

const PAGE_SIZE = 50;
const items = [];
for (const type of TYPES) {
  for (let page = 1; page <= (type.pages ?? 1); page++) {
    const paging = { "pagination[page]": page, "pagination[pageSize]": PAGE_SIZE };
    // German drafts with all fields, plus the published German and the English drafts
    // (only ids), to tell what is unpublished, changed or missing in English.
    for (const [status, locale, query] of [
      ["draft", "de", type.query],
      ["published", "de", fields(["updatedAt"])],
      ["draft", "en", fields(["slug"])],
    ]) {
      items.push({
        json: {
          api: type.api,
          status,
          locale,
          page,
          url: `${CMS}/api/${type.api}?${qs({ ...query, ...paging, status, locale })}`,
        },
      });
    }
  }
}
return items;
