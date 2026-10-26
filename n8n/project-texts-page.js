/**
 * n8n Code node "Seite" (workflow "BEER Projekttexte"): the review page.
 * Lists the stored proposals (photo descriptions, English texts) with "Übernehmen" and
 * "Verwerfen", plus a form to create new proposals. Reads only.
 */

const BASE = "/webhook/beer-texte";
const store = $getWorkflowStaticData("global");
const query = $input.first()?.json?.query ?? {};

const proposals = Object.values(store.proposals ?? {}).sort(
  (a, b) => (a.status === "offen" ? 0 : 1) - (b.status === "offen" ? 0 : 1) || b.createdAt.localeCompare(a.createdAt),
);
const open = proposals.filter((p) => p.status === "offen");
const closed = proposals.filter((p) => p.status !== "offen").slice(0, 30);

const card = (p) => {
  const photos = Object.values(p.alt ?? {});
  const en = p.en;
  return `<section class="card"><h2 style="margin:0"><a href="${esc(adminUrl("projects", p.documentId))}" target="_blank">${esc(p.title)}</a></h2>
<div class="small">Vorschlag vom ${esc(when(p.createdAt))}${p.slug ? ` · <a href="${esc(`${SITE}/projekte/${p.slug}`)}" target="_blank">/projekte/${esc(p.slug)}</a>` : ""}</div>
${p.errors?.length ? `<p class="fehler">${p.errors.map(esc).join("<br>")}</p>` : ""}
${photos.length ? `<h3>Fotobeschreibungen (${photos.length})</h3><table>${photos
    .map((f) => `<tr><td style="width:170px"><img src="${esc(f.thumb)}" alt="" width="156"></td><td>${esc(f.text)}<div class="small">bisher: ${esc(f.old || "leer")}</div></td></tr>`)
    .join("")}</table>` : `<p class="small">Noch keine Fotobeschreibungen – sie entstehen nach dem Start in etwa einer Minute.</p>`}
${en ? `<h3>Englische Fassung (wird als Entwurf angelegt)</h3>${en.warnings?.length ? `<p class="hinweis">${en.warnings.map(esc).join("<br>")}</p>` : ""}
<dl><dt>Title</dt><dd>${esc(en.title)}</dd><dt>Place</dt><dd>${esc(en.place)}</dd><dt>Intro</dt><dd>${esc(en.intro)}</dd>
<dt>Text</dt><dd class="pre">${esc(en.body)}</dd>${en.ueberschrift ? `<dt>Heading</dt><dd>${esc(en.ueberschrift)}</dd>` : ""}${en.lesetext ? `<dt>Reading text</dt><dd class="pre">${esc(en.lesetext)}</dd>` : ""}
<dt>Details</dt><dd>${en.specs.map((s) => `${esc(s.label)}: ${esc(s.value)}`).join("<br>")}</dd>
<dt>Meta title</dt><dd>${esc(en.metaTitle)} <span class="small">(${en.metaTitle.length})</span></dd><dt>Meta description</dt><dd>${esc(en.metaDescription)} <span class="small">(${en.metaDescription.length})</span></dd></dl>` : ""}
${p.status === "offen" ? `<div class="actions">${button(`${BASE}/aktion`, { documentId: p.documentId, aktion: "uebernehmen" }, "Übernehmen", true)}${button(`${BASE}/aktion`, { documentId: p.documentId, aktion: "verwerfen" }, "Verwerfen")}</div>` : ""}
</section>`;
};

const notice = query.gestartet
  ? "Vorschläge werden erstellt – das dauert etwa eine Minute pro Projekt. Seite danach neu laden."
  : query.gespeichert
    ? "Wird gespeichert. Seite in ein paar Sekunden neu laden, um das Ergebnis zu sehen."
    : "";

const html = page(
  "Projekttexte",
  "Projekttexte",
  `<p class="small">Fotobeschreibungen (Alt-Texte) für Projekte, vorgeschlagen von Claude. Erst „Übernehmen“ schreibt in Strapi; Fotobeschreibungen gelten dann sofort. Sie helfen Google-Bildersuche, KI-Suche und blinden Besuchern – und ersetzen alte Dateinamen, in denen teils Kundennamen stehen.</p>
<section class="card"><form method="post" action="${BASE}/vorschlaege">Neue Vorschläge für
<select name="limit"><option>1</option><option selected>3</option><option>5</option></select> Projekte
<input name="documentId" placeholder="oder Strapi-ID eines Projekts" size="28"><button class="primary">Erstellen</button></form></section>
<h2>Offen (${open.length})</h2>${open.map(card).join("") || `<p class="small">Keine offenen Vorschläge.</p>`}
${closed.length ? `<h2>Erledigt</h2><table>${closed
    .map((p) => `<tr><td><a href="${esc(adminUrl("projects", p.documentId))}" target="_blank">${esc(p.title)}</a></td><td>${p.status === "übernommen" ? `übernommen ${esc(when(p.doneAt))}: ${p.saved?.alt ?? 0} Fotos${p.saved?.en ? ", englischer Entwurf" : ""}` : `verworfen ${esc(when(p.doneAt))}`}${p.saved?.errors?.length ? `<div class="fehler">${p.saved.errors.map(esc).join("<br>")}</div>` : ""}</td></tr>`)
    .join("")}</table>` : ""}`,
  notice,
);

return [{ json: { html } }];
