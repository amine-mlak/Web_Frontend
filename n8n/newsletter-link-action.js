// The button on the confirm or unsubscribe page (and "one-click" unsubscribe from mail apps,
// which POST to the link itself). route 1: save the change in the table; route 0: only answer.
// KIND and TRIGGER are set in front by pack-workflows.mjs.
const trigger = $(TRIGGER).first().json;
const token = String(trigger.body?.t ?? trigger.query?.t ?? "").slice(0, 120);
const found = $input.all().map((item) => item.json).find((row) => row && row.id && token && row.token === token);
const lang = nlLang(found?.sprache);
const en = lang === "en";
const headers = trigger.headers || {};
const ip = String(headers["x-forwarded-for"] || headers["x-real-ip"] || "").split(",")[0].trim().slice(0, 60);
const now = new Date().toISOString();
const expired = found?.angemeldet_am && Date.now() - new Date(found.angemeldet_am) > NL_CONFIRM_DAYS * 864e5;
const invalid = nlPage(lang, en ? "This link is not valid" : "Dieser Link ist nicht gültig", `<p>${en ? "The link is incomplete or no longer valid." : "Der Link ist unvollständig oder nicht mehr gültig."}</p>`);

if (KIND === "bestaetigen") {
  const done = nlPage(
    lang,
    en ? "Thank you, you are subscribed" : "Danke, Sie sind angemeldet",
    `<p>${en ? "From now on you will receive our newsletter about kitchens, projects and dates in Wolfersdorf." : "Ab jetzt erhalten Sie unseren Newsletter mit Küchen, Projekten und Terminen aus Wolfersdorf."}</p><p><a href="${NL_SITE}${en ? "/en" : ""}">${en ? "Back to beer.de" : "Zurück zu beer.de"}</a></p>`,
  );
  if (found?.status === "bestaetigt") return [{ json: { route: 0, html: done } }];
  if (!found || found.status !== "ausstehend" || expired) return [{ json: { route: 0, html: invalid } }];
  return [{ json: { route: 1, token, row: { status: "bestaetigt", bestaetigt_am: now, bestaetigt_ip: ip }, html: done } }];
}

const gone = nlPage(lang, en ? "You are unsubscribed" : "Sie sind abgemeldet", `<p>${en ? "This address no longer receives the newsletter. We are sorry to see you go." : "Diese Adresse erhält den Newsletter nicht mehr. Schade, dass Sie gehen."}</p>`);
if (!found) return [{ json: { route: 0, html: invalid } }];
if (found.status === "abgemeldet") return [{ json: { route: 0, html: gone } }];
return [{ json: { route: 1, token, row: { status: "abgemeldet", abgemeldet_am: now }, html: gone } }];
