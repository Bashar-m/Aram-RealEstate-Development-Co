import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { CtaBand } from "@/components/ui/cta-band";
import { PageHero } from "@/components/ui/page-hero";
import { Photo } from "@/components/ui/photo";
import { RoofMark } from "@/components/ui/roof";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  return pageMetadata(await resolveLocale(params), "about");
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = await resolveLocale(params);
  const t = getMessages(locale);
  const a = t.about;

  return (
    <>
      <PageHero
        locale={locale}
        t={t}
        eyebrow={a.hero.eyebrow}
        title={a.hero.title}
        description={a.hero.description}
        image="villaWhite"
        imageAlt={t.images.villaWhite}
      />

      {/* Intro — heading beside a lead paragraph, then an editorial image pair */}
      <section aria-labelledby="intro-title" className="section-y">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <SectionHeading id="intro-title" eyebrow={a.intro.eyebrow} title={a.intro.title} className="lg:col-span-5" />
            <div data-reveal className="lg:col-span-6 lg:col-start-7 lg:pt-10">
              <p className="text-xl leading-relaxed font-medium text-brand sm:text-2xl sm:leading-relaxed">{a.intro.lead}</p>
              <div className="mt-7 space-y-5 text-lg leading-relaxed text-muted">
                {a.intro.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-12 sm:gap-6">
            <Photo
              image="interior"
              alt={t.images.interior}
              sizes="(min-width: 640px) 58vw, 100vw"
              className="aspect-[4/3] rounded-2xl sm:col-span-7 sm:aspect-auto sm:min-h-[22rem] lg:min-h-[30rem]"
            />
            <Photo
              image="facade"
              alt={t.images.facade}
              sizes="(min-width: 640px) 40vw, 100vw"
              className="aspect-[4/3] rounded-2xl sm:col-span-5 sm:aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* Philosophy — dark band with three columns */}
      <section aria-labelledby="philosophy-title" className="on-dark section-y relative isolate overflow-hidden bg-brand-deep text-white">
        <div className="container-site">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <SectionHeading id="philosophy-title" eyebrow={a.philosophy.eyebrow} title={a.philosophy.title} className="lg:col-span-6" />
            <p data-reveal className="max-w-xl text-lg leading-relaxed text-white/75 lg:col-span-5 lg:col-start-8">
              {a.philosophy.intro}
            </p>
          </div>
          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0 lg:mt-20">
            {a.philosophy.pillars.map((p, i) => (
              <li
                key={p.title}
                data-reveal
                style={{ "--delay": `${i * 110}ms` } as CSSProperties}
                className="border-t border-gold-light/40 pt-8 md:border-t-0 md:border-s md:border-white/15 md:px-8 md:pt-0 md:first:border-s-0 md:first:ps-0 lg:px-12"
              >
                <span className="text-sm font-medium text-gold-light tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-2xl font-semibold">{p.title}</h3>
                <p className="mt-4 leading-relaxed text-white/75">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quality & details — image + checklist */}
      <section aria-labelledby="quality-title" className="section-y overflow-hidden">
        <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div data-reveal className="relative lg:col-span-6">
            <Photo
              image="blueprint"
              alt={t.images.blueprint}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] rounded-2xl lg:aspect-[5/6]"
              imageClassName="object-[50%_85%]"
            />
            <RoofMark className="absolute -bottom-6 w-20 ltr:-right-3 rtl:-left-3 sm:w-24" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <SectionHeading id="quality-title" eyebrow={a.quality.eyebrow} title={a.quality.title}>
              <p className="mt-6 text-lg leading-relaxed text-muted">{a.quality.text}</p>
            </SectionHeading>
            <ul className="mt-10 space-y-4">
              {a.quality.items.map((item, i) => (
                <li
                  key={item}
                  data-reveal
                  style={{ "--delay": `${i * 80}ms` } as CSSProperties}
                  className="flex items-start gap-4 rounded-xl border border-line bg-white/60 p-4 sm:p-5"
                >
                  <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Check aria-hidden strokeWidth={2.25} className="size-4" />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Values — editorial rows */}
      <section aria-labelledby="about-values-title" className="section-y bg-stone">
        <div className="container-site">
          <SectionHeading id="about-values-title" eyebrow={a.values.eyebrow} title={a.values.title} />
          <ol className="mt-12 lg:mt-16">
            {t.home.values.items.map((v, i) => (
              <li
                key={v.title}
                data-reveal
                className="grid gap-3 border-t border-brand/15 py-8 last:border-b sm:grid-cols-12 sm:gap-6 lg:py-10"
              >
                <span className="text-sm font-medium text-gold-ink tabular-nums sm:col-span-1 sm:pt-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-semibold sm:col-span-4 lg:text-[1.75rem]">{v.title}</h3>
                <p className="text-lg leading-relaxed text-muted sm:col-span-7">{v.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand locale={locale} t={t} />
    </>
  );
}
