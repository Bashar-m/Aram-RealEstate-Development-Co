import { ButtonLink } from "@/components/ui/button";
import { RoofLines, RoofMark } from "@/components/ui/roof";
import type { Messages } from "@/lib/i18n";
import { pagePath, type Locale } from "@/lib/routes";

export function VisionPreview({ locale, t }: { locale: Locale; t: Messages }) {
  const v = t.home.vision;

  return (
    <section
      aria-labelledby="vision-preview-title"
      className="on-dark section-y relative isolate overflow-hidden bg-brand-deep text-white"
    >
      <RoofLines className="absolute top-1/2 -z-10 w-[64rem] -translate-y-1/2 text-gold-light/12 max-md:w-[44rem] ltr:-right-72 rtl:-left-72" />
      <RoofLines className="absolute -bottom-24 -z-10 w-[28rem] text-gold-light/8 ltr:-left-24 rtl:-right-24" />

      <div className="container-site">
        <div data-reveal className="mx-auto max-w-4xl text-center">
          <RoofMark tone="light" className="mx-auto w-14" />
          <h2 id="vision-preview-title" className="mt-8 text-sm font-semibold text-gold-light ltr:tracking-[0.18em] ltr:uppercase">
            {v.eyebrow}
          </h2>
          <p className="mt-7 text-[1.625rem] leading-[1.6] font-medium sm:text-3xl lg:text-[2.5rem] lg:leading-[1.5]">
            {v.statement}
          </p>
          <ButtonLink href={pagePath(locale, "vision")} variant="outlineLight" arrow className="mt-12 w-full sm:w-auto">
            {v.link}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
