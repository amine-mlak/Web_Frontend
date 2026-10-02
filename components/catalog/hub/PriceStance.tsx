export default function PriceStance({ line }: { line: string }) {
  return (
    <section className="bg-nacht" aria-label={line}>
      <p className="mx-auto max-w-4xl px-6 py-12 text-center font-serif text-[26px] leading-[1.2] font-medium tracking-[-0.02em] text-paper italic sm:py-16 md:text-[34px] lg:text-[40px]">
        {line}
      </p>
    </section>
  );
}
