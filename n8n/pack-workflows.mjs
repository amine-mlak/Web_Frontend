/**
 * Builds the BEER n8n workflows from the Code-node files in this folder and writes each one
 * to <key>.json here.
 *
 *   node n8n/pack-workflows.mjs            write the JSON files only
 *   node n8n/pack-workflows.mjs --deploy   also create or update them on n8n.beer.de
 *
 * Every Code node gets lib-common.js and lib-claude.js pasted in front of its own code,
 * plus lib-seo.js / lib-ratgeber.js / lib-geo.js where named. Deploy reads N8N_API_KEY from
 * .env.local, creates the three credentials with placeholder values if they do not exist yet
 * (never overwrites them), keeps each workflow's stored data, sets "BEER Redaktion" as the
 * error workflow of all others, and leaves new workflows inactive.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (file) => fs.readFileSync(path.join(here, file), "utf8");

const CREDENTIALS = {
  strapi: { name: "BEER Strapi (Token)", type: "httpHeaderAuth", placeholder: { name: "Authorization", value: "Bearer TOKEN-HIER-EINTRAGEN" } },
  claude: { name: "Claude API (BEER)", type: "httpHeaderAuth", placeholder: { name: "x-api-key", value: "KEY-HIER-EINTRAGEN" } },
  login: { name: "BEER Redaktion (Login)", type: "httpBasicAuth", placeholder: () => ({ user: "redaktion", password: randomPassword() }) },
};

function randomPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(24)), (n) => chars[n % chars.length]).join("");
}

let ids = {};
const cred = (key) => ({ [CREDENTIALS[key].type]: { id: ids[key] ?? "", name: CREDENTIALS[key].name } });

// ---- node builders -------------------------------------------------------------------
let x = 0;
let y = 300;
const pos = () => [(x += 240), y];
const row = (n) => {
  x = 0;
  y = 300 + n * 220;
};

const LIBS = { seo: "lib-seo.js", ratgeber: "lib-ratgeber.js", geo: "lib-geo.js" };
const code = (name, file, { libs = [], prefix = "" } = {}) => ({
  name,
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position: pos(),
  parameters: {
    mode: "runOnceForAllItems",
    jsCode: [prefix, read("lib-common.js"), read("lib-claude.js"), ...libs.map((l) => read(LIBS[l])), read(file)].join("\n"),
  },
});
const webhook = (name, method, webhookPath, webhookId) => ({
  name,
  type: "n8n-nodes-base.webhook",
  typeVersion: 2,
  position: pos(),
  webhookId,
  parameters: { httpMethod: method, path: webhookPath, authentication: "basicAuth", responseMode: "responseNode", options: {} },
  credentials: cred("login"),
});
const chat = (name, webhookId, title, subtitle, initialMessages) => ({
  name,
  type: "@n8n/n8n-nodes-langchain.chatTrigger",
  typeVersion: 1.1,
  position: pos(),
  webhookId,
  parameters: {
    public: true,
    mode: "hostedChat",
    authentication: "basicAuth",
    initialMessages,
    options: { title, subtitle, responseMode: "lastNode", allowFileUploads: false },
  },
  credentials: cred("login"),
});
const html = (name) => ({
  name,
  type: "n8n-nodes-base.respondToWebhook",
  typeVersion: 1.1,
  position: pos(),
  parameters: {
    respondWith: "text",
    responseBody: "={{ $json.html }}",
    options: { responseHeaders: { entries: [{ name: "Content-Type", value: "text/html; charset=utf-8" }] } },
  },
});
const redirect = (name, url) => ({
  name,
  type: "n8n-nodes-base.respondToWebhook",
  typeVersion: 1.1,
  position: pos(),
  parameters: { respondWith: "redirect", redirectURL: url, options: {} },
});
const schedule = (name, interval) => ({
  name,
  type: "n8n-nodes-base.scheduleTrigger",
  typeVersion: 1.2,
  position: pos(),
  // Off until the team has seen the first results; switch on in n8n.
  disabled: true,
  parameters: { rule: { interval: [interval] } },
});
const route = (name, expression) => ({
  name,
  type: "n8n-nodes-base.switch",
  typeVersion: 3.2,
  position: pos(),
  parameters: { mode: "expression", numberOutputs: 2, output: expression },
});
const NEVER_ERROR = { response: { response: { neverError: true } } };
const strapi = (name, extra = {}) => ({
  name,
  type: "n8n-nodes-base.httpRequest",
  typeVersion: 4.2,
  position: pos(),
  parameters: {
    method: "GET",
    url: "={{ $json.url }}",
    authentication: "genericCredentialType",
    genericAuthType: "httpHeaderAuth",
    options: NEVER_ERROR,
    ...extra,
  },
  credentials: cred("strapi"),
});
const strapiWrite = (name, method, url, body = "={{ $json.payload }}") =>
  strapi(name, { method, url, sendBody: true, specifyBody: "json", jsonBody: body });
const claude = (name) => ({
  name,
  type: "n8n-nodes-base.httpRequest",
  typeVersion: 4.2,
  position: pos(),
  // Busy or overloaded API: try again twice, then hand the error on to the next node.
  retryOnFail: true,
  maxTries: 3,
  waitBetweenTries: 5000,
  onError: "continueRegularOutput",
  parameters: {
    method: "POST",
    url: "https://api.anthropic.com/v1/messages",
    authentication: "genericCredentialType",
    genericAuthType: "httpHeaderAuth",
    sendHeaders: true,
    headerParameters: {
      parameters: [
        { name: "anthropic-version", value: "2026-10-21" },
        // Lets the API answer with a fallback model when a request is declined.
        { name: "anthropic-beta", value: "server-side-fallback-2026-07-01" },
      ],
    },
    sendBody: true,
    specifyBody: "json",
    jsonBody: "={{ JSON.stringify($json.request) }}",
    options: { timeout: 300000, batching: { batch: { batchSize: 2, batchInterval: 1500 } } },
  },
  credentials: cred("claude"),
});

// ---- connections ---------------------------------------------------------------------
const link = (...names) => {
  const connections = {};
  for (let i = 0; i < names.length - 1; i++) {
    const [from, output = 0] = [].concat(names[i]);
    connections[from] ??= { main: [] };
    connections[from].main[output] ??= [];
    connections[from].main[output].push({ node: [].concat(names[i + 1])[0], type: "main", index: 0 });
  }
  return connections;
};
const merge = (...parts) => {
  const out = {};
  for (const part of parts)
    for (const [from, { main }] of Object.entries(part)) {
      out[from] ??= { main: [] };
      main.forEach((targets, i) => (out[from].main[i] = [...(out[from].main[i] ?? []), ...(targets ?? [])]));
    }
  return out;
};
const workflow = (name, nodes, connections) => ({ name, nodes, connections, settings: { executionOrder: "v1" } });

// ---- workflows -----------------------------------------------------------------------
const WORKFLOWS = {
  hub: () => {
    row(0);
    const nodes = [
      { name: "Fehler", type: "n8n-nodes-base.errorTrigger", typeVersion: 1, position: pos(), parameters: {} },
      code("Fehler merken", "hub-error.js"),
    ];
    row(1);
    nodes.push(webhook("Aufruf", "GET", "redaktion", "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c08"), code("Übersicht", "hub-page.js"), html("Senden"));
    return workflow("BEER Redaktion", nodes, merge(link("Fehler", "Fehler merken"), link("Aufruf", "Übersicht", "Senden")));
  },

  "seo-check": () => {
    row(0);
    const nodes = [
      webhook("Aufruf", "GET", "seo-pruefung", "5f0d3a52-7e1c-4b7a-9b1e-2a6f4c8d9e01"),
      code("Abfragen", "seo-check-queries.js"),
      strapi("Strapi lesen"),
      code("Prüfen", "seo-check-report.js", { libs: ["seo"] }),
      html("Antwort"),
    ];
    return workflow("BEER SEO-Prüfung", nodes, link("Aufruf", "Abfragen", "Strapi lesen", "Prüfen", "Antwort"));
  },

  "seo-fix": () => {
    row(0);
    const nodes = [webhook("Seite aufrufen", "GET", "seo-vorschlaege", "2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d09"), code("Seite", "seo-fix-page.js", { libs: ["seo"] }), html("Seite senden")];
    row(1);
    nodes.push(
      webhook("Erstellen", "POST", "seo-vorschlaege/erstellen", "3c4d5e6f-7a8b-4c9d-8e0f-2a3b4c5d6e10"),
      redirect("Zur Seite (gestartet)", "/webhook/seo-vorschlaege?gestartet=1"),
      schedule("Monatlich", { field: "months", monthsInterval: 1, triggerAtDayOfMonth: 1, triggerAtHour: 6 }),
      code("Abfragen", "seo-check-queries.js"),
      strapi("Strapi lesen"),
      code("Auswahl", "seo-fix-request.js", { libs: ["seo"] }),
      claude("Claude"),
      code("Vorschläge merken", "seo-fix-store.js"),
    );
    row(2);
    nodes.push(
      webhook("Übernehmen oder verwerfen", "POST", "seo-vorschlaege/aktion", "4d5e6f7a-8b9c-4d0e-9f1a-3b4c5d6e7f11"),
      redirect("Zur Seite (gespeichert)", "/webhook/seo-vorschlaege?gespeichert=1"),
      code("Aktion", "seo-fix-action.js"),
      strapi("Eintrag lesen", { url: "={{ $json.readUrl }}" }),
      code("Neuer SEO-Text", "seo-fix-payload.js"),
      // status=draft in writeUrl: without it Strapi publishes straight away.
      strapiWrite("Speichern", "PUT", "={{ $json.writeUrl }}"),
      code("Gespeichert", "seo-fix-saved.js"),
    );
    return workflow(
      "BEER SEO-Vorschläge",
      nodes,
      merge(
        link("Seite aufrufen", "Seite", "Seite senden"),
        link("Erstellen", "Zur Seite (gestartet)", "Abfragen", "Strapi lesen", "Auswahl", "Claude", "Vorschläge merken"),
        link("Monatlich", "Abfragen"),
        link("Übernehmen oder verwerfen", "Zur Seite (gespeichert)", "Aktion", "Eintrag lesen", "Neuer SEO-Text", "Speichern", "Gespeichert"),
      ),
    );
  },

  "project-texts": () => {
    row(0);
    const nodes = [webhook("Seite aufrufen", "GET", "beer-texte", "8a7c1e4d-2b3f-4c5a-8d6e-7f9a0b1c2d03"), code("Seite", "project-texts-page.js"), html("Seite senden")];
    row(1);
    nodes.push(
      webhook("Vorschläge anfordern", "POST", "beer-texte/vorschlaege", "c3d4e5f6-a7b8-4c9d-8e0f-1a2b3c4d5e04"),
      redirect("Zur Seite (gestartet)", "/webhook/beer-texte?gestartet=1"),
      schedule("Zeitplan", { field: "hours", hoursInterval: 2 }),
      code("Auftrag", "project-texts-requests.js"),
      strapi("Projekte lesen"),
      code("Auswahl", "project-texts-select.js"),
      code("Fotos", "project-texts-photos.js"),
      claude("Alt-Text Claude"),
      code("Alt-Text merken", "project-texts-alt-store.js"),
    );
    row(2);
    nodes.push(code("Übersetzung vorbereiten", "project-texts-translate.js"), claude("Englisch Claude"), code("Englisch merken", "project-texts-en-store.js"));
    row(3);
    nodes.push(
      webhook("Übernehmen oder verwerfen", "POST", "beer-texte/aktion", "e5f6a7b8-c9d0-4e1f-9a2b-3c4d5e6f7a05"),
      redirect("Zur Seite (gespeichert)", "/webhook/beer-texte?gespeichert=1"),
      code("Aktion", "project-texts-apply.js"),
      route("Verteilen", "={{ $json.kind === 'alt' ? 0 : 1 }}"),
      strapi("Alt-Text speichern", {
        method: "POST",
        url: "=https://cms.beer.de/api/upload?id={{ $json.id }}",
        sendBody: true,
        contentType: "multipart-form-data",
        bodyParameters: { parameters: [{ parameterType: "formData", name: "fileInfo", value: "={{ $json.fileInfo }}" }] },
      }),
      code("Alt-Text gespeichert", "project-texts-saved.js", { prefix: 'const KIND = "alt";' }),
    );
    row(4);
    nodes.push(
      // status=draft: without it Strapi publishes the English version straight away.
      strapiWrite("Englisch speichern", "PUT", "=https://cms.beer.de/api/projects/{{ $json.documentId }}?locale=en&status=draft"),
      code("Englisch gespeichert", "project-texts-saved.js", { prefix: 'const KIND = "en";' }),
    );
    return workflow(
      "BEER Projekttexte",
      nodes,
      merge(
        link("Seite aufrufen", "Seite", "Seite senden"),
        link("Vorschläge anfordern", "Zur Seite (gestartet)", "Auftrag"),
        link("Zeitplan", "Auftrag", "Projekte lesen", "Auswahl", "Fotos", "Alt-Text Claude", "Alt-Text merken"),
        link("Auswahl", "Übersetzung vorbereiten", "Englisch Claude", "Englisch merken"),
        link("Übernehmen oder verwerfen", "Zur Seite (gespeichert)", "Aktion", "Verteilen"),
        link(["Verteilen", 0], "Alt-Text speichern", "Alt-Text gespeichert"),
        link(["Verteilen", 1], "Englisch speichern", "Englisch gespeichert"),
      ),
    );
  },

  ratgeber: () => {
    row(0);
    const nodes = [webhook("Seite aufrufen", "GET", "beer-ratgeber", "5e6f7a8b-9c0d-4e1f-8a2b-4c5d6e7f8a12"), code("Seite", "ratgeber-page.js", { libs: ["ratgeber"] }), html("Seite senden")];
    row(1);
    nodes.push(
      webhook("Themen anfordern", "POST", "beer-ratgeber/themen", "6f7a8b9c-0d1e-4f2a-9b3c-5d6e7f8a9b13"),
      redirect("Zur Seite (Themen)", "/webhook/beer-ratgeber?gestartet=1"),
      schedule("Monatlich", { field: "months", monthsInterval: 1, triggerAtDayOfMonth: 1, triggerAtHour: 7 }),
      code("Bestand lesen: Auftrag", "ratgeber-reads.js"),
      strapi("Bestand lesen"),
      route("Was?", "={{ $('Bestand lesen: Auftrag').first().json.trigger?.body?.aktion === 'schreiben' ? 1 : 0 }}"),
      code("Themen: Anfrage", "ratgeber-ideas-request.js", { libs: ["ratgeber"] }),
      claude("Themen Claude"),
      code("Themen: merken", "ratgeber-ideas-store.js", { libs: ["ratgeber"] }),
    );
    row(2);
    nodes.push(
      webhook("Aktion aufrufen", "POST", "beer-ratgeber/aktion", "7a8b9c0d-1e2f-4a3b-8c4d-6e7f8a9b0c14"),
      redirect("Zur Seite (Aktion)", "/webhook/beer-ratgeber?gestartet=1"),
      code("Aktion", "ratgeber-action.js", { libs: ["ratgeber"] }),
    );
    row(3);
    nodes.push(
      code("Artikel: Anfrage", "ratgeber-write-request.js", { libs: ["ratgeber"] }),
      claude("Artikel Claude"),
      code("Artikel: bauen", "ratgeber-write-build.js", { libs: ["ratgeber"] }),
      // status=draft: without it Strapi publishes straight away.
      strapiWrite("Speichern", "POST", "https://cms.beer.de/api/articles?status=draft&locale=de"),
      strapi("Kontrolle", { url: "=https://cms.beer.de/api/articles/{{ $json.data?.documentId ?? 'keiner' }}?status=published&locale=de" }),
      code("Artikel: Ergebnis", "ratgeber-write-result.js"),
    );
    return workflow(
      "BEER Ratgeber",
      nodes,
      merge(
        link("Seite aufrufen", "Seite", "Seite senden"),
        link("Themen anfordern", "Zur Seite (Themen)", "Bestand lesen: Auftrag", "Bestand lesen", "Was?"),
        link("Monatlich", "Bestand lesen: Auftrag"),
        link("Aktion aufrufen", "Zur Seite (Aktion)", "Aktion", "Bestand lesen: Auftrag"),
        link(["Was?", 0], "Themen: Anfrage", "Themen Claude", "Themen: merken"),
        link(["Was?", 1], "Artikel: Anfrage", "Artikel Claude", "Artikel: bauen", "Speichern", "Kontrolle", "Artikel: Ergebnis"),
      ),
    );
  },

  news: () => {
    row(0);
    const nodes = [
      chat(
        "Chat",
        "0b1c2d3e-4f5a-4b6c-8d7e-9f0a1b2c3d06",
        "BEER Meldungen",
        "Entwürfe für Presse & Aktuelles",
        "Hallo! Schreiben Sie in ein paar Zeilen, worum es geht – zum Beispiel ein Termin, eine Auszeichnung oder eine neue Küche. Ich lege daraus einen Entwurf in Strapi an. Veröffentlicht wird dort von Ihnen.",
      ),
      code("Auftrag", "news-request.js"),
      claude("Claude"),
      code("Plan", "news-plan.js"),
      route("Rückfrage?", "={{ $json.route }}"),
      code("Rückfrage", "news-question.js"),
    ];
    row(1);
    nodes.push(
      strapi("Kategorien lesen", { url: "={{ $('Plan').first().json.categoriesUrl }}" }),
      strapi("Projekt suchen", { url: "={{ $('Plan').first().json.projectsUrl }}" }),
      strapi("Adressen prüfen", { url: "={{ $('Plan').first().json.slugsUrl }}" }),
      code("Entwurf", "news-draft.js"),
      // status=draft: without it Strapi publishes straight away.
      strapiWrite("Speichern", "POST", "https://cms.beer.de/api/articles?status=draft&locale=de"),
      strapi("Kontrolle", { url: "=https://cms.beer.de/api/articles/{{ $json.data?.documentId ?? 'keiner' }}?status=published&locale=de" }),
      code("Antwort", "news-reply.js"),
    );
    return workflow(
      "BEER Meldungen",
      nodes,
      merge(
        link("Chat", "Auftrag", "Claude", "Plan", "Rückfrage?"),
        link(["Rückfrage?", 0], "Rückfrage"),
        link(["Rückfrage?", 1], "Kategorien lesen", "Projekt suchen", "Adressen prüfen", "Entwurf", "Speichern", "Kontrolle", "Antwort"),
      ),
    );
  },

  "new-page": () => {
    row(0);
    const nodes = [
      chat(
        "Chat",
        "7d8e9f0a-1b2c-4d3e-8f4a-5b6c7d8e9f07",
        "BEER Neue Seite",
        "Seitenentwürfe im Stil der Website",
        "Hallo! Beschreiben Sie in ein paar Sätzen die neue Seite – zum Beispiel „Materialseite Keramik-Arbeitsplatten: hart, hitzefest, wir verarbeiten sie bei …“. Ich lege einen Entwurf in Strapi an; veröffentlicht wird dort von Ihnen.",
      ),
      code("Bestand: Auftrag", "newpage-reads.js"),
      strapi("Bestand lesen"),
      code("Anfrage", "newpage-request.js"),
      claude("Claude"),
      code("Plan", "newpage-plan.js"),
      route("Rückfrage?", "={{ $json.route }}"),
      code("Rückfrage", "news-question.js"),
    ];
    row(1);
    nodes.push(
      strapi("Projekt suchen", { url: "={{ $json.projectsUrl }}" }),
      code("Bauen", "newpage-build.js"),
      // status=draft is in the url: without it Strapi publishes straight away.
      strapiWrite("Speichern", "POST", "={{ $json.url }}"),
      strapi("Kontrolle", { url: "=https://cms.beer.de/api/{{ $('Bauen').first().json.type }}/{{ $json.data?.documentId ?? 'keiner' }}?status=published&locale=de" }),
      code("Antwort", "newpage-reply.js"),
    );
    return workflow(
      "BEER Neue Seite",
      nodes,
      merge(
        link("Chat", "Bestand: Auftrag", "Bestand lesen", "Anfrage", "Claude", "Plan", "Rückfrage?"),
        link(["Rückfrage?", 0], "Rückfrage"),
        link(["Rückfrage?", 1], "Projekt suchen", "Bauen", "Speichern", "Kontrolle", "Antwort"),
      ),
    );
  },

  geo: () => {
    row(0);
    const nodes = [webhook("Seite aufrufen", "GET", "geo-monitor", "8b9c0d1e-2f3a-4b4c-9d5e-7f8a9b0c1d15"), code("Seite", "geo-page.js", { libs: ["geo"] }), html("Seite senden")];
    row(1);
    nodes.push(
      webhook("Prüfung starten", "POST", "geo-monitor/start", "9c0d1e2f-3a4b-4c5d-8e6f-8a9b0c1d2e16"),
      redirect("Zur Seite (gestartet)", "/webhook/geo-monitor?gestartet=1"),
      schedule("Wöchentlich", { field: "weeks", weeksInterval: 1, triggerAtDay: [1], triggerAtHour: 6 }),
      code("Fragen", "geo-questions.js", { libs: ["geo"] }),
      claude("Claude"),
      code("Auswerten", "geo-evaluate.js"),
      claude("Empfehlung Claude"),
      code("Empfehlungen merken", "geo-advice-store.js"),
    );
    row(2);
    nodes.push(
      webhook("Fragen ändern", "POST", "geo-monitor/fragen", "0d1e2f3a-4b5c-4d6e-9f7a-9b0c1d2e3f17"),
      redirect("Zur Seite (gespeichert)", "/webhook/geo-monitor?gespeichert=1"),
      code("Fragen speichern", "geo-save-questions.js"),
    );
    return workflow(
      "BEER GEO-Monitor",
      nodes,
      merge(
        link("Seite aufrufen", "Seite", "Seite senden"),
        link("Prüfung starten", "Zur Seite (gestartet)", "Fragen", "Claude", "Auswerten", "Empfehlung Claude", "Empfehlungen merken"),
        link("Wöchentlich", "Fragen"),
        link("Fragen ändern", "Zur Seite (gespeichert)", "Fragen speichern"),
      ),
    );
  },

  regionen: () => {
    row(0);
    const nodes = [
      webhook("Seite aufrufen", "GET", "beer-regionen", "1e2f3a4b-5c6d-4e7f-8a8b-0c1d2e3f4a18"),
      code("Seite: Auftrag", "regionen-page-reads.js"),
      strapi("Seite lesen"),
      code("Seite", "regionen-page.js"),
      html("Seite senden"),
    ];
    row(1);
    nodes.push(
      webhook("Aktion aufrufen", "POST", "beer-regionen/aktion", "2f3a4b5c-6d7e-4f8a-9b9c-1d2e3f4a5b19"),
      redirect("Zur Seite", "={{ ['text', 'gbp'].includes($json.body?.aktion) ? '/webhook/beer-regionen?gestartet=1' : '/webhook/beer-regionen?gespeichert=1' }}"),
      code("Aktion", "regionen-action.js"),
      route("Weg?", "={{ $json.route }}"),
      // status=draft is in the url: without it Strapi publishes straight away.
      strapiWrite("Entwurf speichern", "PUT", "={{ $json.url }}"),
      code("Gespeichert", "regionen-saved.js"),
    );
    row(2);
    nodes.push(strapi("Lesen"), code("Anfrage", "regionen-request.js"), claude("Claude"), code("Merken", "regionen-store.js"));
    return workflow(
      "BEER Regionen",
      nodes,
      merge(
        link("Seite aufrufen", "Seite: Auftrag", "Seite lesen", "Seite", "Seite senden"),
        link("Aktion aufrufen", "Zur Seite", "Aktion", "Weg?"),
        link(["Weg?", 0], "Entwurf speichern", "Gespeichert"),
        link(["Weg?", 1], "Lesen", "Anfrage", "Claude", "Merken"),
      ),
    );
  },
};

// ---- deploy --------------------------------------------------------------------------
async function deploy() {
  const env = Object.fromEntries(
    fs.readFileSync(path.join(here, "..", ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^\w+=/.test(l))
      .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^["']|["']$/g, "")]),
  );
  const api = async (method, route, body) => {
    const r = await fetch(`https://n8n.beer.de/api/v1${route}`, {
      method,
      headers: { "X-N8N-API-KEY": env.N8N_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await r.text();
    if (!r.ok) throw new Error(`${method} ${route}: ${r.status} ${text.slice(0, 300)}`);
    return text ? JSON.parse(text) : null;
  };

  const existing = (await api("GET", "/credentials?limit=100")).data;
  for (const [key, def] of Object.entries(CREDENTIALS)) {
    const found = existing.find((c) => c.name === def.name && c.type === def.type);
    if (found) {
      ids[key] = found.id;
      continue;
    }
    const data = typeof def.placeholder === "function" ? def.placeholder() : def.placeholder;
    ids[key] = (await api("POST", "/credentials", { name: def.name, type: def.type, data })).id;
    console.log(`credential created: ${def.name} (placeholder – fill in in n8n)`);
  }

  const all = (await api("GET", "/workflows?limit=200")).data;
  const upsert = async (definition) => {
    const found = all.find((w) => w.name === definition.name);
    if (!found) {
      const created = await api("POST", "/workflows", definition);
      console.log(`created: ${definition.name} (${created.id}, inactive)`);
      return created.id;
    }
    // Keep what the workflow has stored (proposals, topics, runs) across updates.
    const current = await api("GET", `/workflows/${found.id}`);
    await api("PUT", `/workflows/${found.id}`, { ...definition, staticData: current.staticData ?? undefined });
    console.log(`updated: ${definition.name} (${found.id}, ${found.active ? "active" : "inactive"})`);
    return found.id;
  };

  const hubId = await upsert(WORKFLOWS.hub());
  for (const [key, build] of Object.entries(WORKFLOWS)) {
    if (key === "hub") continue;
    const definition = build();
    definition.settings.errorWorkflow = hubId;
    await upsert(definition);
  }
}

const deploying = process.argv.includes("--deploy");
if (deploying) await deploy();
for (const [key, build] of Object.entries(WORKFLOWS)) {
  fs.writeFileSync(path.join(here, `${key}.json`), JSON.stringify(build(), null, 2) + "\n");
}
console.log(`written: ${Object.keys(WORKFLOWS).map((k) => `n8n/${k}.json`).join(", ")}`);
