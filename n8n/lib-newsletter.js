/* eslint-disable @typescript-eslint/no-unused-vars -- shared helpers, pasted in front of the newsletter Code nodes */
/**
 * Newsletter helpers, pasted by pack-workflows.mjs in front of the Code nodes of "BEER Newsletter":
 * sender, links, the e-mail layout, placeholders, and the public pages (confirm, unsubscribe)
 * that subscribers see. Nothing here talks to an API.
 */

// Sender and reply address. The sender must be an address the SMTP account may send from
// (with SPF/DKIM for beer.de), otherwise the mails land in spam.
const NL_FROM = "BEER Küchenmanufaktur <newsletter@beer.de>";
const NL_REPLY_TO = "info@beer.de";
// Public links in mails. Subscribers cannot open staging (password), so mails point to beer.de;
// /impressum and /datenschutz exist there once the new site is live.
const NL_SITE = "https://www.beer.de";
const NL_HOOK = "https://n8n.beer.de/webhook/beer-newsletter";
// A confirmation link older than this no longer confirms (the person signs up again).
const NL_CONFIRM_DAYS = 30;

const nlConfirmUrl = (token) => `${NL_HOOK}/bestaetigen?t=${encodeURIComponent(token)}`;
const nlUnsubscribeUrl = (token) => `${NL_HOOK}/abmelden?t=${encodeURIComponent(token)}`;
const nlLang = (value) => (value === "en" ? "en" : "de");
const nlEmail = (value) => {
  const email = String(value ?? "").trim().toLowerCase().slice(0, 160);
  return /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(email) ? email : "";
};

const NL_WORDS = {
  de: {
    greeting: (name) => (name ? `Guten Tag ${name},` : "Guten Tag,"),
    footerWhy: "Sie erhalten diese E-Mail, weil Sie den Newsletter der BEER Küchenmanufaktur abonniert haben.",
    unsubscribe: "Newsletter abbestellen",
    imprint: "Impressum",
    privacy: "Datenschutz",
  },
  en: {
    greeting: (name) => (name ? `Hello ${name},` : "Hello,"),
    footerWhy: "You are receiving this e-mail because you subscribed to the BEER Küchenmanufaktur newsletter.",
    unsubscribe: "Unsubscribe",
    imprint: "Legal notice",
    privacy: "Privacy",
  },
};

/** The legal footer every newsletter ends with: why, unsubscribe link, address, imprint. */
function nlFooter(lang) {
  const w = NL_WORDS[nlLang(lang)];
  return `<tr><td style="padding:28px 32px 36px;border-top:1px solid #e3ded6;font:13px/1.6 Arial,Helvetica,sans-serif;color:#6b6760">
${esc(w.footerWhy)}<br><a href="{{abmelden_url}}" style="color:#1d1d1b">${esc(w.unsubscribe)}</a><br><br>
BEER GmbH · Badendorf 6 · 85395 Wolfersdorf · +49 8168 909910 · info@beer.de<br>
<a href="${NL_SITE}/impressum" style="color:#6b6760">${esc(w.imprint)}</a> · <a href="${NL_SITE}/datenschutz" style="color:#6b6760">${esc(w.privacy)}</a>
</td></tr>`;
}

/**
 * The BEER mail layout: wordmark, optional preview text (shown by mail apps next to the subject),
 * the content, the legal footer. Table layout and inline styles, so Outlook and Gmail show it alike.
 */
function nlLayout({ lang, preheader = "", content }) {
  return `<!doctype html><html lang="${nlLang(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BEER Küchenmanufaktur</title></head>
<body style="margin:0;padding:0;background:#f4f1ea">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff">
<tr><td style="padding:28px 32px 8px;font:600 22px/1 Georgia,'Times New Roman',serif;letter-spacing:0.18em;color:#1d1d1b">BEER</td></tr>
<tr><td style="padding:0 32px;font:12px/1.4 Arial,Helvetica,sans-serif;letter-spacing:0.08em;color:#8a7a5c;text-transform:uppercase">Küchenmanufaktur · Wolfersdorf</td></tr>
${content}
${nlFooter(lang)}
</table></td></tr></table></body></html>`;
}

