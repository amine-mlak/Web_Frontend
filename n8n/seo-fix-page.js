/**
 * n8n Code node "Seite" (workflow "BEER SEO-Vorschläge"): old and new snippet side by side.
 */

const BASE = "/webhook/seo-vorschlaege";
const store = $getWorkflowStaticData("global");
const query = $input.first()?.json?.query ?? {};
const proposals = Object.values(store.proposals ?? {}).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
const open = proposals.filter((p) => p.status === "offen" || p.status === "speichert");
const done = proposals.filter((p) => p.status === "übernommen").slice(0, 40);

// A Google-like preview of the snippet.
const snippet = (title, description, path) => `<div style="font-family:arial,sans-serif;max-width:600px">
<div style="color:#1a0dab;font-size:18px;line-height:1.3">${esc(title)}</div>
<div style="color:#006621;font-size:13px">beer.de${esc(path)}</div>
<div style="color:#4d5156;font-size:14px">${esc(description)}</div></div>`;

const card = (p) => `<section class="card"><b><a href="${esc(adminUrl(p.api, p.documentId))}" target="_blank">${esc(p.name)}</a></b>
<span class="small">· ${esc(SEO_TYPES[p.api]?.label ?? p.api)}${p.live ? "" : " · noch nicht veröffentlicht"}</span>
<div class="hinweis small">${p.issues.map(esc).join(" ")}</div>
<table><tr><th>Bisher</th><th>Vorschlag</th></tr><tr><td>${snippet(p.old.metaTitle || p.name, p.old.metaDescription, p.path)}</td>
<td>${snippet(p.new.metaTitle, p.new.metaDescription, p.path)}<div class="small">${p.new.metaTitle.length} / ${p.new.metaDescription.length} Zeichen</div></td></tr></table>
${p.warnings?.length ? `<p class="hinweis">${p.warnings.map(esc).join(" ")}</p>` : ""}${p.error ? `<p class="fehler">${esc(p.error)}</p>` : ""}
${p.status === "offen" ? `<div class="actions">${button(`${BASE}/aktion`, { documentId: p.documentId, aktion: "uebernehmen" }, "Übernehmen", true)}${button(`${BASE}/aktion`, { documentId: p.documentId, aktion: "verwerfen" }, "Verwerfen")}</div>` : `<p class="small">Wird gespeichert …</p>`}</section>`;

const notice = query.gestartet
  ? "Vorschläge werden erstellt – etwa eine Minute. Seite danach neu laden."
  : query.gespeichert
    ? "Wird in Strapi gespeichert. Die Änderung steht dann als Entwurf bereit und wird in Strapi veröffentlicht."
    : "";

const html = page(
  "SEO-Vorschläge",
  "SEO-Vorschläge",
  `<p class="small">Für Einträge, bei denen die SEO-Prüfung Titel oder Beschreibung bemängelt (fehlt, zu lang, doppelt), schreibt Claude neue Snippets. „Übernehmen“ speichert sie in den <b>Entwurf</b> des Eintrags; veröffentlicht wird in Strapi.</p>
<section class="card"><div class="actions">${button(`${BASE}/erstellen`, {}, "Vorschläge für bis zu 15 Einträge erstellen", true)}
${open.length > 1 ? button(`${BASE}/aktion`, { documentId: "alle", aktion: "uebernehmen" }, `Alle ${open.length} übernehmen`) : ""}</div></section>
<h2>Offen (${open.length})</h2>${open.map(card).join("") || `<p class="small">Keine offenen Vorschläge.</p>`}
${done.length ? `<h2>Übernommen – in Strapi veröffentlichen</h2><table>${done.map((p) => `<tr><td><a href="${esc(adminUrl(p.api, p.documentId))}" target="_blank">${esc(p.name)}</a></td><td>${esc(p.new.metaTitle)}<div class="small">${esc(when(p.doneAt))}</div>${p.error ? `<div class="fehler">${esc(p.error)}</div>` : ""}</td></tr>`).join("")}</table>` : ""}
${(store.log ?? []).length ? `<details><summary class="small">Verlauf</summary><ul class="small">${store.log.slice(0, 15).map((l) => `<li>${esc(when(l.at))}: ${esc(l.text)}</li>`).join("")}</ul></details>` : ""}`,
  notice,
);
return [{ json: { html } }];
