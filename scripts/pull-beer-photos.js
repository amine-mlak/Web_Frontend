const fs = require("fs");
const path = require("path");

const SKIP = new Set([
  "miele-dreams",
  "miele-dreams-zubehor",
  "kuchenakademie-masterclass",
]);

const STILE_HANDLE = {
  "stile-modern.jpg": "moderne-wohnkuche",
  "stile-landhaus.jpg": "elegante-landhauskuche",
  "stile-design.jpg": "design-in-glas-und-stein",
  "stile-holz.jpg": "moderne-echtholzkueche",
  "stile-insel.jpg": "panorama-kochinsel",
  "stile-purist.jpg": "puristische-kuche",
};

(async () => {
  const response = await fetch("https://www.beer.de/products.json?limit=250", {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const data = await response.json();
  const products = data.products || [];
  const pool = [];
  const firstByHandle = {};

  for (const product of products) {
    if (SKIP.has(product.handle)) {
      continue;
    }
    const images = product.images || [];
    const srcs = images
      .map((image) => String(image.src || "").split("?")[0])
      .filter(Boolean);
    if (!srcs.length) {
      continue;
    }
    firstByHandle[product.handle] = srcs[0];
    const landscape = images
      .filter((image) => (image.width || 1) >= (image.height || 1))
      .map((image) => String(image.src || "").split("?")[0])
      .filter(Boolean);
    const pick = (landscape.length ? landscape : srcs).slice(0, 4);
    for (const src of pick) {
      if (!pool.includes(src)) {
        pool.push(src);
      }
    }
  }

  const named = {};
  for (const [file, handle] of Object.entries(STILE_HANDLE)) {
    named[file] = firstByHandle[handle] || pool[0];
  }

  const lines = [
    "/** Temporary stand-in photography from beer.de until CMS uploads replace it. */",
    "",
    "function shopifyWidth(src: string, width: number) {",
    "  const join = src.includes(\"?\") ? \"&\" : \"?\";",
    "  return `${src}${join}width=${width}`;",
    "}",
    "",
    "export const BEER_NAMED: Record<string, string> = {",
    ...Object.entries(named).map(
      ([file, src]) => `  ${JSON.stringify(file)}: ${JSON.stringify(src)},`,
    ),
    "};",
    "",
    "export const BEER_PHOTOS = [",
    ...pool.map((src) => `  ${JSON.stringify(src)},`),
    "] as const;",
    "",
    "export function beerPhoto(index: number, width = 1800) {",
    "  const src =",
    "    BEER_PHOTOS[((index % BEER_PHOTOS.length) + BEER_PHOTOS.length) % BEER_PHOTOS.length];",
    "  return shopifyWidth(src, width);",
    "}",
    "",
    "export function beerNamed(file: string, width = 1800) {",
    "  const src = BEER_NAMED[file] ?? BEER_PHOTOS[0];",
    "  return shopifyWidth(src, width);",
    "}",
    "",
  ];

  const out = path.join(__dirname, "..", "lib", "beer-photos.ts");
  fs.writeFileSync(out, lines.join("\n"));
  console.log("wrote", out, "pool", pool.length, "named", Object.keys(named).length);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
