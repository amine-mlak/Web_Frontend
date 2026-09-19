export const BERATUNG_WIZARD_STEPS = [
  "shape",
  "room",
  "style",
  "handle",
  "colour",
  "worktop",
  "appliances",
  "cooking",
  "occasion",
  "preparations",
  "timing",
  "budget",
  "floorplan",
  "ort",
  "kontakt",
  "nachricht",
] as const;

export type BeratungWizardStep = (typeof BERATUNG_WIZARD_STEPS)[number];

export type BeratungChoice = {
  id: string;
  label: string;
  icon: string;
};

export const BERATUNG_SHAPES = [
  { id: "einzeilig", label: "Einzeilig", icon: "shape-einzeilig" },
  { id: "zweizeilig", label: "Zweizeilig", icon: "shape-zweizeilig" },
  { id: "l_form", label: "L-Form", icon: "shape-l" },
  { id: "u_form", label: "U-Form", icon: "shape-u" },
  { id: "insel", label: "Mit Kücheninsel", icon: "shape-insel" },
  { id: "offen", label: "Noch nicht entschieden", icon: "shape-offen" },
] as const;

export const BERATUNG_ROOMS = [
  { id: "geschlossen", label: "Geschlossen", icon: "room-geschlossen" },
  { id: "offen", label: "Offen", icon: "room-offen" },
  { id: "planung", label: "Noch in Planung", icon: "room-planung" },
] as const;

export const BERATUNG_STYLES = [
  { id: "modern", label: "Modern", icon: "style-modern" },
  { id: "landhaus", label: "Landhaus", icon: "style-landhaus" },
  { id: "design", label: "Design", icon: "style-design" },
  { id: "holz", label: "Holz", icon: "style-holz" },
  { id: "offen", label: "Noch nicht entschieden", icon: "style-offen" },
] as const;

export const BERATUNG_HANDLES = [
  { id: "grifflos", label: "Grifflos", icon: "handle-grifflos" },
  { id: "griff", label: "Mit Griff", icon: "handle-griff" },
  { id: "touch", label: "Mit Touchfunktion", icon: "handle-touch" },
] as const;

export const BERATUNG_COLOURS = [
  { id: "hell", label: "Hell", icon: "colour-hell" },
  { id: "dunkel", label: "Dunkel", icon: "colour-dunkel" },
  { id: "farbig", label: "Farbig", icon: "colour-farbig" },
] as const;

export const BERATUNG_WORKTOPS = [
  { id: "kunststoff", label: "Kunststoff", icon: "worktop-kunststoff" },
  { id: "naturstein", label: "Naturstein", icon: "worktop-naturstein" },
  { id: "keramik", label: "Keramik", icon: "worktop-keramik" },
  { id: "edelstahl", label: "Edelstahl", icon: "worktop-edelstahl" },
] as const;

export const BERATUNG_APPLIANCES = [
  {
    id: "kuehl_einbau",
    label: "Kühl- & Gefrierkombination (Einbau)",
    icon: "appliance-fridge",
  },
  {
    id: "kuehl_frei",
    label: "Freistehender Kühl- & Gefrierschrank",
    icon: "appliance-fridge-free",
  },
  { id: "spueler_xxl", label: "XXL Geschirrspüler", icon: "appliance-dishwasher" },
  {
    id: "abzug_kochfeld",
    label: "Abzugshaube (im Kochfeld)",
    icon: "appliance-hood",
  },
  { id: "dampfgarer", label: "Dampfgarer (Kombigerät)", icon: "appliance-steam" },
  { id: "teppanyaki", label: "Teppanyaki-Kochfeld", icon: "appliance-teppan" },
  { id: "wein", label: "Weinkühlschrank", icon: "appliance-wine" },
  { id: "waermeschublade", label: "Wärmeschublade", icon: "appliance-drawer" },
  { id: "keine", label: "Keine besonderen Wünsche", icon: "appliance-none" },
] as const;

export const BERATUNG_COOKING = [
  { id: "alleine", label: "Ich koche alleine", icon: "cooking-alleine" },
  { id: "zu_zweit", label: "Wir kochen zu zweit", icon: "cooking-zweit" },
  { id: "kinder", label: "Ich koche mit Kindern", icon: "cooking-kinder" },
  { id: "freunde", label: "Ich koche mit Freunden", icon: "cooking-freunde" },
] as const;

