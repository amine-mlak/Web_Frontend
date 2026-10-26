/**
 * n8n Code node "Seite" (workflow "BEER GEO-Monitor"): the latest check, the trend and the
 * list of questions (editable).
 */

const BASE = "/webhook/geo-monitor";
const store = $getWorkflowStaticData("global");
const query = $input.first()?.json?.query ?? {};
const runs = store.runs ?? [];
const latest = runs[0];
const questions = store.questions ?? GEO_QUESTIONS;

const trend = runs
  .slice(0, 12)
  .reverse()
  .map((r) => `<div style="text-align:center"><div style="height:${Math.max(4, Math.round((r.named / Math.max(r.total, 1)) * 80))}px;width:26px;background:#1d1d1b;margin:0 auto" title="${r.named} von ${r.total}"></div><div class="small">${esc(new Date(r.at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }))}</div></div>`)
  .join("");

const rows = (latest?.results ?? [])
  .map((r) => `<tr><td><b>${esc(r.question)}</b>${r.error ? `<div class="fehler">${esc(r.error)}</div>` : `<div class="small pre">${esc(r.answer)}</div>`}</td>
<td style="width:110px">${r.error ? "" : r.named ? `<span class="ok">genannt</span>` : `<span class="fehler">nicht genannt</span>`}${r.cited ? `<div class="ok small">beer.de zitiert</div>` : ""}</td>
<td style="width:30%" class="small">${(r.businesses ?? []).map((b) => esc(b.name)).join(", ") || "–"}${r.sources?.length ? `<details><summary>Quellen</summary>${r.sources.map((u) => `<div><a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\/(www\.)?/, "").slice(0, 60))}</a></div>`).join("")}</details>` : ""}</td></tr>`)
  .join("");

const notice = query.gestartet
  ? "Die Prüfung läuft – mit Web-Suche etwa fünf bis zehn Minuten. Seite danach neu laden."
  : query.gespeichert
    ? "Fragen gespeichert."
    : "";

const html = page(
  "GEO-Monitor",
  "GEO-Monitor",
  `<p class="small">Wird die BEER genannt, wenn jemand eine KI-Suche nach einer Küche vom Schreiner fragt? Claude beantwortet typische Fragen mit Web-Suche aus Sicht einer Person bei Freising und hält fest, wer genannt und welche Seiten zitiert werden. Daraus folgen konkrete Empfehlungen. Ergebnisse schwanken von Lauf zu Lauf – der Trend zählt.</p>
<section class="card"><div class="actions">${button(`${BASE}/start`, {}, "Jetzt prüfen", true)}</div></section>
${latest ? `<div class="kpi"><div><b>${latest.named}/${latest.total}</b>Antworten nennen BEER</div><div><b>${latest.cited}</b>zitieren beer.de</div><div><b>${esc(when(latest.at))}</b>letzte Prüfung</div></div>
${runs.length > 1 ? `<h2>Verlauf</h2><div style="display:flex;gap:10px;align-items:flex-end">${trend}</div>` : ""}
${latest.recommendations?.length ? `<h2>Empfehlungen</h2><ol>${latest.recommendations.map((r) => `<li><b>${esc(r.title)}</b><div>${esc(r.detail)}</div></li>`).join("")}</ol>` : ""}
${latest.rivals?.length ? `<h2>Häufig genannt</h2><p class="small">${latest.rivals.map(([n, c]) => `${esc(n)} (${c})`).join(" · ")}</p>` : ""}
${latest.domains?.length ? `<h2>Häufig zitierte Websites</h2><p class="small">${latest.domains.map(([d, c]) => `${esc(d)} (${c})`).join(" · ")}</p>` : ""}
<h2>Antworten</h2><table><tr><th>Frage und Antwort</th><th>BEER</th><th>Genannt / Quellen</th></tr>${rows}</table>` : `<p class="small">Noch keine Prüfung gelaufen.</p>`}
<h2>Fragen</h2><form method="post" action="${BASE}/fragen" style="display:block"><textarea name="fragen" rows="12">${esc(questions.join("\n"))}</textarea>
<div class="actions"><button>Fragen speichern</button><span class="small">Eine Frage pro Zeile, höchstens 20. So formulieren, wie Kunden fragen.</span></div></form>`,
  notice,
);
return [{ json: { html } }];
