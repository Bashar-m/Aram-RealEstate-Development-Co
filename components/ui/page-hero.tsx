import Link from "next/link";
import type { ImageKey } from "@/data/images";
import { cn } from "@/lib/cn";
import type { Messages } from "@/lib/i18n";
import { pagePath, type Locale } from "@/lib/routes";
import { Photo } from "./photo";
import { RoofLines } from "./roof";

type PageHeroProps = {
  locale: Locale;
  t: Messages;
  eyebrow: string;
  title: string;
  description: string;
  /** With an image: full-bleed photo hero. Without: calm stone-coloured hero. */
  image?: ImageKey;
  imageAlt?: string;
};

export function PageHero({ locale, t, eyebrow, title, description, image, imageAlt }: PageHeroProps) {
  const dark = Boolean(image);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        dark
          ? "on-dark flex min-h-[28rem] items-end bg-brand-deep text-white sm:min-h-[32rem] lg:min-h-[38rem]"
          : "bg-stone",
      )}
    >
      {image && (
        <>
          <Photo
            image={image}
            alt={imageAlt ?? ""}
            sizes="100vw"
            priority
            className="absolute inset-0 -z-20"
            imageClassName="animate-settle"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-brand-deep/55" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-brand-deep/90 via-brand-deep/30 to-transparent" />
        </>
      )}

      {!dark && (
        <RoofLines className="absolute -bottom-10 w-[34rem] text-brand/12 max-sm:-end-40 sm:end-[-6rem] lg:end-0 lg:w-[44rem]" />
      )}

      <div className={cn("container-site relative", dark ? "pt-32 pb-14 sm:pb-16 lg:pb-20" : "pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-28 lg:pb-28")}>
        <nav aria-label={t.header.breadcrumb} className="animate-rise">
          <ol className={cn("flex flex-wrap items-center gap-2 text-sm", dark ? "text-white/70" : "text-muted")}>
            <li>
              <Link href={pagePath(locale, "home")} className="transition-colors hover:text-current hover:underline">
                {t.nav.home}
              </Link>
            </li>
            <li aria-hidden className="opacity-60">
              /
            </li>
            <li aria-current="page" className={dark ? "text-white" : "text-ink"}>
              {eyebrow}
            </li>
          </ol>
        </nav>

        <h1
          className="animate-rise mt-6 max-w-4xl text-[2.25rem] leading-[1.25] font-semibold sm:text-5xl lg:text-6xl lg:leading-[1.2]"
          style={{ "--delay": "120ms" } as React.CSSProperties}
        >
          {title}
        </h1>
        <p
          className={cn(
            "animate-rise mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl",
            dark ? "text-white/85" : "text-muted",
          )}
          style={{ "--delay": "240ms" } as React.CSSProperties}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
