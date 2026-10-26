/**
 * n8n Code node "Themen: merken" (workflow "BEER Ratgeber").
 * Stores Claude's topic ideas for the review page. Writes nothing to the CMS.
 */

const store = $getWorkflowStaticData("global");
store.topics ??= {};
store.log ??= [];
const bestand = ratgeberBestand();
const slugs = new Set(bestand.projects.map((p) => p.slug));

const answer = claudeAnswer($input.first().json);
if (answer.error) {
  store.log.unshift({ at: new Date().toISOString(), text: `Themenvorschläge fehlgeschlagen: ${answer.error}` });
  return [{ json: { ok: false } }];
}

const stamp = Date.now().toString(36);
(answer.value.topics ?? []).forEach((topic, i) => {
  const id = `${stamp}-${i}`;
  store.topics[id] = {
    id,
    ...topic,
    title: String(topic.title).slice(0, 90),
    projects: (topic.projects ?? []).filter((slug) => slugs.has(slug)).slice(0, 3),
    sources: (topic.sources ?? []).filter((url) => /^https?:\/\//.test(url)).slice(0, 3),
    status: "offen",
    createdAt: new Date().toISOString(),
  };
});
store.log.unshift({ at: new Date().toISOString(), text: `${answer.value.topics?.length ?? 0} Themen vorgeschlagen.` });
store.log = store.log.slice(0, 50);
return [{ json: { ok: true } }];
