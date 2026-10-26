/**
 * n8n Code node "Aktion" (workflow "BEER SEO-Vorschläge"): "Übernehmen" (one or all) and
 * "Verwerfen". Each entry to write goes on as one item: first its draft is read (to keep
 * the share image), then the new SEO text is saved into the German draft.
 */

const store = $getWorkflowStaticData("global");
const body = $input.first()?.json?.body ?? {};
const open = Object.values(store.proposals ?? {}).filter((p) => p.status === "offen");
const chosen = body.documentId === "alle" ? open : open.filter((p) => p.documentId === body.documentId);

if (body.aktion === "verwerfen") {
  for (const p of chosen) Object.assign(p, { status: "verworfen", doneAt: new Date().toISOString() });
  return [];
}
if (body.aktion !== "uebernehmen") return [];

return chosen.map((p) => {
  p.status = "speichert";
  return {
    json: {
      documentId: p.documentId,
      api: p.api,
      readUrl: `${CMS}/api/${p.api}/${p.documentId}?${qs({ status: "draft", locale: "de", "populate[seo][populate][0]": "shareImage" })}`,
      writeUrl: `${CMS}/api/${p.api}/${p.documentId}?${qs({ status: "draft", locale: "de" })}`,
    },
  };
});
