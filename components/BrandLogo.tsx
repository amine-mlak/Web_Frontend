import LocaleLink from "@/components/LocaleLink";
import { cn } from "@/lib/utils";
import CmsImage from "@/components/CmsImage";

export default function BrandLogo({
  className,
  src,
  alt = "BEER Küchenmanufaktur",
  wordmarkSrc,
}: {
  className?: string;
  src?: string;
  alt?: string;
  /** The lettering from the CMS header; left out when the CMS has none. */
  wordmarkSrc?: string;
}) {
  // The lettering is about 1000 px wide in the CMS but shown at 110 px: the 320 px WebP from
  // /cms-opt is a third of the bytes and cached for a year.
  const wordmark = wordmarkSrc && /^\/cms-uploads\/[A-Za-z0-9._-]+\.(png|jpe?g)$/i.test(wordmarkSrc)
    ? wordmarkSrc.replace("/cms-uploads/", "/cms-opt/320/")
    : wordmarkSrc;

  return (
    <LocaleLink
      href="/"
      className={cn("flex items-center gap-2.5", className)}
    >
      <span className="relative block h-8 w-[30px] shrink-0">
        <CmsImage
          src={src || "/logo.png"}
          alt={alt}
          fill
          priority
          sizes="32px"
          className="object-contain object-center"
        />
      </span>
      {wordmark ? (
        <span className="relative block h-[22px] w-[100px] shrink-0 sm:h-6 sm:w-[110px]">
          <CmsImage
            src={wordmark}
            alt=""
            fill
            priority
            sizes="110px"
            className="object-contain object-left brightness-0"
          />
        </span>
      ) : null}
    </LocaleLink>
  );
}
