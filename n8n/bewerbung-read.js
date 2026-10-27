// One application from the website (Karriere form → /api/bewerbung), made readable.
// Where it goes next (mail to Christian Beer, an HR tool, a list) is not decided yet:
// until then each application is kept only in this workflow's executions in n8n.
const raw = $input.first().json;
const body = raw.body && typeof raw.body === "object" && !Array.isArray(raw.body) ? raw.body : {};
const applicant = body.applicant || {};
const text = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

const bewerbung = {
  eingegangen: text(body.received_at, 40) || new Date().toISOString(),
  stelle: text(body.job?.title, 120),
  stelle_slug: text(body.job?.slug, 80),
  name: text(applicant.name, 80),
  email: text(applicant.email, 120).toLowerCase(),
  telefon: text(applicant.phone, 40),
  start: text(applicant.start, 60),
  nachricht: String(applicant.message ?? "").trim().slice(0, 2000),
  seite: text(body.page, 200),
  id: text(body.id, 80),
};

const ok =
  body.form === "bewerbung" &&
  bewerbung.stelle.length > 0 &&
  bewerbung.name.length >= 2 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bewerbung.email);

return [{ json: { ok, bewerbung } }];
