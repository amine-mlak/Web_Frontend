import { cmsSrc } from "@/lib/beer-photos";

const u = (file: string) => `/cms-uploads/${file}`;

export type HouseLayout =
  | "manufactory"
  | "showroom"
  | "people"
  | "lasting"
  | "place"
  | "papers"
  | "path"
  | "letter"
  | "legal";

export type HouseShot = {
  src: string;
  alt: string;
};

export type HousePerson = {
  src: string;
  name: string;
};

export type HouseMedia = {
  layout: HouseLayout;
  hero: string;
  statement: string;
  statementB: string;
  close: string;
  ledger: string;
  visit: string;
  gallery: HouseShot[];
  chapters: HouseShot[];
  people: HousePerson[];
};

const BUILDING = {
  snow1: u("Gebaeude_Schnee1_5d88ff6215.JPG"),
  snow2: u("Gebaeude_Schnee2_1a16897e74.JPG"),
  snow3: u("Gebaeude_Schnee3_c37d8dadf4.JPG"),
  facade: u("Gebaeude_83a16ba48b.jpg"),
  dusk: u("Gebaeude_2013_abends_3a7d0fe7a7.jpg"),
};

const WORKSHOP = {
  one: u("Werkstatt1_1b8b108b52.JPG"),
  two: u("Werkstatt2_563e1191ad.JPG"),
};

// Werk 2: the showroom building (wood ceilings, lounge, kitchens, sample wall, meeting rooms).
const WERK2 = {
  hall: u("076_Showroom_9551399c54.jpg"),
  kitchens: u("077_Showroom_dd2f36d39f.jpg"),
  table: u("018_Showroom_bc9448e1b5.jpg"),
  samples: u("082_Showroom_fd03396871.jpg"),
  lounge: u("004_Showroom_13654adf97.jpg"),
  meeting: u("117_Showroom_4bcb8435f7.jpg"),
};

/** The sample wall in Werk 2: fronts and worktops side by side (material overview). */
export const SHOWROOM_SAMPLES = {
  wall: u("084_Showroom_67e66b0449.jpg"),
  detail: u("085_Showroom_cc551702ba.jpg"),
};

/**
 * The showroom photo beside the visit facts at the end of a collection. Each collection gets its
 * own view, so two collections never close on the same picture.
 */
export const HUB_VISIT: Record<string, string> = {
  kuechen: WERK2.hall,
  material: SHOWROOM_SAMPLES.detail,
  geraete: u("Ausstellung_0052_eb6f5b30c7.jpg"),
  moebel: WERK2.lounge,
  projekte: WERK2.meeting,
  regionen: BUILDING.dusk,
  marken: WERK2.kitchens,
  ratgeber: WERK2.samples,
  planen: WERK2.table,
};

const ROOM = {
  r0002: u("Ausstellung_0002_198946b6fd.jpg"),
  r0003: u("Ausstellung_0003_bcf7bea1a4.jpg"),
  r0004: u("Ausstellung_0004_206b4b157f.jpg"),
  r0047: u("Ausstellung_0047_854d690ca4.jpg"),
  r0048: u("Ausstellung_0048_644e260bd5.jpg"),
  r0052: u("Ausstellung_0052_eb6f5b30c7.jpg"),
  r0058: u("Ausstellung_0058_f91f94d9eb.jpg"),
  r0060: u("Ausstellung_0060_20e956be9d.jpg"),
  r0065: u("Ausstellung_0065_edafc3255f.jpg"),
  r0068: u("Ausstellung_0068_17f82323da.jpg"),
  r0070: u("Ausstellung_0070_a265fbff7d.jpg"),
  r0071: u("Ausstellung_0071_47300bcee1.jpg"),
  r0074: u("Ausstellung_0074_d0b883e35b.jpg"),
  r0075: u("Ausstellung_0075_e07b177881.jpg"),
  r0076: u("Ausstellung_0076_36bc652178.jpg"),
  r0081: u("Ausstellung_0081_9aec727cfd.jpg"),
};

const CREW = {
  group: u("beer_hebauf_werk2_mitarbeiter_635001d01f.jpg"),
  // A joiner with a finished front in the workshop: the team page opens on a person, not a crowd.
  joiner: u("FAP_0959_c8ac1e8672.jpg"),
  table: u("beer_hebauf_werk2_mitarbeiter_essen_44852ab4f9.jpg"),
};

/**
 * Team portraits: the studio series from beer.de (same wall, same light), in the order of the
 * team text in the CMS. Names are full names, so lib/team-voices.ts matches them exactly.
 */
