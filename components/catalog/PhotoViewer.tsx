"use client";

import { useLenis } from "lenis/react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type TransitionEvent,
} from "react";
import CmsImage from "@/components/CmsImage";

export type ViewerPhoto = { src: string; srcSet?: string; alt: string; caption?: string };

export type ViewerLabels = { close: string; previous: string; next: string; of: string; title: string };

/** How long one photo takes to slide out of the way. */
const SLIDE_MS = 420;

/**
 * The photos of a page, large: a click on any photo marked with data-photo opens it on a dark
 * full screen. Arrow keys, the two arrows or a swipe slide to the next one, Escape closes.
 * It uses the browser's own dialog, so focus and Escape are handled by the browser.
 *
 * The photos to either side are already in place (and loading at full size) beside the one shown,
 * so a step slides the next photo in sharp. On a phone the photo follows the finger.
 * With "reduce motion" the photo changes without sliding.
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
  const stage = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number; moving: boolean } | null>(null);
  const settle = useRef<number | undefined>(undefined);
  const [index, setIndex] = useState<number | null>(null);
  /** The step being animated: -1 back, 1 forward, 0 none. */
  const [shift, setShift] = useState(0);
  /** How far a finger has pulled the photo sideways, in pixels. */
  const [drag, setDrag] = useState(0);
  const [sliding, setSliding] = useState(false);
  const lenis = useLenis();
  const open = index !== null;
  const count = photos.length;
  const photo = open ? photos[index] : null;
  const at = (by: number) => ((index ?? 0) + by + count) % count;

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

  useEffect(() => () => window.clearTimeout(settle.current), []);

  const show = (event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-photo]");
    const next = Number(target?.dataset.photo);
    if (!target || !Number.isInteger(next) || !photos[next]) return;
    setIndex(next);
    setShift(0);
    setDrag(0);
    setSliding(false);
    dialog.current?.showModal();
  };

  /** The slide has ended: the photo it brought in becomes the current one, without moving again. */
  const finish = (by: number) => {
    window.clearTimeout(settle.current);
    if (by !== 0) setIndex((current) => (current === null ? current : (current + by + count) % count));
    setShift(0);
    setDrag(0);
    setSliding(false);
  };

  const step = (by: number) => {
    if (count < 2 || shift !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish(by);
      return;
    }
    setSliding(true);
    setShift(by);
    setDrag(0);
    // transitionend can be missed (a hidden tab, a photo that never paints); the step still ends.
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => finish(by), SLIDE_MS + 120);
  };

  const close = () => dialog.current?.close();

  const onKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" || shift !== 0) return;
    swipe.current = { x: event.clientX, y: event.clientY, moving: false };
  };
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = swipe.current;
    if (!state || count < 2) return;
    const dx = event.clientX - state.x;
    if (!state.moving) {
      // Only a sideways pull moves the photo; an upward one is left to the browser.
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(event.clientY - state.y)) return;
      state.moving = true;
      setSliding(false);
    }
    setDrag(dx);
  };
  const onUp = (event: PointerEvent<HTMLDivElement>) => {
    const state = swipe.current;
    swipe.current = null;
    if (!state?.moving) return;
    const dx = event.clientX - state.x;
    const width = stage.current?.clientWidth ?? window.innerWidth;
    if (Math.abs(dx) > Math.min(80, width * 0.18)) {
      step(dx < 0 ? 1 : -1);
    } else {
      // Not far enough: the photo slides back.
      setSliding(true);
      setDrag(0);
      window.clearTimeout(settle.current);
      settle.current = window.setTimeout(() => finish(0), SLIDE_MS + 120);
    }
  };
  const onEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.propertyName === "transform") finish(shift);
  };

  // The photos in place: the current one and its neighbours. With two photos there is only one
  // neighbour, placed on the side it comes from.
  const side = shift !== 0 ? shift : drag > 0 ? -1 : 1;
  const slides =
    !open || count === 1
      ? [{ photo: at(0), place: 0 }]
      : count === 2
        ? [
            { photo: at(0), place: 0 },
            { photo: at(1), place: side },
          ]
        : [
            { photo: at(-1), place: -1 },
            { photo: at(0), place: 0 },
            { photo: at(1), place: 1 },
          ];

  const arrow =
    "flex h-12 w-12 items-center justify-center border border-paper/25 text-paper transition-colors hover:border-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper";

  return (
    <>
      <div onClick={show}>{children}</div>
      <dialog
        ref={dialog}
        aria-label={labels.title}
        onClose={() => {
          finish(0);
          setIndex(null);
        }}
        onKeyDown={onKey}
        data-lenis-prevent=""
        className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-nacht p-0 text-paper backdrop:bg-nacht"
      >
        {photo ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <p className="font-sans text-[13px] tracking-[0.18em] text-paper/70 tabular-nums" aria-live="polite">
                {at(shift) + 1} {labels.of} {count}
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
              ref={stage}
              className="relative min-h-0 flex-1 touch-pan-y overflow-hidden"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={() => {
                swipe.current = null;
                finish(0);
              }}
              onClick={(event) => {
                // A click beside the photo closes the viewer.
                if ((event.target as HTMLElement).dataset.backdrop !== undefined) close();
              }}
            >
              <div
                className={`absolute inset-0 ${sliding ? "transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]" : ""}`}
                style={{
                  transform: `translate3d(calc(${-shift * 100}% + ${drag}px), 0, 0)`,
                  transitionDuration: sliding ? `${SLIDE_MS}ms` : undefined,
                }}
                onTransitionEnd={onEnd}
              >
                {slides.map(({ photo: item, place }) => (
                  <div
                    key={item}
                    data-backdrop=""
                    aria-hidden={place !== 0 || undefined}
                    className="absolute inset-y-0 w-full px-0 sm:px-8 lg:px-24"
                    style={{ left: `${place * 100}%` }}
                  >
                    <div className="relative h-full" data-backdrop="">
                      <CmsImage
                        src={photos[item].src}
                        srcSet={photos[item].srcSet}
                        alt={place === 0 ? photos[item].alt : ""}
                        fill
                        priority
                        sizes="100vw"
                        className="pointer-events-none object-contain select-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex min-h-[5.5rem] items-center justify-between gap-6 px-5 py-4 sm:px-8">
              <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className={arrow}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M14.5 5 7.5 12l7 7" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
              <p className="max-w-2xl text-center font-sans text-[14px] leading-relaxed text-paper/75">
                {photos[at(shift)].caption}
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
