/**
 * The site's two main actions. An appointment is the short way (a few fields on /kontakt),
 * the planner the long one (twelve questions on /beratung). Every button that offers one of
 * them takes its address and wording from here, so they read the same on every page.
 */
export const TERMIN_HREF = "/kontakt#termin";
export const PLANNER_HREF = "/beratung";

export type MainAction = "termin" | "planner";

export const MAIN_ACTIONS = {
  termin: { href: TERMIN_HREF, label: { de: "Termin vereinbaren", en: "Book an appointment" }, event: "cta_termin" },
  planner: { href: PLANNER_HREF, label: { de: "Küche planen", en: "Plan your kitchen" }, event: "cta_planner" },
} as const;

function pathOf(href: string) {
  return href.split("#")[0].replace(/\/$/, "") || "/";
}

/** Which of the two main actions an address leads to, if any. */
export function mainAction(href: string): MainAction | undefined {
  const path = pathOf(href);
  if (path === PLANNER_HREF) return "planner";
  if (path === pathOf(TERMIN_HREF)) return "termin";
  return undefined;
}

/**
 * Where a button really goes. Many buttons were written before the appointment form existed and
 * point at the planner while their wording promises a talk ("Termin anfragen", "Küche besprechen",
 * "Material mustern"). Those go to the appointment form; only wording about planning keeps the
 * planner. Addresses to any other page stay as they are.
 */
export function ctaHref(href: string | undefined, label: string | undefined) {
  const target = href?.trim() || TERMIN_HREF;
  if (mainAction(target) !== "planner") return target;
  return /plan/i.test(label ?? "") ? target : TERMIN_HREF;
}
