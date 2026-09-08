import Link from "next/link";
import type { StoryblokSource } from "@/lib/storyblok";

const BLOCKS = [
  { href: "#hero", label: "Hero" },
  { href: "#kacheln", label: "Küchenfarben" },
  { href: "#ablauf", label: "Ablauf" },
  { href: "#entdecken", label: "Entdecken" },
  { href: "#faq", label: "FAQ" },
  { href: "#beratung", label: "Beratung" },
];

export default function DemoChrome({ source }: { source: StoryblokSource }) {
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span className="w-fit rounded-full bg-[#00b3b0] px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-white uppercase">
            Storyblok
          </span>
          <p className="text-sm text-muted">
            {source === "storyblok"
              ? "Jede umrandete Fläche ist ein Blok — Texte ändern, Bilder tauschen, Reihenfolge verschieben."
              : "Lokaler Fallback — Token fehlt noch"}
          </p>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="text-ink underline-offset-4 hover:underline">
            Strapi
          </Link>
          <Link
            href="/v2"
            className="text-ink underline-offset-4 hover:underline"
          >
            Statisch
          </Link>
          <span className="text-gold">Storyblok</span>
        </nav>
      </div>
      {source === "storyblok" ? (
        <div className="border-t border-line bg-karte/80">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-2">
            <span className="text-[11px] tracking-[0.12em] text-muted uppercase">
              Bloks
            </span>
            {BLOCKS.map((block) => (
              <a
                key={block.href}
                href={block.href}
                className="rounded-full border border-line bg-paper px-2.5 py-1 text-[12px] text-ink hover:border-gold hover:text-gold"
              >
                {block.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
