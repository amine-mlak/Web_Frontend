/**
 * n8n Code node "Prüfen" (workflow "BEER SEO-Prüfung").
 * Input: the Strapi answers from "Strapi lesen", in the same order as the "Abfragen" items.
 * Output: one item { html, summary } for "Antwort". Reads only, changes nothing in the CMS.
 * The rules are in lib-seo.js.
 */

const { all, failed } = seoRows(
  $("Abfragen").all().map((item) => item.json),
  $input.all().map((item) => item.json),
);

const count = (level) => all.reduce((n, row) => n + row.issues.filter((i) => i.level === level).length, 0);
const summary = {
  eintraege: all.length,
  fehler: count("fehler"),
  hinweise: count("hinweis"),
  ohneBefund: all.filter((row) => !row.issues.length).length,
  ohneEnglisch: all.filter((row) => !row.english).length,
  metaVorschlaege: all.filter((row) => SEO_TYPES[row.api].seo && row.issues.some((i) => META_CODES.includes(i.code))).length,
  nichtGelesen: failed,
};

const sections = Object.keys(SEO_TYPES)
  .map((api) => {
    const rows = all
      .filter((row) => row.api === api)
      .sort(
        (a, b) =>
          b.issues.filter((i) => i.level === "fehler").length - a.issues.filter((i) => i.level === "fehler").length ||
          b.issues.length - a.issues.length ||
          a.name.localeCompare(b.name, "de"),
      );
    if (!rows.length) return "";
    const type = SEO_TYPES[api];
    const body = rows
      .map((row) => {
        const path = row.entry.slug ? type.path(row.entry) : "";
        const list = row.issues.length
          ? `<ul>${row.issues.map((i) => `<li class="${i.level}">${esc(i.text)}</li>`).join("")}</ul>`
          : `<span class="ok">Alles in Ordnung.</span>`;
        return `<tr><td><a href="${esc(adminUrl(api, row.entry.documentId))}" target="_blank">${esc(row.name || "(ohne Titel)")}</a>${
          path ? `<br><a class="small" href="${esc(SITE + path)}" target="_blank">${esc(path)}</a>` : ""
        }</td><td>${list}</td></tr>`;
      })
      .join("");
    const errors = rows.reduce((n, row) => n + row.issues.filter((i) => i.level === "fehler").length, 0);
    return `<details${errors ? " open" : ""}><summary><b>${esc(type.label)}</b> <span class="small">${rows.length} Einträge · ${errors} Fehler</span></summary><table><tbody>${body}</tbody></table></details>`;
  })
  .join("");

const html = page(
  "SEO-Prüfung",
  "SEO-Prüfung",
  `<div class="small">Stand ${esc(when(new Date().toISOString()))} · deutsche Entwürfe aus cms.beer.de · ändert nichts</div>
<div class="kpi"><div><b>${summary.eintraege}</b>Einträge</div><div><b class="fehler">${summary.fehler}</b>Fehler</div><div><b class="hinweis">${summary.hinweise}</b>Hinweise</div><div><b class="ok">${summary.ohneBefund}</b>ohne Befund</div><div><b>${summary.ohneEnglisch}</b>ohne englische Fassung</div></div>
${failed.length ? `<p class="fehler">Nicht gelesen: ${esc(failed.join(", "))}</p>` : ""}
<p class="small"><span class="fehler">Fehler</span> vor dem Veröffentlichen beheben. <span class="hinweis">Hinweise</span> verbessern die Seite, sind aber kein Hindernis. Der Titel führt in den Strapi-Eintrag, die Adresse darunter auf die Seite.</p>
${summary.metaVorschlaege ? `<p><a href="/webhook/seo-vorschlaege">${summary.metaVorschlaege} Einträge mit Titel- oder Beschreibungsfehlern → Vorschläge erstellen lassen</a></p>` : ""}
${sections}`,
);

return [{ json: { html, summary } }];
