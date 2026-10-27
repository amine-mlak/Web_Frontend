// One item per recipient with the personal mail: test addresses for a test, otherwise every
// confirmed subscriber in the chosen language (each address once).
const n = $("Ausgabe vorbereiten").first().json.newsletter;
const mail = (to, { vorname = "", token = "", lang = n.lang } = {}) => {
  const html = nlPersonalize(n.html, { lang, vorname, email: to, token });
  return { json: { from: NL_FROM, replyTo: NL_REPLY_TO, to, subject: n.test ? `[Test] ${n.betreff}` : n.betreff, html, text: nlText(html) } };
};

if (n.test) return n.testadressen.map((to) => mail(to));

const seen = new Set();
return $input.all()
  .map((item) => item.json)
  .filter((row) => row && row.status === "bestaetigt" && row.token && (n.sprache === "alle" || row.sprache === n.sprache))
  .filter((row) => !seen.has(row.email) && seen.add(row.email))
  .map((row) => mail(row.email, { vorname: row.vorname, token: row.token }));
