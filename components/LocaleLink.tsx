"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { withLocale } from "@/lib/i18n";

export default function LocaleLink({
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const locale = useLocale();
  const nextHref = typeof href === "string" ? withLocale(href, locale) : href;

  return <Link href={nextHref} {...props} />;
}
