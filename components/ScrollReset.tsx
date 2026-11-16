"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * A new page always opens at the top. Next.js only scrolls when the new page's first element is
 * out of view, so with the fixed header some pages kept the old position. Back and forward keep
 * the browser's own restored position, and links to an anchor (/kontakt#termin) go to the anchor.
 */
export default function ScrollReset() {
  const pathname = usePathname();
  const first = useRef(true);
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (popped.current) {
      popped.current = false;
      return;
    }
    if (window.location.hash) return;
    // An open phone menu locks the page; unlock it so the jump to the top is not blocked.
    document.body.style.overflow = "";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
