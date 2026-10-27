import Image from "next/image";
import type { ProjectMedia } from "@/data/projects/types";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/routes";

type MediaImageProps = {
  media: ProjectMedia;
  locale: Locale;
  sizes: string;
  /** Fill the (sized) parent. Otherwise renders at intrinsic ratio, full width. */
  fill?: boolean;
  priority?: boolean;
  className?: string;
};

/** Brochure image with its real dimensions — no layout shift, responsive WebP variants. */
export function MediaImage({ media, locale, sizes, fill, priority, className }: MediaImageProps) {
  const alt = media.alt[locale];
  const common = {
    src: media.src,
    sizes,
    preload: priority,
    fetchPriority: priority ? ("high" as const) : undefined,
  };
  if (fill) {
    return <Image {...common} alt={alt} fill className={cn(media.fit === "contain" ? "object-contain" : "object-cover", className)} />;
  }
  return <Image {...common} alt={alt} width={media.width} height={media.height} className={cn("h-auto w-full", className)} />;
}
