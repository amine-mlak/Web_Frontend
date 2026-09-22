import Image from "next/image";
import Link from "next/link";
import FooterRegions from "@/components/FooterRegions";
import {
  footerColumns,
  footerContact,
  footerShortcuts,
  legalLinks,
  socialLinks,
  type SocialIcon,
} from "@/lib/footer";

const headingClass =
  "font-sans text-[11px] font-medium tracking-[0.22em] text-[#c2a483]";

const linkClass =
  "text-[15px] leading-7 text-[#e4e0d8] transition-colors hover:text-white";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-nacht text-[#e4e0d8]">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-14 md:px-10 md:pt-20 md:pb-16">
        <div className="flex justify-center">
          <Link href="/" className="inline-flex" aria-label="Startseite">
            <Image
              src="/logo.png"
              alt=""
              width={68}
              height={72}
              className="h-[4.5rem] w-auto brightness-0 invert"
            />
          </Link>
        </div>

        <nav
          aria-label="Fußzeile"
          className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:mt-16 lg:grid-cols-5"
        >
          {footerColumns.map((column) => (
            <section key={column.title}>
              <h2 className={headingClass}>{column.title}</h2>
              <ul className="mt-4">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {column.more ? (
                <div className="mt-0.5">
                  <FooterRegions
                    label={column.more.label}
                    links={column.more.links}
                  />
                </div>
              ) : null}
            </section>
          ))}
        </nav>

        <section className="mt-14 md:mt-16">
          <h2 className={headingClass}>{footerContact.title}</h2>
          <address className="mt-4 text-[15px] leading-7 text-[#e4e0d8] not-italic">
            {footerContact.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <ul className="mt-6 flex gap-8">
            {footerShortcuts.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={headingClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 md:grid md:grid-cols-3 md:items-center md:px-10">
          <nav aria-label="Rechtliches">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#9c9892] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-[13px] text-[#9c9892] md:text-center">
            © {year}, BEER Küchen
          </p>
          <nav aria-label="Social Media" className="md:justify-self-end">
            <ul className="flex gap-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-[#e4e0d8] transition-colors hover:border-white hover:text-white"
                    data-umami-event="social_click"
                    data-umami-event-network={link.label}
                  >
                    <SocialGlyph icon={link.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function SocialGlyph({ icon }: { icon: SocialIcon }) {
  if (icon === "houzz") {
    return <span className="font-sans text-[13px] tracking-tight">hz</span>;
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      {icon === "instagram" ? (
        <>
          <rect
            x="3.5"
            y="3.5"
            width="17"
            height="17"
            rx="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="12"
            cy="12"
            r="3.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
        </>
      ) : null}
      {icon === "youtube" ? (
        <path d="M9.2 7.6v8.8L17.4 12 9.2 7.6z" fill="currentColor" />
      ) : null}
      {icon === "facebook" ? (
        <path
          d="M14.2 8.2h2.1V5.4h-2.1c-2.3 0-3.8 1.5-3.8 3.8v1.6H8.2v2.8h2.2V20h2.9v-6.4h2.3l.4-2.8h-2.7V9.4c0-.7.3-1.2.9-1.2z"
          fill="currentColor"
        />
      ) : null}
      {icon === "pinterest" ? (
        <path
          d="M12 4.2A7.8 7.8 0 0 0 7.1 17.6c.1-.7.5-1.8.7-2.4.2-.6 1.3-5.2 1.3-5.2s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.6 0 1-.6 2.4-.9 3.7-.3 1.1.5 2 1.6 2 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.2-3.8-3.1 0-5 2.3-5 4.8 0 .9.3 1.8.7 2.3.1.1.1.2.1.3l-.3 1.1c0 .2-.2.3-.4.2-1.4-.6-2-2.2-2-4 0-3 2.5-6.6 7.5-6.6 4 0 6.6 2.9 6.6 6 0 4.1-2.3 7.2-5.6 7.2-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2.9-.9 1.9-1.3 2.6A7.8 7.8 0 1 0 12 4.2z"
          fill="currentColor"
        />
      ) : null}
    </svg>
  );
}
