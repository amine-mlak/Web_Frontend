import type { ReactNode } from "react";
import { Frame, type FrameZoom } from "@/components/catalog/Frame";

export type TriptychPhoto = { src: string; srcSet?: string; alt: string; zoom?: FrameZoom };

/**
 * The opener in three panels: the whole room, the page name set on a close-up, and a detail.
 * On phones the room comes first and the two smaller panels sit side by side below it.
 */
export default function TriptychHero({
  room,
  close,
  detail,
  title,
  meta,
}: {
  room: TriptychPhoto;
  close: TriptychPhoto;
  detail: TriptychPhoto;
  title: ReactNode;
  meta?: string;
}) {
  return (
    <section className="mt-8 grid grid-cols-5 gap-1.5 lg:mt-12 lg:h-[min(84svh,50vw)] lg:grid-cols-12">
      <Frame
        src={room.src}
        srcSet={room.srcSet}
        alt={room.alt}
        className="col-span-5 aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:h-full"
        priority
        sizes="(max-width: 1024px) 100vw, 58vw"
        zoom={room.zoom}
      />
      <div className="relative col-span-3 aspect-[3/4] overflow-hidden lg:col-span-3 lg:aspect-auto lg:h-full">
        <Frame
          src={close.src}
          srcSet={close.srcSet}
          alt={close.alt}
          className="absolute inset-0"
          sizes="(max-width: 1024px) 60vw, 25vw"
          drift
        />
        <span className="absolute inset-0 bg-nacht/45" aria-hidden />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <h1 className="font-serif text-[30px] leading-[1.02] font-medium tracking-[-0.03em] text-paper sm:text-[40px] lg:text-[clamp(2rem,2.6vw,3.25rem)]">
            {title}
          </h1>
          {meta ? (
            <p className="mt-4 font-sans text-[11px] tracking-[0.2em] text-paper/80 uppercase">{meta}</p>
          ) : null}
        </div>
      </div>
      <Frame
        src={detail.src}
        srcSet={detail.srcSet}
        alt={detail.alt}
        className="col-span-2 aspect-[1/2] lg:col-span-2 lg:aspect-auto lg:h-full"
        sizes="(max-width: 1024px) 40vw, 17vw"
        drift
        zoom={detail.zoom}
      />
    </section>
  );
}
