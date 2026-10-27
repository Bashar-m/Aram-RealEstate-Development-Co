import { cn } from "@/lib/cn";

/** Construction status pill, e.g. "قيد التنفيذ" — with a gently pulsing dot. */
export function ProgressBadge({ label, tone = "light", className }: { label: string; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        tone === "light" ? "bg-brand/8 text-brand" : "bg-white/12 text-white backdrop-blur-sm",
        className,
      )}
    >
      <span aria-hidden className="relative flex size-2">
        <span className="animate-soft-ping absolute inset-0 rounded-full bg-gold-light" />
        <span className="relative size-2 rounded-full bg-gold" />
      </span>
      {label}
    </span>
  );
}
