import {
  StoryblokServerComponent,
} from "@storyblok/react/rsc";
import type { SbBlokData } from "@storyblok/react/rsc";
import BlokFrame from "@/components/storyblok/BlokFrame";

export default function FeatureGrid({ blok }: { blok: SbBlokData }) {
  const items = Array.isArray(blok.items) ? (blok.items as SbBlokData[]) : [];

  return (
    <BlokFrame
      blok={blok}
      name="Merkmale"
      className="bg-paper px-6 pt-20 pb-16"
    >
      <div className="mx-auto max-w-6xl">
        {typeof blok.eyebrow === "string" && blok.eyebrow ? (
          <p className="type-eyebrow text-gold">{blok.eyebrow}</p>
        ) : null}
        <h2 className="type-h2 mt-3 max-w-2xl text-ink">
          {String(blok.title || "")}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <StoryblokServerComponent blok={item} key={item._uid} />
          ))}
        </div>
      </div>
    </BlokFrame>
  );
}
