import type { Project } from "@/data/projects/types";
import { cn } from "@/lib/cn";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";
import { RoofLines } from "@/components/ui/roof";
import { MediaImage } from "./media-image";

/**
 * Editorial storytelling: short chapters alternating image and text,
 * followed by the location band. Images unveil on scroll with pure CSS
 * (scroll-driven animations — no JavaScript, skipped for reduced motion).
 */
export function ProjectStory({ project, locale, t }: { project: Project; locale: Locale; t: Messages }) {
  const d = t.projects.detail;

  return (
    <>
      <section aria-label={d.storyEyebrow} className="bg-stone py-6 sm:py-10">
        <div className="container-site">
          {project.chapters.map((chapter, i) => {
            const flip = i % 2 === 1;
            const body = chapter.body[locale];
            const cutout = chapter.mediaStyle === "cutout";
            return (
              <article
                key={chapter.id}
                aria-labelledby={`chapter-${chapter.id}`}
                className="grid items-center gap-10 border-b border-brand/10 py-16 last:border-b-0 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-28"
              >
                <div className={cn("lg:col-span-7", flip && "lg:order-last lg:col-start-6")}>
                  {cutout ? (
                    <div className="scroll-unveil rounded-2xl bg-ivory p-6 sm:p-12">
                      <MediaImage media={chapter.media} locale={locale} sizes="(min-width: 1024px) 50vw, 100vw" className="mx-auto max-h-[34rem] w-auto" />
                    </div>
                  ) : (
                    <div className="scroll-unveil relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-deep sm:aspect-[16/10]">
                      <MediaImage media={chapter.media} locale={locale} fill sizes="(min-width: 1024px) 55vw, 100vw" />
                    </div>
                  )}
                </div>

                <div data-reveal className={cn("lg:col-span-4", flip ? "lg:col-start-1" : "lg:col-start-9")}>
                  <span aria-hidden className="text-outline-brand block text-6xl leading-none font-semibold tabular-nums sm:text-7xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="eyebrow mt-6">{chapter.eyebrow[locale]}</p>
                  <h2 id={`chapter-${chapter.id}`} className="mt-4 text-2xl leading-[1.35] font-semibold sm:text-3xl">
                    {chapter.title[locale]}
                  </h2>
                  {body.length > 2 ? (
                    <ul className="mt-6 space-y-4">
                      {body.map((line) => (
                        <li key={line} className="flex gap-3 leading-relaxed text-ink/85">
                          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/85">
                      {body.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {project.site && (
        <section aria-labelledby="site-title" className="on-dark relative isolate overflow-hidden bg-brand-deep text-white">
          <RoofLines className="absolute -top-10 -z-10 w-[40rem] text-gold-light/10 ltr:-left-40 rtl:-right-40" />
          <div className="container-site grid items-center gap-12 pt-20 pb-12 sm:pt-24 lg:grid-cols-12 lg:gap-8 lg:pt-32 lg:pb-16">
            <div data-reveal className="lg:col-span-5">
              <p className="eyebrow">{d.siteEyebrow}</p>
              <h2 id="site-title" className="mt-5 text-3xl leading-[1.3] font-semibold sm:text-4xl">
                {project.site.title[locale]}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/80">{project.site.text[locale]}</p>
              {project.location && <p className="mt-6 font-semibold text-gold-light">{project.location[locale]}</p>}
            </div>
            <figure data-reveal className="lg:col-span-6 lg:col-start-7">
              <div className="mx-auto aspect-square w-full max-w-[26rem] overflow-hidden rounded-full border border-gold-light/40 bg-white p-2 shadow-[0_0_0_10px_rgb(208_186_103/0.08)]">
                <div className="relative size-full overflow-hidden rounded-full">
                  <MediaImage media={project.site.plan} locale={locale} fill sizes="(min-width: 1024px) 420px, 90vw" />
                </div>
              </div>
              <figcaption className="mt-4 text-center text-sm text-white/65">{project.site.plan.alt[locale]}</figcaption>
            </figure>
          </div>
          {project.site.panorama && (
            <div className="scroll-unveil relative h-40 sm:h-56 lg:h-72">
              <MediaImage media={project.site.panorama} locale={locale} fill sizes="100vw" />
              <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-deep via-transparent to-transparent" />
            </div>
          )}
        </section>
      )}
    </>
  );
}
