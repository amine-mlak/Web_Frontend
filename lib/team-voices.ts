import type { HousePerson } from "@/lib/house-photos";

/**
 * The team page text in the CMS is one block per person:
 *
 *   ### Christian Beer
 *   Geschäftsführer
 *
 *   „Küchen haben mich immer schon fasziniert …"
 *
 * This turns it into people and joins each with their portrait, so name, role, quote and face
 * show together. Portraits are named "C. Beer" or "Benedikt H.", so the match is first initial
 * plus surname, or first name plus the surname's initial.
 */

export type TeamVoice = {
  name: string;
  role: string;
  quote: string;
  photo?: string;
  /** Sets the quotation marks; German unless said otherwise. */
  locale?: "de" | "en";
};

function key(name: string) {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z. ]/g, "").trim();
}

function matches(fullName: string, short: string) {
  const [first = "", ...rest] = key(fullName).split(/\s+/);
  const last = rest.join(" ");
  const s = key(short);
  // "C. Beer"
  const initialSurname = s.match(/^([a-z])\.\s*(.+)$/);
  if (initialSurname) return first.startsWith(initialSurname[1]) && last === initialSurname[2];
  // "Benedikt H."
  const nameInitial = s.match(/^(.+?)\s+([a-z])\.?$/);
  if (nameInitial) return first === nameInitial[1] && last.startsWith(nameInitial[2]);
  return key(fullName) === s;
}

/** The people in the CMS text, in its order, each with their portrait if there is one. */
export function parseTeamVoices(body: string, portraits: HousePerson[]): TeamVoice[] {
  const blocks = body.split(/^###\s+/m).slice(1);
  const used = new Set<string>();
  const voices = blocks
    .map((block) => {
      const lines = block.split(/\r?\n/).map((line) => line.trim());
      const name = lines[0] ?? "";
      const rest = lines.slice(1).filter(Boolean);
      // A role is a short line that is not the quote itself.
      const role = rest[0] && !/^["„“‚']/.test(rest[0]) && rest[0].length < 60 ? rest[0] : "";
      const quote = rest.slice(role ? 1 : 0).join(" ").trim().replace(/^["„“”‚']+|["„“”‚']+$/g, "");
      const portrait = portraits.find((person) => !used.has(person.src) && matches(name, person.name));
      if (portrait) used.add(portrait.src);
      return { name, role, quote, photo: portrait?.src };
    })
    .filter((voice) => voice.name);
  return voices;
}

