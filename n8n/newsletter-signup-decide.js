// Decides what a sign-up does, after looking the address up in the table:
// – already confirmed: nothing (the website still says "thank you", so nobody learns who is subscribed);
// – asked for a confirmation in the last 10 minutes: nothing (no mail flood to one address);
// – otherwise: save as "ausstehend" with a fresh key and send the confirmation mail.
const signup = $("Schlüssel erzeugen").first().json;
const found = $input.all().map((item) => item.json).find((row) => row && row.id && row.email === signup.email);
const now = new Date();

if (!signup.ok) return [{ json: { ok: false, route: 0 } }];
if (found?.status === "bestaetigt") return [{ json: { ok: true, route: 0 } }];
if (found?.status === "ausstehend" && found.angemeldet_am && now - new Date(found.angemeldet_am) < 10 * 60 * 1000) {
  return [{ json: { ok: true, route: 0 } }];
}

const lang = signup.sprache;
const row = {
  email: signup.email,
  vorname: signup.vorname || found?.vorname || "",
  sprache: lang,
  status: "ausstehend",
  token: signup.token,
  quelle: signup.quelle,
  einwilligung: signup.einwilligung,
  angemeldet_am: now.toISOString(),
};

const copy = {
  de: {
    subject: "Bitte bestätigen Sie Ihre Anmeldung zum BEER Newsletter",
    intro: "Sie haben sich für den Newsletter der BEER Küchenmanufaktur angemeldet. Bitte bestätigen Sie das mit einem Klick:",
    button: "Anmeldung bestätigen",
    after: `Der Link gilt ${NL_CONFIRM_DAYS} Tage. Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach; Sie erhalten dann keine weiteren Nachrichten von uns.`,
  },
  en: {
    subject: "Please confirm your BEER newsletter subscription",
    intro: "You signed up for the BEER Küchenmanufaktur newsletter. Please confirm with one click:",
    button: "Confirm subscription",
    after: `The link is valid for ${NL_CONFIRM_DAYS} days. If you did not sign up, simply ignore this e-mail; you will not hear from us again.`,
  },
}[lang];

const link = nlConfirmUrl(row.token);
const paragraph = (value) => `<tr><td style="padding:12px 32px 0;font:16px/1.65 Arial,Helvetica,sans-serif;color:#33312d">${value}</td></tr>`;
const html = nlLayout({
  lang,
  preheader: copy.intro,
  content: `<tr><td style="padding:28px 32px 4px;font:500 28px/1.2 Georgia,serif;color:#1d1d1b">${esc(NL_WORDS[lang].greeting(row.vorname))}</td></tr>
${paragraph(esc(copy.intro))}<tr><td style="padding:16px 32px 4px">${nlButton(copy.button, link)}</td></tr>
${paragraph(`<span style="font-size:14px;color:#6b6760">${esc(copy.after)}</span>`)}<tr><td style="padding:0 0 28px"></td></tr>`,
})
  // The confirmation mail has no unsubscribe link yet: nobody is subscribed until they click.
  .replace(/<br><a href="\{\{abmelden_url\}\}"[^>]*>[^<]*<\/a>/, "")
  .replace(esc(NL_WORDS[lang].footerWhy), esc(lang === "en" ? "This e-mail was sent because this address was entered on beer.de." : "Diese E-Mail wurde verschickt, weil diese Adresse auf beer.de eingetragen wurde."));

return [{ json: { ok: true, route: 1, row, mail: { from: NL_FROM, replyTo: NL_REPLY_TO, to: row.email, subject: copy.subject, html, text: nlText(html) } } }];
