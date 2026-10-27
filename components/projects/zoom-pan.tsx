"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

const MIN = 1;
const MAX = 4;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Keeps the zoomed drawing from being dragged out of its frame. */
function bound(el: HTMLElement | null, x: number, y: number, s: number) {
  if (!el) return { x: 0, y: 0 };
  const maxX = ((s - 1) * el.clientWidth) / 2;
  const maxY = ((s - 1) * el.clientHeight) / 2;
  return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
}

type ZoomPanProps = {
  children: ReactNode;
  labels: { zoomIn: string; zoomOut: string; reset: string; hint: string };
  className?: string;
};

/**
 * Lightweight zoom & pan for drawings: buttons, double-click/tap, ctrl/⌘ + wheel (trackpad pinch),
 * two-finger pinch and drag. At 1× the page still scrolls normally on touch devices.
 * Remount (change `key`) to reset.
 */
export function ZoomPan({ children, labels, className }: ZoomPanProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);

  const zoomTo = (next: number) => {
    const s = clamp(next, MIN, MAX);
    scaleRef.current = s;
    setScale(s);
    setOffset((o) => (s === 1 ? { x: 0, y: 0 } : bound(viewport.current, o.x, o.y, s)));
  };

  // ctrl/⌘ + wheel (and trackpad pinch) — needs a non-passive listener to prevent page zoom
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const next = clamp(scaleRef.current * Math.exp(-e.deltaY * 0.01), MIN, MAX);
      scaleRef.current = next;
      setScale(next);
      setOffset((o) => bound(el, o.x, o.y, next));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
    }
    if (scale > 1 || pointers.current.size === 2) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      zoomTo((pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.dist);
    } else if (scale > 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setOffset((o) => bound(viewport.current, o.x + dx, o.y + dy, scale));
    }
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const btn =
    "inline-flex size-10 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand hover:text-white disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        ref={viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onDoubleClick={() => zoomTo(scale > 1 ? 1 : 2.25)}
        className={cn("absolute inset-0 select-none", scale > 1 ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-zoom-in touch-pan-y")}
      >
        <div
          className="size-full transition-transform duration-150 ease-out will-change-transform"
          style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})` }}
        >
          {children}
        </div>
      </div>

      <div className="absolute end-3 bottom-3 flex items-center gap-0.5 rounded-full border border-line bg-white/90 p-1 shadow-sm backdrop-blur-sm">
        <button type="button" className={btn} onClick={() => zoomTo(scale / 1.5)} disabled={scale <= MIN} aria-label={labels.zoomOut}>
          <Minus aria-hidden className="size-4" strokeWidth={2} />
        </button>
        <span className="w-11 text-center text-xs font-semibold text-brand tabular-nums" aria-live="polite">
          {Math.round(scale * 100)}%
        </span>
        <button type="button" className={btn} onClick={() => zoomTo(scale * 1.5)} disabled={scale >= MAX} aria-label={labels.zoomIn}>
          <Plus aria-hidden className="size-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => zoomTo(1)}
          disabled={scale === 1}
          aria-label={labels.reset}
        >
          <Maximize2 aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
      </div>
      <p className="pointer-events-none absolute start-4 bottom-4 hidden text-xs text-muted sm:block">{labels.hint}</p>
    </div>
  );
}
