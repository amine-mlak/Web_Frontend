// After the last batch: one line in the send log with how many mails went out and how many failed.
const n = $("Ausgabe vorbereiten").first().json.newsletter;
const items = $input.all();
const failed = items.filter((item) => item.json.error).length;
return [{
  json: {
    betreff: n.betreff,
    sprache: n.sprache,
    test: n.test,
    empfaenger: items.length,
    gesendet: items.length - failed,
    fehler: failed,
    gestartet_am: n.gestartet_am,
    fertig_am: new Date().toISOString(),
    fingerabdruck: n.fingerprint,
  },
}];
