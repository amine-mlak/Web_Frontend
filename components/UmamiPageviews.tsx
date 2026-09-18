"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { isUmamiTrackedPath } from "@/lib/umami";

function pageUrl(pathname: string, search: string) {
  return search ? `${pathname}?${search}` : pathname;
}

export default function UmamiPageviews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!isUmamiTrackedPath(pathname)) {
      return;
    }

    const url = pageUrl(pathname, searchParams.toString());
    if (lastUrl.current === url) {
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const send = () => {
      if (cancelled) {
        return;
      }

      const track = window.umami?.track;
      if (typeof track === "function") {
        lastUrl.current = url;
        track((props) => ({ ...props, url, title: document.title }));
        return;
      }

      if (attempts < 40) {
        attempts += 1;
        window.setTimeout(send, 50);
      }
    };

    send();

    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  return null;
}
