"use client";

import { useState, type ReactNode } from "react";
import CmsImage from "@/components/CmsImage";

export type OpeningPhoto = {
  id: string;
  title: string;
  image: { src: string; srcSet?: string; alt: string };
  /** Heading, text and links of this photo, rendered on the server. */
  panel: ReactNode;
};

/**
 * Several photos side by side as narrow strips; the chosen one opens wide and shows its text.
 * Every text is in the page, only the open one can be reached. On phones the strips lie under
 * each other and open downwards. The sizes and the movement are in globals.css (.slats).
 */
export default function OpeningPhotos({ photos, label }: { photos: OpeningPhoto[]; label: string }) {
  const [active, setActive] = useState(0);

  return (
    <section className="slats" aria-label={label}>
      {photos.map((photo, index) => {
        const open = index === active;
        return (
          <div key={photo.id} className={open ? "slat slat-open" : "slat"}>
            <div className="slat-photo photo-mood">
              <CmsImage
                src={photo.image.src}
                srcSet={photo.image.srcSet}
                alt={open ? photo.image.alt : ""}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                sizes="(max-width: 1024px) 100vw, 64vw"
                className="object-cover"
              />
            </div>
            <span className="slat-shade" aria-hidden />
            <button
              type="button"
              className="slat-button"
              aria-expanded={open}
              aria-controls={`slat-${photo.id}`}
              tabIndex={open ? -1 : undefined}
              onClick={() => setActive(index)}
            >
              <span className="slat-plus" aria-hidden>
                +
              </span>
              <span className="slat-name">{photo.title}</span>
            </button>
            <div id={`slat-${photo.id}`} className="slat-panel" inert={!open}>
              {photo.panel}
            </div>
          </div>
        );
      })}
    </section>
  );
}
