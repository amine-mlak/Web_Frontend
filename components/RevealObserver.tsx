"use client";

import { useEffect } from "react";

const SELECTOR = "[data-rise]:not([data-shown])";

/**
 * Marks headings and closing texts ([data-rise]) with data-shown once they scroll into view; the
 * CSS in globals.css does the movement. Elements added later (page changes) are picked up too.
 * Without JavaScript, or with "reduce motion", the CSS shows everything at once.
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
          show(element);
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
