/**
 * n8n Code node "Seite" (workflow "BEER Newsletter"): the newsletter page for the team.
 * Who is subscribed, what was sent, and the form for a new newsletter: text in the BEER layout
 * or own HTML (file or pasted). Preview opens the mail in the browser; a test goes to the
 * addresses given; "Alle" needs the word SENDEN, so nothing goes out by a slip of the mouse.
 */
const rows = $("Abonnenten lesen").all().map((item) => item.json).filter((row) => row && row.id && row.email);
const sends = $("Versand lesen").all().map((item) => item.json).filter((row) => row && row.id);
const query = $("Seite aufrufen").first().json.query || {};

const count = (status, lang) => rows.filter((row) => row.status === status && (!lang || row.sprache === lang)).length;
const STATUS = { bestaetigt: "bestätigt", ausstehend: "wartet auf Bestätigung", abgemeldet: "abgemeldet" };
const notice =
  query.gestartet === "test" ? "Testmail ist unterwegs. Prüfen Sie das Postfach (auch den Spam-Ordner)."
  : query.gestartet === "alle" ? "Versand läuft. Er erscheint unten im Verlauf, sobald alle Mails raus sind."
  : query.geloescht ? "Eintrag gelöscht."
  : "";

const sorted = [...rows].sort((a, b) => String(b.angemeldet_am ?? "").localeCompare(String(a.angemeldet_am ?? "")));
const subscribers = sorted.length
  ? `<table><tr><th>E-Mail</th><th>Name</th><th>Sprache</th><th>Status</th><th>Angemeldet</th><th>Bestätigt</th><th>Quelle</th><th></th></tr>
${sorted.slice(0, 300).map((row) => `<tr><td>${esc(row.email)}</td><td>${esc(row.vorname)}</td><td>${esc(row.sprache)}</td>
<td class="${row.status === "bestaetigt" ? "ok" : row.status === "abgemeldet" ? "small" : "hinweis"}">${esc(STATUS[row.status] ?? row.status)}${row.abgemeldet_am ? `<div class="small">${esc(when(row.abgemeldet_am))}</div>` : ""}</td>
<td class="small">${esc(when(row.angemeldet_am))}</td><td class="small">${esc(when(row.bestaetigt_am))}</td><td class="small">${esc(row.quelle)}</td>
<td><form method="post" action="/webhook/beer-newsletter/loeschen" onsubmit="return confirm('${esc(row.email)} endgültig löschen? Das lässt sich nicht rückgängig machen.')"><input type="hidden" name="id" value="${esc(row.id)}"><button>Löschen</button></form></td></tr>`).join("")}</table>
${sorted.length > 300 ? `<p class="small">Die ersten 300 von ${sorted.length}. Alle stehen in n8n unter „Data tables“ → newsletter_abonnenten.</p>` : ""}`
  : `<p class="small">Noch niemand. Anmeldungen kommen vom Formular auf der Website (Fußzeile und Küchenplaner).</p>`;

const history = sends.length
  ? `<table><tr><th>Gesendet</th><th>Betreff</th><th>Sprache</th><th>Art</th><th>Empfänger</th><th>Fehler</th></tr>
${[...sends].sort((a, b) => String(b.gestartet_am ?? "").localeCompare(String(a.gestartet_am ?? ""))).slice(0, 50).map((row) => `<tr><td class="small">${esc(when(row.fertig_am || row.gestartet_am))}</td><td>${esc(row.betreff)}</td><td>${esc(row.sprache)}</td><td>${row.test ? "Test" : "<b>Alle</b>"}</td><td>${esc(row.gesendet)} von ${esc(row.empfaenger)}</td><td class="${row.fehler ? "fehler" : "small"}">${esc(row.fehler || "–")}</td></tr>`).join("")}</table>`
  : `<p class="small">Noch nichts gesendet.</p>`;

