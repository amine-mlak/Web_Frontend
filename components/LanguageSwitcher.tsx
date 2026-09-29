"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_NAMES,
  chromeCopy,
  stripLocalePrefix,
  withLocale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const path = stripLocalePrefix(pathname);
  const copy = chromeCopy[locale];

  return (
    <nav
      aria-label={copy.language}
      className={cn("flex items-center gap-1.5", className)}
    >
      {LOCALES.map((item, index) => {
        const current = item === locale;
        return (
          <span key={item} className="flex items-center gap-1.5">
            {index > 0 ? (
              <span className="text-black/25" aria-hidden="true">
                |
              </span>
            ) : null}
            <a
              href={withLocale(path, item)}
              hrefLang={item}
              lang={item}
              aria-current={current ? "true" : undefined}
              aria-label={LOCALE_NAMES[item]}
              className={cn(
                "font-sans text-[12px] tracking-[0.12em] uppercase transition-opacity",
                current
                  ? "text-black"
                  : "text-black/45 hover:text-black hover:opacity-80",
              )}
            >
              {LOCALE_LABELS[item]}
            </a>
          </span>
        );
      })}
    </nav>
  );
}
