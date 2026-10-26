/* eslint-disable @typescript-eslint/no-unused-vars -- shared helpers, pasted in front of the Code nodes that use them */
/**
 * Shared helpers, pasted by pack-workflows.mjs in front of every Code node that needs them:
 * addresses, query strings, escaping, slugs, Strapi admin links, and the one page layout
 * with navigation used by all review pages. Nothing here talks to an API.
 */

const CMS = "https://cms.beer.de";
// Links to the website go to staging until the new site is live on beer.de.
const SITE = "https://staging.beer.de";

const qs = (query) =>
  Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

const esc = (value) =>
  String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const slugify = (value, max = 60) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, max)
    .replace(/-$/, "");

const UID = {
  projects: "api::project.project",
  articles: "api::article.article",
  "site-pages": "api::site-page.site-page",
  "kitchen-topics": "api::kitchen-topic.kitchen-topic",
  regions: "api::region.region",
  materials: "api::material.material",
  appliances: "api::appliance.appliance",
  brands: "api::brand.brand",
  "furniture-items": "api::furniture-item.furniture-item",
};
const adminUrl = (api, documentId, locale = "de") =>
  `${CMS}/admin/content-manager/collection-types/${UID[api] ?? api}/${documentId}?plugins[i18n][locale]=${locale}`;

const when = (iso) => (iso ? new Date(iso).toLocaleString("de-DE", { timeZone: "Europe/Berlin", dateStyle: "medium", timeStyle: "short" }) : "");

// Same words as the website uses for a "useful" photo description.
const weakAlt = (alt) => {
  const text = String(alt ?? "").trim();
  return text.length < 30 || !text.includes(" ") || /\.(jpe?g|png|webp|gif)$/i.test(text);
};

const NAV = [
  ["Übersicht", "/webhook/redaktion"],
  ["SEO-Prüfung", "/webhook/seo-pruefung"],
  ["SEO-Vorschläge", "/webhook/seo-vorschlaege"],
  ["Projekttexte", "/webhook/beer-texte"],
  ["Ratgeber", "/webhook/beer-ratgeber"],
  ["GEO-Monitor", "/webhook/geo-monitor"],
  ["Regionen", "/webhook/beer-regionen"],
  ["Meldungen", "/webhook/0b1c2d3e-4f5a-4b6c-8d7e-9f0a1b2c3d06/chat"],
  ["Neue Seite", "/webhook/7d8e9f0a-1b2c-4d3e-8f4a-5b6c7d8e9f07/chat"],
];

/** One full HTML page in the shared layout. `active` is the NAV label to highlight. */
function page(title, active, body, notice = "") {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · BEER Redaktion</title><style>
:root{--ink:#1d1d1b;--muted:#6b6760;--line:#e3ded6;--paper:#faf8f5;--card:#fff;--red:#a4161a;--amber:#7a5c00;--green:#2d6a4f}
*{box-sizing:border-box}body{font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;margin:0;color:var(--ink);background:var(--paper)}
nav{display:flex;flex-wrap:wrap;gap:4px 14px;padding:12px 16px;border-bottom:1px solid var(--line);background:var(--card);font-size:14px}
nav a{color:var(--muted);text-decoration:none}nav a.on{color:var(--ink);font-weight:600}nav b{margin-right:8px}
main{max-width:1080px;margin:0 auto;padding:24px 16px 64px}h1{font-weight:500;font-size:28px;margin:0 0 4px}
h2{font-size:19px;margin:28px 0 8px}h3{font-size:15px;margin:16px 0 6px}a{color:var(--ink)}
.small{font-size:13px;color:var(--muted)}.card{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:16px 18px;margin:14px 0}
table{border-collapse:collapse;width:100%}td,th{vertical-align:top;text-align:left;padding:7px 8px;border-bottom:1px solid #ece8e1}th{font-weight:600;font-size:13px;color:var(--muted)}
ul{margin:0;padding-left:18px}.fehler{color:var(--red)}.hinweis{color:var(--amber)}.ok{color:var(--green)}
.kpi{display:flex;gap:28px;margin:16px 0 20px;flex-wrap:wrap}.kpi b{display:block;font-size:24px;font-weight:600}
.notice{background:#eef6f0;border:1px solid #b7d8c2;padding:8px 12px;border-radius:4px;margin:12px 0}
.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}form{margin:0;display:inline-flex;flex-wrap:wrap;gap:8px;align-items:center}
button{font:inherit;padding:7px 14px;border:1px solid var(--ink);background:#fff;border-radius:4px;cursor:pointer}button.primary{background:var(--ink);color:#fff}
input,select,textarea{font:inherit;padding:6px 8px;border:1px solid #cfc9bf;border-radius:4px;background:#fff}textarea{width:100%;min-height:90px}
dl{display:grid;grid-template-columns:160px 1fr;gap:4px 12px;margin:0}dt{color:var(--muted)}dd{margin:0}.pre{white-space:pre-wrap}
details>summary{cursor:pointer;padding:10px 0}img{border-radius:3px;display:block;max-width:100%}
@media (max-width:640px){dl{grid-template-columns:1fr}.kpi{gap:18px}}</style></head><body>
<nav><b>BEER Redaktion</b>${NAV.map(([label, href]) => `<a href="${href}"${label === active ? ' class="on"' : ""}>${esc(label)}</a>`).join("")}</nav>
<main><h1>${esc(title)}</h1>${notice ? `<p class="notice">${notice}</p>` : ""}${body}</main></body></html>`;
}

/** A small POST form with hidden fields and one button. */
function button(action, fields, label, primary = false) {
  const hidden = Object.entries(fields).map(([k, v]) => `<input type="hidden" name="${esc(k)}" value="${esc(v)}">`).join("");
  return `<form method="post" action="${esc(action)}">${hidden}<button${primary ? ' class="primary"' : ""}>${esc(label)}</button></form>`;
}
