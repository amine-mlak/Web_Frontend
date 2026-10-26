/**
 * n8n Code node "Seite" (workflow "BEER Regionen").
 * Three parts: projects with town and region (the base for local search), region texts
 * built from the projects in a region, and posts for the Google Business Profile.
 */

const BASE = "/webhook/beer-regionen";
const store = $getWorkflowStaticData("global");
const requests = $("Seite: Auftrag").all().map((i) => i.json);
const answers = $input.all().map((i) => i.json);
const query = requests[0]?.query ?? {};
const data = { regions: [], projects: [], published: [] };
answers.forEach((a, i) => Array.isArray(a?.data) && data[requests[i].kind].push(...a.data));

const publishedAt = new Map(data.published.map((p) => [p.documentId, p.publishedAt]));
const regionOf = (p) => p.regions?.[0]?.slug ?? "";
const count = (slug) => data.projects.filter((p) => p.regions?.some((r) => r.slug === slug)).length;
const vague = (p) => !p.place || /^raum münchen$/i.test(p.place.trim());
const projects = [...data.projects].sort((a, b) => Number(Boolean(regionOf(a)) && !vague(a)) - Number(Boolean(regionOf(b)) && !vague(b)) || a.title.localeCompare(b.title, "de"));
const thumb = (p) => (p.image?.formats?.thumbnail?.url ? `${CMS}${p.image.formats.thumbnail.url}` : "");

const regionOptions = (selected) =>
  `<option value="">– Region –</option>${data.regions.map((r) => `<option value="${esc(r.documentId)}"${r.slug === selected ? " selected" : ""}>${esc(r.name)}</option>`).join("")}`;

const projectRow = (p) => `<tr><td style="width:90px">${thumb(p) ? `<img src="${esc(thumb(p))}" alt="" width="80">` : ""}</td>
<td><a href="${esc(adminUrl("projects", p.documentId))}" target="_blank">${esc(p.title)}</a>${store.saved?.[p.documentId] ? `<div class="ok small">gespeichert ${esc(when(store.saved[p.documentId].at))}${store.saved[p.documentId].error ? ` – <span class="fehler">${esc(store.saved[p.documentId].error)}</span>` : ""}</div>` : ""}</td>
<td><form method="post" action="${BASE}/aktion"><input type="hidden" name="aktion" value="zuordnen"><input type="hidden" name="documentId" value="${esc(p.documentId)}">
<input name="place" value="${esc(vague(p) ? "" : p.place)}" placeholder="Ort, z. B. Freising" size="16"><select name="region">${regionOptions(regionOf(p))}</select><button>Speichern</button></form></td></tr>`;

const proposals = store.regionTexts ?? {};
const regionRow = (r) => {
  const n = count(r.slug);
  const p = proposals[r.documentId];
  return `<tr><td><a href="${esc(adminUrl("regions", r.documentId))}" target="_blank">${esc(r.name)}</a><div class="small">${n} Projekt${n === 1 ? "" : "e"}</div></td>
<td>${p?.status === "offen" ? `<dl><dt>Überschrift</dt><dd>${esc(p.text.ueberschrift)}</dd><dt>Einleitung</dt><dd>${esc(p.text.intro)}</dd><dt>Lesetext</dt><dd class="pre">${esc(p.text.lesetext)}</dd><dt>Meta-Titel</dt><dd>${esc(p.text.metaTitle)}</dd><dt>Meta-Beschreibung</dt><dd>${esc(p.text.metaDescription)}</dd></dl>
<div class="actions">${button(`${BASE}/aktion`, { aktion: "uebernehmen", regionId: r.documentId }, "Übernehmen (als Entwurf)", true)}${button(`${BASE}/aktion`, { aktion: "verwerfen", regionId: r.documentId }, "Verwerfen")}</div>`
    : p?.status === "übernommen" ? `<span class="ok">Text übernommen ${esc(when(p.doneAt))} – in Strapi veröffentlichen.</span>${p.error ? `<div class="fehler">${esc(p.error)}</div>` : ""}`
    : p?.status === "schreibt" ? `<span class="small">Wird geschrieben …</span>`
    : n ? button(`${BASE}/aktion`, { aktion: "text", regionId: r.documentId }, "Text aus den Projekten vorschlagen") : `<span class="small">Erst Projekte zuordnen.</span>`}
${p?.error && p.status !== "übernommen" ? `<div class="fehler">${esc(p.error)}</div>` : ""}</td></tr>`;
};

const recent = data.projects
  .filter((p) => publishedAt.get(p.documentId) && Date.now() - new Date(publishedAt.get(p.documentId)).getTime() < 45 * 864e5)
  .sort((a, b) => publishedAt.get(b.documentId).localeCompare(publishedAt.get(a.documentId)))
  .slice(0, 15);
const posts = store.posts ?? {};
const postRow = (p) => {
  const post = posts[p.documentId];
  return `<tr><td><a href="${esc(`${SITE}/projekte/${p.slug}`)}" target="_blank">${esc(p.title)}</a><div class="small">veröffentlicht ${esc(when(publishedAt.get(p.documentId)))}</div></td>
<td>${post?.text ? `<div class="pre">${esc(post.text)}</div><div class="small">${post.photos?.length ? `Fotos dazu: ${post.photos.map((u, i) => `<a href="${esc(u)}" target="_blank">Foto ${i + 1}</a>`).join(" · ")}` : ""}</div>` : post?.error ? `<span class="fehler">${esc(post.error)}</span>` : button(`${BASE}/aktion`, { aktion: "gbp", documentId: p.documentId }, "Beitrag schreiben lassen")}</td></tr>`;
};

const missing = data.projects.filter((p) => !regionOf(p) || vague(p)).length;
const notice = query.gestartet ? "Läuft – etwa eine Minute. Seite danach neu laden." : query.gespeichert ? "Gespeichert (als Entwurf). In Strapi veröffentlichen, damit es auf der Website erscheint." : "";

const html = page(
  "Regionen",
  "Regionen",
  `<p class="small">Lokale Suche lebt von echten Orten: Welche Küche steht wo? Mit Ort und Region erscheinen Projekte auf den Regionsseiten, und Google wie KI-Suche sehen, wo die BEER wirklich arbeitet. Keine erfundenen Orte – nur eintragen, was stimmt. Kundennamen nie.</p>
<div class="kpi"><div><b class="${missing ? "hinweis" : "ok"}">${missing}</b>Projekte ohne echten Ort oder Region</div><div><b>${data.regions.length}</b>Regionen</div><div><b>${recent.length}</b>neue Projekte (45 Tage)</div></div>
<h2>Regionen</h2><table>${data.regions.map(regionRow).join("")}</table>
<h2>Google-Unternehmensprofil: neue Projekte</h2><p class="small">Ein Beitrag pro neuer Küche, mit zwei bis drei Fotos. Zum Kopieren ins Profil (business.google.com).</p>
<table>${recent.map(postRow).join("") || `<tr><td class="small">Keine neuen Projekte in den letzten 45 Tagen.</td></tr>`}</table>
<h2>Projekte: Ort und Region</h2><table>${projects.map(projectRow).join("")}</table>`,
  notice,
);
return [{ json: { html } }];
