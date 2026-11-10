"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import CmsImage from "@/components/CmsImage";

export type ViewerPhoto = { src: string; srcSet?: string; alt: string; caption?: string };

export type ViewerLabels = { close: string; previous: string; next: string; of: string; title: string };

/**
 * The photos of a page, large: a click on any photo marked with data-photo opens it on a dark
 * full screen. Arrow keys, the two arrows or a swipe go to the next one, Escape closes.
 * It uses the browser's own dialog, so focus and Escape are handled by the browser.
 */
export default function PhotoViewer({
  photos,
  labels,
  children,
}: {
  photos: ViewerPhoto[];
  labels: ViewerLabels;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const swipe = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const lenis = useLenis();
  const open = index !== null;
  const count = photos.length;
  const photo = open ? photos[index] : null;

  // The page behind does not scroll while a photo is open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  // The two neighbours load ahead, so a step shows the next photo at once.
  useEffect(() => {
    if (index === null || count < 2) return;
    for (const by of [1, -1]) {
      const near = photos[(index + by + count) % count];
      const ahead = new window.Image();
      ahead.sizes = "100vw";
      if (near.srcSet) ahead.srcset = near.srcSet;
      ahead.src = near.src;
    }
  }, [index, count, photos]);

  const show = (event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-photo]");
    const next = Number(target?.dataset.photo);
    if (!target || !Number.isInteger(next) || !photos[next]) return;
    setIndex(next);
    dialog.current?.showModal();
  };
  const step = (by: number) =>
    setIndex((current) => (current === null ? current : (current + by + count) % count));
  const close = () => dialog.current?.close();

  const onKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };
  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    swipe.current = event.pointerType === "touch" ? event.clientX : null;
  };
  const onUp = (event: PointerEvent<HTMLDivElement>) => {
    if (swipe.current === null) return;
    const moved = event.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(moved) > 48) step(moved < 0 ? 1 : -1);
  };

  const arrow =
    "flex h-12 w-12 items-center justify-center border border-paper/25 text-paper transition-colors hover:border-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper";

  return (
    <>
      <div onClick={show}>{children}</div>
      <dialog
        ref={dialog}
        aria-label={labels.title}
        onClose={() => setIndex(null)}
        onKeyDown={onKey}
        data-lenis-prevent=""
        className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-nacht p-0 text-paper backdrop:bg-nacht"
      >
        {photo ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <p className="font-sans text-[13px] tracking-[0.18em] text-paper/70 tabular-nums" aria-live="polite">
                {index! + 1} {labels.of} {count}
              </p>
              <button
                type="button"
                onClick={close}
                className="font-sans text-[13px] tracking-[0.18em] text-paper uppercase underline decoration-paper/30 underline-offset-8 transition-colors hover:decoration-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
              >
                {labels.close}
              </button>
            </div>
            <div
              className="relative min-h-0 flex-1 touch-pan-y sm:mx-8 lg:mx-24"
              onPointerDown={onDown}
              onPointerUp={onUp}
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <CmsImage
                key={photo.src}
                src={photo.src}
                srcSet={photo.srcSet}
                alt={photo.alt}
                fill
                priority
                sizes="100vw"
                className="pointer-events-none object-contain"
              />
            </div>
            <div className="flex min-h-[5.5rem] items-center justify-between gap-6 px-5 py-4 sm:px-8">
              <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className={arrow}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M14.5 5 7.5 12l7 7" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
              <p className="max-w-2xl text-center font-sans text-[14px] leading-relaxed text-paper/75">
                {photo.caption}
              </p>
              <button type="button" onClick={() => step(1)} aria-label={labels.next} className={arrow}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="m9.5 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
