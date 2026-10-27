// The page behind the link in a mail (confirm or unsubscribe). Opening the link changes nothing:
// mail scanners open links on their own, so the change needs the button on this page (POST).
// KIND ("bestaetigen" | "abmelden") and TRIGGER (the webhook node) are set in front by pack-workflows.mjs.
const query = $(TRIGGER).first().json.query || {};
const token = String(query.t ?? "").slice(0, 120);
const found = $input.all().map((item) => item.json).find((row) => row && row.id && token && row.token === token);
const lang = nlLang(found?.sprache || query.lang);
const en = lang === "en";
const form = (label, note) =>
  `<p>${note}</p><form method="post" action="${NL_HOOK}/${KIND}"><input type="hidden" name="t" value="${esc(token)}"><button>${esc(label)}</button></form>`;
const expired = found?.angemeldet_am && Date.now() - new Date(found.angemeldet_am) > NL_CONFIRM_DAYS * 864e5;
const again = en
  ? `<p>You can sign up again at any time on <a href="${NL_SITE}/en">beer.de</a>.</p>`
  : `<p>Sie können sich jederzeit auf <a href="${NL_SITE}">beer.de</a> neu anmelden.</p>`;

let html;
if (!found) {
  html = nlPage(lang, en ? "This link is not valid" : "Dieser Link ist nicht gültig", `<p>${en ? "The link is incomplete or no longer valid." : "Der Link ist unvollständig oder nicht mehr gültig."}</p>${KIND === "bestaetigen" ? again : ""}`);
} else if (KIND === "bestaetigen") {
  if (found.status === "bestaetigt") html = nlPage(lang, en ? "You are subscribed" : "Sie sind angemeldet", `<p>${en ? "Your subscription is already confirmed. Thank you!" : "Ihre Anmeldung ist schon bestätigt. Vielen Dank!"}</p>`);
  else if (found.status === "abgemeldet" || expired) html = nlPage(lang, en ? "This link has expired" : "Dieser Link ist abgelaufen", again);
  else
    html = nlPage(
      lang,
      en ? "One more click" : "Noch ein Klick",
      form(
        en ? "Confirm subscription" : "Anmeldung bestätigen",
        en
          ? `Please confirm that <b>${esc(found.email)}</b> should receive the BEER Küchenmanufaktur newsletter. You can unsubscribe at any time with the link in every newsletter.`
          : `Bitte bestätigen Sie, dass <b>${esc(found.email)}</b> den Newsletter der BEER Küchenmanufaktur erhalten soll. Abbestellen können Sie jederzeit über den Link in jedem Newsletter.`,
      ),
    );
} else if (found.status === "abgemeldet") {
  html = nlPage(lang, en ? "You are unsubscribed" : "Sie sind abgemeldet", `<p>${en ? "This address no longer receives the newsletter." : "Diese Adresse erhält den Newsletter nicht mehr."}</p>`);
} else {
  html = nlPage(
    lang,
    en ? "Unsubscribe from the newsletter" : "Newsletter abbestellen",
    form(
      en ? "Unsubscribe" : "Abbestellen",
      en ? `<b>${esc(found.email)}</b> will no longer receive the BEER newsletter.` : `<b>${esc(found.email)}</b> erhält dann keinen BEER Newsletter mehr.`,
    ),
  );
}
return [{ json: { html } }];
