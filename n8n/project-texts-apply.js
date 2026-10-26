/**
 * n8n Code node "Aktion" (workflow "BEER Projekttexte").
 * Button "Übernehmen": one item per photo description and one for the English draft,
 * routed by "Verteilen" to the two Strapi writes. Button "Verwerfen": marks the proposal.
 * Writes only what the review page showed; nothing is generated again here.
 */

const store = $getWorkflowStaticData("global");
const body = $input.first()?.json?.body ?? {};
const proposal = store.proposals?.[String(body.documentId ?? "")];
if (!proposal || proposal.status !== "offen") return [];

proposal.doneAt = new Date().toISOString();
if (body.aktion !== "uebernehmen") {
  proposal.status = "verworfen";
  return [];
}

proposal.status = "übernommen";
proposal.saved = { alt: 0, en: false, errors: [] };
const items = Object.values(proposal.alt ?? {}).map((photo) => ({
  json: { kind: "alt", documentId: proposal.documentId, id: photo.id, fileInfo: JSON.stringify({ alternativeText: photo.text }) },
}));
if (proposal.en) {
  const { title, place, intro, body: text, ueberschrift, lesetext, specs, metaTitle, metaDescription } = proposal.en;
  items.push({
    json: {
      kind: "en",
      documentId: proposal.documentId,
      // The shared fields go along with their German values: Strapi copies shared fields
      // from the saved language to the other one, so leaving them out would empty them.
      payload: JSON.stringify({
        data: {
          title, place, intro, body: text, ueberschrift, lesetext, specs,
          seo: { metaTitle, metaDescription },
          ...proposal.shared,
        },
      }),
    },
  });
}
return items;