export const BERATUNG_OCCASIONS = [
  { id: "renovieren", label: "Renovierung", icon: "occasion-renovieren" },
  { id: "umzug", label: "Umzug", icon: "occasion-umzug" },
  { id: "neubau", label: "Neubau", icon: "occasion-neubau" },
  { id: "bestehend", label: "Bestehende Küche", icon: "occasion-bestehend" },
  { id: "moebel", label: "Möbel nach Maß", icon: "occasion-moebel" },
  { id: "anders", label: "Etwas anderes", icon: "occasion-anders" },
] as const;

export const BERATUNG_PREPARATIONS = [
  {
    id: "inspiration",
    label: "Ich habe online nach Inspirationen gesucht",
    icon: "prep-inspiration",
  },
  {
    id: "studio",
    label: "Ich habe mir bereits Küchen in einem Studio angeschaut",
    icon: "prep-studio",
  },
  {
    id: "architekt",
    label: "Ich habe eine/n Innenarchitekt/in engagiert",
    icon: "prep-architekt",
  },
  {
    id: "grundriss",
    label: "Ich habe bereits einen Küchengrundriss erstellen lassen",
    icon: "prep-grundriss",
  },
  {
    id: "angebote",
    label: "Ich habe bereits Angebote eingeholt",
    icon: "prep-angebote",
  },
  { id: "keine", label: "Noch keine", icon: "prep-keine" },
] as const;

export const BERATUNG_TIMINGS = [
  { id: "1_3", label: "1 – 3 Monate", icon: "timing-1" },
  { id: "4_6", label: "4 – 6 Monate", icon: "timing-2" },
  { id: "7_12", label: "7 – 12 Monate", icon: "timing-3" },
  { id: "12_plus", label: "12+ Monate", icon: "timing-4" },
] as const;

export const BERATUNG_BUDGETS = [
  { id: "unter_25", label: "Bis 25.000 €", icon: "budget-1" },
  { id: "25_35", label: "25.000 – 35.000 €", icon: "budget-2" },
  { id: "ueber_35", label: "Über 35.000 €", icon: "budget-3" },
  { id: "offen", label: "Noch nicht festgelegt", icon: "budget-offen" },
] as const;

export const BERATUNG_FLOORPLANS = [
  { id: "ja", label: "Ja", icon: "floorplan-ja" },
  { id: "nein", label: "Nein", icon: "floorplan-nein" },
] as const;

export const BERATUNG_PLACES = [
  { id: "ausstellung", label: "In der Ausstellung in Wolfersdorf", icon: "place-studio" },
  { id: "vor_ort", label: "Bei mir vor Ort", icon: "place-home" },
] as const;

export const BERATUNG_SALUTATIONS = [
  { id: "herr", label: "Herr" },
  { id: "frau", label: "Frau" },
] as const;

/** @deprecated Use BERATUNG_OCCASIONS. Kept so older posts still type-check. */
export const BERATUNG_INTENTS = BERATUNG_OCCASIONS;

export type BeratungShape = (typeof BERATUNG_SHAPES)[number]["id"];
export type BeratungRoom = (typeof BERATUNG_ROOMS)[number]["id"];
export type BeratungStyle = (typeof BERATUNG_STYLES)[number]["id"];
export type BeratungHandle = (typeof BERATUNG_HANDLES)[number]["id"];
export type BeratungColour = (typeof BERATUNG_COLOURS)[number]["id"];
export type BeratungWorktop = (typeof BERATUNG_WORKTOPS)[number]["id"];
export type BeratungAppliance = (typeof BERATUNG_APPLIANCES)[number]["id"];
export type BeratungCooking = (typeof BERATUNG_COOKING)[number]["id"];
export type BeratungOccasion = (typeof BERATUNG_OCCASIONS)[number]["id"];
export type BeratungPreparation = (typeof BERATUNG_PREPARATIONS)[number]["id"];
export type BeratungTiming = (typeof BERATUNG_TIMINGS)[number]["id"];
export type BeratungBudget = (typeof BERATUNG_BUDGETS)[number]["id"];
export type BeratungFloorplan = (typeof BERATUNG_FLOORPLANS)[number]["id"];
export type BeratungPlace = (typeof BERATUNG_PLACES)[number]["id"];
export type BeratungSalutation = (typeof BERATUNG_SALUTATIONS)[number]["id"];
export type BeratungIntent = BeratungOccasion;

export const WIZARD_STEP_COPY: Record<
  BeratungWizardStep,
  { title: string; hint: string }
