// One application from the website (Karriere form → /api/bewerbung), made readable.
// The website sends multipart: the details as JSON in "payload", up to three documents as
// files "dokument_1" … "dokument_3" (already checked there by type, content and size).
// Where it goes next (mail to Christian Beer, an HR tool, a list) is not decided yet:
// until then each application, with its documents, is kept only in this workflow's executions.
const input = $input.first();
const raw = input.json;
let body = raw.body && typeof raw.body === "object" && !Array.isArray(raw.body) ? raw.body : {};
if (typeof body.payload === "string") {
  try {
    body = JSON.parse(body.payload);
  } catch {
    body = {};
  }
}
const applicant = body.applicant || {};
const text = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

const binary = input.binary || {};
const unterlagen = Object.entries(binary).map(([key, file]) => ({
  feld: key,
  name: file.fileName || key,
  typ: file.mimeType || "",
  groesse: file.fileSize || "",
}));

const bewerbung = {
  eingegangen: text(body.received_at, 40) || new Date().toISOString(),
  stelle: text(body.job?.title, 120),
  stelle_slug: text(body.job?.slug, 80),
  name: text(applicant.name, 80),
  email: text(applicant.email, 120).toLowerCase(),
  telefon: text(applicant.phone, 40),
  start: text(applicant.start, 60),
  nachricht: String(applicant.message ?? "").trim().slice(0, 2000),
  unterlagen,
  seite: text(body.page, 200),
  id: text(body.id, 80),
};

const ok =
  body.form === "bewerbung" &&
  bewerbung.stelle.length > 0 &&
  bewerbung.name.length >= 2 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bewerbung.email);

// The documents stay on the item, so a later mail or upload step can attach them.
return [{ json: { ok, bewerbung }, binary }];
