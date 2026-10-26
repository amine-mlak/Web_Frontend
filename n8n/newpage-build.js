/**
 * n8n Code node "Bauen" (workflow "BEER Neue Seite"): the Strapi draft for the chosen type,
 * with only the fields that type has.
 */

const { plan } = $("Plan").first().json;
const project = $input.first().json?.data?.[0];
const t = plan.type;

const common = {
  slug: plan.slug,
  intro: plan.intro,
  ueberschrift: plan.ueberschrift,
  betonung: plan.betonung,
  seitentitel: plan.seitentitel,
  lesetext: plan.lesetext,
  aussage: plan.aussage,
  hinweis: plan.hinweis,
  schlussTitel: plan.schlussTitel,
  schlussText: plan.schlussText,
  ...(plan.zitat ? { zitat: plan.zitat, zitatQuelle: plan.zitatQuelle } : {}),
  punkte: (plan.punkte ?? []).slice(0, 3),
  stichworte: (plan.stichworte ?? []).slice(0, 4),
  ...(project?.image?.id ? { image: project.image.id } : {}),
};

let data;
if (t === "site-pages") {
  // Fixed pages use "title" and "body", have no "ueberschrift"/"lesetext" and no SEO block
  // (the intro is the description).
  const { ueberschrift, lesetext, ...rest } = common;
  data = { ...rest, title: plan.name, body: lesetext };
  void ueberschrift;
} else {
  data = { ...common, name: plan.name, seo: { metaTitle: plan.metaTitle, metaDescription: plan.metaDescription } };
  if (t === "kitchen-topics") data.cluster = ["formen", "stile", "farben", "inseln", "besondere"].includes(plan.cluster) ? plan.cluster : "besondere";
  if (t === "materials") data.kind = ["front", "worktop", "interior"].includes(plan.kind) ? plan.kind : "front";
  if (t === "appliances") data.kind = ["kochen", "backen", "kaelte", "spuelen", "extra"].includes(plan.kind) ? plan.kind : "extra";
  if (t === "furniture-items" && plan.kind) data.kind = plan.kind;
}

return [{ json: { type: t, url: `${CMS}/api/${t}?${qs({ status: "draft", locale: "de" })}`, payload: JSON.stringify({ data }), project: project?.title ?? null } }];
