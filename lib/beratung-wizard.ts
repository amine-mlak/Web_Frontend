export const BERATUNG_WIZARD_STEPS = [
  "anliegen",
  "ort",
  "kontakt",
  "nachricht",
] as const;

export type BeratungWizardStep = (typeof BERATUNG_WIZARD_STEPS)[number];

export const BERATUNG_INTENTS = [
  { id: "renovieren", label: "Ich möchte meine Küche renovieren" },
  { id: "neubau", label: "Ich suche eine Küche für einen Neubau" },
  { id: "bestehend", label: "Ich habe eine Frage zu einer bestehenden Küche" },
  { id: "moebel", label: "Ich plane Möbel nach Maß" },
  { id: "anders", label: "Etwas anderes" },
] as const;

export const BERATUNG_PLACES = [
  { id: "ausstellung", label: "In der Ausstellung in Wolfersdorf" },
  { id: "vor_ort", label: "Bei mir vor Ort" },
] as const;

export const BERATUNG_SALUTATIONS = [
  { id: "herr", label: "Herr" },
  { id: "frau", label: "Frau" },
] as const;

export type BeratungIntent = (typeof BERATUNG_INTENTS)[number]["id"];
export type BeratungPlace = (typeof BERATUNG_PLACES)[number]["id"];
export type BeratungSalutation = (typeof BERATUNG_SALUTATIONS)[number]["id"];

export const WIZARD_STEP_COPY: Record<
  BeratungWizardStep,
  { title: string; hint: string }
> = {
  anliegen: {
    title: "Worum geht es?",
    hint: "So wissen wir, wen Sie sprechen möchten.",
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

function optionIds<T extends { id: string }>(options: readonly T[]) {
  return new Set(options.map((option) => option.id));
}

const INTENT_IDS = optionIds(BERATUNG_INTENTS);
const PLACE_IDS = optionIds(BERATUNG_PLACES);
const SALUTATION_IDS = optionIds(BERATUNG_SALUTATIONS);

export function isBeratungIntent(value: string): value is BeratungIntent {
  return INTENT_IDS.has(value);
}

export function isBeratungPlace(value: string): value is BeratungPlace {
  return PLACE_IDS.has(value);
}

export function isBeratungSalutation(
  value: string,
): value is BeratungSalutation {
  return SALUTATION_IDS.has(value);
}

export function labelForIntent(id: string) {
  return BERATUNG_INTENTS.find((item) => item.id === id)?.label ?? id;
}

export function labelForPlace(id: string) {
  return BERATUNG_PLACES.find((item) => item.id === id)?.label ?? id;
}

export function composeLeadMessage(input: {
  intent?: string;
  place?: string;
  plz?: string;
  message?: string;
}) {
  const lines = [
    `Anliegen: ${labelForIntent(input.intent ?? "")}`,
    `Ort: ${labelForPlace(input.place ?? "")}`,
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
