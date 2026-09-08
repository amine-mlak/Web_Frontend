import type { SbBlokData } from "@storyblok/react/rsc";
import BlokFrame from "@/components/storyblok/BlokFrame";
import { storyblokAsset } from "@/lib/storyblok-asset";

const FALLBACK =
  "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1800&q=80";

export default function Hero({ blok }: { blok: SbBlokData }) {
  const image = storyblokAsset(blok.image, FALLBACK, "Küche");

  return (
    <BlokFrame
      blok={blok}
      name="Hero"
      id="hero"
      className="relative isolate min-h-[70vh] bg-nacht text-paper"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-nacht/55" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-end px-6 pt-24 pb-20 md:px-10">
        {typeof blok.eyebrow === "string" && blok.eyebrow ? (
          <p className="type-eyebrow text-messing">{blok.eyebrow}</p>
        ) : null}
        <h1 className="type-h1 mt-4 max-w-3xl text-paper">
          {String(blok.headline || "Storyblok Landing")}
        </h1>
        {typeof blok.text === "string" && blok.text ? (
          <p className="type-body mt-6 max-w-2xl text-paper/85">{blok.text}</p>
        ) : null}
        {typeof blok.cta_label === "string" && blok.cta_label ? (
          <a
            href={String(blok.cta_href || "#kontakt")}
            className="pill pill-primary mt-8 w-fit"
          >
            {blok.cta_label}
          </a>
        ) : null}
      </div>
    </BlokFrame>
  );
}
