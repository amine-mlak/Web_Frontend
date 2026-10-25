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
  table: u("beer_hebauf_werk2_mitarbeiter_essen_44852ab4f9.jpg"),
};

const PEOPLE: HousePerson[] = [
  { src: u("beer_kuechen_mitarbeiter_a_beer_23cffd2e13.jpg"), name: "A. Beer" },
  { src: u("beer_kuechen_mitarbeiter_c_beer_bf930a4cc3.jpg"), name: "C. Beer" },
  { src: u("beer_kuechen_mitarbeiter_j_beer_5efafb8961.jpg"), name: "J. Beer" },
  { src: u("beer_kuechen_mitarbeiter_a_wagner_8efc9e4bf2.jpg"), name: "A. Wagner" },
  { src: u("beer_kuechen_mitarbeiter_a_hilgers_3b3ee2f0be.jpg"), name: "A. Hilgers" },
  { src: u("beer_kuechen_mitarbeiter_benedikt_h_neu_c81c42696f.jpg"), name: "Benedikt H." },
  { src: u("beer_kuechen_mitarbeiter_c_fellner_bfd9b8bdea.jpg"), name: "C. Fellner" },
  { src: u("beer_kuechen_mitarbeiter_d_ciglaric_neu_444c56cd1f.jpg"), name: "D. Ciglaric" },
  { src: u("beer_kuechen_mitarbeiter_d_vogl_384cf65a31.jpg"), name: "D. Vogl" },
  { src: u("beer_kuechen_mitarbeiter_j_mirlach_d81cec0fdf.jpg"), name: "J. Mirlach" },
  { src: u("beer_kuechen_mitarbeiter_j_sperrer_77470e7e96.jpg"), name: "J. Sperrer" },
  { src: u("beer_kuechen_mitarbeiter_r_geier_acd98e783d.jpg"), name: "R. Geier" },
  { src: u("beer_kuechen_mitarbeiter_r_huber_27fcadb598.jpg"), name: "R. Huber" },
  { src: u("beer_kuechen_mitarbeiter_r_pecho_115fc16ed5.jpg"), name: "R. Pecho" },
  { src: u("beer_kuechen_mitarbeiter_r_stauber_2f1af7bd56.jpg"), name: "R. Stauber" },
  { src: u("beer_kuechen_mitarbeiter_r_vater_c846f62245.jpg"), name: "R. Vater" },
  { src: u("beer_kuechen_mitarbeiter_s_ostertag_917ca9232a.jpg"), name: "S. Ostertag" },
  { src: u("beer_kuechen_mitarbeiter_thomas_l_c840172867.jpg"), name: "Thomas L." },
  { src: u("beer_kuechen_mitarbeiter_v_fuerbacher_3f322dc099.jpg"), name: "V. Fürbacher" },
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
      shot(BUILDING.snow1, "Radius um Wolfersdorf"),
    ],
    people: [],
  },
  ausstellung: {
    layout: "showroom",
    hero: ROOM.r0002,
    statement: ROOM.r0004,
    statementB: ROOM.r0048,
    close: ROOM.r0075,
    ledger: ROOM.r0058,
    visit: ROOM.r0060,
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
    hero: CREW.group,
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
    visit: ROOM.r0002,
    gallery: [
      shot(ROOM.r0002, "Erstes Gespräch in der Ausstellung"),
      shot(WORKSHOP.one, "Fertigung nach Aufmaß"),
      shot(ROOM.r0071, "Muster und Entscheidungen"),
      shot(BUILDING.snow1, "Übergabe, Wolfersdorf"),
    ],
    chapters: [
      shot(ROOM.r0002, "Ausstellung Freising"),
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

export const SIBLING_IMAGES = {
  ueber: houseSrc(BUILDING.snow1, 1100),
  team: houseSrc(CREW.group, 1100),
  ausstellung: houseSrc(ROOM.r0002, 1100),
  nachhaltigkeit: houseSrc(WORKSHOP.one, 1100),
  karriere: houseSrc(WORKSHOP.two, 1100),
};
