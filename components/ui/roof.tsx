import { cn } from "@/lib/cn";

// Decorative motif taken from the ARAM emblem: the gold roof chevron
// with the lighter gold bar running parallel above its right slope.
// Purely ornamental — always aria-hidden.

export function RoofMark({ className, tone = "gold" }: { className?: string; tone?: "gold" | "light" }) {
  const main = tone === "gold" ? "var(--color-gold)" : "var(--color-gold-light)";
  const accent = tone === "gold" ? "var(--color-gold-light)" : "rgb(255 255 255 / 0.55)";
  return (
    <svg viewBox="0 0 240 140" aria-hidden className={cn("h-auto", className)}>
      <path d="M14 132 110 36l96 96" fill="none" stroke={main} strokeWidth="18" strokeLinejoin="miter" />
      <path d="M128 6l104 104" fill="none" stroke={accent} strokeWidth="18" />
    </svg>
  );
}

/** Large hairline outline of the roof — used as a background ornament. */
export function RoofLines({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 140" aria-hidden className={cn("pointer-events-none h-auto", className)} fill="none">
      <path d="M14 132 110 36l96 96" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M41 132 110 63l69 69" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M128 6l104 104" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Hairline section divider with the roof mark in the middle. */
export function RoofDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-5", className)}>
      <span className="h-px flex-1 bg-line" />
      <RoofMark className="w-9" />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
