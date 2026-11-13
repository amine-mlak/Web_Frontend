import LocaleLink from "@/components/LocaleLink";
import { MAIN_ACTIONS, ctaHref, mainAction, type MainAction } from "@/lib/cta";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The end of a page: one button and, beside it, the quieter ways on.
 *
 * The button is the page's own call to action, or the main action that fits the page ("lead":
 * an appointment by default, the planner on pages people read early on, such as guides and
 * questions). The other main action follows as a text link, so both are always one tap away
 * without two buttons competing. The phone number closes the row where there is room for it.
 */
const PHONE: Record<Locale, { href: string; label: string }> = {
  de: { href: "tel:+498168909910", label: "08168 909910" },
  en: { href: "tel:+498168909910", label: "+49 8168 909910" },
};

export default function NextSteps({
  primary,
  locale,
  tone = "light",
  lead = "termin",
  className,
}: {
  primary?: { href?: string; label?: string };
  locale: Locale;
  /** "dark" on dark backgrounds (bg-nacht), "light" on paper. */
  tone?: "light" | "dark";
  /** The main action offered as the button when the page has no call to action of its own. */
  lead?: MainAction;
  className?: string;
}) {
  const own = primary?.href && primary.label ? { href: ctaHref(primary.href, primary.label), label: primary.label } : undefined;
  const main = own ?? { href: MAIN_ACTIONS[lead].href, label: MAIN_ACTIONS[lead].label[locale] };
  const mainKind = mainAction(main.href);
  const others = (["termin", "planner"] as const).filter((kind) => kind !== mainKind);
  const link = tone === "dark" ? "btn-quiet text-paper" : "btn-quiet";

  return (
    <div className={cn("flex flex-wrap items-center gap-x-7 gap-y-4", className)}>
      <LocaleLink
        href={main.href}
        className={tone === "dark" ? "pill pill-light" : "pill pill-primary"}
        data-umami-event={mainKind ? MAIN_ACTIONS[mainKind].event : undefined}
        data-umami-event-placement="page_end"
      >
        {main.label}
      </LocaleLink>
      {others.map((kind) => (
        <LocaleLink key={kind} href={MAIN_ACTIONS[kind].href} className={link} data-umami-event={MAIN_ACTIONS[kind].event} data-umami-event-placement="page_end">
          {MAIN_ACTIONS[kind].label[locale]}
        </LocaleLink>
      ))}
      {others.length < 2 ? (
        <a
          href={PHONE[locale].href}
          className={cn("inline-flex items-center gap-2 font-sans text-[16px] transition-opacity hover:opacity-70", tone === "dark" ? "text-paper" : "text-ink")}
          data-umami-event="tel_click"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="h-4 w-4">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" strokeLinejoin="round" />
          </svg>
          {PHONE[locale].label}
        </a>
      ) : null}
    </div>
  );
}
