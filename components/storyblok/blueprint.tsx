import {
  StoryblokServerComponent,
  StoryblokServerRichText,
  storyblokEditable,
} from "@storyblok/react/rsc";
import type { SbBlokData } from "@storyblok/react/rsc";
import BlokFrame, { blokSectionName } from "@/components/storyblok/BlokFrame";
import { storyblokAsset } from "@/lib/storyblok-asset";
import {
  asBloks,
  headlineParts,
  headlinePlain,
  isRichText,
  storyblokHref,
} from "@/lib/storyblok-fields";

function Headline({
  value,
  className,
}: {
  value: unknown;
  className?: string;
}) {
  return (
    <span className={className}>
      {headlineParts(value).map((part, index) => (
        <span
          key={`${part.text}-${index}`}
          className={part.highlight ? "text-gold" : undefined}
        >
          {part.text}
        </span>
      ))}
    </span>
  );
}

function RichText({ value, className }: { value: unknown; className?: string }) {
  if (typeof value === "string" && value) {
    return <p className={className}>{value}</p>;
  }
  if (!isRichText(value)) return null;
  return (
    <div
      className={`[&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:font-semibold ${className ?? ""}`}
    >
      <StoryblokServerRichText document={value} />
    </div>
  );
}

export function DefaultPage({ blok }: { blok: SbBlokData }) {
  const body = asBloks(blok.body);
  return (
    <main {...storyblokEditable(blok)} className="bg-stone text-ink">
      <div className="flex flex-col gap-3 p-3 md:p-4">
        {body.map((nested) => (
          <StoryblokServerComponent blok={nested} key={nested._uid} />
        ))}
      </div>
    </main>
  );
}

export function BlueprintButton({ blok }: { blok: SbBlokData }) {
  const href = storyblokHref(blok.link);
  const dark =
    String(blok.background_color || "").includes("dark") ||
    String(blok.text_color || "") === "white";
  return (
    <a
      {...storyblokEditable(blok)}
      href={href}
      className={dark ? "pill pill-primary" : "pill border border-line bg-paper text-ink"}
    >
      {String(blok.label || "Weiter")}
    </a>
  );
}

export function HeroSection({ blok }: { blok: SbBlokData }) {
  const image = storyblokAsset(blok.image, "", String(blok.eyebrow || "Hero"));
  const buttons = asBloks(blok.buttons);

  return (
    <BlokFrame
      blok={blok}
      name="Hero"
      id="hero"
      className="grid min-h-[70vh] bg-nacht text-paper lg:grid-cols-2"
    >
      <div className="flex flex-col justify-center px-6 pt-20 pb-16 md:px-12">
        {typeof blok.eyebrow === "string" && blok.eyebrow ? (
          <p className="type-eyebrow text-messing">{blok.eyebrow}</p>
        ) : null}
        <h1 className="type-h1 mt-4 max-w-xl text-paper">
          <Headline value={blok.headline} />
        </h1>
        {typeof blok.text === "string" && blok.text ? (
          <p className="type-body mt-6 max-w-xl text-paper/80">{blok.text}</p>
        ) : null}
        {buttons.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {buttons.map((button) => (
              <StoryblokServerComponent blok={button} key={button._uid} />
            ))}
          </div>
        ) : null}
      </div>
      {image.src ? (
        <div className="relative min-h-[320px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : null}
    </BlokFrame>
  );
}

export function TabbedContentSection({ blok }: { blok: SbBlokData }) {
  const entries = asBloks(blok.entries);
  return (
    <BlokFrame blok={blok} name="Tabs" className="bg-paper px-6 pt-20 pb-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="type-h2 text-ink">
          <Headline value={blok.headline} />
        </h2>
        {typeof blok.lead === "string" && blok.lead ? (
          <p className="type-body mt-4 max-w-3xl">{blok.lead}</p>
        ) : null}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {entries.map((entry) => (
            <StoryblokServerComponent blok={entry} key={entry._uid} />
          ))}
        </div>
      </div>
    </BlokFrame>
  );
}

export function TabbedContentEntry({ blok }: { blok: SbBlokData }) {
  const image = storyblokAsset(blok.image, "", String(blok.headline || ""));
  return (
    <BlokFrame
      blok={blok}
      name="Eintrag"
      nested
      as="article"
      className="border border-line bg-karte"
    >
      {image.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} className="h-48 w-full object-cover" />
      ) : null}
      <div className="p-6 pt-14">
        <h3 className="type-h3 text-ink">{String(blok.headline || "")}</h3>
        <div className="type-body mt-3">
          <RichText value={blok.description} />
        </div>
      </div>
    </BlokFrame>
  );
}

