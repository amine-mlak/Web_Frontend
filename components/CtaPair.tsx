import LocaleLink from "@/components/LocaleLink";
import { MAIN_ACTIONS, ctaHref, mainAction, type MainAction } from "@/lib/cta";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * A page opener's call to action in the site's three button styles: the dark pill on light
 * ground, the light pill on photos and dark ground, and beside it the quieter second way as an
 * underlined link.
 *
 * The second way is the other main action (appointment or planner) and appears by itself when
 * the button is one of the two. A button that leads elsewhere ("Küchen entdecken") stands alone
 * unless `second` names the action to put beside it.
 */
export default function CtaPair({
  href,
  label,
  locale,
  tone = "light",
  second,
  placement = "hero",
  className,
}: {
  href: string | undefined;
  label: string;
  locale: Locale;
  /** "light": on paper. "image": on a photo or dark ground. */
  tone?: "light" | "image";
  second?: MainAction | false;
  placement?: string;
  className?: string;
}) {
  const target = ctaHref(href, label);
  const kind = mainAction(target);
  const other: MainAction | undefined = second === false ? undefined : (second ?? (kind === "termin" ? "planner" : kind === "planner" ? "termin" : undefined));
  const more = other && other !== kind ? MAIN_ACTIONS[other] : undefined;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-7 gap-y-4", className)}>
      <LocaleLink
        href={target}
        className={tone === "image" ? "pill pill-light" : "pill pill-primary"}
        data-umami-event={kind ? MAIN_ACTIONS[kind].event : undefined}
        data-umami-event-placement={placement}
      >
        {label}
      </LocaleLink>
      {more ? (
        <LocaleLink href={more.href} className={tone === "image" ? "btn-quiet text-paper" : "btn-quiet"} data-umami-event={more.event} data-umami-event-placement={placement}>
          {more.label[locale]}
        </LocaleLink>
      ) : null}
    </div>
  );
}
