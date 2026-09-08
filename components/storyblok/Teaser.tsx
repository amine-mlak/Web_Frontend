import BlokFrame from "@/components/storyblok/BlokFrame";
import type { SbBlokData } from "@storyblok/react/rsc";

export default function Teaser({ blok }: { blok: SbBlokData }) {
  return (
    <BlokFrame
      blok={blok}
      name="Teaser"
      className="bg-nacht px-6 pt-24 pb-20 text-center text-paper"
    >
      <p className="type-eyebrow text-messing">Storyblok</p>
      <h1 className="type-h1 mx-auto mt-4 max-w-4xl text-paper">
        {String(blok.headline || "")}
      </h1>
    </BlokFrame>
  );
}
