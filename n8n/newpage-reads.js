/**
 * n8n Code node "Bestand: Auftrag" (workflow "BEER Neue Seite").
 * Reads the names of the existing pages per type, so Claude can spot overlaps, plus one
 * finished page as the house-style example. The chat message rides along as `chat`.
 */

const chat = $input.first()?.json ?? {};
const TYPES = ["site-pages", "kitchen-topics", "materials", "appliances", "brands", "furniture-items", "regions"];
const items = TYPES.map((api) => ({
  json: {
    chat,
    kind: api,
    url: `${CMS}/api/${api}?${qs({ status: "draft", locale: "de", "pagination[pageSize]": 100, "fields[0]": api === "site-pages" ? "title" : "name", "fields[1]": "slug" })}`,
  },
}));
items.push({
  json: {
    chat,
    kind: "beispiel",
    url: `${CMS}/api/kitchen-topics?${qs({ locale: "de", "filters[slug][$eq]": "weiss", "populate[punkte]": "true", "populate[stichworte]": "true", "populate[seo]": "true" })}`,
  },
});
return items;
