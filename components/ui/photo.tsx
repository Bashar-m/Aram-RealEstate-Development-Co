import Image from "next/image";
import { images, type ImageKey } from "@/data/images";
import { cn } from "@/lib/cn";

type PhotoProps = {
  image: ImageKey;
  alt: string;
  /** Rendered width hint for srcset, e.g. "(min-width: 1024px) 50vw, 100vw" */
  sizes: string;
  /** Size the wrapper (aspect ratio / height) so the layout never shifts */
  className?: string;
  imageClassName?: string;
  /** Above-the-fold image (LCP) */
  priority?: boolean;
};

export function Photo({ image, alt, sizes, className, imageClassName, priority }: PhotoProps) {
  // `fill` needs a positioned wrapper; keep the caller's `absolute` if given
  const positioned = className?.split(" ").includes("absolute") ? "" : "relative";
  return (
    <div className={cn(positioned, "overflow-hidden bg-stone", className)}>
      <Image
        src={images[image]}
        alt={alt}
        fill
        sizes={sizes}
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