> = {
  shape: {
    title: "Welche Küchenform bevorzugen Sie?",
    hint: "Eine erste Idee reicht. Im Gespräch zeichnen wir den Raum genau.",
  },
  room: {
    title: "Wie sieht der Raum Ihrer neuen Küche aus?",
    hint: "Geschlossen, offen zum Wohnen, oder noch nicht festgelegt.",
  },
  style: {
    title: "Welcher Stil gefällt Ihnen?",
    hint: "So, wie wir Küchen in der Manufaktur denken — nicht als Kataloglinie.",
  },
  handle: {
    title: "Wie möchten Sie Ihre Küchenschränke öffnen?",
    hint: "Grifflos, mit Griff oder über Touch.",
  },
  colour: {
    title: "Welche Farbe soll Ihre Küche haben?",
    hint: "Eine Richtung genügt. Materialien stimmen wir später ab.",
  },
  worktop: {
    title: "Welches Material wünschen Sie sich für Ihre Arbeitsplatte?",
    hint: "Kunststoff, Naturstein, Keramik oder Edelstahl.",
  },
  appliances: {
    title: "Welche besonderen E-Geräte wünschen Sie sich?",
    hint: "Neben den Standardgeräten. Mehrfachauswahl möglich.",
  },
  cooking: {
    title: "Wie kochen Sie am häufigsten?",
    hint: "Damit die Arbeitswege zur Küche passen.",
  },
  occasion: {
    title: "Warum benötigen Sie eine neue Küche?",
    hint: "Renovierung, Umzug, Neubau — oder etwas anderes.",
  },
  preparations: {
    title: "Welche Vorbereitungen haben Sie bereits getroffen?",
    hint: "Mehrfachauswahl möglich.",
  },
  timing: {
    title: "Wann benötigen Sie Ihre neue Küche?",
    hint: "Ein grober Zeitrahmen reicht.",
  },
  budget: {
    title: "Wieviel Budget haben Sie für Ihre Küche eingeplant?",
    hint: "Damit wir ehrlich planen können. Kein Angebot, nur Orientierung.",
  },
  floorplan: {
    title: "Haben Sie bereits einen Grundriss Ihrer Küche?",
    hint: "Falls ja, können Sie ihn später im Gespräch schicken. Kein Upload nötig.",
  },
  ort: {
    title: "Wo sollen wir uns treffen?",
    hint: "Ausstellung in Wolfersdorf oder bei Ihnen vor Ort.",
  },
  kontakt: {
    title: "Wie erreichen wir Sie?",
    hint: "Wir melden uns persönlich zur Terminabsprache.",
  },
  nachricht: {
    title: "Was dürfen wir schon wissen?",
    hint: "Raum, Zeitrahmen, erste Ideen — freiwillig.",
  },
};

export const PICTURE_STEPS = new Set<BeratungWizardStep>([
  "shape",
  "room",
  "style",
  "handle",
  "colour",
  "worktop",
  "cooking",
  "occasion",
  "timing",
  "budget",
  "floorplan",
  "ort",
]);

export const MULTI_STEPS = new Set<BeratungWizardStep>([
  "appliances",
  "preparations",
]);

function optionIds<T extends { id: string }>(options: readonly T[]) {
  return new Set(options.map((option) => option.id));
}

const SHAPE_IDS = optionIds(BERATUNG_SHAPES);
const ROOM_IDS = optionIds(BERATUNG_ROOMS);
const STYLE_IDS = optionIds(BERATUNG_STYLES);
const HANDLE_IDS = optionIds(BERATUNG_HANDLES);
const COLOUR_IDS = optionIds(BERATUNG_COLOURS);
const WORKTOP_IDS = optionIds(BERATUNG_WORKTOPS);
const APPLIANCE_IDS = optionIds(BERATUNG_APPLIANCES);
const COOKING_IDS = optionIds(BERATUNG_COOKING);
const OCCASION_IDS = optionIds(BERATUNG_OCCASIONS);
const PREPARATION_IDS = optionIds(BERATUNG_PREPARATIONS);
const TIMING_IDS = optionIds(BERATUNG_TIMINGS);
const BUDGET_IDS = optionIds(BERATUNG_BUDGETS);
const FLOORPLAN_IDS = optionIds(BERATUNG_FLOORPLANS);
const PLACE_IDS = optionIds(BERATUNG_PLACES);
const SALUTATION_IDS = optionIds(BERATUNG_SALUTATIONS);

