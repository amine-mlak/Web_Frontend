function isLight(hex: string) {
  const raw = hex.replace("#", "");
  const value =
    raw.length === 3 ? raw.split("").map((char) => `${char}${char}`).join("") : raw;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55;
}

export default function TopicTone({
  hex,
  title,
  line,
}: {
  hex: string;
  title: string;
  line: string;
}) {
  const light = isLight(hex);

  return (
    <section
      className="relative min-h-[44vh] overflow-hidden"
      style={{ backgroundColor: hex }}
      aria-label={title}
    >
      <div className="mx-auto flex min-h-[44vh] max-w-[90rem] flex-col justify-end px-5 py-16 sm:px-8 lg:min-h-[56vh] lg:px-14 lg:py-24">
        <p
          className={`font-sans text-[11px] tracking-[0.28em] uppercase ${
            light ? "text-ink/45" : "text-paper/55"
          }`}
        >
          {hex}
        </p>
        <h2
          className={`mt-4 font-serif text-[40px] leading-[0.92] font-medium tracking-[-0.035em] md:text-[64px] lg:text-[80px] ${
            light ? "text-ink" : "text-paper"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mt-6 max-w-xl font-serif text-[22px] leading-[1.3] font-medium italic md:text-[28px] ${
            light ? "text-ink/70" : "text-paper/75"
          }`}
        >
          {line}
        </p>
      </div>
    </section>
  );
}
