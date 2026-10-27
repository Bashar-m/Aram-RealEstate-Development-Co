"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Expand } from "lucide-react";
import type { ProjectMedia } from "@/data/projects/types";
import { cn } from "@/lib/cn";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";

// The lightbox is only downloaded the first time someone opens an image
const GalleryLightbox = dynamic(() => import("./gallery-lightbox"), { ssr: false });

type GalleryText = Messages["projects"]["gallery"];

// Editorial rhythm for the desktop grid (6 columns, 11rem rows)
const tiles = [
  "md:col-span-4 md:row-span-3",
  "md:col-span-2 md:row-span-3",
  "md:col-span-3 md:row-span-2",
  "md:col-span-3 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-2 md:row-span-3",
  "md:col-span-2 md:row-span-3",
  "md:col-span-2 md:row-span-3",
];

export function ArchitecturalGallery({ items, locale, t }: { items: ProjectMedia[]; locale: Locale; t: GalleryText }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul
        className={cn(
          // Mobile: swipeable row. md+: editorial grid.
          "no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:-mx-8 sm:px-8",
          "md:mx-0 md:grid md:auto-rows-[11rem] md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0 lg:auto-rows-[13rem]",
        )}
      >
        {items.map((item, i) => (
          <li
            key={item.src}
            data-reveal
            style={{ "--delay": `${(i % 3) * 90}ms` } as CSSProperties}
            className={cn("w-[82%] shrink-0 snap-center sm:w-[60%] md:w-auto", tiles[i % tiles.length])}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${t.open}: ${item.alt[locale]}`}
              className={cn(
                "group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl md:aspect-auto md:h-full",
                item.fit === "contain" ? "bg-white" : "bg-brand",
              )}
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 82vw"
                className={cn(
                  "transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-[1.05]",
                  item.fit === "contain" ? "object-contain p-4" : "object-cover",
                )}
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-brand-deep/80 via-brand-deep/0 to-transparent opacity-90 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
              />
              {item.caption && (
                <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-start text-sm font-semibold text-white transition-transform duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                  {item.caption[locale]}
                  <Expand aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-white/60 md:hidden">{t.swipeHint}</p>

      {open !== null && (
        <GalleryLightbox items={items} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} locale={locale} t={t} />
      )}
    </>
  );
}
