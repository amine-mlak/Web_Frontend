#!/usr/bin/env node
/**
 * Writes gtm/web-container.json: the GTM web container for beer.de as an import
 * file (GTM → Admin → Import Container). Run: node scripts/gtm/build-container.mjs
 *
 * Fill the IDs in PLATFORMS below (or later in GTM's constant variables). A
 * platform whose ID still starts with "REPLACE" has its tags paused, so an
 * import never sends anything to a platform that is not set up yet.
 *
 * Consent (Consent Mode v2 "basic", see docs/tracking-and-consent.md): GTM only
 * loads after a "yes", and every tag below additionally requires its consent
 * type (analytics_storage or ad_storage), so no tag ever fires in "denied" mode,
 * not even Google's cookieless pings.
 *
 * Site events (lib/analytics.ts, lib/form-tracking.ts, components/LinkTracking.tsx):
 * generate_lead, contact, get_directions, social_click, form_*, menu_open,
 * page_view_spa (client-side navigation).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PLATFORMS = {
  ga4: { "GA4 Measurement ID": "REPLACE_G-XXXXXXXXXX" },
  googleAds: {
    "Google Ads Conversion ID": "REPLACE_AW_ID_digits_only",
    "Google Ads Label Lead": "REPLACE_LABEL_LEAD",
    "Google Ads Label Contact": "REPLACE_LABEL_CONTACT",
    "Google Ads Label Directions": "REPLACE_LABEL_DIRECTIONS",
  },
  meta: { "Meta Pixel ID": "REPLACE_META_PIXEL_ID" },
  pinterest: { "Pinterest Tag ID": "REPLACE_PINTEREST_TAG_ID" },
  microsoft: { "Microsoft UET Tag ID": "REPLACE_UET_TAG_ID" },
  linkedin: {
    "LinkedIn Partner ID": "REPLACE_LINKEDIN_PARTNER_ID",
    "LinkedIn Conversion ID Lead": "REPLACE_LINKEDIN_CONVERSION_ID",
  },
};

const here = dirname(fileURLToPath(import.meta.url));
const outFile = join(here, "..", "..", "gtm", "web-container.json");

// GTM built-in triggers.
const ALL_PAGES = "2147479553";
const BUILT_IN_TRIGGERS = new Set([ALL_PAGES, "2147479572", "2147479573"]);
const BUILT_IN_VARIABLES = new Set(["Event", "Page URL", "Page Path", "Page Hostname", "Referrer", "_event"]);

let nextId = 1;
const id = () => String(nextId++);
const tpl = (key, value) => ({ type: "TEMPLATE", key, value: String(value) });
const bool = (key, value) => ({ type: "BOOLEAN", key, value: String(value) });
const list = (key, items) => ({ type: "LIST", key, list: items });
const map = (entries) => ({ type: "MAP", map: Object.entries(entries).map(([k, v]) => tpl(k, v)) });

const paused = (platform) => Object.values(PLATFORMS[platform]).some((v) => String(v).startsWith("REPLACE"));
const needs = (consentType) => ({
  consentStatus: "NEEDED",
  consentType: { type: "LIST", list: [{ type: "TEMPLATE", value: consentType }] },
});

// ---------- variables ----------
const variables = [];
function constant(name, value) {
  variables.push({ variableId: id(), name, type: "c", parameter: [tpl("value", value)] });
}
function dataLayer(name, key) {
  variables.push({
    variableId: id(),
    name,
    type: "v",
    parameter: [{ type: "INTEGER", key: "dataLayerVersion", value: "2" }, bool("setDefaultValue", false), tpl("name", key)],
  });
}
for (const group of Object.values(PLATFORMS)) {
  for (const [name, value] of Object.entries(group)) constant(name, value);
}
for (const key of ["event_id", "value", "currency", "method", "placement", "network", "form", "source", "step", "reason", "page_path", "user_data",
  "user_data.sha256_email_address", "user_data.sha256_phone_number", "user_data.address.postal_code"]) {
  dataLayer(`DLV - ${key}`, key);
}
// Pre-hashed e-mail/phone for Google enhanced conversions (the site never pushes raw data).
variables.push({
  variableId: id(),
  name: "User-Provided Data",
  type: "awec",
  parameter: [tpl("mode", "CODE"), tpl("dataSource", "{{DLV - user_data}}")],
});

// ---------- triggers ----------
const triggers = [];
const triggerIds = {};
function customEvent(name, eventName, regex = false) {
  const triggerId = id();
  triggers.push({
    triggerId,
    name,
    type: "CUSTOM_EVENT",
    customEventFilter: [
      { type: regex ? "MATCH_REGEX" : "EQUALS", parameter: [tpl("arg0", "{{_event}}"), tpl("arg1", eventName)] },
    ],
  });
  triggerIds[name] = triggerId;
  return triggerId;
}
const T = {
  lead: customEvent("CE - generate_lead", "generate_lead"),
  contact: customEvent("CE - contact", "contact"),
  contactPhone: (() => {
    const triggerId = id();
    triggers.push({
      triggerId,
      name: "CE - contact (phone)",
      type: "CUSTOM_EVENT",
      customEventFilter: [{ type: "EQUALS", parameter: [tpl("arg0", "{{_event}}"), tpl("arg1", "contact")] }],
      filter: [{ type: "EQUALS", parameter: [tpl("arg0", "{{DLV - method}}"), tpl("arg1", "phone")] }],
    });
    return triggerId;
  })(),
  directions: customEvent("CE - get_directions", "get_directions"),
  social: customEvent("CE - social_click", "social_click"),
  funnel: customEvent("CE - form funnel", "^form_(view|start|step|attempt|error|submit)$", true),
  spa: customEvent("CE - page_view_spa", "page_view_spa"),
};

// ---------- tags ----------
const tags = [];
function tag(platform, name, type, parameter, firingTriggerId, consentType) {
  tags.push({
    tagId: id(),
    name,
    type,
    parameter,
    firingTriggerId,
    tagFiringOption: "ONCE_PER_EVENT",
    consentSettings: needs(consentType),
    ...(paused(platform) ? { paused: true } : {}),
  });
}
const html = (code) => [tpl("html", code), bool("supportDocumentWrite", false)];

// Google tag + GA4 events (analytics_storage).
tag("ga4", "GA4 - Google tag", "googtag", [tpl("tagId", "{{GA4 Measurement ID}}")], [ALL_PAGES], "analytics_storage");
const ga4Event = (name, eventName, trigger, params) =>
  tag("ga4", name, "gaawe", [
    tpl("eventName", eventName),
    tpl("measurementIdOverride", "{{GA4 Measurement ID}}"),
    bool("sendEcommerceData", false),
    list("eventSettingsTable", Object.entries(params).map(([parameter, parameterValue]) => map({ parameter, parameterValue }))),
  ], [trigger], "analytics_storage");
ga4Event("GA4 - generate_lead", "generate_lead", T.lead, { form: "{{DLV - form}}", value: "{{DLV - value}}", currency: "{{DLV - currency}}", transaction_id: "{{DLV - event_id}}" });
ga4Event("GA4 - contact", "contact", T.contact, { method: "{{DLV - method}}", placement: "{{DLV - placement}}" });
ga4Event("GA4 - get_directions", "get_directions", T.directions, { placement: "{{DLV - placement}}" });
ga4Event("GA4 - social_click", "social_click", T.social, { network: "{{DLV - network}}" });
ga4Event("GA4 - form funnel", "{{Event}}", T.funnel, { form: "{{DLV - form}}", source: "{{DLV - source}}", step: "{{DLV - step}}", reason: "{{DLV - reason}}" });

// Google Ads (ad_storage).
tag("googleAds", "Google Ads - Conversion Linker", "gclidw", [bool("enableCrossDomain", false), bool("enableUrlPassthrough", false), bool("enableCookieOverrides", false)], [ALL_PAGES], "ad_storage");
const adsConversion = (name, label, trigger, extra = []) =>
  tag("googleAds", name, "awct", [
    tpl("conversionId", "{{Google Ads Conversion ID}}"),
    tpl("conversionLabel", label),
    bool("enableConversionLinker", true),
    bool("enableNewCustomerReporting", false),
    bool("enableProductReporting", false),
    bool("rdp", false),
    ...extra,
  ], [trigger], "ad_storage");
adsConversion("Google Ads - Lead (Küchenplaner)", "{{Google Ads Label Lead}}", T.lead, [
  tpl("conversionValue", "{{DLV - value}}"),
  tpl("currencyCode", "{{DLV - currency}}"),
  tpl("orderId", "{{DLV - event_id}}"),
  bool("enableEnhancedConversion", true),
  tpl("cssProvidedEnhancedConversionValue", "{{User-Provided Data}}"),
]);
adsConversion("Google Ads - Contact (phone)", "{{Google Ads Label Contact}}", T.contactPhone);
adsConversion("Google Ads - Directions", "{{Google Ads Label Directions}}", T.directions);
tag("googleAds", "Google Ads - Remarketing", "sp", [
  tpl("conversionId", "{{Google Ads Conversion ID}}"),
  tpl("customParamsFormat", "NONE"),
  bool("enableDynamicRemarketing", false),
  bool("enableConversionLinker", true),
  bool("rdp", false),
], [ALL_PAGES, T.spa], "ad_storage");

// Meta Pixel (ad_storage). eventID = the lead's event_id, for dedup with the Conversions API later.
const META_BASE = `<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{Meta Pixel ID}}');
fbq('track', 'PageView');
</script>`;
tag("meta", "Meta - Base + PageView", "html", html(META_BASE), [ALL_PAGES], "ad_storage");
tag("meta", "Meta - PageView (navigation)", "html", html(`<script>window.fbq && fbq('track', 'PageView');</script>`), [T.spa], "ad_storage");
tag("meta", "Meta - Lead", "html", html(`<script>
if (window.fbq) {
  var em = {{DLV - user_data.sha256_email_address}}, ph = {{DLV - user_data.sha256_phone_number}}, zp = {{DLV - user_data.address.postal_code}};
  var am = {};
  if (em) am.em = em;
  if (ph) am.ph = ph.replace(/^\\+/, '');
  if (zp) am.zp = zp;
  if (em || ph) fbq('init', '{{Meta Pixel ID}}', am);
  var v = {{DLV - value}};
  fbq('track', 'Lead', v ? { value: v, currency: 'EUR' } : {}, { eventID: {{DLV - event_id}} });
}
</script>`), [T.lead], "ad_storage");
tag("meta", "Meta - Contact", "html", html(`<script>window.fbq && fbq('track', 'Contact', { content_category: {{DLV - method}} });</script>`), [T.contact], "ad_storage");
tag("meta", "Meta - FindLocation", "html", html(`<script>window.fbq && fbq('track', 'FindLocation');</script>`), [T.directions], "ad_storage");

// Pinterest (ad_storage).
tag("pinterest", "Pinterest - Base + Page", "html", html(`<script>
!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', '{{Pinterest Tag ID}}');
pintrk('page');
</script>`), [ALL_PAGES], "ad_storage");
tag("pinterest", "Pinterest - Page (navigation)", "html", html(`<script>window.pintrk && pintrk('page');</script>`), [T.spa], "ad_storage");
tag("pinterest", "Pinterest - Lead", "html", html(`<script>
if (window.pintrk) {
  var em = {{DLV - user_data.sha256_email_address}};
  if (em) pintrk('set', { em: em });
  pintrk('track', 'lead', { event_id: {{DLV - event_id}}, lead_type: 'Kuechenplaner' });
}
</script>`), [T.lead], "ad_storage");

// Microsoft Advertising UET (ad_storage). The tag only fires after a "yes", so UET's own consent is granted.
tag("microsoft", "Microsoft UET - Base", "html", html(`<script>
window.uetq = window.uetq || [];
window.uetq.push('consent', 'default', { 'ad_storage': 'granted' });
(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"{{Microsoft UET Tag ID}}", enableAutoSpaTracking: true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","https://bat.bing.com/bat.js","uetq");
</script>`), [ALL_PAGES], "ad_storage");
tag("microsoft", "Microsoft UET - Lead", "html", html(`<script>
window.uetq = window.uetq || [];
var em = {{DLV - user_data.sha256_email_address}}, ph = {{DLV - user_data.sha256_phone_number}};
if (em || ph) window.uetq.push('set', { pid: { em: em || undefined, ph: ph || undefined } });
window.uetq.push('event', 'submit_lead_form', { event_category: 'lead', event_label: 'Kuechenplaner', revenue_value: {{DLV - value}} || 0, currency: 'EUR' });
</script>`), [T.lead], "ad_storage");
tag("microsoft", "Microsoft UET - Contact", "html", html(`<script>window.uetq = window.uetq || []; window.uetq.push('event', 'contact', { event_label: {{DLV - method}} });</script>`), [T.contact], "ad_storage");

// LinkedIn Insight Tag (ad_storage). Single-page navigation is tracked by the tag itself.
tag("linkedin", "LinkedIn - Insight Tag", "html", html(`<script>
_linkedin_partner_id = "{{LinkedIn Partner ID}}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);
</script>`), [ALL_PAGES], "ad_storage");
tag("linkedin", "LinkedIn - Lead", "html", html(`<script>window.lintrk && window.lintrk('track', { conversion_id: {{LinkedIn Conversion ID Lead}} });</script>`), [T.lead], "ad_storage");

// ---------- container ----------
const container = {
  exportFormatVersion: 2,
  exportTime: new Date().toISOString().replace("T", " ").slice(0, 19),
  containerVersion: {
    path: "accounts/0/containers/0/versions/0",
    accountId: "0",
    containerId: "0",
    containerVersionId: "0",
    container: {
      path: "accounts/0/containers/0",
      accountId: "0",
      containerId: "0",
      name: "beer.de (web)",
      publicId: "GTM-XXXXXXX",
      usageContext: ["WEB"],
    },
    tag: tags,
    trigger: triggers,
    variable: variables,
    builtInVariable: [
      { type: "EVENT", name: "Event" },
      { type: "PAGE_URL", name: "Page URL" },
      { type: "PAGE_PATH", name: "Page Path" },
      { type: "PAGE_HOSTNAME", name: "Page Hostname" },
      { type: "REFERRER", name: "Referrer" },
    ],
  },
};

// ---------- self-check ----------
const problems = [];
const allIds = [...tags.map((t) => t.tagId), ...triggers.map((t) => t.triggerId), ...variables.map((v) => v.variableId)];
if (new Set(allIds).size !== allIds.length) problems.push("duplicate ids");
const names = new Set([...variables.map((v) => v.name), ...BUILT_IN_VARIABLES]);
for (const kind of [tags, triggers, variables]) {
  const seen = new Set();
  for (const item of kind) {
    if (seen.has(item.name)) problems.push(`duplicate name: ${item.name}`);
    seen.add(item.name);
  }
}
const triggerSet = new Set([...triggers.map((t) => t.triggerId), ...BUILT_IN_TRIGGERS]);
for (const t of tags) {
  for (const trigger of t.firingTriggerId) if (!triggerSet.has(trigger)) problems.push(`${t.name}: unknown trigger ${trigger}`);
}
for (const ref of JSON.stringify(container).matchAll(/\{\{([^}]+)\}\}/g)) {
  if (!names.has(ref[1])) problems.push(`unknown variable {{${ref[1]}}}`);
}
if (problems.length) {
  console.error(`Container check failed:\n- ${[...new Set(problems)].join("\n- ")}`);
  process.exit(1);
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(container, null, 2)}\n`);
const pausedCount = tags.filter((t) => t.paused).length;
console.log(`Wrote ${outFile}: ${tags.length} tags (${pausedCount} paused until their IDs are set), ${triggers.length} triggers, ${variables.length} variables.`);