const PEOPLE: HousePerson[] = [
  { src: u("beer_team_christian_beer_17e412823c.jpg"), name: "Christian Beer" },
  { src: u("beer_team_ingeborg_beer_72a9c70b74.jpg"), name: "Ingeborg Beer" },
  { src: u("beer_team_anton_beer_ea09020ef9.jpg"), name: "Anton Beer" },
  { src: u("beer_team_julia_beer_af91772220.jpg"), name: "Julia Beer" },
  { src: u("beer_team_johannes_sperrer_b5ccbf9987.jpg"), name: "Johannes Sperrer" },
  { src: u("beer_team_christian_fellner_156f977359.jpg"), name: "Christian Fellner" },
  { src: u("beer_team_robert_pecho_8e50d73e3e.jpg"), name: "Robert Pecho" },
  { src: u("beer_team_robert_stauber_2e1b172919.jpg"), name: "Robert Stauber" },
  { src: u("beer_team_kathrin_stampfl_9ca93a3ed4.jpg"), name: "Kathrin Stampfl" },
  { src: u("beer_team_simon_ostertag_940788ae8f.jpg"), name: "Simon Ostertag" },
  // Not in the 2024 studio series yet: the older portrait.
  { src: u("beer_kuechen_mitarbeiter_a_wagner_8efc9e4bf2.jpg"), name: "Andreas Wagner" },
  { src: u("beer_team_richard_geier_fa333d3dbd.jpg"), name: "Richard Geier" },
  { src: u("beer_team_dominik_vogl_a0310a7c6d.jpg"), name: "Dominik Vogl" },
  { src: u("beer_team_robert_vater_b3afa3c7b7.jpg"), name: "Robert Vater" },
  { src: u("beer_team_michael_sasse_6f9a5add37.jpg"), name: "Michael Sasse" },
  { src: u("beer_team_robert_huber_1261412dc7.jpg"), name: "Robert Huber" },
  { src: u("beer_team_josef_mirlach_57889a5d5b.jpg"), name: "Josef Mirlach" },
  { src: u("beer_team_benedikt_holzmaier_2e90aacf88.jpg"), name: "Benedikt Holzmaier" },
  { src: u("beer_team_avi_geisel_0b103e23a1.jpg"), name: "Avi Geisel" },
  { src: u("beer_team_bruno_bauer_3cfb1922f3.jpg"), name: "Bruno Bauer" },
  { src: u("beer_team_alexander_hilgers_7ee93ae9f6.jpg"), name: "Alexander Hilgers" },
  { src: u("beer_team_darko_ciglaric_1e784c96e0.jpg"), name: "Darko Ciglaric" },
  { src: u("beer_team_thomas_lang_1e7e47e3cf.jpg"), name: "Thomas Lang" },
  { src: u("beer_team_veronika_fuerbacher_e6299b39a9.jpg"), name: "Veronika Fürbacher" },
];

function shot(src: string, alt: string): HouseShot {
  return { src, alt };
}

