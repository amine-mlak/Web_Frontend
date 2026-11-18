import CmsImage from "@/components/CmsImage";
import type { HousePerson } from "@/lib/house-photos";
import type { TeamVoice } from "@/lib/team-voices";

/**
 * The team: one card per person with portrait, full name, role and their own words together.
 * People the CMS text names but who have no portrait yet get a card with their initials; portraits
 * without text follow in a quieter row.
 */
export default function HousePeople({
  eyebrow,
  title,
  people,
  voices = [],
}: {
  eyebrow: string;
  title: string;
  people: HousePerson[];
  voices?: TeamVoice[];
}) {
  const shown = new Set(voices.map((voice) => voice.photo).filter(Boolean));
  const rest = people.filter((person) => !shown.has(person.src));
  if (voices.length === 0 && rest.length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-24 bg-paper" aria-labelledby="house-people-heading">
      <div className="px-5 py-16 sm:px-8 lg:px-gutter lg:py-24">
        <p className="type-eyebrow text-gold">{eyebrow}</p>
        <h2
          id="house-people-heading"
          className="mt-3 max-w-xl font-serif text-[24px] leading-[1.08] font-medium tracking-[-0.03em] text-ink md:text-[32px] xl:text-[42px]"
        >
          {title}
        </h2>

        {voices.length ? (
          <ul className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 xl:grid-cols-4">
            {voices.map((voice) => (
              <li key={voice.name}>
                {/* Phones: small portrait beside name and role, the quote below. Wider: portrait on top. */}
                <article aria-label={voice.name} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-end gap-x-4 sm:block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-karte">
                    {voice.photo ? (
                      <CmsImage
                        src={voice.photo}
                        alt={voice.name}
                        fill
                        sizes="(max-width: 640px) 7rem, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-serif text-[32px] text-ink/25 sm:text-[64px]">
                        {voice.name
                          .split(/\s+/)
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="sm:mt-5">
                    <h3 className="font-serif text-[22px] leading-tight text-ink sm:text-[26px]">{voice.name}</h3>
                    {voice.role ? <p className="mt-1 font-sans text-[11px] tracking-[0.16em] text-gold uppercase sm:text-[12px]">{voice.role}</p> : null}
                  </div>
                  {voice.quote ? (
                    <blockquote className="col-span-2 mt-4 border-l border-messing pl-4 font-sans text-[15px] leading-[1.7] font-light text-ink/85">
                      {voice.locale === "en" ? `“${voice.quote}”` : `„${voice.quote}“`}
                    </blockquote>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        ) : null}

        {rest.length ? (
          <ul className="mt-16 grid grid-cols-2 gap-x-4 gap-y-8 border-t border-line pt-12 sm:grid-cols-3 lg:grid-cols-5">
            {rest.map((person) => (
              <li key={person.src}>
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden bg-karte">
                    <CmsImage
                      src={person.src}
                      alt={person.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <figcaption className="mt-3 font-serif text-[19px] text-ink">{person.name}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
