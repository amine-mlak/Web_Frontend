/**
 * n8n Code node "Seite" (workflow "BEER Ratgeber"): topic ideas and written drafts.
 */

const BASE = "/webhook/beer-ratgeber";
const store = $getWorkflowStaticData("global");
const query = $input.first()?.json?.query ?? {};
const topics = Object.values(store.topics ?? {}).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
const by = (status) => topics.filter((t) => t.status === status);

const label = { kosten: "Kosten", planung: "Planung", geraete: "Geräte", material: "Material" };
const ideaCard = (t) => `<section class="card"><b>${esc(t.title)}</b> <span class="small">· ${esc(label[t.category] ?? t.category)}</span>
<div>${esc(t.question)}</div>
<div class="small" style="margin-top:6px">${esc(t.why)}<br>BEER-Beitrag: ${esc(t.angle)}</div>
${t.projects?.length ? `<div class="small">Projekte: ${t.projects.map((s) => `<a href="${esc(`${SITE}/projekte/${s}`)}" target="_blank">${esc(s)}</a>`).join(", ")}</div>` : ""}
${t.sources?.length ? `<div class="small">Belege: ${t.sources.map((u, i) => `<a href="${esc(u)}" target="_blank" rel="noopener">Quelle ${i + 1}</a>`).join(" · ")}</div>` : ""}
${t.error ? `<p class="fehler">${esc(t.error)}</p>` : ""}
<div class="actions">${button(`${BASE}/aktion`, { topicId: t.id, aktion: "schreiben" }, "Artikel schreiben lassen", true)}${button(`${BASE}/aktion`, { topicId: t.id, aktion: "verwerfen" }, "Verwerfen")}</div></section>`;

const draftRow = (t) => `<tr><td><a href="${esc(adminUrl("articles", t.documentId))}" target="_blank">${esc(t.draft?.title ?? t.title)}</a>
<div class="small">${esc(when(t.writtenAt))} · ${t.draft?.words ?? "?"} Wörter · /ratgeber/${esc(t.draft?.slug ?? "")}</div></td>
<td>${t.error ? `<div class="fehler">${esc(t.error)}</div>` : ""}${t.draft?.note ? `<div>${esc(t.draft.note)}</div>` : ""}
${t.draft?.checks?.length ? `<div class="hinweis">Bitte prüfen:</div><ul>${t.draft.checks.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}
${t.draft?.removedLinks?.length ? `<div class="small">Entfernte Links (nicht erlaubt): ${t.draft.removedLinks.map(esc).join(", ")}</div>` : ""}</td></tr>`;

const notice = query.gestartet
  ? "Läuft – Themen mit Web-Recherche dauern etwa zwei Minuten, ein Artikel etwa drei. Seite danach neu laden."
  : "";

const html = page(
  "Ratgeber",
  "Ratgeber",
  `<p class="small">Claude schlägt Themen vor, die Menschen vor dem Küchenkauf wirklich suchen und die die BEER aus eigener Erfahrung beantworten kann. Ein Klick lässt den Artikel schreiben – aus den FAQ-Antworten und den passenden Projekten, mit Links auf die eigenen Seiten. Er landet als <b>Entwurf</b> in Strapi; Stellen mit „[prüfen: …]“ brauchen eine Angabe der BEER. Etwa zwei Artikel im Monat genügen; Qualität zählt mehr als Menge.</p>
<section class="card"><div class="actions">${button(`${BASE}/themen`, {}, "Neue Themen vorschlagen lassen", true)}</div>
<form method="post" action="${BASE}/aktion" style="margin-top:12px"><input type="hidden" name="aktion" value="eigenes">
<input name="title" placeholder="Eigenes Thema, z. B. Arbeitsplatten im Vergleich" size="44" required>
<select name="category">${Object.entries(label).map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select>
<button>Thema hinzufügen</button></form></section>
${by("schreibt").length ? `<h2>Wird geschrieben</h2><ul>${by("schreibt").map((t) => `<li>${esc(t.title)} <span class="small">seit ${esc(when(t.startedAt))}</span></li>`).join("")}</ul>` : ""}
<h2>Themen (${by("offen").length})</h2>${by("offen").map(ideaCard).join("") || `<p class="small">Noch keine Themen – oben vorschlagen lassen.</p>`}
${by("entwurf").length ? `<h2>Entwürfe in Strapi</h2><table>${by("entwurf").map(draftRow).join("")}</table>` : ""}
${(store.log ?? []).length ? `<details><summary class="small">Verlauf</summary><ul class="small">${store.log.slice(0, 15).map((l) => `<li>${esc(when(l.at))}: ${esc(l.text)}</li>`).join("")}</ul></details>` : ""}`,
  notice,
);

return [{ json: { html } }];
