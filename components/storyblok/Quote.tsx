import BlokFrame from "@/components/storyblok/BlokFrame";
import type { SbBlokData } from "@storyblok/react/rsc";

export default function Quote({ blok }: { blok: SbBlokData }) {
  return (
    <BlokFrame
      blok={blok}
      name="Zitat"
      className="bg-nacht px-6 pt-20 pb-16 text-paper"
    >
      <figure className="mx-auto max-w-3xl text-center">
        <blockquote className="type-h2 text-paper">
          {String(blok.quote || "")}
        </blockquote>
        {(blok.author || blok.role) && (
          <figcaption className="mt-8 type-body text-messing">
            {blok.author ? <span>{String(blok.author)}</span> : null}
            {blok.author && blok.role ? <span> · </span> : null}
            {blok.role ? <span>{String(blok.role)}</span> : null}
          </figcaption>
        )}
      </figure>
    </BlokFrame>
  );
}
