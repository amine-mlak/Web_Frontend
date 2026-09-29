import LocaleLink from "@/components/LocaleLink";
import { cn } from "@/lib/utils";
import CmsImage from "@/components/CmsImage";

export default function BrandLogo({
  className,
  src = "/logo.png",
  alt = "BEER Küchenmanufaktur",
}: {
  className?: string;
  src?: string;
  alt?: string;
}) {
  return (
    <LocaleLink
      href="/"
      className={cn("flex items-center gap-2.5", className)}
    >
      <span className="relative block h-8 w-[30px] shrink-0">
        <CmsImage
          src={src}
          alt={alt}
          fill
          priority
          sizes="32px"
          className="object-contain object-center"
        />
      </span>
      <span className="relative block h-[22px] w-[100px] shrink-0 sm:h-6 sm:w-[110px]">
        <CmsImage
          src="/beer-wordmark.png"
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
