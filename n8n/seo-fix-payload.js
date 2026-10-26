/**
 * n8n Code node "Neuer SEO-Text" (workflow "BEER SEO-Vorschläge").
 * One item per entry: the SEO block with the approved title and description, keeping the
 * share image the draft already had.
 */

const store = $getWorkflowStaticData("global");
const jobs = $("Aktion").all().map((i) => i.json);
return $input.all().map((item, i) => {
  const job = jobs[i];
  const proposal = store.proposals[job.documentId];
  const shareImage = item.json?.data?.seo?.shareImage?.id;
  return {
    json: {
      ...job,
      payload: JSON.stringify({
        data: { seo: { ...proposal.new, ...(shareImage ? { shareImage } : {}) } },
      }),
    },
  };
});
