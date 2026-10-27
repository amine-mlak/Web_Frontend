/**
 * n8n Code node "Ausgabe vorbereiten": turns the send form into one finished newsletter.
 * route 0 answers with a page (preview of the mail, or what is missing); route 1 sends
 * (test addresses or everyone confirmed) after answering with a redirect to the overview.
 */
const input = $input.first();
const body = input.json.body || {};
const field = (name, max) => String(body[name] ?? "").trim().slice(0, max);
const aktion = ["vorschau", "test", "alle"].includes(body.aktion) ? body.aktion : "vorschau";
const sprache = ["de", "en", "alle"].includes(body.sprache) ? body.sprache : "de";
const lang = sprache === "en" ? "en" : "de";
const betreff = field("betreff", 150);
const vorschau = field("vorschau", 200);
const problems = [];

let fileHtml = "";
const file = input.binary?.datei;
if (file && Number(file.fileSize ?? 1) !== 0) {
  const buffer = await this.helpers.getBinaryDataBuffer(0, "datei");
  if (buffer.length > 600 * 1024) problems.push("Die HTML-Datei ist größer als 600 KB. Bilder bitte verlinken statt einbetten.");
  else fileHtml = buffer.toString("utf8");
}

let html = "";
if (body.inhalt === "html") {
  const source = (fileHtml || String(body.html ?? "")).trim();
  if (!source) problems.push("Kein HTML: Datei wählen oder HTML einfügen.");
  else if (source.length > 600 * 1024) problems.push("Das HTML ist größer als 600 KB.");
  else if (/<script\b/i.test(source)) problems.push("Das HTML enthält <script>. Mail-Programme blockieren das; bitte entfernen.");
  else if (/<html[\s>]/i.test(source) || /<body[\s>]/i.test(source)) {
    // A whole mail from a mail editor: keep it, add the legal footer when it has no unsubscribe link.
    html = source.includes("{{abmelden_url}}")
      ? source
      : source.replace(
          /<\/body>/i,
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff">${nlFooter(lang)}</table></td></tr></table></body>`,
        );
    if (!/<\/body>/i.test(source)) html += `<table role="presentation" width="600" cellpadding="0" cellspacing="0">${nlFooter(lang)}</table>`;
  } else {
    html = nlLayout({ lang, preheader: vorschau, content: `<tr><td style="padding:24px 32px;font:16px/1.65 Arial,Helvetica,sans-serif;color:#33312d">${source}</td></tr>` });
  }
} else {
  const text = String(body.text ?? "").trim();
  if (!text) problems.push("Kein Text für die BEER-Vorlage.");
  else html = nlLayout({ lang, preheader: vorschau, content: nlFromText({ headline: field("ueberschrift", 120), text }) });
}

if (betreff.length < 3) problems.push("Betreff fehlt.");
const testadressen = [...new Set(field("testadressen", 600).split(/[,;\s]+/).map(nlEmail).filter(Boolean))].slice(0, 5);
if (aktion === "test" && testadressen.length === 0) problems.push("Für die Testmail mindestens eine gültige Testadresse eintragen.");
if (aktion === "alle" && field("bestaetigung", 20).toUpperCase() !== "SENDEN") problems.push("Für „An alle senden“ bitte SENDEN in das Feld „Alle senden“ eintippen.");

const store = $getWorkflowStaticData("global");
const fingerprint = nlFingerprint(`${sprache}\n${betreff}\n${html}`);
store.sent = Object.fromEntries(Object.entries(store.sent ?? {}).filter(([, at]) => Date.now() - at < 12 * 3600e3));
if (aktion === "alle" && store.sent[fingerprint]) problems.push("Genau dieser Newsletter ist in den letzten 12 Stunden schon an alle gegangen.");

if (problems.length) {
  const list = `<ul>${problems.map((p) => `<li class="fehler">${esc(p)}</li>`).join("")}</ul><p><a href="javascript:history.back()">Zurück zum Formular</a> (die Eingaben bleiben erhalten)</p>`;
  return [{ json: { route: 0, html: page("Newsletter: noch nicht fertig", "Newsletter", list) } }];
}
if (aktion === "vorschau") {
  return [{ json: { route: 0, html: nlPersonalize(html, { lang, vorname: "Anna", email: "anna@example.com" }) } }];
}
// Remember before sending, so a second click on "An alle senden" is refused straight away.
if (aktion === "alle") store.sent[fingerprint] = Date.now();

return [{
  json: {
    route: 1,
    redirect: `/webhook/beer-newsletter?gestartet=${aktion}`,
    newsletter: { betreff, sprache, lang, html, test: aktion === "test", testadressen, fingerprint, gestartet_am: new Date().toISOString() },
  },
}];