export function isBeratungShape(value: string): value is BeratungShape {
  return SHAPE_IDS.has(value);
}
export function isBeratungRoom(value: string): value is BeratungRoom {
  return ROOM_IDS.has(value);
}
export function isBeratungStyle(value: string): value is BeratungStyle {
  return STYLE_IDS.has(value);
}
export function isBeratungHandle(value: string): value is BeratungHandle {
  return HANDLE_IDS.has(value);
}
export function isBeratungColour(value: string): value is BeratungColour {
  return COLOUR_IDS.has(value);
}
export function isBeratungWorktop(value: string): value is BeratungWorktop {
  return WORKTOP_IDS.has(value);
}
export function isBeratungAppliance(value: string): value is BeratungAppliance {
  return APPLIANCE_IDS.has(value);
}
export function isBeratungCooking(value: string): value is BeratungCooking {
  return COOKING_IDS.has(value);
}
export function isBeratungOccasion(value: string): value is BeratungOccasion {
  return OCCASION_IDS.has(value);
}
export function isBeratungIntent(value: string): value is BeratungIntent {
  return isBeratungOccasion(value);
}
export function isBeratungPreparation(value: string): value is BeratungPreparation {
  return PREPARATION_IDS.has(value);
}
export function isBeratungTiming(value: string): value is BeratungTiming {
  return TIMING_IDS.has(value);
}
export function isBeratungBudget(value: string): value is BeratungBudget {
  return BUDGET_IDS.has(value);
}
export function isBeratungFloorplan(value: string): value is BeratungFloorplan {
  return FLOORPLAN_IDS.has(value);
}
export function isBeratungPlace(value: string): value is BeratungPlace {
  return PLACE_IDS.has(value);
}
export function isBeratungSalutation(value: string): value is BeratungSalutation {
  return SALUTATION_IDS.has(value);
}

function labelIn<T extends { id: string; label: string }>(
  options: readonly T[],
  id: string,
) {
  return options.find((item) => item.id === id)?.label ?? id;
}

export function labelForIntent(id: string) {
  return labelIn(BERATUNG_OCCASIONS, id);
}

export function labelForPlace(id: string) {
  return labelIn(BERATUNG_PLACES, id);
}

export function parseIdList(
  value: unknown,
  isValid: (id: string) => boolean,
  max = 8,
) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !isValid(item) || out.includes(item)) {
      continue;
    }
    out.push(item);
    if (out.length >= max) {
      break;
    }
  }
  return out;
}

export function toggleExclusiveNone(
  current: string[],
  id: string,
  noneId = "keine",
) {
  if (id === noneId) {
    return current.includes(noneId) ? [] : [noneId];
  }
  const withoutNone = current.filter((item) => item !== noneId);
  if (withoutNone.includes(id)) {
    return withoutNone.filter((item) => item !== id);
  }
  return [...withoutNone, id];
}

export type BeratungPlannerDetails = {
  shape: string;
  room: string;
  style: string;
  handle: string;
  colour: string;
  worktop: string;
  appliances: string[];
  cooking: string;
  intent: string;
  preparations: string[];
  timing: string;
  budget: string;
  floorplan: string;
  place: string;
  salutation?: string;
  plz?: string;
};

export function composeLeadMessage(input: BeratungPlannerDetails & { message?: string }) {
  const lines = [
    `Küchenform: ${labelIn(BERATUNG_SHAPES, input.shape)}`,
    `Raum: ${labelIn(BERATUNG_ROOMS, input.room)}`,
    `Stil: ${labelIn(BERATUNG_STYLES, input.style)}`,
    `Öffnung: ${labelIn(BERATUNG_HANDLES, input.handle)}`,
    `Farbe: ${labelIn(BERATUNG_COLOURS, input.colour)}`,
    `Arbeitsplatte: ${labelIn(BERATUNG_WORKTOPS, input.worktop)}`,
    `E-Geräte: ${
      input.appliances.length
        ? input.appliances.map((id) => labelIn(BERATUNG_APPLIANCES, id)).join(", ")
        : "keine Angabe"
    }`,
    `Kochen: ${labelIn(BERATUNG_COOKING, input.cooking)}`,
    `Anliegen: ${labelForIntent(input.intent)}`,
    `Vorbereitung: ${
      input.preparations.length
        ? input.preparations
            .map((id) => labelIn(BERATUNG_PREPARATIONS, id))
            .join(", ")
        : "keine Angabe"
    }`,
    `Zeitrahmen: ${labelIn(BERATUNG_TIMINGS, input.timing)}`,
    `Budget: ${labelIn(BERATUNG_BUDGETS, input.budget)}`,
    `Grundriss: ${labelIn(BERATUNG_FLOORPLANS, input.floorplan)}`,
    `Ort: ${labelForPlace(input.place)}`,
  ];
  if (input.plz) {
    lines.push(`PLZ: ${input.plz}`);
  }
  const note = input.message?.trim();
  if (note) {
    lines.push("", note);
  }
  return lines.join("\n");
}
