/**
 * n8n Code node "Aktion" (workflow "BEER Ratgeber"): the buttons on the page.
 * "schreiben" starts the article for a topic, "verwerfen" sets it aside, "eigenes" adds a
 * topic the team typed in. Only "schreiben" continues to the Strapi reads.
 */

const store = $getWorkflowStaticData("global");
store.topics ??= {};
const body = $input.first()?.json?.body ?? {};
const topic = store.topics[String(body.topicId ?? "")];

if (body.aktion === "eigenes" && String(body.title ?? "").trim()) {
  const id = `eigen-${Date.now().toString(36)}`;
  store.topics[id] = {
    id,
    title: String(body.title).trim().slice(0, 90),
    question: String(body.question ?? body.title).trim(),
    category: RATGEBER_CATEGORIES.includes(body.category) ? body.category : "planung",
    why: "Von der Redaktion vorgeschlagen.",
    angle: String(body.angle ?? "").trim() || "Aus der eigenen Planungs- und Werkstatterfahrung.",
    projects: [],
    sources: [],
    status: "offen",
    createdAt: new Date().toISOString(),
  };
  return [];
}
if (!topic) return [];
if (body.aktion === "verwerfen") {
  topic.status = "verworfen";
  return [];
}
// A write that has hung for more than 15 minutes may be started again.
const stuck = topic.status === "schreibt" && Date.now() - new Date(topic.startedAt).getTime() > 15 * 60e3;
if (body.aktion === "schreiben" && (topic.status === "offen" || topic.status === "entwurf" || stuck)) {
  topic.status = "schreibt";
  topic.error = null;
  topic.startedAt = new Date().toISOString();
  return [{ json: { body: { aktion: "schreiben", topicId: topic.id } } }];
}
return [];
