/**
 * n8n Code node "Seite" (workflow "BEER Mediathek"): the review page.
 * Shows progress through the media library, the texts that wait for a person (with photo and
 * editable field), the latest saved ones for spot checks, and the errors. Reads only.
 */

const BASE = "/webhook/beer-mediathek";
const store = $getWorkflowStaticData("global");
const query = $input.first()?.json?.query ?? {};
const media = Object.entries(store.media ?? {}).map(([id, m]) => ({ id, ...m }));
const by = (status) => media.filter((m) => m.s === status);
const review = by("prüfen").slice(0, 60);
const recent = by("gespeichert").sort((a, b) => String(b.saved).localeCompare(String(a.saved))).slice(0, 24);
const errors = by("fehler").slice(-20);
const scan = store.lastScan ?? {};

const photo = (m, width = 200) => `<a href="${esc(m.u)}" target="_blank"><img src="${esc(m.u)}" alt="" width="${width}" loading="lazy"></a>`;

const notice = query.gestartet
  ? "Der nächste Stapel läuft – etwa eine Minute pro Foto. Seite danach neu laden."
  : query.gespeichert
    ? "Wird gespeichert. Seite in ein paar Sekunden neu laden."
    : "";

const html = page(
  "Mediathek",
  "Mediathek",
  `<p class="small">Fotobeschreibungen (Alt-Texte) und Dateinamen für die ganze Strapi-Mediathek, auch für Fotos, die noch auf keiner Seite stehen. Die KI sieht jedes Foto an. Texte ohne Warnung werden sofort gespeichert; Texte mit Warnung warten hier. Der Zeitplan nimmt alle 15 Minuten den nächsten Stapel.</p>
<div class="kpi"><div><b>${by("gespeichert").length}</b>gespeichert</div><div><b>${by("bereit").length}</b>bereit zum Speichern</div><div><b>${by("prüfen").length}</b>zu prüfen</div><div><b>${scan.open ?? "?"}</b>noch offen</div><div><b>${by("fehler").length}</b>Fehler</div></div>
<p class="small">Letzter Lauf: ${esc(when(scan.at))}${scan.files ? ` · ${scan.files} Dateien in der Mediathek` : ""}${scan.error ? ` · <span class="fehler">${esc(scan.error)}</span>` : ""}</p>
${store.saveError ? `<p class="fehler">Speichern fehlgeschlagen (${esc(when(store.saveError.at))}): ${esc(store.saveError.message)}. Braucht der Strapi-Token Schreibrecht für „Upload“? Die Texte bleiben „bereit“ und werden beim nächsten Lauf erneut gesendet.</p>` : ""}
<section class="card"><form method="post" action="${BASE}/start"><button class="primary">Nächsten Stapel jetzt starten</button></form>
<form method="post" action="${BASE}/aktion"><input type="hidden" name="aktion" value="speichern"><button>Bereite Texte jetzt speichern</button></form></section>
<h2>Zu prüfen (${by("prüfen").length})</h2>
${review.length ? `<form method="post" action="${BASE}/aktion"><input type="hidden" name="aktion" value="uebernehmen"><p class="small">Text mit dem Foto vergleichen und korrigieren. Ein leeres Feld verwirft das Foto.</p><table>${review
    .map((m) => `<tr><td style="width:220px">${photo(m)}</td><td><textarea name="alt_${esc(m.id)}" style="min-height:64px">${esc(m.t)}</textarea><p class="hinweis">${(m.w ?? []).map(esc).join("; ")}</p><div class="small">erkannt (${esc(m.b)}): ${esc((m.v ?? []).join(", "))}</div><div class="small">bisher: ${esc(m.o || "leer")}</div></td></tr>`)
    .join("")}</table><div class="actions"><button class="primary">Übernehmen</button></div></form>` : `<p class="small">Nichts zu prüfen.</p>`}
<h2>Zuletzt gespeichert</h2>
${recent.length ? `<table>${recent.map((m) => `<tr><td style="width:160px">${photo(m, 150)}</td><td>${esc(m.t)}<div class="small">${esc(m.n)}</div></td></tr>`).join("")}</table>` : `<p class="small">Noch nichts gespeichert.</p>`}
${errors.length ? `<h2>Fehler</h2><p class="small">Ein Foto wird bis zu drei Mal versucht.</p><table>${errors.map((m) => `<tr><td>Foto ${esc(m.id)}</td><td class="fehler">${esc(m.e)} (${m.c ?? 1}×)</td></tr>`).join("")}</table>` : ""}`,
  notice,
);

return [{ json: { html } }];
