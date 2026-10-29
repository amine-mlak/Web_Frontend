import LocaleLink from "@/components/LocaleLink";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The page's own call to action plus the site's standard next steps
 * (book an appointment, plan the kitchen, call), without repeating one
 * the page already offers. Used at the end of every detail and hub page.
 */
const STEPS: Record<Locale, { href: string; label: string }[]> = {
  de: [
    { href: "/beratung", label: "Termin vereinbaren" },
    { href: "/beratung", label: "Küche planen" },
    { href: "tel:+498168909910", label: "08168 909910" },
  ],
  en: [
    { href: "/beratung", label: "Book an appointment" },
    { href: "/beratung", label: "Plan your kitchen" },
    { href: "tel:+498168909910", label: "+49 8168 909910" },
  ],
};

function samePlace(a: string, b: string) {
  const path = (href: string) => href.split("#")[0].replace(/\/$/, "") || "/";
  return path(a) === path(b);
}

export default function NextSteps({
  primary,
  locale,
  tone = "light",
  className,
}: {
  primary?: { href?: string; label?: string };
  locale: Locale;
  /** "dark" on dark backgrounds (bg-nacht), "light" on paper. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const main = primary?.href && primary.label ? { href: primary.href, label: primary.label } : STEPS[locale][0];
  const more = STEPS[locale].filter((step) => !samePlace(step.href, main.href)).slice(0, 2);
  const secondary = tone === "dark" ? "pill pill-ghost-dark" : "pill pill-secondary";

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <LocaleLink href={main.href} className={tone === "dark" ? "pill pill-light" : "pill pill-primary"}>
        {main.label}
      </LocaleLink>
      {more.map((step) =>
        step.href.startsWith("tel:") ? (
          <a key={step.href} href={step.href} className={cn(secondary, "inline-flex items-center gap-2")} data-umami-event="tel_click">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="h-4 w-4">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" strokeLinejoin="round" />
            </svg>
            {step.label}
          </a>
        ) : (
          <LocaleLink key={step.href} href={step.href} className={secondary}>
            {step.label}
          </LocaleLink>
        ),
      )}
    </div>
  );
}
