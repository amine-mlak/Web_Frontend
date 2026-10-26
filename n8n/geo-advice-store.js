/**
 * n8n Code node "Empfehlungen merken" (workflow "BEER GEO-Monitor").
 */

const store = $getWorkflowStaticData("global");
const { runId } = $("Auswerten").first().json;
const run = (store.runs ?? []).find((r) => r.id === runId);
const answer = claudeAnswer($input.first().json);
if (run) run.recommendations = answer.error ? [{ title: "Keine Empfehlungen", detail: answer.error }] : answer.value.recommendations;
return [{ json: { ok: !answer.error } }];