export function GridSection({ blok }: { blok: SbBlokData }) {
  const cards = asBloks(blok.cards);
  const buttons = asBloks(blok.button);
  const colKey = String(blok.cols || "3");
  const cols =
    colKey === "4"
      ? "md:grid-cols-4"
      : colKey === "2"
        ? "md:grid-cols-2"
        : "md:grid-cols-3";
  const dark = String(blok.background_color || "").includes("primary");
  const lead = String(blok.lead || "");
  const sectionId = lead.includes("Kacheln")
    ? "kacheln"
    : lead.includes("Weg")
      ? "ablauf"
      : lead.includes("Küchenwelten")
        ? "entdecken"
        : undefined;
  return (
    <BlokFrame
      blok={blok}
      name={blokSectionName(blok)}
      id={sectionId}
      className={`px-6 pt-20 pb-16 ${dark ? "bg-gold-soft" : "bg-paper"}`}
    >
      <div className="mx-auto max-w-6xl">
        {typeof blok.lead === "string" && blok.lead ? (
          <p className="type-eyebrow text-gold">{blok.lead}</p>
        ) : null}
        <h2 className="type-h2 mt-3 text-ink">
          <Headline value={blok.headline} />
        </h2>
        <div className={`mt-12 grid gap-6 ${cols}`}>
          {cards.map((card) => (
            <StoryblokServerComponent blok={card} key={card._uid} />
          ))}
        </div>
        {buttons.length > 0 ? (
          <div className="mt-10 flex justify-center gap-3">
            {buttons.map((button) => (
              <StoryblokServerComponent blok={button} key={button._uid} />
            ))}
          </div>
        ) : null}
      </div>
    </BlokFrame>
  );
}

export function GridCard({ blok }: { blok: SbBlokData }) {
  const cover = storyblokAsset(
    blok.background_image || blok.icon,
    "",
    String(blok.label || ""),
  );
  const hasCover = Boolean(cover.src);
  const step = typeof blok.bold_text === "string" ? blok.bold_text : "";

  return (
    <BlokFrame
      blok={blok}
      name={blokSectionName(blok)}
      nested
      as="article"
      className="border border-line bg-karte"
    >
      {hasCover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover.src}
          alt={cover.alt}
          className="h-64 w-full object-cover"
        />
      ) : null}
      <div className={`p-8 ${hasCover ? "" : "pt-14"}`}>
        {step ? <p className="type-eyebrow text-gold">{step}</p> : null}
        <h3 className="type-h3 mt-2 text-ink">{String(blok.label || "")}</h3>
        {typeof blok.text === "string" && blok.text ? (
          <p className="type-body mt-3">{blok.text}</p>
        ) : null}
      </div>
    </BlokFrame>
  );
}

