/**
 * n8n Code node "Fragen speichern" (workflow "BEER GEO-Monitor").
 */

const store = $getWorkflowStaticData("global");
const text = String($input.first()?.json?.body?.fragen ?? "");
const list = [...new Set(text.split(/\r?\n/).map((q) => q.trim()).filter((q) => q.length > 5))].slice(0, 20);
if (list.length) store.questions = list;
return [{ json: { count: list.length } }];
