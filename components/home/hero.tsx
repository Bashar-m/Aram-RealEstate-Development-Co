import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { RoofMark } from "@/components/ui/roof";
import type { Messages } from "@/lib/i18n";
import { pagePath, type Locale } from "@/lib/routes";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero({ locale, t }: { locale: Locale; t: Messages }) {
  const h = t.home.hero;

  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-[max(34rem,calc(100svh-4rem))] items-end overflow-hidden bg-brand-deep text-white lg:min-h-[max(40rem,calc(100svh-5rem))]"
    >
      <Photo
        image="hero"
        alt={t.images.hero}
        sizes="100vw"
        priority
        className="absolute inset-0 -z-20"
        imageClassName="animate-settle object-[62%_50%]"
      />
      {/* Deep-green overlays keep the copy legible on any crop */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-brand-deep via-brand-deep/55 to-brand-deep/10" />
      <div aria-hidden className="absolute inset-0 -z-10 hidden from-brand-deep/80 via-brand-deep/25 to-transparent lg:block ltr:bg-linear-to-r rtl:bg-linear-to-l" />

      <div className="container-site relative pt-40 pb-14 sm:pb-20 lg:pb-28">
        <div className="max-w-3xl">
          <div className="animate-rise flex items-center gap-4">
            <RoofMark tone="light" className="w-10 sm:w-12" />
            <p className="text-sm font-medium text-gold-light sm:text-base">{h.eyebrow}</p>
          </div>

          <h1
            id="hero-title"
            className="animate-rise mt-6 text-[2.5rem] leading-[1.2] font-semibold sm:text-6xl lg:text-7xl xl:text-[5.25rem] xl:leading-[1.15]"
            style={delay(120)}
          >
            {h.title}
          </h1>

          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl" style={delay(240)}>
            {h.description}
          </p>

          <div className="animate-rise mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4" style={delay(360)}>
            <ButtonLink href={pagePath(locale, "about")} variant="secondary" arrow>
              {h.primaryCta}
            </ButtonLink>
            <ButtonLink href={pagePath(locale, "contact")} variant="outlineLight">
              {h.secondaryCta}
            </ButtonLink>
          </div>
        </div>

        <a
          href="#about-preview"
          className="animate-rise absolute end-5 bottom-10 hidden flex-col items-center gap-4 text-xs font-medium text-white/70 transition-colors hover:text-white sm:end-8 md:flex lg:end-12 lg:bottom-14"
          style={delay(600)}
        >
          <span className="[writing-mode:vertical-rl]">{h.scroll}</span>
          <span aria-hidden className="relative h-16 w-px overflow-hidden bg-white/25">
            <span className="animate-scroll-cue absolute inset-0 bg-gold-light" />
          </span>
        </a>
      </div>
    </section>
  );
}
