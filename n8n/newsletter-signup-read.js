// A newsletter sign-up from the website (/api/newsletter), checked and tidied.
// The website has already filtered bots (challenge, honeypot, rate limit) and only sends a
// sign-up when the person ticked the consent box; its wording comes along as proof.
const body = $input.first().json.body || {};
const text = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

const signup = {
  email: nlEmail(body.email),
  vorname: text(body.vorname, 60),
  sprache: nlLang(body.sprache),
  quelle: text(body.quelle, 200),
  einwilligung: text(body.einwilligung, 600),
};
const ok = body.form === "newsletter" && body.consent === true && Boolean(signup.email) && signup.einwilligung.length > 20;
return [{ json: { ok, ...signup } }];
