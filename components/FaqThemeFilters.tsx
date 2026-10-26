import LocaleLink from "@/components/LocaleLink";
import type { FaqTheme } from "@/lib/faq";
import type { Locale } from "@/lib/i18n";

export default function FaqThemeFilters({
  themes,
  activeSlug,
  locale = "de",
}: {
  themes: FaqTheme[];
  activeSlug?: string;
  locale?: Locale;
}) {
  const chipClass = (active: boolean) =>
    `type-nav inline-flex min-h-10 items-center border px-3 transition-colors ${
      active
        ? "border-ink bg-ink text-paper"
        : "border-line bg-white text-ink hover:border-ink"
    }`;

  return (
    <nav aria-label={locale === "en" ? "FAQ by topic" : "FAQ nach Thema"} className="mt-10 flex flex-wrap gap-2">
      <LocaleLink href="/faq" className={chipClass(!activeSlug)} aria-current={!activeSlug ? "page" : undefined}>
        {locale === "en" ? "All questions" : "Alle Fragen"}
      </LocaleLink>
      {themes.map((theme) => (
        <LocaleLink
          key={theme.slug}
          href={`/faq/${theme.slug}`}
          className={chipClass(activeSlug === theme.slug)}
          aria-current={activeSlug === theme.slug ? "page" : undefined}
        >
          {theme.name}
        </LocaleLink>
      ))}
    </nav>
  );
}
