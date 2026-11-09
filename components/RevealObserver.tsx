"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not([data-shown]), [data-rise]:not([data-shown])";

/**
 * Marks photo frames ([data-reveal]) and headings ([data-rise]) with data-shown once they scroll
 * into view; the CSS in globals.css does the movement. A photo frame waits until its photo has
 * loaded, so the cover never uncovers an empty frame. Elements added later (page changes) are
 * picked up too. Without JavaScript, or with "reduce motion", the CSS shows everything at once.
 */
export default function RevealObserver() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const show = (element: Element) => element.setAttribute("data-shown", "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target;
          observer.unobserve(element);
          const image = element.hasAttribute("data-reveal") ? element.querySelector("img") : null;
          if (!image || (image.complete && image.naturalWidth > 0)) {
            show(element);
            continue;
          }
          const done = () => show(element);
          image.addEventListener("load", done, { once: true });
          image.addEventListener("error", done, { once: true });
          // A slow photo still gets uncovered; its blurred stand-in sits underneath.
          window.setTimeout(done, 2500);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const watch = () => document.querySelectorAll(SELECTOR).forEach((element) => observer.observe(element));
    watch();

    let queued = false;
    const mutations = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        watch();
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
