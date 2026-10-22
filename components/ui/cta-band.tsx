import type { Messages } from "@/lib/i18n";
import { pagePath, type Locale } from "@/lib/routes";
import { ButtonLink } from "./button";
import { Photo } from "./photo";
import { RoofLines } from "./roof";

/** Closing call-to-action used at the end of most pages. */
export function CtaBand({ locale, t, className = "py-20 sm:py-24 lg:py-32" }: { locale: Locale; t: Messages; className?: string }) {
  return (
    <section aria-labelledby="cta-title" className={className}>
      <div className="container-site">
        <div
          data-reveal
          className="on-dark relative isolate grid overflow-hidden rounded-[1.25rem] bg-brand text-white lg:grid-cols-[1.15fr_1fr]"
        >
          <Photo
            image="towers"
            alt={t.images.towers}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="h-48 sm:h-64 lg:order-last lg:h-auto lg:min-h-[26rem]"
          />
          <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <RoofLines className="absolute -bottom-8 w-80 text-white/10 ltr:-right-16 rtl:-left-16" />
            <p className="eyebrow">{t.cta.eyebrow}</p>
            <h2 id="cta-title" className="mt-5 max-w-lg text-3xl leading-[1.3] font-semibold sm:text-4xl lg:text-[2.6rem]">
              {t.cta.title}
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/80">{t.cta.description}</p>
            <ButtonLink href={pagePath(locale, "contact")} variant="secondary" arrow className="mt-9 w-full sm:w-auto">
              {t.cta.button}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
