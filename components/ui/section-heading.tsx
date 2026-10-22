import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  id?: string;
  as?: "h1" | "h2";
  align?: "start" | "center";
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, id, as: Tag = "h2", align = "start", className, children }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", className)} data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <Tag
        id={id}
        className="mt-5 text-[1.875rem] leading-[1.3] font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.25]"
      >
        {title}
      </Tag>
      {children}
    </div>
  );
}
