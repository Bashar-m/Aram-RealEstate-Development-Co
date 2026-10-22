import type { CSSProperties } from "react";
import Link from "next/link";
import { Compass, Eye } from "lucide-react";
import { CtaBand } from "@/components/ui/cta-band";
import { Photo } from "@/components/ui/photo";
import { RoofLines, RoofMark } from "@/components/ui/roof";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { pagePath } from "@/lib/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/vision">) {
  return pageMetadata(await resolveLocale(params), "vision");
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default async function VisionPage({ params }: PageProps<"/[locale]/vision">) {
  const locale = await resolveLocale(params);
  const t = getMessages(locale);
  const v = t.vision;

  return (
    <>
      {/* Hero — typographic, on deep green, with the roof drawn large */}
      <section className="on-dark relative isolate overflow-hidden bg-brand-deep pb-36 text-white sm:pb-44 lg:pb-52">
        <RoofLines className="absolute -bottom-20 -z-10 w-[48rem] text-gold-light/15 max-sm:w-[34rem] ltr:-right-40 rtl:-left-40 lg:w-[62rem]" />
        <div className="container-site pt-14 sm:pt-20 lg:pt-28">
          <nav aria-label={t.header.breadcrumb} className="animate-rise">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              <li>
                <Link href={pagePath(locale, "home")} className="hover:text-white hover:underline">
                  {t.nav.home}
                </Link>
              </li>
              <li aria-hidden className="opacity-60">/</li>
              <li aria-current="page" className="text-white">{v.hero.eyebrow}</li>
            </ol>
          </nav>
          <h1
            className="animate-rise mt-8 max-w-4xl text-[2.25rem] leading-[1.3] font-semibold sm:text-5xl lg:text-6xl lg:leading-[1.25]"
            style={delay(120)}
          >
            {v.hero.title}
          </h1>
          <p className="animate-rise mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl" style={delay(240)}>
            {v.hero.description}
          </p>
        </div>
      </section>

      {/* Vision & mission — panels overlapping the hero */}
      <section aria-label={`${v.vision.label} / ${v.mission.label}`} className="relative z-10 -mt-24 sm:-mt-28 lg:-mt-36">
        <div className="container-site grid gap-5 md:grid-cols-2 lg:gap-6">
          {[
            { ...v.vision, Icon: Eye, tone: "bg-white" },
            { ...v.mission, Icon: Compass, tone: "bg-stone" },
          ].map(({ label, text, Icon, tone }, i) => (
            <article
              key={label}
              data-reveal
              style={delay(i * 120)}
              className={`relative overflow-hidden rounded-2xl border border-line p-7 shadow-[0_30px_60px_-40px_rgb(40_55_29/0.5)] sm:p-10 lg:p-12 ${tone}`}
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand text-gold-light">
                  <Icon aria-hidden strokeWidth={1.5} className="size-5" />
                </span>
                <h2 className="text-2xl font-semibold text-brand">{label}</h2>
              </div>
              <p className="mt-7 text-xl leading-[1.75] sm:text-[1.375rem]">{text}</p>
              <RoofMark className="absolute -bottom-4 w-24 opacity-15 ltr:-right-4 rtl:-left-4" />
            </article>
          ))}
        </div>
      </section>

      {/* Values — five "pillars" */}
      <section aria-labelledby="vision-values-title" className="section-y">
        <div className="container-site">
          <SectionHeading id="vision-values-title" eyebrow={v.values.eyebrow} title={v.values.title} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5 lg:items-end lg:gap-5">
            {v.values.items.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                style={delay(i * 90)}
                className={[
                  "on-dark group relative flex flex-col overflow-hidden rounded-2xl bg-brand-deep p-7 text-white transition-transform duration-500 hover:-translate-y-1.5",
                  "sm:min-h-[16rem] sm:last:col-span-2 lg:last:col-span-1",
                  // Staggered heights on desktop, like a skyline
                  ["lg:min-h-[22rem]", "lg:min-h-[25rem]", "lg:min-h-[28rem]", "lg:min-h-[25rem]", "lg:min-h-[22rem]"][i],
                ].join(" ")}
              >
                <RoofMark tone="light" className="w-12 transition-transform duration-500 group-hover:-translate-y-1" />
                <span className="mt-6 text-sm font-medium text-gold-light tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-auto pt-6 leading-relaxed text-white/75">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach — four steps on a timeline */}
      <section aria-labelledby="approach-title" className="section-y bg-stone">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionHeading id="approach-title" eyebrow={v.approach.eyebrow} title={v.approach.title} />
            <Photo
              image="geometric"
              alt={t.images.geometric}
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="mt-10 hidden aspect-[4/5] rounded-2xl lg:block"
            />
          </div>
          <ol className="relative lg:col-span-7 lg:col-start-6">
            <span aria-hidden className="absolute inset-y-3 start-[1.1875rem] w-px bg-brand/20" />
            {v.approach.steps.map((step, i) => (
              <li key={step.title} data-reveal style={delay(i * 100)} className="relative flex gap-6 pb-12 last:pb-0 sm:gap-8">
                <span className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-gold bg-stone text-sm font-semibold text-gold-ink tabular-nums">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-xl font-semibold sm:text-2xl">{step.title}</h3>
                  <p className="mt-3 max-w-lg text-lg leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand locale={locale} t={t} />
    </>
  );
}
