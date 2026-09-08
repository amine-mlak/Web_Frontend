import BlokFrame from "@/components/storyblok/BlokFrame";
import type { SbBlokData } from "@storyblok/react/rsc";

export default function Feature({ blok }: { blok: SbBlokData }) {
  return (
    <BlokFrame
      blok={blok}
      name="Merkmal"
      nested
      as="article"
      className="border border-line bg-karte p-8 pt-14"
    >
      <h3 className="type-h3 text-ink">
        {String(blok.title || blok.name || "")}
      </h3>
      {typeof blok.text === "string" && blok.text ? (
        <p className="type-body mt-3">{blok.text}</p>
      ) : null}
    </BlokFrame>
  );
}
