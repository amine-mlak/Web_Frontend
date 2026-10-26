/**
 * n8n Code node "Übersicht" (workflow "BEER Redaktion"): the start page for the team.
 * What each automation does, where to find it, and the latest failures of any of them.
 */

const store = $getWorkflowStaticData("global");
const errors = store.errors ?? [];

const TOOLS = [
  ["SEO-Prüfung", "/webhook/seo-pruefung", "Prüft alle deutschen Einträge: Titel, Beschreibungen, Doppelungen, Bilder, Ort, Region. Ändert nichts.", "nach jeder größeren Änderung"],
  ["SEO-Vorschläge", "/webhook/seo-vorschlaege", "Neue Titel und Beschreibungen für alles, was die Prüfung bemängelt. Übernehmen → Entwurf.", "monatlich"],
  ["Projekttexte", "/webhook/beer-texte", "Fotobeschreibungen für Projekte. Prüfen, übernehmen – gilt sofort.", "nach neuen Projekten"],
  ["Ratgeber", "/webhook/beer-ratgeber", "Themen, die Menschen vor dem Küchenkauf suchen; ein Klick schreibt den Artikel als Entwurf.", "zwei Artikel im Monat"],
  ["Meldungen", NAV.find(([l]) => l === "Meldungen")[1], "Chat: ein paar Zeilen zu Termin, Auszeichnung oder neuer Küche → Artikelentwurf plus Text für Google-Profil und Social Media.", "bei Bedarf"],
  ["Neue Seite", NAV.find(([l]) => l === "Neue Seite")[1], "Chat: kurze Beschreibung → Entwurf einer Themen-, Material-, Geräte-, Marken-, Möbel-, Regions- oder festen Seite im Stil der Website.", "bei Bedarf"],
  ["GEO-Monitor", "/webhook/geo-monitor", "Wird die BEER genannt, wenn jemand eine KI-Suche fragt? Antworten, Quellen, Empfehlungen.", "wöchentlich"],
  ["Regionen", "/webhook/beer-regionen", "Ort und Region pro Projekt eintragen, Regionstexte aus echten Projekten, Beiträge fürs Google-Profil.", "nach neuen Projekten"],
];

const html = page(
  "Redaktion",
  "Übersicht",
  `<p class="small">Werkzeuge für Inhalte, SEO und lokale Sichtbarkeit der Website. Alles, was hier entsteht, landet als <b>Entwurf</b> in Strapi; veröffentlicht wird dort von einem Menschen. Einzige Ausnahme: übernommene Fotobeschreibungen gelten sofort (Bilder haben in Strapi keine Entwürfe).</p>
<table><tr><th>Werkzeug</th><th>Was es tut</th><th>Wie oft</th></tr>
${TOOLS.map(([name, href, what, often]) => `<tr><td><a href="${href}"><b>${esc(name)}</b></a></td><td>${esc(what)}</td><td class="small">${esc(often)}</td></tr>`).join("")}</table>
<h2>Regeln</h2><ul>
<li>Lieber wenige gute Seiten aus echten Projekten und Erfahrungen als viele ähnliche – Google straft Massenware ab, egal wer sie schreibt.</li>
<li>Stellen mit „[prüfen: …]“ brauchen eine Angabe der BEER, bevor veröffentlicht wird.</li>
<li>Kundennamen nie. Orte nur, wenn sie stimmen.</li>
<li>Englische Fassungen erst, wenn Themen, Materialien und Regionen auch auf Englisch existieren.</li></ul>
<h2>Letzte Fehler</h2>${errors.length ? `<table>${errors.slice(0, 25).map((e) => `<tr><td class="small" style="width:150px">${esc(when(e.at))}</td><td><b>${esc(e.workflow)}</b>${e.node ? ` · ${esc(e.node)}` : ""}<div class="fehler">${esc(e.message)}</div>${e.url ? `<a class="small" href="${esc(e.url)}" target="_blank">Ausführung ansehen</a>` : ""}</td></tr>`).join("")}</table>` : `<p class="ok">Keine Fehler.</p>`}`,
);
return [{ json: { html } }];
