import Link from "next/link";

export default function FilterChips({
  items,
  activeHref,
}: {
  items: { href: string; label: string }[];
  activeHref?: string;
}) {
  const chip = (active: boolean) =>
    `type-nav border px-3 py-2 transition-colors ${
      active
        ? "border-ink bg-ink text-paper"
        : "border-line bg-white text-ink hover:border-ink"
    }`;

  return (
    <nav aria-label="Filter" className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={chip(item.href === activeHref)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
