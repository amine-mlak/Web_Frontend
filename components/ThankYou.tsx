"use client";

import { useSyncExternalStore } from "react";
import LocaleLink from "@/components/LocaleLink";
import { readThanks, type ThanksKind } from "@/lib/thanks";

/**
 * The thank-you page after a form (planner, booking, application): the page the contract and the
 * ad platforms count as the end of a form. Same look as the booklet's thank-you page. The first
 * name and details come from the tab's sessionStorage (lib/thanks.ts); without them the
 * title drops the name.
 */

type Step = { href: string; label: string };

const noop = () => () => undefined;

export default function ThankYou({
  kind,
  eyebrow,
  title,
  text,
  next,
  nextTitle,
}: {
  kind: ThanksKind;
  eyebrow: string;
  /** May contain {name}; without a name it reads "Danke." / "Thank you." instead. */
  title: string;
  text: string;
  next: Step[];
  nextTitle: string;
}) {
  // Read after hydration only: the server has no sessionStorage.
  const stored = useSyncExternalStore(
    noop,
    () => sessionStorage.getItem(`beer_thanks_${kind}`) ?? "",
    () => "",
  );
  const data = stored ? readThanks(kind) : {};
  const heading = data.name ? title.replace("{name}", data.name) : title.replace(/,?\s*\{name\}/, "");
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  return (
    <main className="bg-paper">
      <section aria-labelledby="danke-title" className="px-5 py-16 sm:px-8 lg:px-gutter lg:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="type-eyebrow text-gold">{eyebrow}</p>
          <h1 id="danke-title" className="type-h1 mt-3 text-ink">
            {heading}
          </h1>
          {data.lines?.length ? (
            <p className="mt-6 font-sans text-[18px] leading-[1.6] text-ink">
              {data.lines.map((line, index) => (
                <span key={line} className="block">
                  {index > 0 ? <span className="text-muted">{line}</span> : line}
                </span>
              ))}
            </p>
          ) : null}
          <div className="type-intro mt-6 space-y-4">
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-14 border-t border-line pt-8">
            <p className="type-eyebrow text-gold">{nextTitle}</p>
            <ul className="mt-4 divide-y divide-line">
              {next.map((step) => (
                <li key={step.href}>
                  <LocaleLink href={step.href} className="flex min-h-12 items-center justify-between py-3 font-serif text-[21px] text-ink hover:text-gold">
                    {step.label}
                    <span aria-hidden="true" className="font-sans text-[16px]">
                      →
                    </span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
