/**
 * n8n Code node: last node of the CMS news chat.
 * Must return { output: "..." } for the Chat Trigger.
 *
 * Env (n8n, never commit values):
 *   STRAPI_URL           default https://cms.beer.de
 *   STRAPI_API_TOKEN     create/update drafts only — no publish
 *   N8N_LLM_BASE_URL     default OpenRouter
 *   N8N_LLM_API_KEY or OPENROUTER_API_KEY
 *   N8N_LLM_MODEL        default openai/gpt-4o-mini
 */

const chatInput = String(
  $json.chatInput || $json.message || $json.text || "",
).trim();

if (!chatInput) {
  return [
    {
      json: {
        output:
          "Schreiben Sie, welche Meldung, welchen Ratgeber oder welche feste Seite ich als Entwurf anlegen soll. Ich veröffentliche nichts.",
      },
    },
  ];
}

const strapiUrl = String($env.STRAPI_URL || "https://cms.beer.de").replace(
  /\/$/,
  "",
);
const strapiToken = String($env.STRAPI_API_TOKEN || "");
const llmBase = String(
  $env.N8N_LLM_BASE_URL || "https://openrouter.ai/api/v1",
).replace(/\/$/, "");
const llmKey = String(
  $env.N8N_LLM_API_KEY ||
    $env.OPENROUTER_API_KEY ||
    $env.OPENAI_API_KEY ||
    "",
);
const llmModel = String($env.N8N_LLM_MODEL || "openai/gpt-4o-mini");
const llmHeaders = {
  Authorization: `Bearer ${llmKey}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://www.beer.de",
  "X-Title": "BEER CMS news chat",
};

if (!strapiUrl || !strapiToken) {
  return [
    {
      json: {
        output:
          "In n8n fehlen STRAPI_URL (https://cms.beer.de) und STRAPI_API_TOKEN. Token nur für Entwürfe, ohne Publish-Recht.",
      },
    },
  ];
}

const helpers =
  (typeof $helpers !== "undefined" && $helpers) || this.helpers || null;

const CATEGORIES = {
  presse: "Aktuelles & Presse",
  kosten: "Kosten",
  planung: "Küchenplanung",
  geraete: "Geräte & Technik",
  material: "Material & Pflege",
};

const SYSTEM = `Du bist Redakteur der BEER Küchenmanufaktur in Wolfersdorf.
Deutsch ist die Quelle. Keine Preise erfinden. Keine Markennamen übersetzen:
BEER, Bora, Miele, Gaggenau, Quooker, Fenix, Taj Mahal.
Erstgespräch kostenlos, die Küche nicht.
Antworte NUR mit einem JSON-Objekt:
{
  "collection": "article" | "site-page",
  "category": "presse" | "kosten" | "planung" | "geraete" | "material" | null,
  "title": "string",
  "slug": "kleingeschrieben-mit-bindestrichen",
  "description": "max 80 Zeichen, Deutsch",
  "body": "Fliesstext Deutsch, ein paar Absätze",
  "eyebrow": "kurz oder leer",
  "locale": "de",
  "reason": "warum diese Collection"
}
Regeln:
- News, Presse, Aktuelles, Ausstellung, Termin, Messe, Personal, Gewinn -> article + presse
- Ratgeber, Kosten, Planung, Geräte-Erklärung, Materialpflege -> article + passende Kategorie
- Impressum, Datenschutz, AGB, Kontakt, Über uns als feste Seite -> site-page
- Im Zweifel bei Meldungen: article + presse
- NIEMALS veroeffentlichen. Nur Entwurf.`;

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function clip(value, max) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)).trimEnd();
}

function flatten(entry) {
  if (!entry) return null;
  if (entry.attributes && typeof entry.attributes === "object") {
    return {
      documentId: entry.documentId || entry.id,
      id: entry.id,
      ...entry.attributes,
    };
  }
  return entry;
}

function rowsOf(payload) {
  const data = payload && payload.data;
  if (Array.isArray(data)) return data.map(flatten).filter(Boolean);
  if (data) {
    const row = flatten(data);
    return row ? [row] : [];
  }
  return [];
}

async function httpJson(method, url, body) {
  const headers = {
    Authorization: `Bearer ${strapiToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (helpers && typeof helpers.httpRequest === "function") {
    return helpers.httpRequest({
      method,
      url,
      headers,
      body: body === undefined ? undefined : body,
      json: true,
    });
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let parsed = {};
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch (error) {
    parsed = { raw: text };
  }
  if (!res.ok) {
    const hint =
      parsed.error?.message ||
      parsed.error ||
      parsed.raw ||
      text.slice(0, 280);
    throw new Error(`Strapi ${res.status} ${method} ${url}: ${hint}`);
  }
  return parsed;
}

function guessPlan(text) {
  const lower = text.toLowerCase();
  const isPage =
    /impressum|datenschutz|agb|kontakt|über uns|ueber uns|widerruf/.test(
      lower,
    );
  const isGuide =
    /ratgeber|kosten|preis|planen|ablauf|gerät|geraet|pflege|material|front|arbeitsplatte/.test(
      lower,
    ) && !/presse|aktuell|ausstellung|messe|termin/.test(lower);
  let category = "presse";
  if (isGuide) {
    if (/kosten|preis/.test(lower)) category = "kosten";
    else if (/plan|ablauf|maß|mass/.test(lower)) category = "planung";
    else if (/gerät|geraet|bora|abzug|ofen/.test(lower)) category = "geraete";
    else if (/material|pflege|front|stein|holz/.test(lower))
      category = "material";
    else category = "planung";
  }
  const title = clip(
    text
      .split(/[\n.!?]/)[0]
      .replace(/^(bitte |lege |erstell[e]? |schreib[e]? )/i, ""),
    90,
  );
  return {
    collection: isPage ? "site-page" : "article",
    category: isPage ? null : category,
    title: title || "Neue Meldung",
    slug: slugify(title) || `entwurf-${Date.now()}`,
    description: clip(text, 80),
    body: text,
    eyebrow: isPage ? "" : "Aktuelles",
    locale: "de",
    reason: isPage
      ? "Feste Seite erkannt"
      : isGuide
        ? "Ratgeber erkannt"
        : "Meldung, Collection Artikel / Presse",
  };
}

async function llmPlan(text) {
  if (!llmKey) return guessPlan(text);
  const payload = {
    model: llmModel,
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: text },
    ],
  };
  let parsed;
  try {
    if (helpers && typeof helpers.httpRequest === "function") {
      parsed = await helpers.httpRequest({
        method: "POST",
        url: `${llmBase}/chat/completions`,
        headers: llmHeaders,
        body: payload,
        json: true,
      });
    } else {
      const res = await fetch(`${llmBase}/chat/completions`, {
        method: "POST",
        headers: llmHeaders,
        body: JSON.stringify(payload),
      });
      parsed = await res.json();
      if (!res.ok) {
        throw new Error(parsed.error?.message || `LLM ${res.status}`);
      }
    }
  } catch (error) {
    const fallback = guessPlan(text);
    fallback.reason = `${fallback.reason} (ohne Modell: ${error.message})`;
    return fallback;
  }
  const content = parsed.choices?.[0]?.message?.content || "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return guessPlan(text);
  try {
    const plan = JSON.parse(jsonMatch[0]);
    const guessed = guessPlan(text);
    return {
      collection: plan.collection === "site-page" ? "site-page" : "article",
      category:
        plan.collection === "site-page"
          ? null
          : CATEGORIES[plan.category]
            ? plan.category
            : guessed.category,
      title: clip(plan.title || guessed.title, 120),
      slug: slugify(plan.slug || plan.title || guessed.slug),
      description: clip(plan.description || guessed.description, 80),
      body: String(plan.body || text).trim(),
      eyebrow: clip(plan.eyebrow || "", 40),
      locale: "de",
      reason: String(plan.reason || guessed.reason),
    };
  } catch (error) {
    return guessPlan(text);
  }
}

