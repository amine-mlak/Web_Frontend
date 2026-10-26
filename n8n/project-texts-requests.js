/**
 * n8n Code node "Auftrag" (workflow "BEER Projekttexte").
 * Started by the button on the review page (POST …/beer-texte/vorschlaege) or by the
 * schedule. Builds the Strapi reads; "Auswahl" picks the projects to work on.
 * Body fields (all optional): documentId, limit (default 3).
 */


const input = $input.first()?.json ?? {};
const body = input.body ?? {};
const params = {
  documentId: String(body.documentId ?? "").trim() || null,
  limit: Math.min(Math.max(Number(body.limit) || 3, 1), 10),
};

const items = [];
for (let page = 1; page <= 3; page++) {
  const paging = { "pagination[page]": page, "pagination[pageSize]": 50 };
  items.push({
    json: {
      ...params,
      kind: "de",
      url: `${CMS}/api/projects?${qs({
        ...paging,
        status: "draft",
        locale: "de",
        "fields[0]": "title",
        "fields[1]": "slug",
        "fields[2]": "place",
        "fields[3]": "intro",
        "fields[4]": "body",
        "fields[5]": "ueberschrift",
        "fields[6]": "lesetext",
        "fields[7]": "year",
        "fields[8]": "order",
        "fields[9]": "createdAt",
        "populate[image][fields][0]": "alternativeText",
        "populate[image][fields][1]": "url",
        "populate[image][fields][2]": "formats",
        "populate[gallery][fields][0]": "alternativeText",
        "populate[gallery][fields][1]": "url",
        "populate[gallery][fields][2]": "formats",
        "populate[specs]": "true",
        "populate[seo]": "true",
      })}`,
    },
  });
  items.push({
    json: {
      ...params,
      kind: "published",
      url: `${CMS}/api/projects?${qs({ ...paging, status: "published", locale: "de", "fields[0]": "slug" })}`,
    },
  });
  items.push({
    json: {
      ...params,
      kind: "en",
      url: `${CMS}/api/projects?${qs({ ...paging, status: "draft", locale: "en", "fields[0]": "slug" })}`,
    },
  });
}
return items;