export const HOUSE_MEDIA: Record<string, HouseMedia> = {
  ueber: {
    layout: "manufactory",
    hero: WORKSHOP.one,
    statement: WORKSHOP.one,
    statementB: BUILDING.snow3,
    close: ROOM.r0081,
    ledger: WORKSHOP.two,
    visit: ROOM.r0002,
    gallery: [
      shot(BUILDING.snow2, "Manufaktur in Wolfersdorf im Schnee"),
      shot(WORKSHOP.one, "Werkstatt"),
      shot(ROOM.r0052, "Ausstellung"),
      shot(BUILDING.facade, "Gebäude Badendorf"),
    ],
    chapters: [
      shot(WORKSHOP.one, "Werkstatt"),
      shot(WORKSHOP.two, "Fertigung in einer Hand"),
      shot(BUILDING.snow2, "Das Haus, nicht die Halle"),
      shot(ROOM.r0003, "Aktuelles aus der Manufaktur"),
      shot(BUILDING.snow1, "BEER in Wolfersdorf im Winter"),
    ],
    people: [],
  },
  ausstellung: {
    layout: "showroom",
    hero: WERK2.hall,
    statement: WERK2.kitchens,
    statementB: WERK2.table,
    close: WERK2.meeting,
    ledger: WERK2.samples,
    visit: WERK2.lounge,
    gallery: [
      shot(ROOM.r0003, "Ausstellung, Blick ins Studio"),
      shot(ROOM.r0004, "Muster und gebaute Details"),
      shot(ROOM.r0047, "Ausstellung unter Tageslicht"),
      shot(ROOM.r0052, "Küche in der Ausstellung"),
      shot(ROOM.r0065, "Materialien zum Anfassen"),
      shot(ROOM.r0071, "Querschnitte und Kanten"),
      shot(ROOM.r0074, "Einrichtung im Studio"),
      shot(ROOM.r0081, "Ausstellung Wolfersdorf"),
    ],
    chapters: [],
    people: [],
  },
  team: {
    layout: "people",
    hero: CREW.joiner,
    statement: CREW.table,
    statementB: WORKSHOP.one,
    close: ROOM.r0003,
    ledger: WORKSHOP.two,
    visit: ROOM.r0058,
    gallery: [shot(CREW.group, "Team in der Manufaktur"), shot(CREW.table, "Werkstatt")],
    chapters: [],
    people: PEOPLE,
  },
  nachhaltigkeit: {
    layout: "lasting",
    hero: WORKSHOP.one,
    statement: BUILDING.snow2,
    statementB: WORKSHOP.two,
    close: BUILDING.snow3,
    ledger: BUILDING.facade,
    visit: ROOM.r0068,
    gallery: [
      shot(WORKSHOP.one, "Fertigung in Wolfersdorf"),
      shot(BUILDING.snow1, "Das Haus in Badendorf"),
      shot(WORKSHOP.two, "Werkstatt"),
    ],
    chapters: [],
    people: [],
  },
  karriere: {
    layout: "letter",
    hero: WORKSHOP.two,
    statement: CREW.group,
    statementB: WORKSHOP.one,
    close: BUILDING.snow1,
    ledger: WORKSHOP.one,
    visit: ROOM.r0002,
    gallery: [shot(WORKSHOP.two, "Werkstatt"), shot(CREW.group, "Team")],
    chapters: [],
    people: PEOPLE.slice(0, 8),
  },
  kontakt: {
    layout: "place",
    hero: BUILDING.snow1,
    statement: BUILDING.facade,
    statementB: BUILDING.snow3,
    close: BUILDING.dusk,
    ledger: BUILDING.snow2,
    visit: ROOM.r0002,
    gallery: [
      shot(BUILDING.snow1, "Badendorf 6, Wolfersdorf"),
      shot(BUILDING.facade, "Manufaktur"),
    ],
    chapters: [],
    people: [],
  },
  katalog: {
    layout: "papers",
    hero: ROOM.r0075,
    statement: ROOM.r0076,
    statementB: ROOM.r0048,
    close: ROOM.r0002,
    ledger: ROOM.r0070,
    visit: ROOM.r0065,
    gallery: [
      shot(ROOM.r0075, "Ausstellung"),
      shot(ROOM.r0076, "Details zum Anfassen"),
      shot(ROOM.r0047, "Muster"),
      shot(ROOM.r0068, "Studio Wolfersdorf"),
    ],
    chapters: [],
    people: [],
  },
  "kueche-planen": {
    layout: "path",
    hero: ROOM.r0052,
    statement: WORKSHOP.one,
    statementB: ROOM.r0004,
    close: ROOM.r0081,
    ledger: WORKSHOP.two,
    visit: ROOM.r0047,
    gallery: [
      shot(ROOM.r0002, "Erstes Gespräch in der Ausstellung"),
      shot(WORKSHOP.one, "Fertigung nach Aufmaß"),
      shot(ROOM.r0071, "Muster und Entscheidungen"),
      shot(BUILDING.snow1, "Übergabe, Wolfersdorf"),
    ],
    chapters: [
      shot(ROOM.r0002, "Ausstellung Wolfersdorf"),
      shot(ROOM.r0004, "Beratung in der Ausstellung"),
      shot(ROOM.r0076, "Unterlagen zum Anfassen"),
      shot(ROOM.r0065, "Fragen vor dem Gespräch"),
    ],
    people: [],
  },
};

export function houseSrc(src: string, width = 1800) {
  return cmsSrc(src, width);
}

export function sizedMedia(slug: string): HouseMedia | null {
  const media = HOUSE_MEDIA[slug];
  if (!media) {
    return null;
  }
  const size = (src: string, width: number) => houseSrc(src, width);
  return {
    ...media,
    hero: size(media.hero, 3840),
    statement: size(media.statement, 2560),
    statementB: size(media.statementB, 1200),
    close: size(media.close, 1600),
    ledger: size(media.ledger, 1400),
    visit: size(media.visit, 1600),
    gallery: media.gallery.map((item) => ({
      ...item,
      src: size(item.src, 1600),
    })),
    chapters: media.chapters.map((item) => ({
      ...item,
      src: size(item.src, 1600),
    })),
    people: media.people.map((person) => ({
      ...person,
      src: size(person.src, 1280),
    })),
  };
}

/** Extra house photos for a page that would otherwise show one twice. */
export function reserveShots(): HouseShot[] {
  return [
    shot(BUILDING.facade, "Manufaktur in Wolfersdorf"),
    shot(BUILDING.dusk, "Manufaktur am Abend"),
    shot(BUILDING.snow3, "Manufaktur im Winter"),
    shot(WORKSHOP.two, "Werkstatt"),
    shot(CREW.table, "Team in der Manufaktur"),
    shot(ROOM.r0047, "Ausstellung Wolfersdorf"),
    shot(ROOM.r0048, "Ausstellung Wolfersdorf"),
    shot(ROOM.r0068, "Ausstellung Wolfersdorf"),
    shot(ROOM.r0070, "Ausstellung Wolfersdorf"),
    shot(ROOM.r0071, "Querschnitte und Kanten"),
    shot(ROOM.r0074, "Einrichtung im Studio"),
    shot(ROOM.r0058, "Ausstellung Wolfersdorf"),
  ].map((item) => ({ ...item, src: houseSrc(item.src, 1600) }));
}

export const SIBLING_IMAGES = {
  ueber: houseSrc(BUILDING.snow1, 1100),
  team: houseSrc(CREW.group, 1100),
  ausstellung: houseSrc(ROOM.r0002, 1100),
  nachhaltigkeit: houseSrc(WORKSHOP.one, 1100),
  karriere: houseSrc(WORKSHOP.two, 1100),
};
