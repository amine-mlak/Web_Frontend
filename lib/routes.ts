import type { Locale } from "@/lib/i18n";

/**
 * Fixed route segments and their English names. The app folders keep the
 * German names; the proxy maps English URLs onto them and `localizePath`
 * maps German paths out to English ones.
 *
 * Only technical segments live here. Entry slugs (a region, a project, an
 * FAQ theme) come from the CMS per locale and pass through untouched.
 */
type Segment = { en: string; children?: Record<string, Segment> };

const ROUTES: Record<string, Segment> = {
  kuechen: {
    en: "kitchens",
    children: {
      formen: { en: "shapes" },
      stile: { en: "styles" },
      farben: { en: "colours" },
      inseln: { en: "islands" },
      besondere: { en: "special" },
    },
  },
  material: {
    en: "materials",
    children: {
      fronten: { en: "fronts" },
      arbeitsplatten: { en: "worktops" },
      innenleben: { en: "interiors" },
      spuele: { en: "sink" },
    },
  },
  geraete: {
    en: "appliances",
    children: {
      kochen: { en: "cooking" },
      backen: { en: "baking" },
      kaelte: { en: "cooling" },
      spuelen: { en: "dishwashing" },
      extra: { en: "extras" },
    },
  },
  moebel: { en: "furniture" },
  projekte: { en: "projects" },
  regionen: { en: "regions" },
  marken: { en: "brands" },
  ratgeber: { en: "guides" },
  presse: { en: "press" },
  faq: { en: "faq" },
  "kueche-planen": { en: "plan-your-kitchen" },
  beratung: { en: "consultation" },
  kontakt: { en: "contact" },
  ueber: { en: "about" },
  team: { en: "team" },
  nachhaltigkeit: { en: "sustainability" },
  karriere: { en: "careers" },
  ausstellung: { en: "showroom" },
  katalog: { en: "catalogue" },
};

function reverse(tree: Record<string, Segment>) {
  const out: Record<string, { de: string; children?: ReturnType<typeof reverse> }> = {};
  for (const [de, node] of Object.entries(tree)) {
    out[node.en] = {
      de,
      children: node.children ? reverse(node.children) : undefined,
    };
  }
  return out;
}

const ROUTES_EN = reverse(ROUTES);

function splitPath(path: string) {
  return path.split("/").filter(Boolean);
}

/** English path segments → the German app route. Unknown segments pass through. */
export function toInternalSegments(segments: string[]) {
  let level: ReturnType<typeof reverse> | undefined = ROUTES_EN;
  return segments.map((segment) => {
    const node: ReturnType<typeof reverse>[string] | undefined = level?.[segment];
    level = node?.children;
    return node?.de ?? segment;
  });
}

/** German path segments → their English URL form. Unknown segments pass through. */
export function toEnglishSegments(segments: string[]) {
  let level: Record<string, Segment> | undefined = ROUTES;
  return segments.map((segment) => {
    const node: Segment | undefined = level?.[segment];
    level = node?.children;
    return node?.en ?? segment;
  });
}

/**
 * Turns an unprefixed path in either language form into the URL for `locale`.
 * `/kuechen/farben/weiss` → `/en/kitchens/colours/weiss` and back.
 */
export function localizePath(path: string, locale: Locale) {
  const internal = toInternalSegments(splitPath(path));
  // German is the default locale and has no prefix.
  if (locale === "de") {
    return internal.length ? `/${internal.join("/")}` : "/";
  }
  const english = toEnglishSegments(internal);
  return english.length ? `/${locale}/${english.join("/")}` : `/${locale}`;
}
