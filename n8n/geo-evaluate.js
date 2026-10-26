/**
 * n8n Code node "Auswerten" (workflow "BEER GEO-Monitor").
 * Records the run: per question whether BEER is named or used as a source, who is named
 * instead, and which sites are cited. Then asks Claude for what to do about it.
 */

const store = $getWorkflowStaticData("global");
store.runs ??= [];
const jobs = $("Fragen").all().map((i) => i.json);
const isBeer = (text) => /\bbeer\b|beer\.de|beer-kuechen/i.test(String(text ?? ""));

const results = $input.all().map((item, i) => {
  const { question } = jobs[i];
  const answer = claudeAnswer(item.json);
  if (answer.error) return { question, error: answer.error };
  const v = answer.value;
  const sources = [...new Set([...(v.sources ?? []), ...(answer.sources ?? []).map((s) => s.url)])].slice(0, 10);
  return {
    question,
    answer: v.answer,
    // Checked here as well, in case the model's own flag is wrong.
    named: v.beerNamed || isBeer(v.answer) || (v.businesses ?? []).some((b) => isBeer(b.name) || isBeer(b.url)),
    cited: v.beerSource || sources.some(isBeer),
    businesses: (v.businesses ?? []).filter((b) => !isBeer(b.name) && !isBeer(b.url)).slice(0, 8),
    sources,
  };
});

const run = {
  id: jobs[0]?.runId ?? new Date().toISOString(),
  at: new Date().toISOString(),
  results,
  named: results.filter((r) => r.named).length,
  cited: results.filter((r) => r.cited).length,
  total: results.length,
};
store.runs.unshift(run);
store.runs = store.runs.slice(0, 26);

// Which businesses and sites come up most often: that is what AI search trusts here.
const tally = (list) => Object.entries(list.reduce((m, k) => ((m[k] = (m[k] ?? 0) + 1), m), {})).sort((a, b) => b[1] - a[1]).slice(0, 12);
const rivals = tally(results.flatMap((r) => (r.businesses ?? []).map((b) => b.name)));
const domains = tally(results.flatMap((r) => (r.sources ?? []).map((u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } })));
run.rivals = rivals;
run.domains = domains;

const SYSTEM = `Du berätst die BEER Küchenmanufaktur, wie sie in KI-Antworten (Google AI Overviews, ChatGPT, Perplexity, Claude) häufiger genannt und zitiert wird.
${BEER_FACTS}
Grundlage sind die Ergebnisse einer Prüfung mit typischen Kundenfragen. Gib fünf bis acht konkrete, umsetzbare Empfehlungen auf Deutsch, nach Wirkung sortiert. Jede Empfehlung: was genau zu tun ist (z. B. welche Seite oder welcher Artikel, welche Frage beantwortet werden muss, welches Verzeichnis oder Profil gepflegt werden sollte) und warum, mit Bezug auf die Ergebnisse. Keine allgemeinen SEO-Floskeln.`;
const schema = {
  type: "object",
  properties: {
    recommendations: {
      type: "array",
      items: { type: "object", properties: { title: { type: "string" }, detail: { type: "string" } }, required: ["title", "detail"], additionalProperties: false },
    },
  },
  required: ["recommendations"],
  additionalProperties: false,
};
const user = `Ergebnisse (${run.named} von ${run.total} Antworten nennen BEER, ${run.cited} nutzen beer.de als Quelle):
${results.map((r) => `- ${r.question}\n  BEER genannt: ${r.named ? "ja" : "nein"}; genannt stattdessen: ${(r.businesses ?? []).map((b) => b.name).join(", ") || "–"}; Quellen: ${(r.sources ?? []).join(", ") || "–"}`).join("\n")}

Häufigste Quellen-Websites: ${domains.map(([d, n]) => `${d} (${n})`).join(", ")}`;

return [{ json: { runId: run.id, request: claudeRequest({ system: SYSTEM, user, schema, effort: "high" }) } }];
