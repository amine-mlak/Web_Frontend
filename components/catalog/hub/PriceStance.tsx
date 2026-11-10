export default function PriceStance({ line }: { line: string }) {
  return (
    <section className="bg-nacht" aria-label={line}>
      <p className="t-lead mx-auto max-w-4xl px-6 py-12 text-center text-paper sm:py-16">
        {line}
      </p>
    </section>
  );
}