const html = page(
  "Newsletter",
  "Newsletter",
  `<div class="kpi"><div><b>${count("bestaetigt")}</b>bestätigt (${count("bestaetigt", "de")} DE · ${count("bestaetigt", "en")} EN)</div><div><b>${count("ausstehend")}</b>warten auf Bestätigung</div><div><b>${count("abgemeldet")}</b>abgemeldet</div></div>

<h2>Neuer Newsletter</h2>
<form class="card" method="post" action="/webhook/beer-newsletter/senden" enctype="multipart/form-data" style="display:block">
<dl>
<dt>Betreff</dt><dd><input name="betreff" required maxlength="150" style="width:100%"></dd>
<dt>Vorschautext</dt><dd><input name="vorschau" maxlength="200" style="width:100%" placeholder="Erscheint im Postfach neben dem Betreff"></dd>
<dt>An</dt><dd><select name="sprache"><option value="de">Deutsch</option><option value="en">Englisch</option><option value="alle">Alle Sprachen</option></select></dd>
<dt>Inhalt</dt><dd><label><input type="radio" name="inhalt" value="vorlage" checked> Text in der BEER-Vorlage</label> &nbsp; <label><input type="radio" name="inhalt" value="html"> Eigenes HTML</label></dd>
<dt>Überschrift</dt><dd><input name="ueberschrift" maxlength="120" style="width:100%" placeholder="Nur für die BEER-Vorlage"></dd>
<dt>Text</dt><dd><textarea name="text" rows="12" placeholder="{{anrede}}

Absätze durch eine Leerzeile trennen.

## Zwischenüberschrift

Ein [Link](https://www.beer.de/projekte) im Text.

-> Termin vereinbaren | https://www.beer.de/beratung

Bild: https://cms.beer.de/uploads/…"></textarea>
<div class="small">Für die BEER-Vorlage. <b>## </b> = Zwischenüberschrift · <b>[Text](https://…)</b> = Link · <b>-&gt; Text | https://…</b> = Knopf · <b>Bild: https://…</b> = Foto (z. B. aus der Strapi-Mediathek).</div></dd>
<dt>HTML-Datei</dt><dd><input type="file" name="datei" accept=".html,.htm,text/html"> <span class="small">oder unten einfügen</span></dd>
<dt>HTML</dt><dd><textarea name="html" rows="6" placeholder="&lt;html&gt;… aus einem Mail-Editor (z. B. Stripo, Beefree, Mailchimp-Export)"></textarea>
<div class="small">Für „Eigenes HTML“. Fehlt der Platzhalter <b>{{abmelden_url}}</b>, wird die Fußzeile mit Abmeldelink, Adresse und Impressum automatisch angehängt.</div></dd>
<dt>Testadressen</dt><dd><input name="testadressen" style="width:100%" placeholder="eine oder mehrere, durch Komma getrennt"></dd>
<dt>Alle senden</dt><dd><input name="bestaetigung" placeholder="SENDEN eintippen" autocomplete="off"> <span class="small">nur für „An alle senden“</span></dd>
</dl>
<div class="actions"><button name="aktion" value="vorschau" formtarget="_blank">Vorschau</button><button name="aktion" value="test">Testmail senden</button><button class="primary" name="aktion" value="alle">An alle senden</button></div>
<p class="small">Platzhalter in Text und HTML: <b>{{anrede}}</b> (Guten Tag Anna, / Guten Tag,), <b>{{vorname}}</b>, <b>{{email}}</b>, <b>{{abmelden_url}}</b>. Ein Newsletter geht nur an bestätigte Adressen der gewählten Sprache. Dieselbe Mail lässt sich innerhalb von 12 Stunden nicht zweimal an alle senden.</p>
</form>

<h2>Verlauf</h2>${history}
<h2>Abonnenten</h2>${subscribers}
<h2>Regeln</h2><ul>
<li>Jede Adresse kommt nur per Double-Opt-in in die Liste: Anmeldung auf der Website, dann Klick auf den Link in der Bestätigungsmail. Adressen nie von Hand oder aus Kundenlisten eintragen.</li>
<li>Gespeichert wird als Nachweis: Zeitpunkt der Anmeldung und Bestätigung, die IP bei der Bestätigung und der Wortlaut der Einwilligung.</li>
<li>Abmeldungen bleiben in der Liste (Status „abgemeldet“), damit niemand versehentlich wieder Post bekommt. Löschen nur, wenn jemand die Löschung seiner Daten verlangt.</li>
<li>Kundennamen und Fotos aus Projekten nur, wenn die Kunden zugestimmt haben.</li></ul>`,
  notice,
);
return [{ json: { html } }];
