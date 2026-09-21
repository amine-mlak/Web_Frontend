import Link from "next/link";
import type { FaqTheme } from "@/lib/faq";

export default function FaqThemeFilters({
  themes,
  activeSlug,
}: {
  themes: FaqTheme[];
  activeSlug?: string;
}) {
  const chipClass = (active: boolean) =>
    `type-nav border px-3 py-2 transition-colors ${
      active
        ? "border-ink bg-ink text-paper"
        : "border-line bg-white text-ink hover:border-ink"
    }`;

  return (
    <nav aria-label="FAQ nach Thema" className="mt-10 flex flex-wrap gap-2">
      <Link href="/faq" className={chipClass(!activeSlug)}>
        Alle Fragen
      </Link>
      {themes.map((theme) => (
        <Link
          key={theme.slug}
          href={`/faq/${theme.slug}`}
          className={chipClass(activeSlug === theme.slug)}
        >
          {theme.name}
        </Link>
      ))}
    </nav>
  );
}
