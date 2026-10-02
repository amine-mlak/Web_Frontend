import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { PresentedBranch } from "@/lib/collection-present";
import type { Locale } from "@/lib/i18n";

function hashId(href?: string) {
  if (!href?.includes("#")) {
    return undefined;
  }
  return href.slice(href.indexOf("#") + 1);
}

function Continue({
  href,
  label,
  invert,
}: {
  href?: string;
  label: string;
  invert?: boolean;
}) {
  if (!href) {
    return null;
  }

  return (
    <LocaleLink
      href={href}
      className={invert ? "pill pill-ghost-dark mt-10" : "pill pill-secondary mt-10"}
    >
      {label}
    </LocaleLink>
  );
}

function Swatch({ hex, invert }: { hex?: string; invert?: boolean }) {
  if (!hex) {
    return null;
  }

  return (
    <p className="mt-4 flex items-center gap-3">
      <span
        className="size-4 rounded-full border border-line"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <span className={`type-eyebrow ${invert ? "text-paper/70" : "text-muted"}`}>
        {hex}
      </span>
    </p>
  );
}

function Points({
  points,
  invert,
}: {
  points: string[];
  invert?: boolean;
}) {
  if (points.length === 0) {
    return null;
  }

  return (
    <ul className="mt-8 space-y-0">
      {points.map((point, index) => (
        <li
          key={point}
          className={`flex gap-4 border-t py-3 font-sans text-[15px] leading-relaxed ${
            invert ? "border-paper/20 text-paper/80" : "border-line text-muted"
          }`}
        >
          <span
            className={`type-eyebrow shrink-0 ${invert ? "text-messing" : "text-gold"}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ChapterSpread({
  branch,
  index,
  locale,
  continueLabel,
}: {
  branch: PresentedBranch;
  index: number;
  locale: Locale;
  continueLabel: string;
}) {
  const variant = index % 5;
  const id = hashId(branch.href) ?? `kapitel-${index + 1}`;
  const kicker =
    locale === "en" ? `Chapter ${branch.kicker}` : `Kapitel ${branch.kicker}`;

  if (variant === 0) {
    return (
      <article id={id} className="relative bg-paper px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
        <div className="relative mx-auto max-w-[90rem]">
          <figure className="relative min-h-[78vh] overflow-hidden bg-nacht md:w-[70%]">
            <CmsImage
              src={branch.image}
              srcSet={branch.srcSet}
              alt={branch.alt}
              fill
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover"
            />
            <figcaption className="absolute bottom-6 left-6 font-sans text-[11px] tracking-[0.18em] text-paper/85 uppercase">
              {branch.caption}
            </figcaption>
          </figure>
          <div className="relative z-10 -mt-16 border border-line bg-paper px-8 py-10 shadow-[0_30px_80px_rgba(20,20,20,0.08)] md:absolute md:top-1/2 md:right-0 md:mt-0 md:w-[min(36rem,44%)] md:-translate-y-1/2 md:px-12 md:py-16">
            <p className="font-serif text-[72px] leading-none font-medium text-ink/[0.06] md:text-[96px]">
              {branch.kicker}
            </p>
            <p className="type-eyebrow -mt-8 text-gold">{kicker}</p>
            <Swatch hex={branch.hex} />
            <h2 className="mt-4 font-serif text-[32px] leading-[1.06] font-medium tracking-[-0.03em] text-ink md:text-[44px]">
              {branch.href ? (
                <LocaleLink href={branch.href}>{branch.title}</LocaleLink>
              ) : (
                branch.title
              )}
            </h2>
            <p className="type-body mt-5">{branch.text}</p>
            <Points points={branch.points} />
            <Continue href={branch.href} label={continueLabel} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === 1) {
    return (
      <article id={id} className="relative min-h-[92vh] overflow-hidden bg-nacht">
        <CmsImage
          src={branch.image}
          srcSet={branch.srcSet}
          alt={branch.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-nacht via-nacht/25 to-nacht/20"
          aria-hidden="true"
        />
        <div className="relative z-10 flex min-h-[92vh] flex-col justify-end">
          <div className="grid gap-8 bg-paper px-5 py-10 sm:px-8 md:grid-cols-12 md:items-end lg:px-14 lg:py-14">
            <div className="md:col-span-5">
              <p className="type-eyebrow text-gold">{kicker}</p>
              <Swatch hex={branch.hex} />
              <h2 className="mt-3 font-serif text-[32px] leading-[1.06] font-medium tracking-[-0.03em] text-ink md:text-[44px]">
                {branch.href ? (
                  <LocaleLink href={branch.href}>{branch.title}</LocaleLink>
                ) : (
                  branch.title
                )}
              </h2>
            </div>
            <div className="md:col-span-7 md:max-w-2xl">
              <p className="type-intro">{branch.text}</p>
              <Points points={branch.points} />
              <Continue href={branch.href} label={continueLabel} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 2) {
    return (
      <article
        id={id}
        className="grid items-center gap-8 bg-karte px-5 py-16 sm:px-8 md:grid-cols-12 md:gap-10 lg:px-14 lg:py-28"
      >
        <div className="grid grid-cols-2 gap-3 md:col-span-7">
          <figure className="relative col-span-2 aspect-[16/10] overflow-hidden bg-nacht">
            <CmsImage
              src={branch.image}
              srcSet={branch.srcSet}
              alt={branch.alt}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
            />
          </figure>
          <figure className="relative aspect-[4/5] overflow-hidden bg-nacht">
            <CmsImage
              src={branch.imageB}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 28vw"
              className="object-cover"
            />
          </figure>
          <figure className="relative aspect-[4/5] overflow-hidden bg-nacht">
            <CmsImage
              src={branch.imageC}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 28vw"
              className="object-cover"
            />
            <figcaption className="absolute right-3 bottom-3 font-sans text-[10px] tracking-[0.16em] text-paper uppercase">
              {branch.caption}
            </figcaption>
          </figure>
        </div>
        <div className="md:col-span-5 md:pl-4 lg:pl-8">
          <p className="font-serif text-[80px] leading-none font-medium text-ink/[0.07] md:text-[128px]">
            {branch.kicker}
          </p>
          <p className="type-eyebrow -mt-8 text-gold md:-mt-14">{kicker}</p>
          <Swatch hex={branch.hex} />
          <h2 className="mt-4 font-serif text-[32px] leading-[1.06] font-medium tracking-[-0.03em] text-ink md:text-[44px]">
            {branch.href ? (
              <LocaleLink href={branch.href}>{branch.title}</LocaleLink>
            ) : (
              branch.title
            )}
          </h2>
          <p className="type-intro mt-6">{branch.text}</p>
          <Points points={branch.points} />
          <Continue href={branch.href} label={continueLabel} />
        </div>
      </article>
    );
  }

  if (variant === 3) {
    return (
      <article
        id={id}
        className="grid min-h-[36rem] overflow-hidden bg-nacht md:grid-cols-2"
      >
        <figure className="relative min-h-[24rem] md:min-h-[42rem]">
          <CmsImage
            src={branch.image}
            srcSet={branch.srcSet}
            alt={branch.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </figure>
        <div className="flex flex-col justify-center px-8 py-16 sm:px-12 lg:px-16">
          <p className="type-eyebrow text-messing">{kicker}</p>
          <Swatch hex={branch.hex} invert />
          <h2 className="mt-5 font-serif text-[34px] leading-[1.06] font-medium tracking-[-0.03em] text-paper italic md:text-[48px]">
            {branch.href ? (
              <LocaleLink href={branch.href} className="hover:opacity-80">
                {branch.title}
              </LocaleLink>
            ) : (
              branch.title
            )}
          </h2>
          <p className="mt-6 font-sans text-[16px] leading-relaxed font-light text-paper/80 md:text-[18px]">
            {branch.text}
          </p>
          <Points points={branch.points} invert />
          <Continue href={branch.href} label={continueLabel} invert />
        </div>
      </article>
    );
  }

  return (
    <article
      id={id}
      className="grid items-center gap-10 bg-paper px-5 py-16 sm:px-8 md:grid-cols-12 lg:px-14 lg:py-28"
    >
      <div className="md:col-span-5 lg:pr-8">
        <p className="type-eyebrow text-gold">{kicker}</p>
        <Swatch hex={branch.hex} />
        <h2 className="mt-4 font-serif text-[32px] leading-[1.06] font-medium tracking-[-0.03em] text-ink md:text-[44px]">
          {branch.href ? (
            <LocaleLink href={branch.href}>{branch.title}</LocaleLink>
          ) : (
            branch.title
          )}
        </h2>
        <p className="type-intro mt-6">{branch.text}</p>
        <Points points={branch.points} />
        <Continue href={branch.href} label={continueLabel} />
      </div>
      <div className="relative pb-20 md:col-span-7 md:pb-28">
        <figure className="relative aspect-[4/5] w-[78%] overflow-hidden bg-nacht">
          <CmsImage
            src={branch.image}
            srcSet={branch.srcSet}
            alt={branch.alt}
            fill
            sizes="(max-width: 768px) 80vw, 40vw"
            className="object-cover"
          />
        </figure>
        <figure className="absolute right-0 bottom-[-8%] aspect-[5/4] w-[52%] overflow-hidden border-[10px] border-paper bg-nacht shadow-[0_20px_50px_rgba(20,20,20,0.16)]">
          <CmsImage
            src={branch.imageB}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 30vw"
            className="object-cover"
          />
          <figcaption className="absolute bottom-3 left-3 font-sans text-[10px] tracking-[0.16em] text-paper uppercase">
            {branch.caption}
          </figcaption>
        </figure>
      </div>
    </article>
  );
}
