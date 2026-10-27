import Image from "next/image";
import { brand } from "@/data/images";
import { cn } from "@/lib/cn";

/**
 * Horizontal lockup for the header: the official emblem + official wordmark,
 * side by side, each at its original proportions.
 */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <Image
        src={brand.icon.src}
        width={brand.icon.width}
        height={brand.icon.height}
        alt=""
        unoptimized
        className="h-11 w-auto lg:h-12"
      />
      <Image
        src={brand.wordmark.src}
        width={brand.wordmark.width}
        height={brand.wordmark.height}
        alt=""
        unoptimized
        className="h-9 w-auto lg:h-10"
      />
    </span>
  );
}

/** The complete official logo (emblem above wordmark). */
export function LogoPrimary({ alt, className }: { alt: string; className?: string }) {
  return (
    <Image
      src={brand.logoPrimary.src}
      width={brand.logoPrimary.width}
      height={brand.logoPrimary.height}
      alt={alt}
      unoptimized
      className={cn("h-auto", className)}
    />
  );
}
