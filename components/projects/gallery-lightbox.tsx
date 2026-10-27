"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectMedia } from "@/data/projects/types";
import { cn } from "@/lib/cn";
import { format } from "@/lib/format";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";

type LightboxProps = {
  items: ProjectMedia[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  locale: Locale;
  t: Messages["projects"]["gallery"];
};

/** Full-screen image viewer on a native <dialog>: focus trap, Esc, arrows, swipe. */
export default function GalleryLightbox({ items, index, onIndexChange, onClose, locale, t }: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const rtl = locale === "ar";
  const item = items[index];
  const go = (delta: number) => onIndexChange((index + delta + items.length) % items.length);

  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
      el?.close();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // "Forward" follows reading direction
      if (e.key === "ArrowRight") onIndexChange((index + (rtl ? -1 : 1) + items.length) % items.length);
      if (e.key === "ArrowLeft") onIndexChange((index + (rtl ? 1 : -1) + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onIndexChange, rtl]);

  const onPointerDown = (e: PointerEvent) => (swipe.current = { x: e.clientX, y: e.clientY });
  const onPointerUp = (e: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(e.clientY - start.y)) return;
    // Swiping toward the reading direction's start reveals the next image
    go((dx < 0) !== rtl ? 1 : -1);
  };

  const navBtn =
    "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-brand-deep sm:inline-flex";

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-label={item.alt[locale]}
      className="on-dark m-0 h-dvh max-h-none w-screen max-w-none bg-brand-deep/97 p-0 text-white backdrop:bg-brand-deep/80"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="text-sm text-white/75 tabular-nums" aria-live="polite">
            {format(t.counter, { i: index + 1, n: items.length })}
          </p>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label={t.close}
            className="inline-flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
          >
            <X aria-hidden strokeWidth={1.75} />
          </button>
        </div>

        <div className="relative flex-1 touch-pan-y select-none" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          {/* Current image + neighbours (preloaded, hidden) for instant navigation */}
          {[-1, 0, 1].map((offset) => {
            const i = (index + offset + items.length) % items.length;
            const m = items[i];
            return (
              <Image
                key={`${offset}-${m.src}`}
                src={m.src}
                alt={offset === 0 ? m.alt[locale] : ""}
                aria-hidden={offset !== 0}
                fill
                sizes="100vw"
                loading="eager"
                draggable={false}
                className={cn(
                  "object-contain px-2 transition-opacity duration-500 sm:px-20",
                  m.fit === "contain" && "bg-white/0",
                  offset === 0 ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              />
            );
          })}
          <button type="button" onClick={() => go(-1)} aria-label={t.prev} className={cn(navBtn, "start-4")}>
            {rtl ? <ChevronRight aria-hidden /> : <ChevronLeft aria-hidden />}
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t.next} className={cn(navBtn, "end-4")}>
            {rtl ? <ChevronLeft aria-hidden /> : <ChevronRight aria-hidden />}
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="text-sm sm:text-base">{item.caption?.[locale] ?? item.alt[locale]}</p>
          <div className="flex gap-2 sm:hidden">
            <button type="button" onClick={() => go(-1)} aria-label={t.prev} className="inline-flex size-11 items-center justify-center rounded-full bg-white/10">
              {rtl ? <ChevronRight aria-hidden /> : <ChevronLeft aria-hidden />}
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.next} className="inline-flex size-11 items-center justify-center rounded-full bg-white/10">
              {rtl ? <ChevronLeft aria-hidden /> : <ChevronRight aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
