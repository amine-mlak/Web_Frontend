/**
 * n8n Code node "Plan" (workflow "BEER Meldungen").
 * Reads Claude's answer. A question back goes straight to the chat (route 0); a draft plan
 * goes on to the Strapi lookups (route 1): categories, a matching project for photos,
 * and existing addresses so the new one does not collide.
 */

const store = $getWorkflowStaticData("global");
const { sessionId, notes } = $("Auftrag").first().json;

const answer = claudeAnswer($input.first().json);
if (answer.error) return [{ json: { route: 0, output: `Das hat nicht geklappt (${answer.error}). Bitte noch einmal senden.` } }];

const plan = answer.value;
if (plan.action === "frage" || !plan.title) {
  store.sessions[sessionId] = { notes, open: true, at: new Date().toISOString() };
  return [{ json: { route: 0, output: plan.frage || "Worum genau geht es? Bitte mit Datum, Uhrzeit und Ort, wenn es ein Termin ist." } }];
}

const base = slugify(plan.slug || plan.title);

const words = (plan.projectWords ?? []).map((w) => String(w).trim()).filter((w) => w.length > 2).slice(0, 3);
const projectFilter = words.length
  ? Object.fromEntries(words.map((w, i) => [`filters[$and][${i}][title][$containsi]`, w]))
  : { "filters[slug][$eq]": "__keins__" };

return [
  {
    json: {
      route: 1,
      plan: { ...plan, slug: base },
      categoriesUrl: `${CMS}/api/categories?${qs({ locale: "de", "fields[0]": "slug", "pagination[pageSize]": 50 })}`,
      projectsUrl: `${CMS}/api/projects?${qs({
        ...projectFilter,
        locale: "de",
        status: "published",
        "fields[0]": "title",
        "fields[1]": "slug",
        "populate[image][fields][0]": "name",
        "populate[gallery][fields][0]": "name",
        "pagination[pageSize]": 3,
      })}`,
      slugsUrl: `${CMS}/api/articles?${qs({
        "filters[slug][$startsWith]": base,
        locale: "de",
        status: "draft",
        "fields[0]": "slug",
        "pagination[pageSize]": 100,
      })}`,
    },
  },
];
