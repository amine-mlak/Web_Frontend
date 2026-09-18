import Link from "next/link";
import {
  footerColumns,
  kitchenWorlds,
  legalLinks,
  socialLinks,
  type FooterLink,
} from "@/lib/footer";

export default function Footer() {
  return (
    <footer className="bg-nacht text-white/60">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <section className="max-w-4xl">
          <h2 className="type-eyebrow text-paper">Küchenwelten</h2>
          <FooterFlow links={kitchenWorlds} />
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {footerColumns.map((column) => (
            <section key={column.title}>
              <h2 className="type-eyebrow text-paper">{column.title}</h2>
              <FooterList links={column.links} />
              {column.extraTitle && column.extraLinks ? (
                <div className="mt-5">
                  <h3 className="type-eyebrow text-paper">{column.extraTitle}</h3>
                  <FooterList links={column.extraLinks} />
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Rechtliches">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="type-nav text-white/45 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Social Media">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="type-nav text-white/45 transition-colors hover:text-white"
                    data-umami-event="social_click"
                    data-umami-event-network={link.label}
                  >
                    {link.label}
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

function FooterList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {links.map((link) => (
        <li key={`${link.href}-${link.label}`}>
          <Link
            href={link.href}
            className="type-nav text-white/55 transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterFlow({ links }: { links: FooterLink[] }) {   
  return (
    <p className="type-nav mt-3 leading-6 text-white/55">
      {links.map((link, index) => (
        <span key={link.label}>
          <Link href={link.href} className="transition-colors hover:text-white">
            {link.label}
          </Link>
          {index < links.length - 1 ? (
            <span className="text-white/40"> · </span>
          ) : null}
        </span>
      ))}
    </p>
  );
}
