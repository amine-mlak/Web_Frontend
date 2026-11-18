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

// The building and its grounds in Badendorf (media library: Themenfotos › Gebäude › Showroom_Werk2).
const BUILDING = {
  /** From the drive: the BEER lettering on the front, the sun behind the wooden facade. */
  street: u("347_051_cd1a0983ff.jpg"),
  /** The whole building with the rock garden, by day. */
  wide: u("beer_kuechen_aussenbereich_5_b95d14ccdb.jpg"),
  /** The long facade behind the paved yard. */
  yard: u("347_040_519a81138d.jpg"),
  /** Seen from the meadow, a fruit tree in front. */
  orchard: u("347_046_6624be8088.jpg"),
  /** Allium in bloom in front of the facade. */
  blossoms: u("347_044_a115ee2e1f.jpg"),
  /** The terrace with the fire bowl, fields behind. */
  terrace: u("347_032_d7af619ca9.jpg"),
  terraceBeds: u("347_038_acdd0158b8.jpg"),
  outdoorKitchen: u("347_035_5ec83059cc.jpg"),
  /** The BEER letters in weathered steel at the drive. */
  sign: u("347_050_420ff564c3.jpg"),
  /** Upright: two stone steles in front of the BEER lettering. */
  steles: u("347_053_e0b39923c9.jpg"),
  /** Across a grain field. */
  field: u("347_054_8421f8a1cd.jpg"),
  facadeBeds: u("347_056_1e77a56689.jpg"),
  forest: u("347_045_ac39bb5c41.jpg"),
  front: u("347_049_7537d5d889.jpg"),
  night: u("347_066_c2a0fc6ac5.jpg"),
  nightWide: u("347_068_053bd29c9b.jpg"),
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
  /** Two meeting rooms behind glass. */
  rooms: u("079_Showroom_ec6cba26d3.jpg"),
  /** A desk for planning talks behind glass. */
  desk: u("078_Showroom_a0a87f0eff.jpg"),
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
  regionen: BUILDING.forest,
  marken: WERK2.kitchens,
  ratgeber: WERK2.samples,
  planen: WERK2.table,
};

const ROOM = {
  r0002: u("Ausstellung_0002_198946b6fd.jpg"),
  r0003: u("Ausstellung_0003_bcf7bea1a4.jpg"),
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


function shot(src: string, alt: string): HouseShot {
  return { src, alt };
}

export const HOUSE_MEDIA: Record<string, HouseMedia> = {
  ueber: {
    layout: "manufactory",
    hero: WORKSHOP.one,
    statement: WORKSHOP.one,
    statementB: BUILDING.orchard,
    close: ROOM.r0081,
    ledger: WORKSHOP.two,
    visit: ROOM.r0002,
    gallery: [
      shot(BUILDING.steles, "Manufaktur in Wolfersdorf"),
      shot(WORKSHOP.one, "Werkstatt"),
      shot(ROOM.r0052, "Ausstellung"),
      shot(BUILDING.wide, "Das Gebäude in Badendorf"),
    ],
    chapters: [
      shot(WORKSHOP.one, "Werkstatt"),
      shot(WORKSHOP.two, "Fertigung in einer Hand"),
      shot(BUILDING.yard, "Das Haus, nicht die Halle"),
      shot(ROOM.r0003, "Aktuelles aus der Manufaktur"),
      shot(BUILDING.blossoms, "BEER in Wolfersdorf"),
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
      shot(SHOWROOM_SAMPLES.wall, "Muster und gebaute Details"),
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
    // The people come from the CMS collection "Team" (lib/team-members.ts).
    people: [],
  },
  nachhaltigkeit: {
    layout: "lasting",
    hero: WORKSHOP.one,
    statement: BUILDING.terraceBeds,
    statementB: WORKSHOP.two,
    close: BUILDING.field,
    ledger: BUILDING.facadeBeds,
    visit: ROOM.r0068,
    gallery: [
      shot(WORKSHOP.one, "Fertigung in Wolfersdorf"),
      shot(BUILDING.orchard, "Das Haus in Badendorf"),
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
    close: BUILDING.street,
    ledger: WORKSHOP.one,
    visit: ROOM.r0002,
    gallery: [shot(WORKSHOP.two, "Werkstatt"), shot(CREW.group, "Team")],
    chapters: [],
    people: [],
  },
  kontakt: {
    layout: "place",
    hero: BUILDING.street,
    statement: BUILDING.sign,
    statementB: BUILDING.front,
    close: BUILDING.night,
    ledger: BUILDING.yard,
    visit: ROOM.r0002,
    gallery: [
      shot(BUILDING.wide, "Badendorf 6, Wolfersdorf"),
      shot(BUILDING.terrace, "Terrasse der Ausstellung"),
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
    statementB: WERK2.desk,
    close: ROOM.r0081,
    ledger: WORKSHOP.two,
    visit: ROOM.r0047,
    gallery: [
      shot(ROOM.r0002, "Erstes Gespräch in der Ausstellung"),
      shot(WORKSHOP.one, "Fertigung nach Aufmaß"),
      shot(ROOM.r0071, "Muster und Entscheidungen"),
      shot(BUILDING.yard, "Übergabe, Wolfersdorf"),
    ],
    chapters: [
      shot(ROOM.r0002, "Ausstellung Wolfersdorf"),
      shot(WERK2.rooms, "Beratung in der Ausstellung"),
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
    shot(BUILDING.front, "Manufaktur in Wolfersdorf"),
    shot(BUILDING.nightWide, "Manufaktur bei Nacht"),
    shot(BUILDING.blossoms, "Zierlauch vor der Manufaktur"),
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
  ueber: houseSrc(BUILDING.street, 1100),
  team: houseSrc(CREW.group, 1100),
  ausstellung: houseSrc(ROOM.r0002, 1100),
  nachhaltigkeit: houseSrc(WORKSHOP.one, 1100),
  karriere: houseSrc(WORKSHOP.two, 1100),
};
