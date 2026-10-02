export default function Interlude({
  quote,
  source,
}: {
  quote: string;
  source: string;
}) {
  return (
    <section className="border-y border-line bg-gold-soft">
      <blockquote className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20 lg:py-24">
        <p className="font-serif text-[26px] leading-[1.3] font-medium tracking-[-0.02em] text-ink italic md:text-[34px]">
          „{quote}“
        </p>
        <footer className="type-eyebrow mt-8 text-muted">{source}</footer>
      </blockquote>
    </section>
  );
}