export function ImageTextSection({ blok }: { blok: SbBlokData }) {
  const image = storyblokAsset(blok.image, "", headlinePlain(blok.headline));
  const buttons = asBloks(blok.buttons);
  const reverse = Boolean(blok.reverse_desktop_layout);
  return (
    <BlokFrame
      blok={blok}
      name="Bild + Text"
      className="bg-paper px-6 pt-20 pb-16"
    >
      <div
        className={`mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          {typeof blok.eyebrow === "string" && blok.eyebrow ? (
            <p className="type-eyebrow text-gold">{blok.eyebrow}</p>
          ) : null}
          <h2 className="type-h2 mt-3 text-ink">
            <Headline value={blok.headline} />
          </h2>
          <div className="type-body mt-5">
            <RichText value={blok.text} />
          </div>
          {buttons.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {buttons.map((button) => (
                <StoryblokServerComponent blok={button} key={button._uid} />
              ))}
            </div>
          ) : null}
        </div>
        {image.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={image.alt}
            className="h-full max-h-[520px] w-full object-cover"
          />
        ) : null}
      </div>
    </BlokFrame>
  );
}

export function NewsletterFormSection({ blok }: { blok: SbBlokData }) {
  const buttons = asBloks(blok.button);
  return (
    <BlokFrame
      blok={blok}
      name="Call-to-Action"
      id="beratung"
      className="bg-nacht px-6 pt-20 pb-16 text-center text-paper"
    >
      <h2 className="type-h2 mx-auto max-w-3xl text-paper">
        <Headline value={blok.headline} />
      </h2>
      {buttons.length > 0 ? (
        <div className="mt-8 flex justify-center gap-3">
          {buttons.map((button) => (
            <StoryblokServerComponent blok={button} key={button._uid} />
          ))}
        </div>
        ) : null}
    </BlokFrame>
  );
}

export function FaqSection({ blok }: { blok: SbBlokData }) {
  const entries = asBloks(blok.faq_entries);
  return (
    <BlokFrame
      blok={blok}
      name="FAQ"
      id="faq"
      className="bg-paper px-6 pt-20 pb-16"
    >
      <div className="mx-auto max-w-3xl">
        {typeof blok.lead === "string" && blok.lead ? (
          <p className="type-eyebrow text-gold">{blok.lead}</p>
        ) : null}
        <h2 className="type-h2 mt-3 text-ink">
          <Headline value={blok.headline} />
        </h2>
        <div className="mt-10 flex flex-col gap-3">
          {entries.map((entry) => (
            <StoryblokServerComponent blok={entry} key={entry._uid} />
          ))}
        </div>
      </div>
    </BlokFrame>
  );
}

export function FaqEntry({ blok }: { blok: SbBlokData }) {
  return (
    <BlokFrame
      blok={blok}
      name="Frage"
      nested
      as="div"
      className="border border-line bg-karte"
    >
      <details className="px-4 pt-12 pb-5">
        <summary className="type-h3 cursor-pointer list-none text-ink [&::-webkit-details-marker]:hidden">
          {String(blok.question || "")}
        </summary>
        <div className="type-body mt-3">
          <RichText value={blok.answer} />
        </div>
      </details>
    </BlokFrame>
  );
}

export function FeaturedArticlesSection({ blok }: { blok: SbBlokData }) {
  const count = Array.isArray(blok.articles) ? blok.articles.length : 0;
  return (
    <BlokFrame blok={blok} name="Artikel" className="bg-paper px-6 pt-20 pb-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="type-h2 text-ink">
          <Headline value={blok.headline} />
        </h2>
        {typeof blok.lead === "string" && blok.lead ? (
          <p className="type-body mt-4 max-w-3xl">{blok.lead}</p>
        ) : null}
        <p className="mt-8 text-sm text-muted">
          {count} Artikel-Referenzen im Space — im Visual Editor klickbar.
        </p>
      </div>
    </BlokFrame>
  );
}

export function BannerReference({ blok }: { blok: SbBlokData }) {
  return (
    <BlokFrame
      blok={blok}
      name="Banner"
      className="bg-karte px-6 pt-16 pb-12 text-center"
    >
      <p className="type-eyebrow text-gold">Storyblok Banner</p>
      <p className="type-body mt-2">
        Banner-Referenz aus dem Space. Inhalt steuert der Visual Editor.
      </p>
    </BlokFrame>
  );
}

export function HeadlineSegment({ blok }: { blok: SbBlokData }) {
  return <span {...storyblokEditable(blok)}>{String(blok.text || "")}</span>;
}
