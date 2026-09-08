import { StoryblokServerComponent } from "@storyblok/react/rsc";
import type { SbBlokData } from "@storyblok/react/rsc";
import BlokFrame from "@/components/storyblok/BlokFrame";

export default function Grid({ blok }: { blok: SbBlokData }) {
  const columns = Array.isArray(blok.columns)
    ? (blok.columns as SbBlokData[])
    : [];

  return (
    <BlokFrame blok={blok} name="Raster" className="bg-paper px-6 pt-20 pb-16">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <StoryblokServerComponent blok={column} key={column._uid} />
        ))}
      </div>
    </BlokFrame>
  );
}
