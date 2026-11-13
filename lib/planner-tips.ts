import type { PlannerContent, PlannerGroupKey } from "@/lib/kitchen-planner-model";
import type { PlannerAnswers } from "@/lib/planner-lead";

/**
 * Reading tips for the follow-up mail after the planner: for the four answers that say most
 * about a kitchen (style, fronts, worktop, layout) the page on the website that shows it.
 * Each tip is a page title, its address and, where the visitor picked a photo, that photo.
 */
export type PlannerTip = { title: string; link: string; image: string };

const SITE = "https://www.beer.de";
const UPLOADS = "https://cms.beer.de/uploads/";

type Target = { title: string; path: string };

/** Shown when the picked option has no photo, e.g. "decide on site". The mail needs one either way. */
const FALLBACK_IMAGE = {
  style: UPLOADS + "large_landhauskuechen_kuechen_ideen_b79ccce433.jpg",
  front: UPLOADS + "large_Luxurioese_Kontrastkueche_7_da4eb5c38e.jpg",
  top: UPLOADS + "large_076_Showroom_9551399c54.jpg",
  form: "",
};

/** Answer of the planner -> page. The first entry of a group is used when nothing fits. */
const TARGETS: Record<"style" | "front" | "top" | "form", { fallback: Target; byValue: Record<string, Target> }> = {
  style: {
    fallback: { title: "Küchenstile", path: "/kuechen/stile" },
    byValue: {
      "modern-schlicht": { title: "Moderne Küchen", path: "/kuechen/stile/modern" },
      skandinavisch: { title: "Holzküchen", path: "/kuechen/stile/holz" },
      "landhaus-klassisch": { title: "Landhausküchen", path: "/kuechen/stile/landhaus" },
      industrial: { title: "Schwarze Küchen", path: "/kuechen/farben/schwarz" },
      natuerlich: { title: "Holzküchen", path: "/kuechen/stile/holz" },
    },
  },
  front: {
    fallback: { title: "Material & Ausstattung", path: "/material" },
    byValue: {
      "hell-weiss": { title: "Weiße Küchen", path: "/kuechen/farben/weiss" },
      dunkel: { title: "Schwarze Küchen", path: "/kuechen/farben/schwarz" },
      kassette: { title: "Fronten in Lack matt", path: "/material/lack-matt" },
      holz: { title: "Fronten in Eiche furniert", path: "/material/eiche-furnier" },
    },
  },
  top: {
    fallback: { title: "Ausstellung in Wolfersdorf", path: "/ausstellung" },
    byValue: {
      naturstein: { title: "Arbeitsplatten aus Naturstein", path: "/material/naturstein" },
      keramik: { title: "Arbeitsplatten aus Keramik", path: "/material/keramik" },
      edelstahl: { title: "Arbeitsplatten aus Edelstahl", path: "/material/edelstahl" },
      massivholz: { title: "Arbeitsplatten aus Massivholz", path: "/material/holz-massiv" },
      dekor: { title: "Fenix", path: "/material/fenix" },
    },
  },
  form: {
    fallback: { title: "Küchenformen", path: "/kuechen/formen" },
    byValue: {
      zeile: { title: "Küchenzeile", path: "/kuechen/formen/zeile" },
      "l-form": { title: "Küche in L-Form", path: "/kuechen/formen/l-form" },
      "u-form": { title: "Küche in U-Form", path: "/kuechen/formen/u-form" },
      insel: { title: "Küche mit Insel", path: "/kuechen/formen/insel" },
    },
  },
};

/** The photo of a planner option as an address a mail program can load. */
function mailImage(src: string | undefined) {
  if (!src) return "";
  const optimised = src.match(/^\/cms-opt\/\d+\/(.+)$/);
  if (optimised) return UPLOADS + optimised[1];
  return src.startsWith("https://") ? src : "";
}

export function plannerTips(details: PlannerAnswers, content: PlannerContent) {
  const tip = (key: keyof typeof TARGETS): PlannerTip => {
    const picked = details.answers[key as PlannerGroupKey] ?? [];
    // The first answer that has a page of its own decides.
    const value = picked.find((item) => TARGETS[key].byValue[item]);
    const target = value ? TARGETS[key].byValue[value] : TARGETS[key].fallback;
    const option = content.groups.find((group) => group.group === key)?.options.find((item) => item.value === (value ?? picked[0]));
    return { title: target.title, link: SITE + target.path, image: mailImage(option?.image?.src) || FALLBACK_IMAGE[key] };
  };
  return { style: tip("style"), front: tip("front"), top: tip("top"), form: tip("form") };
}
