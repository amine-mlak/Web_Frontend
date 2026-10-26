/**
 * n8n Code node "Merken" (workflow "BEER Regionen"): stores the region text proposal or
 * the Business Profile post for the page. Writes nothing to the CMS.
 */

const store = $getWorkflowStaticData("global");
const job = $("Anfrage").first().json;
const answer = claudeAnswer($input.first().json);

if (job.kind === "text") {
  store.regionTexts[job.id] = answer.error
    ? { status: "fehler", error: answer.error }
    : { status: "offen", text: answer.value, shareImage: job.shareImage, createdAt: new Date().toISOString() };
} else {
  store.posts[job.id] = answer.error ? { status: "fehler", error: answer.error } : { status: "fertig", text: answer.value.text, photos: job.photos, at: new Date().toISOString() };
}
return [{ json: { ok: !answer.error } }];
