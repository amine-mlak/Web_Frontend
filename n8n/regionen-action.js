/**
 * n8n Code node "Aktion" (workflow "BEER Regionen"): the buttons and forms.
 * Route 0: write a draft now (town and region of a project, an approved region text).
 * Route 1: read from Strapi, then ask Claude (region text, Business Profile post).
 */

const store = $getWorkflowStaticData("global");
store.regionTexts ??= {};
store.posts ??= {};
store.saved ??= {};
const body = $input.first()?.json?.body ?? {};
const draft = (api, id) => `${CMS}/api/${api}/${id}?${qs({ status: "draft", locale: "de" })}`;

switch (body.aktion) {
  case "zuordnen": {
    const place = String(body.place ?? "").trim().slice(0, 60);
    const data = {};
    if (place) data.place = place;
    if (body.region) data.regions = { set: [{ documentId: body.region }] };
    if (!Object.keys(data).length) return [];
    return [{ json: { route: 0, kind: "projekt", id: body.documentId, url: draft("projects", body.documentId), payload: JSON.stringify({ data }) } }];
  }
  case "uebernehmen": {
    const p = store.regionTexts[body.regionId];
    if (p?.status !== "offen") return [];
    const { metaTitle, metaDescription, ...fields } = p.text;
    const seo = { metaTitle, metaDescription, ...(p.shareImage ? { shareImage: p.shareImage } : {}) };
    return [{ json: { route: 0, kind: "region", id: body.regionId, url: draft("regions", body.regionId), payload: JSON.stringify({ data: { ...fields, seo } }) } }];
  }
  case "verwerfen": {
    const p = store.regionTexts[body.regionId];
    if (p) Object.assign(p, { status: "verworfen", doneAt: new Date().toISOString() });
    return [];
  }
  case "text": {
    store.regionTexts[body.regionId] = { status: "schreibt", startedAt: new Date().toISOString() };
    const region = `${CMS}/api/regions/${body.regionId}?${qs({ status: "draft", locale: "de", "populate[seo][populate][0]": "shareImage" })}`;
    const projects = `${CMS}/api/projects?${qs({ "filters[regions][documentId][$eq]": body.regionId, locale: "de", status: "draft", "pagination[pageSize]": 30, "fields[0]": "title", "fields[1]": "slug", "fields[2]": "place", "fields[3]": "intro", "populate[specs]": "true" })}`;
    return [
      { json: { route: 1, kind: "text", id: body.regionId, part: "region", url: region } },
      { json: { route: 1, kind: "text", id: body.regionId, part: "projects", url: projects } },
    ];
  }
  case "gbp": {
    store.posts[body.documentId] = { status: "schreibt" };
    const url = `${CMS}/api/projects/${body.documentId}?${qs({ locale: "de", "fields[0]": "title", "fields[1]": "slug", "fields[2]": "place", "fields[3]": "intro", "fields[4]": "body", "populate[gallery][fields][0]": "formats", "populate[image][fields][0]": "formats" })}`;
    return [{ json: { route: 1, kind: "gbp", id: body.documentId, part: "project", url } }];
  }
  default:
    return [];
}
