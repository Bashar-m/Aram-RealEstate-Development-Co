import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  // Dark green — main action on light backgrounds
  primary: "bg-brand text-white hover:bg-brand-deep",
  // Gold accent — main action on dark backgrounds
  secondary: "bg-gold-light text-brand-deep hover:bg-[#c4ad57]",
  // Green border
  outline: "border border-brand/70 text-brand hover:border-brand hover:bg-brand hover:text-white",
  // White border — secondary action on dark backgrounds / photos
  outlineLight: "border border-white/45 text-white hover:border-white hover:bg-white hover:text-brand-deep",
} as const;

export type ButtonVariant = keyof typeof variants;

export const buttonClasses = (variant: ButtonVariant = "primary", className?: string) =>
  cn(
    "group inline-flex min-h-12 items-center justify-center gap-3 rounded-lg px-6 text-[0.9375rem] font-semibold",
    "transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-soft)] active:scale-[0.98]",
    variants[variant],
    className,
  );

/** Direction-aware arrow: points "forward" in both RTL and LTR. */
export function Arrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      aria-hidden
      strokeWidth={1.75}
      className={cn(
        "size-[1.1em] shrink-0 transition-transform duration-300 rtl:-scale-x-100",
        "group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
        className,
      )}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  arrow?: boolean;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", arrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

/** Understated text link with an animated underline. */
export function TextLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-2.5 py-2 font-semibold text-brand",
        "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_1px]",
        "rtl:bg-right ltr:bg-left",
        className,
      )}
      {...props}
    >
      {children}
      <Arrow />
    </Link>
  );
}
