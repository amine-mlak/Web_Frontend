/**
 * n8n Code node "Plan" (workflow "BEER Neue Seite").
 * A question back goes to the chat (route 0). A draft goes on (route 1) with the address
 * made free of collisions and a project search for the cover photo.
 */

const store = $getWorkflowStaticData("global");
const { sessionId, notes, existing } = $("Anfrage").first().json;
const answer = claudeAnswer($input.first().json);
if (answer.error) return [{ json: { route: 0, output: `Das hat nicht geklappt (${answer.error}). Bitte noch einmal senden.` } }];

const plan = answer.value;
if (plan.action === "frage" || !plan.type || !plan.name) {
  store.sessions[sessionId] = { notes, open: true, at: new Date().toISOString() };
  return [{ json: { route: 0, output: plan.frage || "Welche Art Seite soll es werden, und worum genau geht es?" } }];
}

const taken = new Set((existing[plan.type] ?? []).map((line) => line.match(/\(([^)]+)\)$/)?.[1]));
const base = slugify(plan.slug || plan.name);
let slug = base;
for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

const words = (plan.projectWords ?? []).map((w) => String(w).trim()).filter((w) => w.length > 2).slice(0, 3);
const filter = words.length ? Object.fromEntries(words.map((w, i) => [`filters[$and][${i}][title][$containsi]`, w])) : { "filters[slug][$eq]": "__keins__" };
return [
  {
    json: {
      route: 1,
      plan: { ...plan, slug },
      projectsUrl: `${CMS}/api/projects?${qs({ ...filter, locale: "de", status: "published", "fields[0]": "title", "populate[image][fields][0]": "name", "pagination[pageSize]": 1 })}`,
    },
  },
];
