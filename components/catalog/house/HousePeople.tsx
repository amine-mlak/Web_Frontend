import CmsImage from "@/components/CmsImage";
import type { HousePerson } from "@/lib/house-photos";

export default function HousePeople({
  eyebrow,
  title,
  people,
}: {
  eyebrow: string;
  title: string;
  people: HousePerson[];
}) {
  if (people.length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-24 bg-karte" aria-labelledby="house-people-heading">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <p className="type-eyebrow text-gold">{eyebrow}</p>
        <h2
          id="house-people-heading"
          className="mt-3 max-w-xl font-serif text-[32px] leading-[1.08] font-medium tracking-[-0.03em] text-ink md:text-[42px]"
        >
          {title}
        </h2>
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {people.map((person) => (
            <li key={person.src}>
              <figure>
                <div className="relative aspect-[2/3] overflow-hidden bg-nacht">
                  <CmsImage
                    src={person.src}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="mt-3 font-sans text-[12px] tracking-[0.16em] text-ink uppercase">
                  {person.name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
