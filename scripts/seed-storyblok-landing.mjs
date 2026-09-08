import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

const SPACE = "295092261868907";
const HOME_ID = "217876562867509";
const STRAPI =
  process.env.STRAPI_URL?.replace(/\/$/, "") ||
  "http://strapi-2p2cktq4f2aqoklpusgyfdqt.217.160.8.26.sslip.io";
const PAT = process.env.STORYBLOK_PAT;
const MAPI = `https://mapi.storyblok.com/v1/spaces/${SPACE}`;

if (!PAT) {
  throw new Error("STORYBLOK_PAT is required");
}

const uid = () => randomUUID();

async function api(method, path, body) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch(`${MAPI}${path}`, {
      method,
      headers: {
        Authorization: PAT,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }
    if (response.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
      continue;
    }
    if (!response.ok) {
      throw new Error(`${method} ${path} ${response.status}: ${text.slice(0, 800)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    return data;
  }
  throw new Error(`${method} ${path} rate limited`);
}

function bloks(whitelist, extras = {}) {
  return {
    type: "bloks",
    restrict_type: "",
    restrict_components: true,
    component_whitelist: whitelist,
    ...extras,
  };
}

function text(display_name, extras = {}) {
  return { type: "text", display_name, translatable: true, ...extras };
}

function textarea(display_name, extras = {}) {
  return { type: "textarea", display_name, translatable: true, ...extras };
}

function asset(display_name) {
  return { type: "asset", display_name, filetypes: ["images"] };
}

const COMPONENTS = [
  {
    name: "hero_slide",
    display_name: "Hero-Slide",
    is_nestable: true,
    is_root: false,
    schema: {
      image: { ...asset("Bild"), pos: 0 },
      alt: { ...text("Alt-Text"), pos: 1 },
    },
  },
  {
    name: "hero",
    display_name: "Hero",
    is_nestable: true,
    is_root: false,
    schema: {
      slides: { ...bloks(["hero_slide"]), display_name: "Slides", pos: 0 },
    },
  },
  {
    name: "kachel",
    display_name: "Kachel",
    is_nestable: true,
    is_root: false,
    schema: {
      title: { ...text("Titel"), pos: 0 },
      href: { ...text("Link"), pos: 1 },
      alt: { ...text("Alt-Text"), pos: 2 },
      color: { ...text("Farbe (Hex)"), pos: 3 },
      image: { ...asset("Bild"), pos: 4 },
    },
  },
  {
    name: "kacheln",
    display_name: "Kacheln",
    is_nestable: true,
    is_root: false,
    schema: {
      eyebrow: { ...text("Eyebrow"), pos: 0 },
      intro: { ...textarea("Intro"), pos: 1 },
      colors: { ...bloks(["kachel"]), display_name: "Farben", pos: 2 },
    },
  },
  {
    name: "ablauf_step",
    display_name: "Ablauf-Schritt",
    is_nestable: true,
    is_root: false,
    schema: {
      step: { ...text("Nummer"), pos: 0 },
      title: { ...text("Titel"), pos: 1 },
      description: { ...textarea("Beschreibung"), pos: 2 },
      icon: {
        type: "option",
        display_name: "Icon",
        pos: 3,
        exclude_empty_option: true,
        options: [
          { name: "Beratung", value: "consult" },
          { name: "Planung", value: "plan" },
          { name: "Manufaktur", value: "factory" },
          { name: "Übergabe", value: "handover" },
        ],
        default_value: "consult",
      },
    },
  },
  {
    name: "ablauf",
    display_name: "Ablauf",
    is_nestable: true,
    is_root: false,
    schema: {
      eyebrow: { ...text("Eyebrow"), pos: 0 },
      title: { ...text("Titel"), pos: 1 },
      button_label: { ...text("Button-Text"), pos: 2 },
      button_href: { ...text("Button-Link"), pos: 3 },
      steps: { ...bloks(["ablauf_step"]), display_name: "Schritte", pos: 4 },
    },
  },
  {
    name: "entdecken_panel",
    display_name: "Entdecken-Karte",
    is_nestable: true,
    is_root: false,
    schema: {
      title: { ...text("Titel"), pos: 0 },
      subtitle: { ...text("Untertitel"), pos: 1 },
      button_label: { ...text("Button-Text"), pos: 2 },
      href: { ...text("Link"), pos: 3 },
      alt: { ...text("Alt-Text"), pos: 4 },
      image: { ...asset("Bild"), pos: 5 },
    },
  },
  {
    name: "entdecken",
    display_name: "Entdecken",
    is_nestable: true,
    is_root: false,
    schema: {
      panels: {
        ...bloks(["entdecken_panel"]),
        display_name: "Karten",
        pos: 0,
      },
    },
  },
  {
    name: "faq_item",
    display_name: "FAQ-Frage",
    is_nestable: true,
    is_root: false,
    schema: {
      question: { ...text("Frage"), pos: 0 },
      answer: { ...textarea("Antwort"), pos: 1 },
    },
  },
  {
    name: "faq",
    display_name: "FAQ",
    is_nestable: true,
    is_root: false,
    schema: {
      eyebrow: { ...text("Eyebrow"), pos: 0 },
      title: { ...text("Titel"), pos: 1 },
      items: { ...bloks(["faq_item"]), display_name: "Fragen", pos: 2 },
    },
  },
  {
    name: "beratung",
    display_name: "Beratung",
    is_nestable: true,
    is_root: false,
    schema: {
      eyebrow: { ...text("Eyebrow"), pos: 0 },
      title: { ...text("Titel"), pos: 1 },
      intro: { ...textarea("Intro"), pos: 2 },
      company: { ...text("Firma"), pos: 3 },
      street: { ...text("Straße"), pos: 4 },
      city: { ...text("Ort"), pos: 5 },
      phone_label: { ...text("Telefon-Label"), pos: 6 },
      phone_href: { ...text("Telefon-Link"), pos: 7 },
      email: { ...text("E-Mail"), pos: 8 },
    },
  },
  {
    name: "landing",
    display_name: "Startseite",
    is_nestable: false,
    is_root: true,
    schema: {
      title: { ...text("Seitentitel"), pos: 0 },
      hero: {
        ...bloks(["hero"], { maximum: 1 }),
        display_name: "Hero",
        pos: 1,
      },
      kacheln: {
        ...bloks(["kacheln"], { maximum: 1 }),
        display_name: "Kacheln",
        pos: 2,
      },
      ablauf: {
        ...bloks(["ablauf"], { maximum: 1 }),
        display_name: "Ablauf",
        pos: 3,
      },
      entdecken: {
        ...bloks(["entdecken"], { maximum: 1 }),
        display_name: "Entdecken",
        pos: 4,
      },
      faq: {
        ...bloks(["faq"], { maximum: 1 }),
        display_name: "FAQ",
        pos: 5,
      },
      beratung: {
        ...bloks(["beratung"], { maximum: 1 }),
        display_name: "Beratung",
        pos: 6,
      },
    },
  },
];

async function ensureGroup() {
  const { component_groups: groups } = await api("GET", "/component_groups/");
  const existing = groups.find((group) => group.name === "Landing");
  if (existing) return existing.uuid;
  const created = await api("POST", "/component_groups/", {
    component_group: { name: "Landing" },
  });
  return created.component_group.uuid;
}

async function upsertComponents(groupUuid) {
  const { components } = await api("GET", "/components/");
  const byName = new Map(components.map((item) => [item.name, item]));

  for (const spec of COMPONENTS) {
    const payload = {
      component: {
        ...spec,
        component_group_uuid: groupUuid,
      },
    };
    const current = byName.get(spec.name);
    if (current) {
      await api("PUT", `/components/${current.id}`, payload);
      console.log(`updated ${spec.name}`);
    } else {
      await api("POST", "/components/", payload);
      console.log(`created ${spec.name}`);
    }
  }
}

function findAsset(assets, needle) {
  return assets.find((item) => String(item.filename || "").includes(needle));
}

function assetField(item, alt) {
  return {
    id: item.id,
    alt,
    name: String(item.filename || "").split("/").pop() || "",
    focus: "",
    title: alt,
    source: "",
    filename: item.filename,
    copyright: "",
    fieldtype: "asset",
    meta_data: {},
    is_external_url: false,
  };
}

async function listAssets() {
  const data = await api("GET", "/assets/?per_page=100");
  return data.assets || [];
}

async function uploadFromUrl(filename, url, contentType) {
  const fileRes = await fetch(url);
  if (!fileRes.ok) {
    throw new Error(`download ${url} failed: ${fileRes.status}`);
  }
  const buffer = Buffer.from(await fileRes.arrayBuffer());
  const signed = await api("POST", "/assets/", {
    filename,
    size: buffer.length,
    content_type: contentType,
  });
  const asset = signed.asset || signed;
  const form = new FormData();
  for (const [key, value] of Object.entries(asset.fields || {})) {
    form.append(key, value);
  }
  form.append("file", new Blob([buffer], { type: contentType }), filename);
  const uploaded = await fetch(asset.post_url, { method: "POST", body: form });
  if (!uploaded.ok) {
    const err = await uploaded.text();
    throw new Error(`S3 upload failed ${uploaded.status}: ${err.slice(0, 400)}`);
  }
  try {
    await api("GET", `/assets/${asset.id}/finish_upload`);
  } catch {
    // some spaces finish automatically after the S3 POST
  }
  console.log(`uploaded ${filename} (${asset.id})`);
  return { id: asset.id, filename: asset.pretty_url || asset.public_url };
}

async function ensureHeroAssets(assets) {
  const map = {
    modern: findAsset(assets, "beer-hero-modern"),
    insel: findAsset(assets, "beer-kueche-insel"),
    landhaus: findAsset(assets, "beer-hero-landhaus"),
    design: findAsset(assets, "beer-hero-design"),
    holz: findAsset(assets, "beer-hero-holz"),
    purist: findAsset(assets, "beer-hero-purist"),
  };

  const uploads = [
    {
      key: "landhaus",
      filename: "beer-hero-landhaus.jpg",
      url: `${STRAPI}/uploads/stile_landhaus_71c2ef9f4c.jpg`,
    },
    {
      key: "design",
      filename: "beer-hero-design.jpg",
      url: `${STRAPI}/uploads/stile_design_61b2a33555.jpg`,
    },
    {
      key: "holz",
      filename: "beer-hero-holz.jpg",
      url: `${STRAPI}/uploads/stile_holz_8f2091c8bc.jpg`,
    },
    {
      key: "purist",
      filename: "beer-hero-purist.jpg",
      url: `${STRAPI}/uploads/stile_purist_39559004d0.jpg`,
    },
  ];

  for (const item of uploads) {
    if (map[item.key]) continue;
    const created = await uploadFromUrl(item.filename, item.url, "image/jpeg");
    map[item.key] = created;
  }

  return map;
}

function blok(component, fields) {
  return { _uid: uid(), component, ...fields };
}

async function seedHome(assets, heroAssets) {
  const cms = JSON.parse(
    readFileSync(new URL("../tmp-strapi-home.json", import.meta.url), "utf8").replace(
      /^\uFEFF/,
      "",
    ),
  ).data[0];

  const kachelAssets = [
    findAsset(assets, "beer-kachel-0"),
    findAsset(assets, "beer-kachel-1"),
    findAsset(assets, "beer-kachel-2"),
  ];
  const entdeckenAssets = [
    findAsset(assets, "beer-entdecken-0"),
    findAsset(assets, "beer-entdecken-1"),
    findAsset(assets, "beer-entdecken-2"),
    findAsset(assets, "beer-entdecken-3"),
  ];

  if (kachelAssets.some((item) => !item) || entdeckenAssets.some((item) => !item)) {
    throw new Error("Missing kachel/entdecken assets in Storyblok");
  }

  const heroSlides = [
    {
      alt: cms.hero.slides[0].alt,
      asset: heroAssets.modern,
    },
    {
      alt: cms.hero.slides[1].alt,
      asset: heroAssets.landhaus,
    },
    {
      alt: cms.hero.slides[2].alt,
      asset: heroAssets.design,
    },
    {
      alt: cms.hero.slides[3].alt,
      asset: heroAssets.holz,
    },
    {
      alt: cms.hero.slides[4].alt,
      asset: heroAssets.insel,
    },
    {
      alt: cms.hero.slides[5].alt,
      asset: heroAssets.purist,
    },
  ];

  if (heroSlides.some((item) => !item.asset)) {
    throw new Error("Missing hero assets after upload");
  }

  const content = {
    _uid: uid(),
    component: "landing",
    title: cms.title || "Startseite",
    hero: [
      blok("hero", {
        slides: heroSlides.map((slide) =>
          blok("hero_slide", {
            alt: slide.alt,
            image: assetField(slide.asset, slide.alt),
          }),
        ),
      }),
    ],
    kacheln: [
      blok("kacheln", {
        eyebrow: cms.kacheln.eyebrow,
        intro: cms.kacheln.intro,
        colors: cms.kacheln.colors.map((tile, index) =>
          blok("kachel", {
            title: tile.title,
            href: tile.href,
            alt: tile.alt,
            color: tile.color,
            image: assetField(kachelAssets[index], tile.alt),
          }),
        ),
      }),
    ],
    ablauf: [
      blok("ablauf", {
        eyebrow: cms.ablauf.eyebrow,
        title: cms.ablauf.title,
        button_label: cms.ablauf.buttonLabel,
        button_href: cms.ablauf.buttonHref,
        steps: cms.ablauf.steps.map((step) =>
          blok("ablauf_step", {
            step: step.step,
            title: step.title,
            description: step.description,
            icon: step.icon,
          }),
        ),
      }),
    ],
    entdecken: [
      blok("entdecken", {
        panels: cms.entdecken.panels.map((panel, index) =>
          blok("entdecken_panel", {
            title: panel.title,
            subtitle: panel.subtitle,
            button_label: panel.buttonLabel,
            href: panel.href,
            alt: panel.alt,
            image: assetField(entdeckenAssets[index], panel.alt),
          }),
        ),
      }),
    ],
    faq: [
      blok("faq", {
        eyebrow: cms.faq.eyebrow,
        title: cms.faq.title,
        items: cms.faq.items.map((item) =>
          blok("faq_item", {
            question: item.question,
            answer: item.answer,
          }),
        ),
      }),
    ],
    beratung: [
      blok("beratung", {
        eyebrow: cms.beratung.eyebrow,
        title: cms.beratung.title,
        intro: cms.beratung.intro,
        company: cms.beratung.company,
        street: cms.beratung.street,
        city: cms.beratung.city,
        phone_label: cms.beratung.phoneLabel,
        phone_href: cms.beratung.phoneHref,
        email: cms.beratung.email,
      }),
    ],
  };

  await api("PUT", `/stories/${HOME_ID}`, {
    force_update: 1,
    publish: 1,
    story: {
      name: "Home",
      slug: "home",
      content,
    },
  });
  console.log("updated home story");
}

async function main() {
  const groupUuid = await ensureGroup();
  console.log("group", groupUuid);
  await upsertComponents(groupUuid);

  try {
    await api("PUT", "", { space: { default_root: "landing" } });
    console.log("default_root=landing");
  } catch (error) {
    console.log("default_root skipped:", error.message);
  }

  let assets = await listAssets();
  const heroAssets = await ensureHeroAssets(assets);
  assets = await listAssets();
  heroAssets.modern = findAsset(assets, "beer-hero-modern") || heroAssets.modern;
  heroAssets.insel = findAsset(assets, "beer-kueche-insel") || heroAssets.insel;
  heroAssets.landhaus =
    findAsset(assets, "beer-hero-landhaus") || heroAssets.landhaus;
  heroAssets.design = findAsset(assets, "beer-hero-design") || heroAssets.design;
  heroAssets.holz = findAsset(assets, "beer-hero-holz") || heroAssets.holz;
  heroAssets.purist = findAsset(assets, "beer-hero-purist") || heroAssets.purist;

  await seedHome(assets, heroAssets);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