/** A large dark button that works in all mail apps. */
function nlButton(label, href) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 8px"><tr><td style="background:#1d1d1b">
<a href="${esc(href)}" style="display:inline-block;padding:14px 26px;font:15px/1 Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none">${esc(label)}</a></td></tr></table>`;
}

/**
 * Plain text from the send page → mail content. Blank lines separate paragraphs; a line starting
 * with "## " is a subheading; "[Text](https://…)" is a link; a line "-> Text | https://…" is a button;
 * a line "Bild: https://…" is a photo across the full width.
 */
function nlFromText({ headline, text }) {
  const inline = (line) =>
    esc(line).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, href) => `<a href="${href}" style="color:#1d1d1b">${label}</a>`);
  const blocks = String(text ?? "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const button = block.match(/^->\s*(.+?)\s*\|\s*(https?:\/\/\S+)$/);
      if (button) return `<tr><td style="padding:8px 32px">${nlButton(button[1], button[2])}</td></tr>`;
      const photo = block.match(/^Bild:\s*(https:\/\/\S+)$/i);
      if (photo) return `<tr><td style="padding:12px 0"><img src="${esc(photo[1])}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>`;
      if (block.startsWith("## ")) return `<tr><td style="padding:18px 32px 0;font:500 22px/1.25 Georgia,'Times New Roman',serif;color:#1d1d1b">${inline(block.slice(3))}</td></tr>`;
      return `<tr><td style="padding:12px 32px 0;font:16px/1.65 Arial,Helvetica,sans-serif;color:#33312d">${block.split("\n").map(inline).join("<br>")}</td></tr>`;
    });
  const title = headline
    ? `<tr><td style="padding:28px 32px 4px;font:500 30px/1.15 Georgia,'Times New Roman',serif;color:#1d1d1b">${esc(headline)}</td></tr>`
    : `<tr><td style="padding:12px 0 0"></td></tr>`;
  return `${title}${blocks.join("\n")}<tr><td style="padding:0 0 28px"></td></tr>`;
}

/** Fills the placeholders a newsletter may use: {{anrede}}, {{vorname}}, {{email}}, {{abmelden_url}}. */
function nlPersonalize(html, { lang, vorname = "", email = "", token = "" }) {
  const values = {
    anrede: NL_WORDS[nlLang(lang)].greeting(vorname),
    vorname,
    email,
    abmelden_url: token ? nlUnsubscribeUrl(token) : `${NL_HOOK}/abmelden`,
  };
  return String(html).replace(/\{\{\s*(anrede|vorname|email|abmelden_url)\s*\}\}/g, (_, key) =>
    key === "abmelden_url" ? values[key] : esc(values[key]),
  );
}

/** A readable text version for mail apps without HTML (and for spam filters). */
function nlText(html) {
  return String(html)
    .replace(/<div style="display:none[\s\S]*?<\/div>/i, "")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => `${label.replace(/<[^>]+>/g, "")} (${href})`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|tr|h[1-6]|li|div)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** A short fingerprint of a newsletter, so the same mail is not sent to everyone twice by accident. */
function nlFingerprint(value) {
  let hash = 0x811c9dc5;
  for (const char of String(value)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/** A simple BEER page for subscribers (confirm, unsubscribe): no navigation, one message. */
function nlPage(lang, title, body) {
  return `<!doctype html><html lang="${nlLang(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(title)} · BEER Küchenmanufaktur</title><style>
body{margin:0;background:#f4f1ea;color:#1d1d1b;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:560px;margin:8vh auto;padding:40px 32px;background:#fff}
.mark{font:600 22px/1 Georgia,serif;letter-spacing:.18em}.sub{font-size:12px;letter-spacing:.08em;color:#8a7a5c;text-transform:uppercase;margin-top:6px}
h1{font:500 32px/1.15 Georgia,serif;margin:32px 0 12px}p{margin:0 0 14px;color:#33312d}a{color:#1d1d1b}
button{font:inherit;padding:13px 24px;background:#1d1d1b;color:#fff;border:0;cursor:pointer}small{color:#6b6760}</style></head>
<body><main><div class="mark">BEER</div><div class="sub">Küchenmanufaktur · Wolfersdorf</div><h1>${esc(title)}</h1>${body}
<p><small><a href="${NL_SITE}">beer.de</a> · <a href="${NL_SITE}/datenschutz">${nlLang(lang) === "en" ? "Privacy" : "Datenschutz"}</a></small></p></main></body></html>`;
}
