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
        <p className="t-lead text-ink">
          „{quote}“
        </p>
        <footer className="mt-8 font-sans text-[14px] text-muted">{source}</footer>
      </blockquote>
    </section>
  );
}