async function findOne(path, slug, extra = "") {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&locale=de&pagination[pageSize]=1${extra}`;
  const payload = await httpJson("GET", `${strapiUrl}${path}?${query}`);
  return rowsOf(payload)[0] || null;
}

async function ensureCategory(slug) {
  if (!slug || !CATEGORIES[slug]) return null;
  const existing = await findOne("/api/categories", slug);
  if (existing) return existing.documentId || existing.id;
  const created = await httpJson("POST", `${strapiUrl}/api/categories`, {
    data: { name: CATEGORIES[slug], slug },
  });
  const row = rowsOf(created)[0];
  return row?.documentId || row?.id || null;
}

async function upsertArticle(plan) {
  const categoryId = await ensureCategory(plan.category || "presse");
  const data = {
    title: plan.title,
    slug: plan.slug,
    description: clip(plan.description || plan.title, 80),
    locale: "de",
    blocks: [
      {
        __component: "shared.rich-text",
        body: plan.body,
      },
    ],
  };
  if (categoryId) {
    data.category = { connect: [categoryId] };
  }
  const draft = await findOne("/api/articles", plan.slug, "&status=draft");
  const live = draft
    ? null
    : await findOne("/api/articles", plan.slug, "&status=published");
  const existing = draft || live;
  const documentId = existing?.documentId || existing?.id;
  if (documentId) {
    const updated = await httpJson(
      "PUT",
      `${strapiUrl}/api/articles/${documentId}?status=draft&locale=de`,
      { data },
    );
    return { action: "updated", row: rowsOf(updated)[0] || existing };
  }
  const created = await httpJson(
    "POST",
    `${strapiUrl}/api/articles?status=draft&locale=de`,
    { data },
  );
  return { action: "created", row: rowsOf(created)[0] };
}

async function upsertPage(plan) {
  const data = {
    title: plan.title,
    slug: plan.slug,
    eyebrow: plan.eyebrow || "",
    intro: clip(plan.description || plan.title, 180),
    body: plan.body,
    locale: "de",
  };
  const draft = await findOne("/api/site-pages", plan.slug, "&status=draft");
  const live = draft
    ? null
    : await findOne("/api/site-pages", plan.slug, "&status=published");
  const existing = draft || live;
  const documentId = existing?.documentId || existing?.id;
  if (documentId) {
    const updated = await httpJson(
      "PUT",
      `${strapiUrl}/api/site-pages/${documentId}?status=draft&locale=de`,
      { data },
    );
    return { action: "updated", row: rowsOf(updated)[0] || existing };
  }
  const created = await httpJson(
    "POST",
    `${strapiUrl}/api/site-pages?status=draft&locale=de`,
    { data },
  );
  return { action: "created", row: rowsOf(created)[0] };
}

const plan = await llmPlan(chatInput);
if (!plan.slug) plan.slug = slugify(plan.title) || `entwurf-${Date.now()}`;

let result;
try {
  result =
    plan.collection === "site-page"
      ? await upsertPage(plan)
      : await upsertArticle(plan);
} catch (error) {
  return [
    {
      json: {
        output: `Der Entwurf ist nicht in Strapi gelandet: ${error.message}. Nichts wurde veröffentlicht.`,
      },
    },
  ];
}

const categoryLabel =
  plan.collection === "site-page"
    ? "Seite · Inhalt (site-pages)"
    : `Artikel / ${CATEGORIES[plan.category] || plan.category}`;
const pathHint =
  plan.collection === "site-page"
    ? `Feste Seite, Slug ${plan.slug}`
    : plan.category === "presse"
      ? `Nach Freigabe auf der Website: /presse/${plan.slug}`
      : `Nach Freigabe auf der Website: /ratgeber/${plan.slug}`;
const verb = result.action === "updated" ? "aktualisiert" : "angelegt";

return [
  {
    json: {
      output: [
        `Entwurf ${verb} in ${categoryLabel}.`,
        `Titel: ${plan.title}`,
        `Slug: ${plan.slug}`,
        `Status: draft — bitte in Strapi prüfen und erst dann veröffentlichen.`,
        pathHint,
        plan.reason ? `Zuordnung: ${plan.reason}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      collection: plan.collection,
      category: plan.category,
      slug: plan.slug,
      status: "draft",
    },
  },
];
