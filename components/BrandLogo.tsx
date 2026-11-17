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
  /** The lettering from the CMS header; the copy in public/ stands in when it is empty. */
  wordmarkSrc?: string;
}) {
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
      <span className="relative block h-[22px] w-[100px] shrink-0 sm:h-6 sm:w-[110px]">
        <CmsImage
          src={wordmarkSrc || "/beer-wordmark.png"}
          alt=""
          fill
          priority
          sizes="110px"
          className="object-contain object-left brightness-0"
        />
      </span>
    </LocaleLink>
  );
}
