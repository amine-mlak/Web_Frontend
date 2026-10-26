/**
 * n8n Code node "Fehler merken" (workflow "BEER Redaktion").
 * Every BEER workflow names this one as its error workflow; failures are kept here and
 * shown on the overview page.
 */

const store = $getWorkflowStaticData("global");
store.errors ??= [];
const { execution = {}, workflow = {} } = $input.first()?.json ?? {};
store.errors.unshift({
  at: new Date().toISOString(),
  workflow: workflow.name ?? "?",
  node: execution.lastNodeExecuted ?? "",
  message: String(execution.error?.message ?? "Unbekannter Fehler").slice(0, 400),
  url: execution.url ?? "",
});
store.errors = store.errors.slice(0, 100);
return [{ json: { ok: true } }];
