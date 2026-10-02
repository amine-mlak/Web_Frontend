import LocaleLink from "@/components/LocaleLink";
import type { ClusterSwatch } from "@/lib/collection-clusters";

function isLight(hex: string) {
  const raw = hex.replace("#", "");
  const value = raw.length === 3 ? raw.split("").map((c) => `${c}${c}`).join("") : raw;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55;
}

export default function ColorField({
  swatches,
  eyebrow,
}: {
  swatches: ClusterSwatch[];
  eyebrow: string;
}) {
  if (swatches.length === 0) {
    return null;
  }

  return (
    <section className="bg-paper" aria-label={eyebrow}>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
        {swatches.map((swatch) => (
          <li key={swatch.href}>
            <LocaleLink href={swatch.href} className="group block">
              <figure
                className="relative min-h-[16rem] overflow-hidden lg:min-h-[28rem]"
                style={{ backgroundColor: swatch.hex }}
              >
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-6 py-6">
                  <span
                    className={`font-serif text-[26px] leading-none font-medium tracking-[-0.02em] ${
                      isLight(swatch.hex) ? "text-ink" : "text-paper"
                    }`}
                  >
                    {swatch.title}
                  </span>
                  <span
                    className={`type-eyebrow ${
                      isLight(swatch.hex) ? "text-ink/60" : "text-paper/70"
                    }`}
                  >
                    {swatch.hex}
                  </span>
                </figcaption>
              </figure>
            </LocaleLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
