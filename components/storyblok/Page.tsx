import {
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";
import type { SbBlokData } from "@storyblok/react/rsc";

export default function Page({ blok }: { blok: SbBlokData }) {
  const body = Array.isArray(blok.body) ? (blok.body as SbBlokData[]) : [];

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
