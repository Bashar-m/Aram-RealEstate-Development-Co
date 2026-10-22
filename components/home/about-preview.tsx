import { TextLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Messages } from "@/lib/i18n";
import { pagePath, type Locale } from "@/lib/routes";

export function AboutPreview({ locale, t }: { locale: Locale; t: Messages }) {
  const a = t.home.about;

  return (
    <section id="about-preview" aria-labelledby="about-preview-title" className="section-y overflow-hidden">
      <div className="container-site grid items-center gap-20 lg:grid-cols-12 lg:gap-8">
        {/* Editorial image pair with an offset gold frame */}
        <div data-reveal className="relative pb-10 lg:col-span-6 lg:pb-14">
          <div className="relative isolate me-12 sm:me-28 lg:me-20">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 translate-y-4 rounded-2xl border border-gold/45 ltr:translate-x-4 rtl:-translate-x-4"
            />
            <Photo
              image="facade"
              alt={t.images.facade}
              sizes="(min-width: 1024px) 40vw, 85vw"
              className="aspect-[4/5] rounded-2xl"
            />
          </div>
          <Photo
            image="villaWhite"
            alt={t.images.villaWhite}
            sizes="(min-width: 1024px) 20vw, 45vw"
            className="absolute end-0 bottom-0 aspect-square w-[46%] rounded-2xl border-[6px] border-ivory shadow-[0_20px_40px_-24px_rgb(40_55_29/0.45)] sm:w-[42%]"
          />
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <SectionHeading id="about-preview-title" eyebrow={a.eyebrow} title={a.title} />
          <div data-reveal className="mt-7 space-y-5 text-lg leading-relaxed text-muted">
            {a.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div data-reveal className="mt-8">
            <TextLink href={pagePath(locale, "about")}>{a.link}</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
