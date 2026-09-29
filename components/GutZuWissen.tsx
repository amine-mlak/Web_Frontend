const SWATCHES = ["#f4f1ea", "#9a958c", "#1a1a1a", "#d4c4a8"] as const;

export type GutZuWissenContent = {
  eyebrow: string;
  quote: string;
  source: string;
};

export const fallbackGutZuWissen: GutZuWissenContent = {
  eyebrow: "Gut zu wissen",
  quote:
    "Sie müssen nicht wissen, was Sie wollen. Sie müssen nur wissen, was Ihnen gefällt – den Rest sortieren wir gemeinsam.",
  source: "Aus dem ersten Gespräch in unserer Ausstellung Freising",
};

export default function GutZuWissen({
  content,
}: {
  content?: Partial<GutZuWissenContent> | null;
}) {
  const data: GutZuWissenContent = {
    eyebrow: content?.eyebrow?.trim() || fallbackGutZuWissen.eyebrow,
    quote: content?.quote?.trim() || fallbackGutZuWissen.quote,
    source: content?.source?.trim() || fallbackGutZuWissen.source,
  };

  return (
    <section
      aria-labelledby="gut-zu-wissen-heading"
      className="grid md:grid-cols-[minmax(15rem,38%)_1fr]"
    >
      <div className="flex min-h-[14rem] flex-col items-center justify-center bg-[#32261c] px-8 py-14 md:min-h-[18rem] md:py-16">
        <span className="mb-4 block h-px w-10 bg-[#c4a070]" aria-hidden="true" />
        <h2
          id="gut-zu-wissen-heading"
          className="font-sans text-[11px] font-medium tracking-[0.28em] text-[#c4a070] uppercase"
        >
          {data.eyebrow}
        </h2>
        <ul className="mt-6 flex items-center gap-3" aria-hidden="true">
          {SWATCHES.map((color) => (
            <li
              key={color}
              className="size-3.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </ul>
      </div>
      <div className="flex items-center bg-[#c9ae8c] px-8 py-14 sm:px-12 md:min-h-[18rem] md:px-16 lg:px-20">
        <blockquote>
          <p className="max-w-2xl font-serif text-[24px] leading-[1.35] font-medium text-[#f7f1e8] italic md:text-[30px] lg:text-[32px]">
            „{data.quote}“
          </p>
          <footer className="mt-6 font-sans text-[13px] leading-relaxed text-[#f7f1e8]/80 md:text-[14px]">
            {data.source}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
