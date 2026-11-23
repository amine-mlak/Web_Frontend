"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { withLocale } from "@/lib/i18n";

/**
 * A link that keeps the visitor's language.
 *
 * Pages are loaded ahead only when the visitor points at a link (mouse over, touch, keyboard
 * focus), not when it scrolls into view. Loading a page ahead also loads the large photo at its
 * top, so the footer and a list of twenty kitchens used to fetch megabytes of photos nobody
 * looked at. Pointed at, the next page and its top photo are on their way before the click.
 * A `prefetch` set on the link still wins.
 */
export default function LocaleLink({
  href,
  prefetch,
  onMouseEnter,
  onTouchStart,
  onFocus,
  ...props
}: ComponentProps<typeof Link>) {
  const locale = useLocale();
  const nextHref = typeof href === "string" ? withLocale(href, locale) : href;
  const [intent, setIntent] = useState(false);

  return (
    <Link
      href={nextHref}
      prefetch={prefetch !== undefined ? prefetch : intent ? null : false}
      onMouseEnter={(event) => {
        setIntent(true);
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        setIntent(true);
        onTouchStart?.(event);
      }}
      onFocus={(event) => {
        setIntent(true);
        onFocus?.(event);
      }}
      {...props}
    />
  );
}
