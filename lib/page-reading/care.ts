import type { CareKey } from "@/lib/page-depth";

/**
 * Care notes for a material, taken from BEER's own care instructions (beer.de, "Materialien
 * und Pflege"). Nothing here is added to what BEER says there; the English is a translation.
 */
export type CareCopy = {
  intro: string;
  rows: { label: string; text: string }[];
};

const WOOD_CLEAN_DE =
  "Trockenes Staubtuch, Fensterleder oder ein weiches Tuch, das nebelfeucht ist, nie nass. In Faserrichtung wischen und immer trocken nachwischen. Ein mildes, nicht scheuerndes Mittel im Wasser ist in Ordnung.";
const WOOD_CLEAN_EN =
  "A dry dust cloth, a chamois or a soft cloth that is barely damp, never wet. Wipe along the grain and always wipe dry afterwards. A mild, non-abrasive cleaner in the water is fine.";
const WOOD_REFRESH_DE =
  "Geölte und gewachste Flächen brauchen nach einiger Zeit eine Auffrischung. Passende Mittel gibt es im Fachhandel oder bei uns.";
const WOOD_REFRESH_EN =
  "Oiled and waxed surfaces need refreshing after a while. Suitable products are sold by specialist shops or by us.";
const WOOD_AVOID_DE =
  "Mikrofasertücher (sie rauen die Fläche auf und reiben Öl und Wachs ab), Möbelpolitur, salmiakhaltige Reiniger, Nitro- und Kunstharzverdünnung, Dampfreiniger.";
const WOOD_AVOID_EN =
  "Microfibre cloths (they roughen the surface and rub off oil and wax), furniture polish, cleaners with ammonia, nitro and synthetic-resin thinners, steam cleaners.";

