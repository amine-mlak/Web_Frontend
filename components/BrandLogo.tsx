import Link from "next/link";
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
    <Link
      href="/"
      className={cn("flex items-center justify-center", className)}
    >
      <span className="relative block h-8 w-[30px]">
        <CmsImage
          src={src}
          alt={alt}
          fill
          priority
          sizes="88px"
          className="object-contain object-center"
        />
      </span>
    </Link>
  );
}