const CARE: Record<CareKey, { de: CareCopy; en: CareCopy }> = {
  naturstein: {
    de: {
      intro:
        "Jeder Stein ist in Struktur, Körnung und Farbe anders. Matte Stellen, kleine Vertiefungen und feine Fugen gehören zum Material.",
      rows: [
        {
          label: "Täglich reinigen",
          text: "Warmes Wasser mit etwas Spülmittel oder Steinseife genügt. Danach die Fläche trocken wischen.",
        },
        {
          label: "Schutz ab Werk",
          text: "Naturstein wird ab Werk mit einem fleckabweisenden Mittel behandelt. Das ist keine Versiegelung: Der Stein nimmt Feuchtigkeit langsamer auf, aber er nimmt sie auf. Öl, Rote Bete oder Saft deshalb nicht stehen lassen. Jura und Schiefer lassen sich nicht gegen Säure schützen.",
        },
        {
          label: "Im Alltag",
          text: "Zum Schneiden ein Brett, für heiße Töpfe einen Untersetzer verwenden. Schiefer braucht von Zeit zu Zeit Schieferöl.",
        },
        {
          label: "Nicht verwenden",
          text: "Stark fettlösende Allzweckreiniger und Schmierseife laugen den Stein aus. Scheuernde und säurehaltige Reiniger nie verwenden.",
        },
      ],
    },
    en: {
      intro:
        "Every stone differs in structure, grain and colour. Matt spots, small hollows and fine joints are part of the material.",
      rows: [
        {
          label: "Daily cleaning",
          text: "Warm water with a little washing-up liquid or stone soap is enough. Wipe the surface dry afterwards.",
        },
        {
          label: "Factory protection",
          text: "Natural stone is treated at the factory with a stain-repellent. This is not a seal: the stone takes up moisture more slowly, but it does take it up. So do not leave oil, beetroot or juice standing. Jura limestone and slate cannot be protected against acid.",
        },
        {
          label: "Everyday use",
          text: "Use a board for cutting and a trivet for hot pots. Slate needs slate oil from time to time.",
        },
        {
          label: "Do not use",
          text: "Strong grease-dissolving all-purpose cleaners and soft soap leach the stone. Never use abrasive or acidic cleaners.",
        },
      ],
    },
  },
  edelstahl: {
    de: {
      intro:
        "Edelstahl ist unkompliziert. Kratzer entstehen im Gebrauch und gehören dazu; kratzfesten Edelstahl gibt es nicht.",
      rows: [
        {
          label: "Täglich reinigen",
          text: "Ein weiches Tuch mit verdünntem Spülmittel reicht für normale Verschmutzungen.",
        },
        {
          label: "Wischrichtung",
          text: "Immer in Richtung des Schliffs arbeiten, nie quer dazu.",
        },
        {
          label: "Flugrost und Rückstände",
          text: "Fremdrost sofort abreiben. Was fest sitzt, löst ein handelsüblicher Edelstahlreiniger; die Angaben des Herstellers beachten.",
        },
        {
          label: "Nicht verwenden",
          text: "Stahlwolle, Stahlbürsten und Reiniger mit Chlor, Jod, Brom oder Salzsäure.",
        },
      ],
    },
    en: {
      intro:
        "Stainless steel is easy to live with. Scratches come with use and belong to it; there is no scratch-proof stainless steel.",
      rows: [
        {
          label: "Daily cleaning",
          text: "A soft cloth with diluted washing-up liquid is enough for normal dirt.",
        },
        {
          label: "Wiping direction",
          text: "Always work along the brushed finish, never across it.",
        },
        {
          label: "Rust film and residue",
          text: "Rub off rust from other metal at once. What sticks comes off with a standard stainless-steel cleaner; follow the maker's instructions.",
        },
        {
          label: "Do not use",
          text: "Steel wool, steel brushes and cleaners with chlorine, iodine, bromine or hydrochloric acid.",
        },
      ],
    },
  },
  keramik: {
    de: {
      intro: "Keramik wie Dekton ist porenfrei. Haushaltsübliche Flecken und Reinigungsmittel machen ihr wenig aus.",
      rows: [
        {
          label: "Täglich reinigen",
          text: "Wasser, neutrale Seife und ein weicher Schwamm. Danach mit einem sauberen, feuchten Tuch nachwischen, am besten aus Mikrofaser.",
        },
        {
          label: "Polierte Flächen",
          text: "Nach dem Reinigen mit Küchenpapier oder einem Baumwolltuch trocknen.",
        },
        {
          label: "Flecken",
          text: "Flecken können entstehen, wenn stark färbende Stoffe, aggressive Chemikalien oder Klebstoffreste länger als 24 Stunden auf der Fläche bleiben.",
        },
        {
          label: "Mit Vorsicht",
          text: "Laugen- und säurehaltige Reiniger nur vorsichtig einsetzen und nicht lange einwirken lassen.",
        },
      ],
    },
    en: {
      intro: "Ceramic such as Dekton has no pores. Household stains and cleaners do little to it.",
      rows: [
        {
          label: "Daily cleaning",
          text: "Water, neutral soap and a soft sponge. Then wipe with a clean, damp cloth, ideally microfibre.",
        },
        {
          label: "Polished surfaces",
          text: "Dry with kitchen paper or a cotton cloth after cleaning.",
        },
        {
          label: "Stains",
          text: "Stains can form when strongly colouring substances, aggressive chemicals or glue residue stay on the surface for more than 24 hours.",
        },
        {
          label: "With care",
          text: "Use alkaline and acidic cleaners with care and do not leave them on for long.",
        },
      ],
    },
  },
  massivholz: {
    de: {
      intro:
        "Holz nimmt Feuchtigkeit auf und gibt sie wieder ab. Kleine Fugen oder Versätze bilden sich meist zurück, wenn sich die Luftfeuchte im Raum ändert. Mit den Jahren verändert Licht den Farbton.",
      rows: [
        { label: "Täglich reinigen", text: WOOD_CLEAN_DE },
        {
          label: "Arbeitsplatten",
          text: "Arbeitsplatten aus Massivholz ölen wir mehrfach mit einem Spezialöl. Feuchtigkeit an den Stoßfugen sofort wegwischen, zum Schneiden ein Brett nehmen, heiße Töpfe nicht direkt abstellen.",
        },
        {
          label: "Flecken",
          text: "Hartnäckige Flecken lassen sich mit Schleifschwamm (P 180) oder Schleifpapier (P 240) entfernen. Danach muss die Stelle nachgeölt werden.",
        },
        { label: "Auffrischen", text: WOOD_REFRESH_DE },
        { label: "Nicht verwenden", text: WOOD_AVOID_DE },
      ],
    },
    en: {
      intro:
        "Wood takes up moisture and gives it off again. Small gaps or offsets usually close when the humidity in the room changes. Over the years, light changes the colour.",
      rows: [
        { label: "Daily cleaning", text: WOOD_CLEAN_EN },
        {
          label: "Worktops",
          text: "We oil solid-wood worktops several times with a special oil. Wipe away moisture at the joints at once, use a board for cutting, and do not put hot pots straight on the wood.",
        },
        {
          label: "Stains",
          text: "Stubborn stains come out with a sanding sponge (P 180) or sandpaper (P 240). The spot must be oiled again afterwards.",
        },
        { label: "Refreshing", text: WOOD_REFRESH_EN },
        { label: "Do not use", text: WOOD_AVOID_EN },
      ],
    },
  },
  furnier: {
    de: {
      intro:
        "Die Hinweise gelten für geölte und gewachste Holzflächen, ob massiv oder furniert. Mit den Jahren verändert Licht den Farbton.",
      rows: [
        { label: "Täglich reinigen", text: WOOD_CLEAN_DE },
        { label: "Auffrischen", text: WOOD_REFRESH_DE },
        { label: "Nicht verwenden", text: WOOD_AVOID_DE },
      ],
    },
    en: {
      intro:
        "These notes apply to oiled and waxed wood surfaces, solid or veneered. Over the years, light changes the colour.",
      rows: [
        { label: "Daily cleaning", text: WOOD_CLEAN_EN },
        { label: "Refreshing", text: WOOD_REFRESH_EN },
        { label: "Do not use", text: WOOD_AVOID_EN },
      ],
    },
  },
  lack: {
    de: {
      intro:
        "Lackierte Fronten werden in mehreren Arbeitsgängen mit Speziallack beschichtet. Licht und Wärme lassen den Farbton über die Jahre langsam nachdunkeln.",
      rows: [
        {
          label: "Täglich reinigen",
          text: "Mildes Spülmittel in Wasser genügt, ein Spezialreiniger ist nicht nötig. Sofort mit einem weichen, trockenen Tuch nachtrocknen.",
        },
        {
          label: "Ohne Schlieren",
          text: "Nach dem ersten Wischen mit einem zweiten feuchten Tuch ohne Reinigungsmittel nachwischen, dann trocknen.",
        },
        {
          label: "Darauf achten",
          text: "Rauch, Dampf und manche Lebensmittel können die Oberfläche verfärben.",
        },
        {
          label: "Nicht verwenden",
          text: "Mikrofasertücher auf Dauer und starkes Reiben, Scheuermittel, Stahlwolle, Poliermittel, Bleichmittel, starke Säuren, Lösungsmittel wie Ammoniak oder Alkohol, Dampfreiniger.",
        },
      ],
    },
    en: {
      intro:
        "Lacquered fronts are coated with a special lacquer in several passes. Light and warmth slowly darken the colour over the years.",
      rows: [
        {
          label: "Daily cleaning",
          text: "Mild washing-up liquid in water is enough; no special cleaner is needed. Dry at once with a soft, dry cloth.",
        },
        {
          label: "Without streaks",
          text: "After the first wipe, go over the surface with a second damp cloth without cleaner, then dry it.",
        },
        {
          label: "Watch out for",
          text: "Smoke, steam and some foods can discolour the surface.",
        },
        {
          label: "Do not use",
          text: "Microfibre cloths in the long run and hard rubbing, scouring agents, steel wool, polish, bleach, strong acids, solvents such as ammonia or alcohol, steam cleaners.",
        },
      ],
    },
  },
};

export function careCopy(key: CareKey | undefined, locale: string): CareCopy | null {
  if (!key) {
    return null;
  }
  return CARE[key][locale === "en" ? "en" : "de"];
}
